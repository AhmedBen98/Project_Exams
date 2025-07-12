// src/components/ExamUpload.jsx
import React from "react";

export default function ExamUpload({ onFileChange, onExtract, disabled }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        style={{
          background: "#fff",
          color: "#222",
          borderRadius: "6px",
          padding: "7px 8px",
          border: "1.2px solid #e63946"
        }}
      />
      <button
        onClick={onExtract}
        disabled={disabled}
        style={{
          padding: "9px 24px",
          borderRadius: "7px",
          border: "none",
          background: disabled
            ? "#eee"
            : "linear-gradient(90deg, #e63946 0%, #222 100%)",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >Extraire Examen</button>
    </div>
  );
}
