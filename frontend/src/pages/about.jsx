import "../styles/styles.css";
import img1 from "../assets/about1.jpg";
import img2 from "../assets/about2.jpg";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout>

      <section className="about-section">
        <h1>About OvaCare 🌸</h1>
        <img src={img1} alt="About OvaCare" />

        <p className="about-tagline">
          Supporting every woman’s PCOS journey with care, balance, and self-love 💖
        </p>
      </section>

      <section className="about-section">
        <h2>Understanding PCOS</h2>
        <img src={img2} alt="Understanding PCOS" />

        <p>
          PCOS (Polycystic Ovary Syndrome) affects hormones, metabolism, and overall well-being.
          With the right lifestyle, nutrition, and care, it can be managed effectively.
        </p>
      </section>

    </Layout>
  );
}

export default About;