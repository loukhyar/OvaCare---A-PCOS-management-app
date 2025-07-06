
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

![Screenshot 2025-07-06 195743](https://github.com/user-attachments/assets/819a0a4e-38e5-4f32-bd99-2a8ee54e40c3)
![Screenshot 2025-07-06 195901](https://github.com/user-attachments/assets/9aae356f-c51c-459d-8cc1-2b3268ee1d23)
![Screenshot 2025-07-06 195924](https://github.com/user-attachments/assets/65c11fae-3f20-433e-8cb7-322b3a4feb9e)
![Screenshot 2025-07-06 195949](https://github.com/user-attachments/assets/0571d0f0-3b47-4632-ac69-2a4b9482f0fa)
![Screenshot 2025-07-06 200016](https://github.com/user-attachments/assets/ffd9d370-7899-42f0-a2f5-dc572ee00e06)
![Screenshot 2025-07-06 200038](https://github.com/user-attachments/assets/ea43f040-b89e-4404-98f1-7b81ad61a4f3)
![Screenshot 2025-07-06 200059](https://github.com/user-attachments/assets/f9facbe2-0f93-48cb-972e-cf6346834757)
![Screenshot 2025-07-06 200110](https://github.com/user-attachments/assets/253f5c9f-80d3-4242-afd1-7ea212ac634e)
![Screenshot 2025-07-06 200127](https://github.com/user-attachments/assets/57a2f87d-af62-49eb-b461-5c2c13382ec7)

---
