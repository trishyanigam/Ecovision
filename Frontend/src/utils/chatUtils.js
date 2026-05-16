// src/utils/chatUtils.js
// Utilities for image analysis and chat replies.
// - Uses backend endpoints if available: /api/analyze and /api/chat
// - Falls back to simulateImageAnalysis and ruleBasedReply if backend unavailable.
// Replace endpoints as needed when you build your backend (Node/Express example).

/**
 * Helper: convert File to FormData for image upload.
 */
export function fileToFormData(file) {
  const fd = new FormData();
  fd.append("image", file);
  return fd;
}

/**
 * Fetch wrapper with timeout
 */
async function fetchWithTimeout(url, opts = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Simulated image analysis (fallback)
 * Returns object matching the /api/analyze expected schema.
 */
export function simulateImageAnalysis(file) {
  const name = (file?.name || "").toLowerCase();

  let type = "Plastic Bottle (PET)";
  let recyclable = "Yes";
  let compostable = "No";
  let estimate = "400–500 years";
  if (name.includes("banana") || name.includes("peel") || name.includes("apple")) {
    type = "Organic (food waste)";
    recyclable = "No";
    compostable = "Yes (home compost)";
    estimate = "2–6 weeks (home compost)";
  } else if (name.includes("battery") || name.includes("phone")) {
    type = "Electronic / Battery";
    recyclable = "No (hazardous)";
    compostable = "No";
    estimate = "Hazardous — do not compost";
  } else if (name.includes("can") || name.includes("aluminium") || name.includes("tin")) {
    type = "Aluminium Can";
    recyclable = "Yes";
    compostable = "No";
    estimate = "80–200 years";
  }

  const steps = [
    recyclable === "Yes" ? "Rinse the item thoroughly." : "Remove contaminants / food residue.",
    "Remove labels and caps when possible.",
    recyclable === "Yes" ? "Place in the appropriate recycling stream." : "Take to municipal hazardous collection if applicable."
  ];

  const confidence = +(0.78 + Math.random() * 0.18).toFixed(2);

  return { type, recyclable, compostable, estimate, steps, confidence };
}

/**
 * analyzeImage(file)
 * - Attempts to call backend /api/analyze by POSTing multipart/form-data {image}
 * - If backend fails, returns simulateImageAnalysis(file)
 *
 * Expected backend response JSON:
 * {
 *   type: "Plastic Bottle (PET)",
 *   recyclable: "Yes",
 *   compostable: "No",
 *   estimate: "400-500 years",
 *   steps: ["Rinse", "Remove cap", ...],
 *   confidence: 0.92
 * }
 */
export async function analyzeImage(file) {
  if (!file) throw new Error("No file provided");
  try {
    // Replace '/api/analyze' with your backend analyze endpoint if different.
    const fd = fileToFormData(file);
    const res = await fetchWithTimeout("/api/analyze", {
      method: "POST",
      body: fd,
    }, 20000);

    if (!res.ok) {
      // fallback
      return simulateImageAnalysis(file);
    }
    const json = await res.json();
    return json;
  } catch (err) {
    // fallback
    return simulateImageAnalysis(file);
  }
}

/**
 * ruleBasedReply(history, question, lastAnalysisMeta)
 * - Simple local fallback rules for common follow-ups
 */
export function ruleBasedReply(history = [], question = "", lastAnalysisMeta = null) {
  const q = (question || "").toLowerCase();

  // if asks about disposal
  if (q.includes("dispose") || q.includes("how to dispose") || q.includes("how do i dispose") || q.includes("how to throw")) {
    if (lastAnalysisMeta) {
      const steps = lastAnalysisMeta.steps || [];
      return `Follow these steps:\n1) ${steps[0]}\n2) ${steps[1]}\n3) ${steps[2]}\nIf item is hazardous (batteries/electronics), please take to authorized collection centers.`;
    }
    return "General disposal steps: 1) Remove residues 2) Separate recyclable parts (caps/labels) 3) Place in recycling or appropriate collection stream. If hazardous (batteries, e-waste), take to a dedicated facility.";
  }

  if (q.includes("recycl") || q.includes("is this recyclable")) {
    if (lastAnalysisMeta) return `Recyclable: ${lastAnalysisMeta.recyclable}. Confidence: ${Math.round((lastAnalysisMeta.confidence||0)*100)}%.`;
    return "I can't be sure without an image, but many plastics with recycle codes (1 PET, 2 HDPE) are recyclable in curbside collections. Check local rules.";
  }

  if (q.includes("compost") || q.includes("manure") || q.includes("compostable")) {
    if (lastAnalysisMeta) return `Compostable: ${lastAnalysisMeta.compostable}. Estimate: ${lastAnalysisMeta.estimate}.`;
    return "Organics and food waste are generally compostable. Avoid composting greasy or chemically-treated items.";
  }

  // default fallback
  return "Sorry, I couldn't confidently answer that. Try asking about 'how to dispose', 'is this recyclable', or upload a clear picture of the item.";
}

/**
 * generateFollowUpReply(history, question, lastAnalysisMeta)
 * - Primary behavior: call backend /api/chat with conversation context.
 * - Backend should call your preferred model (OpenAI/Cohere/etc.) and return { reply: "...", suggestedButtons: [...] }
 * - If backend unreachable, fall back to ruleBasedReply
 */
export async function generateFollowUpReply(history = [], question = "", lastAnalysisMeta = null) {
  try {
    // Replace '/api/chat' with your backend chat endpoint
    const res = await fetchWithTimeout("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, question, lastAnalysisMeta }),
    }, 20000);

    if (!res.ok) {
      return { reply: ruleBasedReply(history, question, lastAnalysisMeta), suggested: ["How to dispose?", "Is this recyclable?"] };
    }
    const json = await res.json();
    // expects { reply: "...", suggested: ["...","..."] }
    return { reply: json.reply || "", suggested: json.suggested || [] };
  } catch (err) {
    // fallback
    return { reply: ruleBasedReply(history, question, lastAnalysisMeta), suggested: ["How to dispose?", "Is this recyclable?"] };
  }
}

/**
 * getPreviewUrl(file)
 */
export function getPreviewUrl(file) {
  if (!file) return "";
  try {
    return URL.createObjectURL(file);
  } catch {
    return "";
  }
}
