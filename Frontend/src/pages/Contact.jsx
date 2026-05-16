import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios"; // 🔥 added backend api
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });

  // Load user from Firebase instead of localStorage
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
        }));
      }
    });
    return () => unsub();
  }, []);

  // UPDATED SUBMIT FUNCTION — sends data to backend + stores in MongoDB
  const submit = async () => {
    if (!message.trim()) {
      toast.error("Please enter your question.");
      return;
    }

    try {
      // 🔥 Send message to backend (auth token auto-included by axios interceptor)
      const res = await api.post("/support/contact", {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        message,
      });

      if (res.data.success) {
        toast.success("Your message has been sent successfully!");
        setMessage("");
      } else {
        toast.error(res.data.msg || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to send message. Try again later.");
    }
  };

  return (
    <main className="main-content pt-24 relative overflow-hidden">
      {/* Floating Background Icons */}
      <motion.div
        className="absolute top-10 left-10 text-green-300 dark:text-green-800 text-7xl opacity-20 pointer-events-none select-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        ♻️
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-20 text-green-400 dark:text-green-900 text-8xl opacity-20 pointer-events-none select-none"
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        🌱
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/4 text-green-500 dark:text-green-700 text-6xl opacity-10 pointer-events-none select-none"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        🍃
      </motion.div>

      <motion.section
        className="container py-16"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        {/* Title */}
        <h2 className="h2 h1-color text-center mb-3">Contact & Support</h2>

        {/* Subheading */}
        <p className="text-center text-secondary dark:text-dark-secondary mb-10 max-w-2xl mx-auto">
          We’re here to help with anything—questions, suggestions, feedback, or collaboration ideas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Info */}
          <motion.div
            className="card p-6 relative"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="absolute top-4 right-4 text-xl opacity-30">📬</div>

            <h3 className="font-semibold text-lg text-primary dark:text-dark-primary">
              📞 Project Contact Information
            </h3>

            <p className="text-secondary dark:text-dark-secondary mt-2 leading-7">
              We would love to hear from you!  
              Whether it’s feedback, support, or collaboration opportunities,
              feel free to reach out.
            </p>

            <hr className="my-4 border-gray-300 dark:border-gray-700" />

            <div className="mt-5 space-y-3">
              <p><strong>Email:</strong> team@ecovision.in</p>
              <p><strong>Support:</strong> support@ecovision.in</p>
              <p><strong>Phone:</strong> +91 7351206107</p>
            </div>

           <div className="mt-5 p-3 rounded-lg 
             text-secondary dark:text-dark-secondary mt-2 leading-7">
              💡 <strong>Tip:</strong> For faster support, mention your issue clearly and attach screenshots if possible.
            </div>
          </motion.div>

          {/* User Input Card */}
          <motion.div
            className="card p-6 relative"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-4 right-4 text-xl opacity-30">📝</div>

            <label className="font-medium block mb-2">Your Email</label>
            <input
              className="input-a2 mb-4"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              placeholder="Email"
            />

            <label className="font-medium block mb-2">Your Phone</label>
            <input
              className="input-a2 mb-4"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              placeholder="Phone"
            />

            <label className="font-medium block mb-2">Ask Your Question</label>
            <textarea
              className="input-a2 min-h-[120px] mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question in detail..."
            ></textarea>

            <button onClick={submit} className="btn-primary w-full py-3">
              Submit Question
            </button>

            <p className="text-xs text-secondary dark:text-dark-secondary mt-3 text-center">
              We respond within <strong>24–48 hours</strong> on business days.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
