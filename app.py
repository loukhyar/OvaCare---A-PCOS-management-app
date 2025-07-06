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
import google.generativeai as genai
import bcrypt

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Flask setup
app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
try:
    client = MongoClient(mongo_uri)
    db = client["pcos_db"]
    users_collection = db["users"]
    periods_collection = db["periods"]
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")

# Upload folder config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load models
try:
    cycle_model = load_model("model/lstm_period_predictor.h5")
    print("✅ LSTM Model loaded.")
except Exception as e:
    print(f"❌ Error loading LSTM model: {e}")

try:
    sonography_model = load_model("model (2).h5")
    print("✅ Sonography Model loaded.")
except Exception as e:
    print(f"❌ Error loading Sonography model: {e}")
    sonography_model = None

# Load scaler
scaler = joblib.load("model/scaler.save")

# Google OAuth client ID
GOOGLE_CLIENT_ID = "851699343467-9a66uak9d637kurdbee67i6q6altiu0s.apps.googleusercontent.com"

# Class labels for sonography prediction
class_labels = {0: "infected", 1: "non_infected"}

# Utils
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ===== Routes =====

@app.route("/predict", methods=["POST"])
def predict():
    dates = request.json.get("dates", [])
    if not dates or len(dates) < 4:
        return jsonify({"error": "Please enter at least 4 period dates."}), 400
    try:
        parsed_dates = sorted(datetime.strptime(d, "%Y-%m-%d") for d in dates)
        cycle_lengths = [(parsed_dates[i+1] - parsed_dates[i]).days for i in range(len(parsed_dates)-1)]

        if any(cl <= 0 for cl in cycle_lengths):
            return jsonify({"error": "Dates must be in increasing order with valid gaps."}), 400

        window_size = 3
        input_data = np.array(cycle_lengths[-window_size:]).reshape(-1, 1)
        input_scaled = scaler.transform(input_data).reshape(1, window_size, 1)

        predicted_scaled = cycle_model.predict(input_scaled)
        predicted_cycle_length = scaler.inverse_transform(predicted_scaled)[0][0]
        predicted_cycle_length = int(round(predicted_cycle_length))

        last_period = parsed_dates[-1]
        next_period = last_period + timedelta(days=predicted_cycle_length)

        return jsonify({
            "predicted_date": next_period.strftime("%Y-%m-%d"),
            "predicted_cycle_length": predicted_cycle_length
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/verify-token", methods=["POST"])
def verify_token():
    token = request.json.get("token")
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if id_info['aud'] != GOOGLE_CLIENT_ID:
            return jsonify({"error": "Invalid audience"}), 400

        user_email = id_info.get("email")
        user_name = id_info.get("name")

        if not users_collection.find_one({"email": user_email}):
            users_collection.insert_one({
                "email": user_email,
                "name": user_name,
                "auth_provider": "google"
            })

        return jsonify({"email": user_email, "name": user_name}), 200
    except ValueError as e:
        return jsonify({"error": "Invalid token: " + str(e)}), 400

@app.route("/analyze-mood", methods=["POST"])
def analyze_mood():
    text = request.json.get("text", "")
    if not text:
        return jsonify({"error": "No input text provided"}), 400
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(
            f"Analyze the tone of this message and return just one word: happy, sad, anxious, excited, tired, or neutral. Message: '{text}'"
        )
        mood = response.text.strip().lower()
        return jsonify({"mood": mood})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-period-date', methods=['POST'])
def add_period_date():
    data = request.json
    email, date = data.get("email"), data.get("date")
    if not email or not date:
        return jsonify({"error": "Missing email or date"}), 400

    user_record = periods_collection.find_one({"email": email})
    if user_record:
        if date not in user_record["dates"]:
            periods_collection.update_one({"email": email}, {"$push": {"dates": date}})
    else:
        periods_collection.insert_one({"email": email, "dates": [date]})

    return jsonify({"message": "Date saved successfully!"}), 200

@app.route('/remove-period-date', methods=['POST'])
def remove_period_date():
    data = request.json
    email, date = data.get("email"), data.get("date")
    if not email or not date:
        return jsonify({"error": "Missing email or date"}), 400

    result = periods_collection.update_one({"email": email}, {"$pull": {"dates": date}})
    if result.modified_count > 0:
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "message": "Date not found or not removed"}), 404

@app.route('/get-period-dates', methods=['POST'])
def get_period_dates():
    email = request.json.get("email")
    if not email:
        return jsonify({"error": "Missing email"}), 400

    user_record = periods_collection.find_one({"email": email})
    return jsonify({"dates": user_record["dates"] if user_record else []}), 200

@app.route("/upload", methods=["POST"])
def upload_image():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        image_file = request.files["file"]
        if image_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(image_file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        filename = secure_filename(image_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)

        # Preprocess
        image = cv2.imread(filepath)
        if image is None:
            return jsonify({"error": "Invalid image file"}), 400

        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0
        image = image.reshape(1, 224, 224, 3)

        if sonography_model is None:
            return jsonify({"error": "Sonography model not loaded"}), 500

        prediction = sonography_model.predict(image)
        predicted_class = np.argmax(prediction)
        probability = float(prediction[0][predicted_class])

        return jsonify({
            "message": "Prediction successful",
            "pcos_infected": int(predicted_class),
            "label": class_labels[predicted_class],
            "probability": probability
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===== Static Routes =====

@app.route('/')
def serve_login():
    return send_from_directory('static', 'index.html')

@app.route('/home')
def serve_home():
    return send_from_directory('static', 'home.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.static_folder), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

# ===== Run Server =====

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
