import { useState } from "react";
import "../styles/styles.css";
import Layout from "../components/Layout";

function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [file, setFile] = useState(null);
  const [sonographyResult, setSonographyResult] = useState("");

  const symptomsList = [
    "Missed periods, irregular periods, or very light periods",
    "Ovaries that are large or have many cysts",
    "Excess body hair, including chest, stomach, back",
    "Weight gain around your belly",
    "Acne or oily skin",
    "Thinning hair or hair loss",
    "Infertility",
    "Skin tags",
    "Dark or thick patches of skin",
  ];

  const handleCheckbox = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDiagnosis = () => {
    let isPCOS = false;

    const missedPeriods = selectedSymptoms.includes(
      "Missed periods, irregular periods, or very light periods"
    );
    const acne = selectedSymptoms.includes("Acne or oily skin");
    const cysts = selectedSymptoms.includes(
      "Ovaries that are large or have many cysts"
    );
    const hairLoss = selectedSymptoms.includes("Thinning hair or hair loss");
    const infertility = selectedSymptoms.includes("Infertility");

    if (missedPeriods && acne && selectedSymptoms.length === 2) {
      isPCOS = false;
    } else if (cysts && hairLoss && infertility && selectedSymptoms.length >= 4) {
      isPCOS = true;
    } else if ((cysts || hairLoss || infertility) && selectedSymptoms.length > 1) {
      isPCOS = true;
    }

    const result = isPCOS
      ? "💡 Possible signs of PCOS. Please consult a doctor 💕"
      : "🌼 No strong signs of PCOS. Stay healthy!";

    setDiagnosis(result);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const message =
        data.prediction_class === 0
          ? "💡 Possible PCOS detected. Consult doctor."
          : "✅ No PCOS signs detected.";

      setSonographyResult(message);
    } catch (err) {
      setSonographyResult("Error uploading file");
    }
  };

  return (
    <Layout>

      {/* Diagnosis */}
      <section>
        <h2>Check Your Symptoms</h2>
        <p>Select symptoms you're experiencing 💖</p>

        {symptomsList.map((symptom, index) => (
          <label key={index}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox(symptom)}
            />
            {symptom}
          </label>
        ))}

        <br /><br />

        <button onClick={handleDiagnosis}>Check My Results</button>

        {diagnosis && (
          <div className="diagnosis-results">
            <h3>Result:</h3>
            <p>{diagnosis}</p>
          </div>
        )}
      </section>

      {/* Upload */}
      <section>
        <h2>Upload Sonography</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload}>Upload & Analyze</button>

        {sonographyResult && (
          <div>
            <h3>Sonography Result:</h3>
            <p>{sonographyResult}</p>
          </div>
        )}
      </section>

    </Layout>
  );
}

export default SymptomChecker;