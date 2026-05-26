import { useEffect, useState } from "react";
import heroImg from "../assets/pcos.png";
import Layout from "../components/Layout";

function Home() {
  const [greeting, setGreeting] = useState("");
  const [result, setResult] = useState(""); // ✅ NEW

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setGreeting(userName ? `Hi, ${userName}! 👋` : "Hi there!");
  }, []);

  // ✅ FIXED FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const age = e.target.age.value;
    const bmi = e.target.bmi.value;

    try {
      const res = await fetch("http://localhost:5000/bmi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ age, bmi }),
      });

      const data = await res.json();

      if (data.category) {
        setResult(`🌸 Your BMI category: ${data.category}`);
      } else {
        setResult("❌ Error calculating BMI");
      }
    } catch (err) {
      setResult("❌ Server error");
    }
  };

  return (
    <Layout>
      {/* Greeting */}
      <section className="max-w-6xl mx-auto mt-6 px-4">
        <div className="bg-pink-200 rounded-2xl shadow-md py-4 text-center">
          <p className="text-pink-900 font-semibold text-lg">
            {greeting}
          </p>
        </div>
      </section>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700 leading-tight">
            Flourish with Care:
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-purple-700 mt-4">
            A Loving Guide to Your PCOS Journey
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-5"
          >
            <input
              type="number"
              name="age"
              placeholder="Enter Age"
              required
              className="w-full md:w-80 px-4 py-3 rounded-xl border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="number"
              name="bmi"
              step="0.1"
              placeholder="Enter BMI"
              required
              className="w-full md:w-80 px-4 py-3 rounded-xl border-2 border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            <button
              type="submit"
              className="w-full md:w-48 bg-gradient-to-r from-pink-600 to-pink-400 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition duration-300"
            >
              Predict
            </button>
          </form>

          {/* ✅ RESULT DISPLAY */}
          {result && (
            <p className="mt-6 text-lg font-semibold text-purple-700">
              {result}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImg}
            alt="PCOS"
            className="w-full max-w-md rounded-3xl shadow-2xl hover:scale-105 transition duration-300"
          />
        </div>
      </section>
    </Layout>
  );
}

export default Home;