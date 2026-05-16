import React from "react";
import { useEffect } from "react";
import { API_BASE } from "../config";
export default function Footer() {
  useEffect(() => {
  fetch(`${API_BASE}/test`)
    .then(res => res.json())
    .then(data => console.log("Backend says:", data));
}, []);
  return (
    <footer className="footer-surface mt-16 py-8 text-center border-t border-gray-200 dark:border-gray-700">
      <div className="container">
        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">EcoVision — Clean & Green India</h3>
        <p className="text-secondary dark:text-dark-secondary mt-2">AI-powered waste classification for a sustainable future.</p>
        <p className="text-xs text-secondary dark:text-dark-secondary mt-4">© {new Date().getFullYear()} EcoVision. All rights reserved.</p>
      </div>
    </footer>
  );
}
