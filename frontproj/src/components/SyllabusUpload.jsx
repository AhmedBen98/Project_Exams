import React, { useRef, useState } from "react";
import { extractCLO } from "../api";

export default function SyllabusUpload({ token }) {
  const [file, setFile] = useState(null);
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleUpload = async () => {
    setLoading(true); setOut(null);
    try {
      const res = await extractCLO(file, token);
      setOut(res.clo);
      inputRef.current.value = "";
      setFile(null);
    } catch {
      setOut("Erreur lors de l'extraction");
    }
    setLoading(false);
  };

  function fixUtf8(str) {
  try {
    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}
  return (
    <div>
      <b>1. Extraire les compétences (CLO) du syllabus</b>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <input type="file" accept=".pdf" ref={inputRef}
          onChange={e => setFile(e.target.files[0])} />
        <button className="main-btn"
          style={{ minWidth: 150 }}
          disabled={!file || loading}
          onClick={handleUpload}
        >Extraire CLO</button>
      </div>
      {Array.isArray(out) && (
        <ul style={{ marginTop: 10 }}>
          {out.map((c, i) => <li key={fixUtf8(i)}>{fixUtf8(c)}</li>)}
        </ul>
      )}
      {typeof out === "string" && out && (
        <div style={{ color: "#e63946", marginTop: 6 }}>{out}</div>
      )}
    </div>
  );
}
