import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/styles.css";

// import all images (rename properly in src/assets/)
import catCow from "../assets/cat-cow.jpg";
import child from "../assets/child.jpg";
import butterfly from "../assets/butterfly.jpg";
import garland from "../assets/garland.jpg";
import cobra from "../assets/cobra.jpg";
import bridge from "../assets/bridge.jpg";
import legsUp from "../assets/legs-up.jpg";
import forwardBend from "../assets/forward-bend.jpg";
import reclining from "../assets/reclining.jpg";
import pigeon from "../assets/pigeon.jpg";
import twist from "../assets/twist.jpg";
import warrior from "../assets/warrior.jpg";
import triangle from "../assets/triangle.jpg";
import boat from "../assets/boat.jpg";
import camel from "../assets/camel.jpg";
import happyBaby from "../assets/happy-baby.jpg";
import corpse from "../assets/corpse.jpg";

function YogaPlanner() {
  const [filter, setFilter] = useState("all");

  const poses = [
    { name: "Cat-Cow Pose", category: "hormonal", img: catCow, desc: "Improves flexibility & hormones" },
    { name: "Child's Pose", category: "relaxing", img: child, desc: "Relieves stress & tension" },
    { name: "Butterfly Pose", category: "hormonal", img: butterfly, desc: "Stimulates ovaries" },
    { name: "Garland Pose", category: "strengthening", img: garland, desc: "Improves hip mobility" },
    { name: "Cobra Pose", category: "hormonal", img: cobra, desc: "Stimulates ovarian function" },
    { name: "Bridge Pose", category: "strengthening", img: bridge, desc: "Strengthens back & glutes" },
    { name: "Legs Up the Wall", category: "relaxing", img: legsUp, desc: "Improves circulation" },
    { name: "Seated Forward Bend", category: "hormonal", img: forwardBend, desc: "Calms mind" },
    { name: "Reclining Bound Angle", category: "relaxing", img: reclining, desc: "Relaxes body" },
    { name: "Pigeon Pose", category: "hormonal", img: pigeon, desc: "Improves emotional release" },
    { name: "Spinal Twist", category: "strengthening", img: twist, desc: "Improves digestion" },
    { name: "Warrior II", category: "strengthening", img: warrior, desc: "Builds strength" },
    { name: "Triangle Pose", category: "hormonal", img: triangle, desc: "Improves metabolism" },
    { name: "Boat Pose", category: "strengthening", img: boat, desc: "Strengthens core" },
    { name: "Camel Pose", category: "hormonal", img: camel, desc: "Opens chest & posture" },
    { name: "Happy Baby", category: "relaxing", img: happyBaby, desc: "Relaxes hips" },
    { name: "Corpse Pose", category: "relaxing", img: corpse, desc: "Deep relaxation" },
  ];

  const filteredPoses =
    filter === "all"
      ? poses
      : poses.filter((p) => p.category === filter);

  return (
    <Layout>

      <section className="yoga-planner">
        <h1>Yoga Planner for PCOS</h1>
        <p>Practice 3–4 times a week 💖</p>

        {/* Filters */}
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("relaxing")}>Relaxing</button>
          <button onClick={() => setFilter("strengthening")}>Strengthening</button>
          <button onClick={() => setFilter("hormonal")}>Hormonal</button>
        </div>

        {/* Grid */}
        <div className="yoga-grid">
          {filteredPoses.map((pose, index) => (
            <div key={index} className="yoga-pose">
              <img src={pose.img} alt={pose.name} />
              <h3>{pose.name}</h3>
              <p>{pose.desc}</p>
            </div>
          ))}
        </div>

      </section>

    </Layout>
  );
}

export default YogaPlanner;