import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/styles.css";

function PeriodTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [predictedDate, setPredictedDate] = useState(null);
  const [result, setResult] = useState("");

  const today = new Date();

  // ✅ FORMAT DATE (FIXES TIMEZONE BUG)
  const formatDate = (date) => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  // 🔁 Month navigation
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // ✅ Select date
  const toggleDate = (dateStr) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  // 🚀 BACKEND CALL
  const handlePredict = async () => {
    if (selectedDates.length < 2) {
      setResult("⚠️ Select at least 2 dates");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dates: selectedDates,
          email: localStorage.getItem("userEmail"),
        }),
      });

      const data = await res.json();

      if (data.predicted_date) {
        setPredictedDate(data.predicted_date);

        const formatted = new Date(data.predicted_date);
        setResult(`🌸 Next period: ${formatted.toDateString()}`);
      } else {
        setResult("❌ Error predicting");
      }
    } catch (err) {
      setResult("❌ Server error");
    }
  };

  // 📅 Calendar generation
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let days = [];

    // empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={"empty" + i}></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = formatDate(dateObj); // ✅ FIXED HERE

      const isSelected = selectedDates.includes(dateStr);
      const isToday =
        dateObj.toDateString() === today.toDateString();
      const isPredicted = predictedDate === dateStr;

      days.push(
        <div
          key={d}
          className={`calendar-day
            ${isSelected ? "selected" : ""}
            ${isToday ? "today" : ""}
            ${isPredicted ? "predicted" : ""}`}
          onClick={() => toggleDate(dateStr)}
        >
          {d}
        </div>
      );
    }

    return days;
  };

  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Layout>
      <div className="period-container">

        <h1 className="hero-title">Predict your next Period 🌸</h1>
        <h3>Select your previous period start dates</h3>

        {/* NAV */}
        <div className="calendar-nav">
          <button onClick={() => changeMonth(-1)}>←</button>
          <span>{monthYear}</span>
          <button onClick={() => changeMonth(1)}>→</button>
        </div>

        {/* CALENDAR */}
        <div className="calendar-grid">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="calendar-label">{d}</div>
          ))}
          {generateCalendar()}
        </div>

        {/* BUTTON */}
        <div style={{ textAlign: "center" }}>
          <button className="predict-btn" onClick={handlePredict}>
            Predict Next Period
          </button>
        </div>

        {/* RESULT */}
        {result && <div className="result-box">{result}</div>}

      </div>
    </Layout>
  );
}

export default PeriodTracker;