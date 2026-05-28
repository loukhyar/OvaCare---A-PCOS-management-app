# 🌸 OvaCare – PCOS Management & AI Health Platform

**OvaCare** is a full-stack AI-powered web application designed to help manage **PCOS (Polycystic Ovary Syndrome)** through smart cycle prediction, AI diet planning, and health tracking. It combines **machine learning, generative AI, and modern web technologies** to provide a personalized health assistant.

---

## 🚀 Features

### 🧠 AI & ML

| Feature | Description |
|--------|-------------|
| 🔄 Menstrual Cycle Prediction | LSTM model predicts next cycle based on historical data |
| 🥗 AI Diet Planner | Gemini API generates 7-day plans filtered by meal type |
| 🧪 PCOS Detection | CNN-based sonography image model for PCOS classification |

---

### 🌐 Web App Features

| Feature | Description |
|--------|-------------|
| 🔐 Google OAuth Login | Secure authentication via Google |
| 📅 Period Tracker | Track and store cycle data with predictions |
| 📊 Health Insights | Logs and visualizations for health monitoring |
| 📤 Image Upload | Upload sonography images for PCOS prediction |
| 💡 Recommendations | Personalized health suggestions based on user data |

---

## 🛠️ Tech Stack

| Category | Tech Used |
|----------|-----------|
| Frontend | React (Vite), CSS |
| Backend | Flask (Python) |
| AI/ML | TensorFlow/Keras (LSTM, CNN) |
| AI API | Google Gemini API |
| Database | MongoDB |
| Auth | Google OAuth 2.0 |
| Deployment | Docker + Nginx + AWS + DuckDNS *(Kubernetes configs prepared)* |

---

## 📂 Project Structure

```
OvaCare/
│
├── backend/
│   ├── app.py
│   ├── model/
│   ├── uploads/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
│
├── backend-deployment.yaml
├── frontend-deployment.yaml
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_api_key
MONGO_URI=your_mongo_uri
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🐳 Running with Docker

### Backend

```bash
cd backend
docker build -t ovacare-backend .
docker run -d -p 5000:5000 ovacare-backend
```

### Frontend

```bash
cd frontend
docker build -t ovacare-frontend .
docker run -d -p 80:80 ovacare-frontend
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Menstrual cycle prediction |
| POST | `/generate-diet` | AI diet plan (filtered by meal) |
| POST | `/upload` | Sonography image prediction |
| POST | `/verify-token` | Google OAuth login |
| POST | `/get-periods` | Fetch user period data |
| POST | `/bmi` | BMI classification |

---

## 🌍 Deployment

| Component | Details |
|-----------|---------|
| 🌐 Domain | [http://ovacare.duckdns.org](http://ovacare.duckdns.org) |
| 🐳 Backend | Port `5000` |
| 🌐 Frontend | Served via Nginx on Port `80` |
| ☁️ Hosting | AWS EC2 |
| ☸️ Scaling | Kubernetes deployment files prepared |

---

## 📸 Screenshots

<img width="324" height="286" alt="Screenshot 2024-05-29 183802" src="https://github.com/user-attachments/assets/c4bc004f-68de-4e21-8a63-7c2bfa23aa8a" />

---

## ✨ Future Improvements

| Planned Feature | Description |
|----------------|-------------|
| 📱 Mobile App | Native iOS/Android version |
| 🧬 Hormone Tracking | Advanced hormonal cycle analytics |
| 👩‍⚕️ Doctor Integration | Connect with healthcare professionals |
| 🔔 Notifications | Reminders and health alerts |

---

## 👩‍💻 Author

**Loukhya Reddy**
**Pranava Sai**
