// src/components/AnalyseBox.jsx
import React, { useState, useEffect } from "react";
import SyllabusUpload from "./SyllabusUpload";
import ExamUpload from "./ExamUpload";
import Report from "./Report";
import { extractCLO, extractExam, analyze, getAnalyses } from "../api";

export default function AnalyseBox({ token, user, isAdmin }) {
  const [clo, setClo] = useState([]);
  const [exam, setExam] = useState([]);
  const [syllabusId, setSyllabusId] = useState("");
  const [examId, setExamId] = useState("");
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [syllabusList, setSyllabusList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les syllabus/exam pour le user (ou tous si admin)
  useEffect(() => {
    getAnalyses().then(list => {
      setSyllabusList(
        list.filter(a => a.type === "syllabus" && (!user || isAdmin || a.userId === user.id))
      );
      setExamList(
        list.filter(a => a.type === "exam" && (!user || isAdmin || a.userId === user.id) && a.result && Array.isArray(a.result) && a.result.length > 0)
      );
    });
  }, [user, isAdmin]);

  const handleExtractCLO = async file => {
    setError(""); setLoading(true);
    try {
      const res = await extractCLO(file, token);
      setClo(res.clo || []);
      // Reload syllabus list
      const analyses = await getAnalyses();
      setSyllabusList(analyses.filter(a => a.type === "syllabus" && (!user || isAdmin || a.userId === user.id)));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleExtractExam = async file => {
    setError(""); setLoading(true);
    try {
      const res = await extractExam(file, token);
      setExam(res.questions || []);
      // Reload exam list
      const analyses = await getAnalyses();
      setExamList(
        analyses.filter(a => a.type === "exam" && (!user || isAdmin || a.userId === user.id) && a.result && Array.isArray(a.result) && a.result.length > 0)
      );
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleAnalyze = async () => {
    if (!syllabusId || !examId) return;
    setError(""); setLoading(true); setAnalyzeResult(null);
    try {
      const res = await analyze(syllabusId, examId, token);
      setAnalyzeResult(res.report || null);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 750, margin: "32px auto", background: "#fff", borderRadius: 20, boxShadow: "0 2px 22px #eee", padding: 30 }}>
      <h2 style={{ color: "#e63946", textAlign: "center", fontWeight: 700, marginBottom: 32 }}>
        Analyser un syllabus et un examen
      </h2>
      <div style={{ marginBottom: 32 }}>
        <b>1. Extraire les compétences (CLO) du syllabus</b>
        <div style={{ margin: "8px 0 18px" }}>
          <SyllabusUpload onExtract={handleExtractCLO} loading={loading} />
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <b>2. Extraire les questions et niveaux de Bloom de l'examen</b>
        <div style={{ margin: "8px 0 18px" }}>
          <ExamUpload onExtract={handleExtractExam} loading={loading} />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <b>3. Analyser la correspondance</b>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
          <select value={syllabusId} onChange={e => setSyllabusId(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">Syllabus...</option>
            {syllabusList.map(s =>
              <option value={s.id} key={s.id}>{s.filename} ({new Date(s.createdAt).toLocaleDateString()})</option>
            )}
          </select>
          <select value={examId} onChange={e => setExamId(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">Examen...</option>
            {examList.map(ex =>
              <option value={ex.id} key={ex.id}>{ex.filename} ({new Date(ex.createdAt).toLocaleDateString()})</option>
            )}
          </select>
          <button className="main-btn" disabled={!syllabusId || !examId || loading} onClick={handleAnalyze}>Analyser la correspondance</button>
        </div>
      </div>
      {error && <div style={{ color: "#e63946", marginTop: 18 }}>{error}</div>}
      {analyzeResult && (
        <div style={{ marginTop: 30 }}>
          <Report report={analyzeResult} />
        </div>
      )}
    </div>
  );
}
