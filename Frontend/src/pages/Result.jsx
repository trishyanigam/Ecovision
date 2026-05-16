
import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const analysis = state?.analysis;
  const preview = state?.preview;

  if (!analysis) return <div className="pt-24 text-center">No data found</div>;

  return (
    <main className="pt-24 p-6">
      <img src={preview} className="max-h-72 rounded mb-4" />

      {analysis.wasteItems?.map((i, idx) => (
        <p key={idx}><b>{i.item}</b> - {i.material}</p>
      ))}

      <ul className="list-disc ml-6 mt-3">
        {analysis.analysis?.map((e, i) =>
          e.steps.map((s, j) => <li key={`${i}-${j}`}>{s}</li>)
        )}
      </ul>

      <Link to="/history" className="mt-4 inline-block underline">Back</Link>
    </main>
  );
}