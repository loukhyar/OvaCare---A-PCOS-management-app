from flask import Flask, request, jsonify, send_from_directory
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
from openai import OpenAI
import json

# Load env
load_dotenv()

# OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Flask
app = Flask(__name__, static_folder='static')
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# MongoDB
mongo_uri = os.getenv("MONGO_URI")
client_db = MongoClient(mongo_uri)
db = client_db["pcos_db"]
users_collection = db["users"]
periods_collection = db["periods"]

# Upload config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Models
cycle_model = load_model("model/lstm_period_predictor.h5")
sonography_model = load_model("model (2).h5")
scaler = joblib.load("model/scaler.save")

GOOGLE_CLIENT_ID = "851699343467-9a66uak9d637kurdbee67i6q6altiu0s.apps.googleusercontent.com"
class_labels = {0: "infected", 1: "non_infected"}

# ---------------- UTIL ---------------- #

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------- ROUTES ---------------- #

@app.route("/predict", methods=["POST"])
def predict():
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

@app.route("/verify-token", methods=["POST"])
def verify_token():
    token = request.json.get("token")

    id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

    email = id_info["email"]
    name = id_info["name"]

    if not users_collection.find_one({"email": email}):
        users_collection.insert_one({
            "email": email,
            "name": name
        })

    return jsonify({"email": email, "name": name})

@app.route("/upload", methods=["POST"])
def upload_image():
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

# ---------------- AI DIET ROUTE ---------------- #

@app.route("/generate-diet", methods=["POST"])
def generate_diet():
    data = request.json
    meal = data.get("meal")
    diet = data.get("diet")
    age = data.get("age")
    goal = data.get("goal")

    if not meal or not diet or not age or not goal:
        return jsonify({"error": "Missing inputs"}), 400

    try:
        prompt = f"""
Create a 7-day PCOS-friendly {diet} diet plan for {meal}.

User:
Age: {age}
Goal: {goal}

Requirements:
- Indian foods
- Low sugar
- PCOS-friendly
- Balanced nutrients

Return ONLY valid JSON.
No explanation. No markdown.

Format:
{{
  "days": [
    {{
      "day": "Day 1",
      "meal": "Oats with fruits"
    }},
    {{
      "day": "Day 2",
      "meal": "Idli with sambar"
    }}
  ]
}}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        text = response.choices[0].message.content.strip()

        # 🔥 Fix markdown JSON issue
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        try:
            parsed = json.loads(text)
        except:
            return jsonify({"error": "AI response formatting failed"}), 500

        return jsonify(parsed)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- STATIC ---------------- #

@app.route('/')
def serve_login():
    return send_from_directory('static', 'index.html')

@app.route('/home')
def serve_home():
    return send_from_directory('static', 'home.html')

# ---------------- RUN ---------------- #

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)