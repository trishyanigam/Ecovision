
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function WasteToValue() {
  const { theme } = useTheme();

  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) fetchHistory();
    // Also listen to token changes? If desired we can subscribe to onIdTokenChanged
    // but keeping this minimal to avoid style changes.
  }, []);

  async function fetchHistory() {
    try {
      const user = auth.currentUser;
      if (!user?.email) return;
      const res = await api.get(`/waste-value/history/${encodeURIComponent(user.email)}`);
      if (res.data.success) setHistory(res.data.items || []);
    } catch (err) {
      console.error("history fetch err", err);
    }
  }

  async function onGenerate(e) {
    e?.preventDefault();
    if (!item.trim()) return;
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to use Waste-to-Value Generator");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post("/waste-value/generate", {
        item: item.trim(),
      });

      if (res.data.success) {
        setResult({
          structured: res.data.structured,
          rawText: res.data.rawText,
        });
        fetchHistory();
      } else {
        toast.error("Generation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. See console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`pt-24 min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#07121a] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl font-bold mb-6 ${
            theme === "dark" ? "text-green-300" : "text-green-700"
          }`}
        >
          Waste-to-Value Generator
        </motion.h1>

        {/* Input Card */}
        <div
          className={`rounded-xl p-6 shadow-xl transition ${
            theme === "dark"
              ? "bg-[#0b1a17]"
              : "bg-white border border-gray-200"
          }`}
        >
          <form onSubmit={onGenerate} className="grid grid-cols-1 gap-6">
            <label
              className={`text-sm font-semibold ${
                theme === "dark" ? "text-green-200" : "text-gray-700"
              }`}
            >
              Enter waste item (e.g. "plastic bottles", "coconut shells")
            </label>

            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="input-a2"
              placeholder="e.g. plastic bottles"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-lg bg-green-600 text-white font-medium shadow"
              >
                {loading ? "Generating..." : "Generate Ideas"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setItem("");
                  setResult(null);
                }}
                className="px-5 py-3 rounded-lg border"
              >
                Reset
              </button>
            </div>
          </form>

          {/* RESULT SECTION */}
          {result && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <h3 className="text-xl font-semibold mb-3">
                Suggested Upcycles & Business Ideas
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {/* PRODUCTS */}
                <div className="card">
                  <h4 className="font-semibold mb-2">Products</h4>
                  {Array.isArray(result.structured?.products) &&
                  result.structured.products.length ? (
                    result.structured.products.map((p, i) => (
                      <div key={i} className="mb-2">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-secondary">
                          {p.description}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-secondary">
                      No product suggestions found.
                    </div>
                  )}
                </div>

                {/* UPCYCLING STEPS */}
                <div className="card">
                  <h4 className="font-semibold mb-2">Upcycling Steps</h4>
                  {Array.isArray(result.structured?.upcyclingSteps) &&
                  result.structured.upcyclingSteps.length ? (
                    <ol className="list-decimal pl-5 text-sm text-secondary">
                      {result.structured.upcyclingSteps.map((s, idx) => (
                        <li key={idx} className="mb-1">
                          {s}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-sm text-secondary">
                      No steps available.
                    </div>
                  )}
                </div>

                {/* TOOLS */}
                <div className="card">
                  <h4 className="font-semibold mb-2">Tools Required</h4>
                  {Array.isArray(result.structured?.toolsRequired) &&
                  result.structured.toolsRequired.length ? (
                    <ul className="list-disc pl-5 text-sm text-secondary">
                      {result.structured.toolsRequired.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-secondary">
                      No tools listed.
                    </div>
                  )}
                </div>

                {/* COST */}
                <div className="card">
                  <h4 className="font-semibold mb-2">Cost Estimate (INR)</h4>
                  <div className="text-sm text-secondary">
                    Low: ₹{result.structured?.estimatedCostINR?.low ?? "N/A"}{" "}
                    <br />
                    Typical: ₹
                    {result.structured?.estimatedCostINR?.typical ?? "N/A"}{" "}
                    <br />
                    High: ₹{result.structured?.estimatedCostINR?.high ?? "N/A"}
                  </div>
                </div>

                {/* MARKET */}
                <div className="card md:col-span-2">
                  <h4 className="font-semibold mb-2">Market Demand (India)</h4>
                  <div className="text-sm text-secondary">
                    {result.structured?.marketDemandIndia ?? "unknown"}
                  </div>
                </div>

                {/* BUSINESS IDEA */}
                <div className="card md:col-span-2">
                  <h4 className="font-semibold mb-2">Business Idea (Short)</h4>
                  <div className="text-sm text-secondary">
                    {result.structured?.businessIdeaShort ?? ""}
                  </div>
                </div>
              </div>

              
            </motion.section>
          )}
        </div>

        {/* HISTORY SECTION */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">
            Your Waste-to-Value History
          </h3>

          <div className="grid gap-4">
            {history.length === 0 && (
              <div className="text-secondary">
                No history yet. Use the generator to store your first idea.
              </div>
            )}

            {history.map((h) => (
              <div
                key={h._id}
                className={`p-4 rounded-lg transition ${
                  theme === "dark"
                    ? "bg-[#0b1a17]"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{h.query}</div>
                    <div className="text-sm text-secondary">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-secondary">
                  {h.structuredResult?.businessIdeaShort ||
                    h.structuredResult?.products?.[0]?.name ||
                    "—"}
                </div>

                {/* SHOW FULL MESSAGE BUTTON */}
                <button
                  onClick={() =>
                    setResult({
                      structured: h.structuredResult,
                      rawText: h.rawText,
                    })
                  }
                  className="mt-3 px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
                >
                  Show Full Message →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}