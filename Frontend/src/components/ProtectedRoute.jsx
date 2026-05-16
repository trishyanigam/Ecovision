// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!firebaseUser) return <Navigate to="/login" replace />;

  // Email not verified → force verification page
  if (!firebaseUser.emailVerified && location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" replace state={{ email: firebaseUser.email }} />;
  }

  return children;
}
