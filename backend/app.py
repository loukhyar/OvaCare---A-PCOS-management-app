from flask import Flask, request, jsonify
import os
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
import joblib
from google.oauth2 import id_token
from google.auth.transport import requests
import google.generativeai as genai
import json
import re

# ================= LOAD ENV ================= #
load_dotenv()

# ================= GEMINI ================= #
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found")

genai.configure(api_key=api_key)
gemini = genai.GenerativeModel("gemini-2.5-flash")

# ================= FLASK ================= #
app = Flask(__name__)
CORS(app)

# ================= MONGO ================= #
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("❌ MONGO_URI not found")

client_db = MongoClient(mongo_uri)
db = client_db["pcos_db"]

users_collection = db["users"]
periods_collection = db["periods"]

# ✅ Prevent duplicate users
periods_collection.create_index("email", unique=True)

print("✅ MongoDB Connected")

# ================= FILE UPLOAD ================= #
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ================= MODELS ================= #
cycle_model = load_model("model/lstm_period_predictor.h5")
sonography_model = load_model("model (2).h5")
scaler = joblib.load("model/scaler.save")

GOOGLE_CLIENT_ID = "476303882358-l5r21fd2iretal5pc6qmgga8drll0r8q.apps.googleusercontent.com"

class_labels = {0: "infected", 1: "non_infected"}

# ================= ROUTES ================= #

# 🔮 PERIOD PREDICTION + UPDATE (FIXED)
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        dates = data.get("dates", [])
        email = data.get("email", "anonymous")

        if len(dates) < 2:
            return jsonify({"error": "Enter at least 2 dates"}), 400

        parsed = sorted(datetime.strptime(d, "%Y-%m-%d") for d in dates)
        cycles = [(parsed[i+1] - parsed[i]).days for i in range(len(parsed)-1)]

        if len(cycles) < 3:
            avg_cycle = int(sum(cycles) / len(cycles))
            next_date = parsed[-1] + timedelta(days=avg_cycle)
        else:
            input_data = np.array(cycles[-3:]).reshape(-1, 1)
            input_scaled = scaler.transform(input_data).reshape(1, 3, 1)

            pred = cycle_model.predict(input_scaled)
            cycle_len = int(round(scaler.inverse_transform(pred)[0][0]))

            next_date = parsed[-1] + timedelta(days=cycle_len)

        predicted_str = next_date.strftime("%Y-%m-%d")

        # ✅ UPSERT (NO DUPLICATES)
        periods_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "dates": dates,
                    "predicted_date": predicted_str,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )

        print("✅ Updated Mongo:", email)

        return jsonify({
            "predicted_date": predicted_str
        })

    except Exception as e:
        print("❌ PREDICT ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# 📥 GET SAVED DATA (NEW)
@app.route("/get-periods", methods=["POST"])
def get_periods():
    try:
        email = request.json.get("email")

        user_data = periods_collection.find_one({"email": email})

        if not user_data:
            return jsonify({"dates": []})

        return jsonify({
            "dates": user_data.get("dates", []),
            "predicted_date": user_data.get("predicted_date")
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔐 GOOGLE LOGIN
@app.route("/verify-token", methods=["POST"])
def verify_token():
    try:
        token = request.json.get("token")

        id_info = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        email = id_info["email"]
        name = id_info["name"]

        if not users_collection.find_one({"email": email}):
            users_collection.insert_one({
                "email": email,
                "name": name
            })

        return jsonify({"email": email, "name": name})

    except Exception as e:
        print("❌ LOGIN ERROR:", str(e))
        return jsonify({"error": str(e)}), 400


# 🧠 SONOGRAPHY
@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        file = request.files["file"]

        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        img = cv2.imread(path)
        img = cv2.resize(img, (224, 224)) / 255.0
        img = img.reshape(1, 224, 224, 3)

        pred = sonography_model.predict(img)
        cls = int(np.argmax(pred))

        return jsonify({
            "label": class_labels[cls],
            "probability": float(pred[0][cls])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🤖 AI DIET
@app.route("/generate-diet", methods=["POST"])
def generate_diet():
    try:
        data = request.json

        prompt = f"""
Generate ONLY valid JSON.

7-day PCOS-friendly {data.get("diet")} diet plan for {data.get("meal")}.
Age: {data.get("age")}
Goal: {data.get("goal")}
"""

        response = gemini.generate_content(prompt)
        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(re.search(r'\{.*\}', text, re.DOTALL).group())

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🧮 BMI
@app.route("/bmi", methods=["POST"])
def bmi_predict():
    try:
        bmi = float(request.json.get("bmi"))

        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25:
            category = "Normal"
        elif bmi < 30:
            category = "Overweight"
        else:
            category = "Obese"

        return jsonify({"category": category})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= RUN ================= #
if __name__ == "__main__":
    print("🚀 Server running on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)