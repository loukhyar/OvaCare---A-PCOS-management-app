import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/styles.css";

function Nutritionguide() {
  const [mealTime, setMealTime] = useState("");
  const [dietType, setDietType] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");

  const [plan, setPlan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE BODY SCROLL LOCK
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mealTime || !dietType || !age || !goal) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setPlan([]);

      const res = await fetch("http://ovacare.duckdns.org/generate-diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal: mealTime,
          diet: dietType,
          age,
          goal,
        }),
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      if (data.error) {
        alert(data.error);
        return;
      }

      if (!Array.isArray(data.days)) {
        alert("Invalid response from server");
        return;
      }

      setPlan(data.days);
      setShowModal(true);

    } catch (err) {
      console.error(err);
      alert("Error generating plan");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Layout>
      <section className="hero">
        <div className="text-container">
          <h1 className="hero-title">
            AI Nutrition Planner 🥗✨
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Meal Time:</label>
              <select
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
              >
                <option value="">Select</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="form-group">
              <label>Diet Type:</label>
              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Goal:</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="">Select</option>
                <option value="weight loss">Weight Loss</option>
                <option value="balance hormones">Balance Hormones</option>
                <option value="general health">General Health</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Plan"}
            </button>
          </form>
        </div>
      </section>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>

            <h2>Your AI Diet Plan</h2>

            <div className="card-container">
              {plan.map((item, index) => (
                <div key={index} className="card">
                  <h3>{item.day}</h3>

                  {/* ✅ ONLY SHOW SELECTED MEAL */}
                  <ul>
                    {item.meal[mealTime] && (
                      <li>
                        <strong style={{ textTransform: "capitalize" }}>
                          {mealTime}:
                        </strong>{" "}
                        {item.meal[mealTime]}
                      </li>
                    )}
                  </ul>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
}

export default Nutritionguide;