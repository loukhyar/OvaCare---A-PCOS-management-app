import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/styles.css";

function PeriodTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [predictedDate, setPredictedDate] = useState(null); // ✅ NEW
  const [result, setResult] = useState("");

  const today = new Date();

  // Month navigation
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Select date
  const toggleDate = (dateStr) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  // Prediction logic
  const handlePredict = () => {
    if (selectedDates.length < 2) {
      setResult("⚠️ Select at least 2 dates");
      return;
    }

    const sorted = [...selectedDates].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    let gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff =
        (new Date(sorted[i]) - new Date(sorted[i - 1])) /
        (1000 * 60 * 60 * 24);
      gaps.push(diff);
    }

    const avg =
      gaps.reduce((a, b) => a + b, 0) / gaps.length;

    const last = new Date(sorted[sorted.length - 1]);
    const next = new Date(last);
    next.setDate(last.getDate() + Math.round(avg));

    const nextStr = next.toISOString().split("T")[0];

    setPredictedDate(nextStr); // ✅ IMPORTANT
    setResult(`🌸 Next period: ${next.toDateString()}`);
  };

  // Generate calendar
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
      const dateStr = dateObj.toISOString().split("T")[0];

      const isSelected = selectedDates.includes(dateStr);
      const isToday =
        dateObj.toDateString() === today.toDateString();
      const isPredicted = predictedDate === dateStr; // ✅ NEW

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
        <button className="predict-btn" onClick={handlePredict}>
          Predict Next Period
        </button>

        {/* RESULT */}
        {result && <div className="result-box">{result}</div>}

      </div>
    </Layout>
  );
}

export default PeriodTracker;