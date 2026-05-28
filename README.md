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

<img width="1919" height="987" alt="Screenshot 2026-05-28 210304" src="https://github.com/user-attachments/assets/23bf44df-b0f9-4a77-b381-5bef53a7ecdf" />
<img width="1919" height="988" alt="Screenshot 2026-05-28 210333" src="https://github.com/user-attachments/assets/ac1c32ca-ca26-4ae5-9c39-3e9ad32832da" />
<img width="1919" height="990" alt="Screenshot 2026-05-28 210407" src="https://github.com/user-attachments/assets/017c6345-e46e-4e74-9f16-3c39d4205b71" />
<img width="1919" height="982" alt="Screenshot 2026-05-28 210424" src="https://github.com/user-attachments/assets/323e589b-2d08-4d89-8121-d8cca1b0fed2" />

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
