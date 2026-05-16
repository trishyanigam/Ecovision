
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          // Ensure user exists in Mongo (server uses token to identify email)
          await api.post("/user/create", { name: user.displayName || "" });

          // Fetch stored user details from Mongo
          const res = await api.get("/user/details");
          if (res.data.success) setMongoUser(res.data.user);
        } catch (err) {
          console.log("User load/create failed", err);
        }
      } else {
        setMongoUser(null);
      }
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <main
      className={`pt-24 min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#060b0e] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
       <motion.div
        className="absolute top-12 left-14 text-yellow-300 text-7xl opacity-20 pointer-events-none"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-12 text-blue-300 text-8xl opacity-20 pointer-events-none"
        animate={{ y: [0, 38, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
      >
        👤
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-1/3 text-indigo-300 text-6xl opacity-10 pointer-events-none"
        animate={{ rotate: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
      >
        🌙
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-8 text-center"
        >
          Your Profile
        </motion.h1>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-2xl p-8 shadow-xl backdrop-blur-lg transition ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#102329] to-[#061418]"
              : "bg-white"
          }`}
        >
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl shadow-lg"
            >
              {mongoUser?.name?.charAt(0).toUpperCase() || "U"}
            </motion.div>

            {/* Name */}
            <h2 className="text-2xl font-bold mt-4">
              {mongoUser?.name || firebaseUser?.displayName || "User"}
            </h2>

            {/* Email */}
            <p className="opacity-70 text-sm mt-1">{mongoUser?.email || firebaseUser?.email}</p>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-gray-300 dark:bg-gray-700 my-6"></div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6">

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-4 shadow ${
                theme === "dark" ? "bg-[#0b1a17]" : "bg-gray-50"
              }`}
            >
              <p className="text-sm opacity-60">Account Created</p>
              <p className="font-semibold text-lg mt-1">
                {firebaseUser?.metadata?.creationTime
                  ? new Date(firebaseUser.metadata.creationTime).toLocaleString()
                  : "---"}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl p-4 shadow ${
                theme === "dark" ? "bg-[#0b1a17]" : "bg-gray-50"
              }`}
            >
              <p className="text-sm opacity-60">Last Login</p>
              <p className="font-semibold text-lg mt-1">
                {firebaseUser?.metadata?.lastSignInTime
                  ? new Date(firebaseUser.metadata.lastSignInTime).toLocaleString()
                  : "---"}
              </p>
            </motion.div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white rounded-xl text-lg shadow-lg"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Decorative animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-center text-sm italic"
        >
          Designed for a cleaner, greener future 🌎♻️
        </motion.div>
      </div>
    </main>
  );
}