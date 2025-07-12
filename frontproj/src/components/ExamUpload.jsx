import React, { useRef, useState } from "react";
import { extractExam } from "../api";

export default function ExamUpload({ token }) {
  const [file, setFile] = useState(null);
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  function fixUtf8(str) {
  try { return decodeURIComponent(escape(str)); } catch { return str; }
}

  const handleUpload = async () => {
    setLoading(true); setOut(null);
    try {
      const res = await extractExam(file, token);
      setOut(res.questions);
      inputRef.current.value = "";
      setFile(null);
    } catch {
      setOut("Erreur lors de l'extraction");
    }
    setLoading(false);
  };

  return (
    <div>
      <b>2. Extraire les questions et niveaux de Bloom de l'examen</b>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
        <input type="file" accept=".pdf" ref={inputRef}
          onChange={e => setFile(e.target.files[0])} />
        <button className="main-btn"
          style={{ minWidth: 150 }}
          disabled={!file || loading}
          onClick={handleUpload}
        >Extraire Examen</button>
      </div>
      {Array.isArray(out) && (
        <ul style={{ marginTop: 10 }}>
          {out.map((q, i) => (
            <li key={i}>
              <b>Question:</b> {q.question} <br />
              <b>Compétence:</b> {(q.competences || [q.competence]).join(", ")} <br />
              <b>Niveau Bloom:</b> {q.niveau_bloom}
            </li>
          ))}
        </ul>
      )}
      {typeof out === "string" && out && (
        <div style={{ color: "#e63946", marginTop: 6 }}>{out}</div>
      )}
    </div>
  );
}
