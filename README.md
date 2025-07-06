
# 🌸 OvaCare - PCOS Management & Cycle Prediction

**OvaCare** is an AI-powered web application designed to help women manage Polycystic Ovary Syndrome (PCOS) through personalized cycle tracking and lifestyle insights. It leverages machine learning (LSTM) to predict menstrual cycles and offers a supportive digital companion for hormonal health awareness.

---

## 🧠 Features

- 🔄 **Cycle Prediction** using LSTM-based deep learning
- 🧪 Input form for user symptoms and cycle data
- 📈 Visualizations and logs for period tracking
- 🔐 Google OAuth 2.0-based secure login
- 📊 Support for custom datasets and retraining the model
- 🌐 Deployed as a Flask app with RESTful API endpoints

---

## 🛠️ Tech Stack

| Category        | Tech Used                        |
|----------------|----------------------------------|
| Frontend       | HTML, CSS, JS                    |
| Backend        | Python, Flask                    |
| Machine Learning | TensorFlow/Keras (LSTM)        |
| Database       | MongoDB (or local CSV-based)     |
| Authentication | Google OAuth 2.0                 |

---

## 📂 Folder Structure

```
OvaCare/
│
├── app.py                  # Main backend file
├── train_lstm_model.py     # LSTM training script
├── model (2).h5            # Trained LSTM model
├── periodcycle.csv         # Dataset used for prediction
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── .git/                   # Git repo data
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/OvaCare.git
cd OvaCare
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file with the following:

```
SECRET_KEY=your_flask_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5. Run the Application

```bash
python train_lstm_model.py
python app.py
```

Visit: `http://127.0.0.1:5000/` in your browser

---

## 🔍 API Endpoints 

| Method | Endpoint        | Description                      |
|--------|------------------|----------------------------------|
| POST   | `/predict`       | Predict cycle date using LSTM    |
| GET    | `/login`         | Google OAuth login route         |
| GET    | `/dashboard`     | User cycle and health summary    |

---

## 🤖 LSTM Model

- Implemented using **Keras LSTM** to predict next cycle date
- Trained on user-entered data (`periodcycle.csv`)
- Model file: `model (2).h5`
- Retrain using:

```bash
python train_lstm_model.py
```

---

## 📷 Screenshots/Demo

 ![alt text](image.png)
 ![alt text](image-1.png)
 ![alt text](image-2.png)
 ![alt text](image-3.png)
 ![alt text](image-4.png)
 ![alt text](image-5.png)
 ![alt text](image-6.png)
 ![alt text](image-7.png)
 ![alt text](image-8.png)

---