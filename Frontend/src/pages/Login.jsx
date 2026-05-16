import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw) => pw.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return toast.error("Enter a valid email.");
    if (!validatePassword(password)) return toast.error("Password is too weak.");

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        toast.error("Please verify your email first.");
        setLoading(false);
        return;
      }

      toast.success("Logged in successfully!");
      navigate("/");

    } catch (err) {
      if (err.code === "auth/user-not-found") toast.error("User not found. Create an account.");
      else if (err.code === "auth/wrong-password") toast.error("Incorrect password.");
      else toast.error("Please Create an account first");
    }

    setLoading(false);
  };

  return (
    <main className={`pt-24 min-h-screen ${theme==="dark"?"bg-[#07121a] text-white":"bg-gray-50"}`}>
      <div className="max-w-xl mx-auto px-6 py-12">

        <h2 className={`text-3xl font-bold text-center ${theme==="dark"?"text-green-300":"text-green-700"}`}>
          Login
        </h2>

        <form className="space-y-6 mt-10" onSubmit={handleLogin}>
          
          <input
            className="input-a2"
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              className="input-a2"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-4 top-3 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <button
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex justify-center gap-3 disabled:opacity-40 cursor-pointer"
            disabled={loading}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Don't have an account?
          <span className="underline text-green-600 ml-2 cursor-pointer" onClick={() => navigate("/signup")}>
            Create Account
          </span>
        </p>

      </div>
    </main>
  );
}