import "../styles/styles7.css";
import img1 from "../assets/about1.jpg";
import img2 from "../assets/about2.jpg";
import { Link } from "react-router-dom";


function About() {
  return (
    <>
      <header className="header-container">
        <nav>
          <div className="logo-text">OvaCare</div>
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
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero-section section-with-image">
          <div className="hero-content">
            <h1>About OvaCare 🌸</h1>

            <img className="section-img" src={img1} alt="Women Health" />

            <p>
              Supporting every woman’s PCOS journey with knowledge, care, and
              community — because healing is personal.
            </p>
          </div>
        </section>

        {/* Understanding PCOS */}
        <section className="section-with-image">
          <h2>Understanding PCOS</h2>

          <img className="section-img" src={img2} alt="Hormones" />

          <p>
            Polycystic Ovary Syndrome (PCOS) is a complex hormonal condition...
          </p>

          <p>
            While the exact cause of PCOS is still being researched...
          </p>
        </section>

        {/* What is OvaCare */}
        <section className="section-with-image">
          <h2>What is OvaCare?</h2>
          <p>
            OvaCare is a digital health platform designed to support women...
          </p>
        </section>

        {/* Why We Exist */}
        <section className="section-with-image">
          <h2>Why We Exist</h2>

          <img className="section-img" src={"https://cdn-icons-png.flaticon.com/512/3940/3940403.png"} alt="Support" />

          <p>
            PCOS isn't just a medical diagnosis—it’s a personal journey...
          </p>
        </section>

        {/* Features */}
        <section>
          <h2>What OvaCare Offers</h2>

          <ul>
            <li>🔍 Symptom Checker</li>
            <li>🥗 Nutrition Guide</li>
            <li>🧘‍♀ Yoga Flow</li>
            <li>📅 My Cycle</li>
            <li>🌱 Wellness Tips</li>
            <li>💖 Mood Journal</li>
          </ul>
        </section>

        {/* Vision */}
        <section className="section-with-image">
          <h2>Our Vision</h2>
          <p>
            At OvaCare, we envision a world where women with PCOS are supported...
          </p>
        </section>
      </main>

      <footer className="footer">
        Made with ❤️ by the OvaCare Team — Because your health deserves care.
      </footer>
    </>
  );
}

export default About;