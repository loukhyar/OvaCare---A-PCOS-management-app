import { useEffect, useState } from "react";
import "../styles/styles.css";
import heroImg from "../assets/pcos.png";
import Layout from "../components/Layout";

function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setGreeting(userName ? `Hi, ${userName}! 👋` : "Hi there!");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.age.value, e.target.bmi.value);
  };

  return (
    <Layout>

      <section className="hero-section">
        <p>{greeting}</p>
      </section>

      <section className="hero">
        <div className="text-container">
          <h1>Flourish with Care:</h1>
          <h2>A Loving Guide to Your PCOS Journey</h2>

          <form onSubmit={handleSubmit}>
            <input type="number" name="age" placeholder="Age" required />
            <input type="number" name="bmi" placeholder="BMI" required />
            <button type="submit">Predict</button>
          </form>
        </div>

        <img src={heroImg} alt="PCOS" />
      </section>

    </Layout>
  );
}

export default Home;