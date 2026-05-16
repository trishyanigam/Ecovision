

import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <main className="main-content pt-24 relative overflow-hidden">

      {/* 🌱 Floating Background Icons */}
      <motion.div
        className="absolute top-10 left-10 text-green-300 dark:text-green-700 text-7xl opacity-20 pointer-events-none select-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        ♻️
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-20 text-green-400 dark:text-green-800 text-8xl opacity-20 pointer-events-none select-none"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        🌱
      </motion.div>

      <motion.section
        className="container py-16"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <h2 className="h2 h1-color text-center mb-6">About EcoVision</h2>

        <motion.p
          className="text-secondary max-w-3xl mx-auto text-center leading-7 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          EcoVision is a Swadeshi, student-led clean-tech initiative built for
          Atmanirbhar Bharat. Our mission is to empower India with AI-driven
          waste analysis, sustainable habits, and accessible recycling knowledge
          — all using indigenous solutions.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-lg text-primary dark:text-dark-primary">
              🌱 Our Story
            </h3>
            <p className="text-secondary dark:text-dark-secondary mt-2">
              Born in a university innovation lab, EcoVision began as a mission
              to solve India's waste challenge using AI, community awareness,
              and modern engineering practices.
            </p>
          </motion.div>

          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h3 className="font-semibold text-lg text-primary dark:text-dark-primary">
              🇮🇳 Mission
            </h3>
            <p className="text-secondary dark:text-dark-secondary mt-2">
              Our mission is to educate millions about proper waste-segregation,
              promote recycling, reduce landfill load and build an eco-conscious
              India powered by local tech.
            </p>
          </motion.div>

          <motion.div
            className="card p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-semibold text-lg text-primary dark:text-dark-primary">
              🔭 Vision
            </h3>
            <p className="text-secondary dark:text-dark-secondary mt-2">
              To build India’s first AI-powered waste-identification ecosystem
              that helps every citizen make greener choices — effortlessly.
            </p>
          </motion.div>

        </div>
      </motion.section>
    </main>
  );
}