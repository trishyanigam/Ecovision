// src/pages/Features.jsx
import React from "react";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    { title: "Waste-to-Value Generator", desc: "Turn waste into useful ideas, products, and upcycling opportunities.", icon: "🔄" },
    { title: "Recycling Guide", desc: "Clean, sort and prepare waste correctly.", icon: "♻️" },
    { title: "Decomposition Time", desc: "Estimate how long materials take to decompose.", icon: "⏳" },
    { title: "Sustainability Tips", desc: "Reduce waste and adopt eco-friendly habits.", icon: "🌱" },
    { title: "Business Ideas From Waste", desc: "Generate profitable business opportunities using waste materials.", icon: "🧠" },
  ];

  return (
    <main className="main-content pt-24">
      {/* Floating Icons */}
      <motion.div
        className="absolute top-10 left-16 text-yellow-300 text-7xl opacity-20 pointer-events-none"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      >
        ✨
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-16 text-gray-400 text-8xl opacity-20 pointer-events-none"
        animate={{ y: [0, 35, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      >
        ⚙️
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-green-400 text-6xl opacity-10 pointer-events-none"
        animate={{ rotate: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      >
        🔄
      </motion.div>
      <motion.section
        className="container py-20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="h2 text-center h1-color mb-10">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <FeatureCard title={f.title} desc={f.desc} icon={f.icon} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}


// src/pages/Features.jsx

  // const features = [
  //   { title: "Waste-to-Value Generator", desc: "Turn waste into profitable eco-business ideas using AI.", icon: "🔄" },
  //   { title: "Material Recognition AI", desc: "Identify plastic, metal, organic, glass and more instantly.", icon: "🧪" },
  //   { title: "Upcycling & Recycling Guide", desc: "Learn the correct way to recycle or creatively reuse waste.", icon: "♻️" },
  //   { title: "Carbon Impact Score", desc: "Calculate how much CO₂ your actions save.", icon: "📊" },
  //   { title: "Decomposition Time Estimator", desc: "See how long different materials take to decompose.", icon: "⏳" },
  //   { title: "Sustainability Tips", desc: "Adopt greener habits personalized for you.", icon: "🌱" },
  //   { title: "DIY Upcycle Tutorials", desc: "Simple tutorials to convert waste into useful products.", icon: "🛠" },
  //   { title: "Marketplace Ideas", desc: "Discover ways to sell your upcycled products.", icon: "🛒" },
  // ];
