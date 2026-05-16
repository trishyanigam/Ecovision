import React from "react";

export default function ImageUpload({ onSelect }) {
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    onSelect(f);
  };

  return (
    <label className="btn-outline cursor-pointer px-4 py-2 rounded">
      Upload Image
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  );
}
