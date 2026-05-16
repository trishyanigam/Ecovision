import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  // 🔥 FIXED RESEND EMAIL BUTTON
  const resend = async () => {
    try {
      setResending(true);

      // Force refresh auth user before sending
      await auth.currentUser?.reload();

      const refreshedUser = auth.currentUser;

      if (!refreshedUser) {
        toast.error("User not loaded. Please login again.");
        setResending(false);
        return;
      }

      await sendEmailVerification(refreshedUser);
      toast.success("Verification email sent again!");
    } catch (err) {
      console.error(err);
      toast.error("Error sending verification email.");
    }

    setResending(false);
  };

  // CHECK IF VERIFIED
  const verify = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();

      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        toast.error("Email is still NOT verified. Check your inbox.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
    setChecking(false);
  };

  return (
    <main
      className={`pt-24 min-h-screen ${
        theme === "dark" ? "bg-[#07121a] text-white" : "bg-gray-50"
      }`}
    >
      <div className="max-w-xl mx-auto px-6 py-12 text-center">
        <h2
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-green-300" : "text-green-700"
          }`}
        >
          Verify Your Email
        </h2>

        <p className="mt-6 text-lg">A verification link has been sent to:</p>
        <p className="text-xl font-semibold mt-2">{email}</p>

        <div className="flex flex-col items-center gap-4 mt-10">
          <button
            onClick={verify}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            {checking ? "Checking..." : "I Have Verified My Email"}
          </button>

          <button
            onClick={resend}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
      </div>
    </main>
  );
}
