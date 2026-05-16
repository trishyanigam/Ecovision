// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios"; // IMPORTANT: use axios with token

export default function Signup() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw) =>
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /\d/.test(pw) &&
    /[@$!%*?&#]/.test(pw);

  const handleInputs = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "name") {
      setErrors((p) => ({
        ...p,
        name: e.target.value.length < 3 ? "Name must be ≥ 3 characters." : ""
      }));
    }

    if (e.target.name === "email") {
      setErrors((p) => ({
        ...p,
        email: !validateEmail(e.target.value) ? "Invalid email format." : ""
      }));
    }

    if (e.target.name === "password") {
      setErrors((p) => ({
        ...p,
        password: !validatePassword(e.target.value)
          ? "Must contain 8+ chars, uppercase, lowercase, number & special char."
          : ""
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (errors.name || errors.email || errors.password) {
      toast.error("Fix validation errors first.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Signup in Firebase
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await sendEmailVerification(userCred.user);

      // 2️⃣ Create user in Mongo (with name)
      await api.post("/user/create", { name: formData.name });

      toast.success("Signup successful! Verification email sent.");

      navigate("/verify-email", { state: { email: formData.email } });

    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <main className={`pt-24 min-h-screen ${theme==="dark"?"bg-[#07121a] text-white":"bg-gray-50"}`}>
      <div className="max-w-xl mx-auto px-6 py-12">
        
        <h2 className={`text-3xl font-bold text-center ${theme==="dark"?"text-green-300":"text-green-700"}`}>
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-6 mt-10">

          {/* NAME */}
          <div>
            <input 
              className="input-a2" 
              name="name" 
              placeholder="Full Name" 
              required 
              onChange={handleInputs} 
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <input 
              className="input-a2" 
              name="email" 
              placeholder="Email" 
              required 
              type="email" 
              onChange={handleInputs} 
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              className="input-a2"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              onChange={handleInputs}
            />

            <span
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>

            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex justify-center gap-3 cursor-pointer"
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Signing up…" : "Sign Up"}
          </button>
        </form>

      </div>
    </main>
  );
}