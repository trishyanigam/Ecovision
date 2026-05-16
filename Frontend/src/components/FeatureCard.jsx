import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div
      className="card p-6 rounded-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900 text-2xl center">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary dark:text-dark-primary">{title}</h3>
          <p className="text-secondary dark:text-dark-secondary mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
