// src/components/ModelSelector.jsx
import React from "react";

export default function ModelSelector({ model, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-green-200">Model</label>
      <select
        value={model}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#07121a] border border-green-800 px-3 py-2 rounded text-sm text-white outline-none"
      >
        <option value="ecoai">EcoAI (fast)</option>
        <option value="ecoai-vision">EcoAI-Vision (image+text)</option>
      
      </select>
    </div>
  );
}
