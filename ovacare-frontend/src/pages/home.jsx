import { useEffect, useState } from "react";
import "../styles/styles.css";
import heroImg from "../assets/pcos.png";
import { Link } from "react-router-dom";

function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setGreeting(userName ? `Hi, ${userName}! 👋` : "Hi there!");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const age = e.target.age.value;
    const bmi = e.target.bmi.value;

    console.log(age, bmi);
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">OvaCare</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li>Symptom Checker</li>
          <li>Nutrition Guide</li>
          <li>Mind & Movement</li>
          <li>Period Tracker</li>
          <li>Wellness Tips</li>
          <li>Mood Tracker</li>
          <li>Log Out</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Greeting */}
        <section className="hero-section">
          <p>{greeting}</p>
        </section>

        {/* Hero Section */}
        <section className="hero">
          <div className="text-container">
            <h1 className="hero-title">Flourish with Care:</h1>
            <h2 className="hero-title">
              A Loving Guide to Your PCOS Journey
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Age:</label>
                <input type="number" name="age" required />
              </div>

              <div className="form-group">
                <label>BMI:</label>
                <input type="number" name="bmi" step="0.1" required />
              </div>

              <div className="form-group">
                <button type="submit">Predict</button>
              </div>
            </form>

            <div className="result-container">
              {/* result will come here */}
            </div>
          </div>

          <img className="hero-image" src={heroImg} alt="PCOS" />
        </section>

      </main>
    </div>
  );
}

export default Home;