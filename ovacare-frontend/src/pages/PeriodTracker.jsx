import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../styles/styles.css";

function PeriodTracker() {
  const calendarRef = useRef(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (calendarRef.current) {
      flatpickr(calendarRef.current, {
        mode: "multiple",
        dateFormat: "Y-m-d",
        onChange: (dates) => {
          setSelectedDates(dates);
        },
      });
    }
  }, []);

  const handlePredict = () => {
    if (selectedDates.length < 2) {
      setResult("Please select at least 2 dates");
      return;
    }

    // sort dates
    const sorted = selectedDates.sort(
      (a, b) => new Date(a) - new Date(b)
    );

    let gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const diff =
        (new Date(sorted[i]) - new Date(sorted[i - 1])) /
        (1000 * 60 * 60 * 24);
      gaps.push(diff);
    }

    const avgCycle =
      gaps.reduce((a, b) => a + b, 0) / gaps.length;

    const lastDate = new Date(sorted[sorted.length - 1]);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + Math.round(avgCycle));

    setResult(`Next period expected around: ${nextDate.toDateString()}`);
  };

  return (
    <Layout>

      <h1 className="hero-title">Predict your next Period</h1>
      <h3>Select your previous period start dates</h3>

      {/* Calendar */}
      <div style={{ maxWidth: "500px", margin: "20px auto" }}>
        <input ref={calendarRef} placeholder="Select dates..." />
      </div>

      {/* Button */}
      <button onClick={handlePredict}>
        Predict Next Period
      </button>

      {/* Result */}
      <h3>{result}</h3>

    </Layout>
  );
}

export default PeriodTracker;