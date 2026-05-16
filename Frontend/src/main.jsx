import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px"
            }
          }}
        />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
