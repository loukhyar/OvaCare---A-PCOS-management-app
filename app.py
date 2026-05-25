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
import google.generativeai as genai  # ✅ Gemini
import json
import re

# ================= LOAD ENV ================= #
load_dotenv()

# ================= GEMINI ================= #
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("❌ GEMINI_API_KEY not found in .env")

genai.configure(api_key=api_key)
gemini = genai.GenerativeModel("gemini-2.5-flash")  # ✅ Free tier model

# ================= FLASK ================= #
app = Flask(__name__)
CORS(app)

# ================= MONGO ================= #
mongo_uri = os.getenv("MONGO_URI")
client_db = MongoClient(mongo_uri)
db = client_db["pcos_db"]
users_collection = db["users"]
periods_collection = db["periods"]

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

# 🔮 PERIOD PREDICTION
@app.route("/predict", methods=["POST"])
def predict():
    try:
        dates = request.json.get("dates", [])

        if len(dates) < 4:
            return jsonify({"error": "Enter at least 4 dates"}), 400

        parsed = sorted(datetime.strptime(d, "%Y-%m-%d") for d in dates)
        cycles = [(parsed[i+1] - parsed[i]).days for i in range(len(parsed)-1)]

        input_data = np.array(cycles[-3:]).reshape(-1, 1)
        input_scaled = scaler.transform(input_data).reshape(1, 3, 1)

        pred = cycle_model.predict(input_scaled)
        cycle_len = int(round(scaler.inverse_transform(pred)[0][0]))

        next_date = parsed[-1] + timedelta(days=cycle_len)

        return jsonify({
            "predicted_date": next_date.strftime("%Y-%m-%d"),
            "cycle_length": cycle_len
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
        return jsonify({"error": str(e)}), 400


# 🧠 SONOGRAPHY
@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

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


# 🤖 AI DIET (MAIN FEATURE)
@app.route("/generate-diet", methods=["POST"])
def generate_diet():
    try:
        data = request.json

        meal = data.get("meal")
        diet = data.get("diet")
        age = data.get("age")
        goal = data.get("goal")

        if not meal or not diet or not age or not goal:
            return jsonify({"error": "Missing inputs"}), 400

        prompt = f"""
Generate ONLY valid JSON. No explanation, no markdown, no backticks.

7-day PCOS-friendly {diet} diet plan for {meal}.

User:
Age: {age}
Goal: {goal}

Rules:
- Indian foods
- Low sugar
- PCOS-friendly
- Balanced nutrients

Return ONLY this JSON format:
{{
  "days": [
    {{
      "day": "Day 1",
      "meal": "Oats with fruits"
    }}
  ]
}}
"""

        # ✅ Gemini API call
        response = gemini.generate_content(prompt)
        text = response.text.strip()
        print("AI RAW RESPONSE:\n", text)

        # 🔥 Remove markdown if present
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        # 🔥 Extract JSON safely
        match = re.search(r'\{.*\}', text, re.DOTALL)

        if not match:
            return jsonify({"error": "Invalid AI response"}), 500

        clean_json = match.group()
        parsed = json.loads(clean_json)

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= RUN ================= #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)