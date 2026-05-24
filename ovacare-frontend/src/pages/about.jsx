import "../styles/styles.css";
import img1 from "../assets/about1.jpg";
import img2 from "../assets/about2.jpg";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout>

      <section>
        <h1>About OvaCare 🌸</h1>
        <img src={img1} alt="" />
        <p>Supporting every woman’s PCOS journey...</p>
      </section>

      <section>
        <h2>Understanding PCOS</h2>
        <img src={img2} alt="" />
      </section>

    </Layout>
  );
}

export default About;