// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { extractCLO, extractExam, analyze, getAnalyses } from "../api";
import SyllabusUpload from "./SyllabusUpload";
import ExamUpload from "./ExamUpload";
import Report from "./Report";

export default function Home({ token }) {
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [examFile, setExamFile] = useState(null);
  const [syllabusAnalyses, setSyllabusAnalyses] = useState([]);
  const [examAnalyses, setExamAnalyses] = useState([]);
  const [syllabusId, setSyllabusId] = useState("");
  const [examId, setExamId] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  // Charger les analyses existantes pour sélection
  useEffect(() => {
    getAnalyses()
      .then(all => {
        setSyllabusAnalyses(all.filter(a => a.type === "syllabus"));
        setExamAnalyses(all.filter(a => a.type === "exam"));
      })
      .catch(e => setError("Erreur analyses: " + e.message));
  }, [report]);

  const handleSyllabusUpload = e => setSyllabusFile(e.target.files[0]);
  const handleExamUpload = e => setExamFile(e.target.files[0]);

  const handleExtractCLO = async () => {
    setError("");
    try {
      await extractCLO(syllabusFile, token);
      setReport(null);
      setSyllabusFile(null);
      setTimeout(() => window.location.reload(), 700); // force reload analyses
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExtractExam = async () => {
    setError("");
    try {
      await extractExam(examFile, token);
      setReport(null);
      setExamFile(null);
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnalyze = async () => {
    setError("");
    setReport(null);
    try {
      const res = await analyze(syllabusId, examId, token);
      setReport(res.report);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-bg">
      <div className="container">
        <h2 className="title">Analyse de Syllabus et d'Examen</h2>
        {error && <div className="error-msg">{error}</div>}

        <div className="card">
          <h3>1. Extraire les CLO du syllabus</h3>
          <SyllabusUpload
            onFileChange={handleSyllabusUpload}
            onExtract={handleExtractCLO}
            disabled={!syllabusFile}
          />
          <div style={{ marginTop: 14 }}>
            <b>Syllabus déjà analysés :</b>
            <select
              value={syllabusId}
              onChange={e => setSyllabusId(e.target.value)}
              style={selectStyle}
            >
              <option value="">Choisir un syllabus</option>
              {syllabusAnalyses.map(s => (
                <option key={s.id} value={s.id}>{s.filename} (le {new Date(s.createdAt).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h3>2. Extraire les questions de l'examen</h3>
          <ExamUpload
            onFileChange={handleExamUpload}
            onExtract={handleExtractExam}
            disabled={!examFile}
          />
          <div style={{ marginTop: 14 }}>
            <b>Examens déjà analysés :</b>
            <select
              value={examId}
              onChange={e => setExamId(e.target.value)}
              style={selectStyle}
            >
              <option value="">Choisir un examen</option>
              {examAnalyses.map(e => (
                <option key={e.id} value={e.id}>{e.filename} (le {new Date(e.createdAt).toLocaleDateString()})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h3>3. Analyse de correspondance CLO/Examen</h3>
          <button
            className="btn-analyze"
            onClick={handleAnalyze}
            disabled={!syllabusId || !examId}
          >
            Analyser la correspondance
          </button>
          <Report report={report} />
        </div>
      </div>
      <style>{`
        .main-bg { min-height: 100vh; background: #f7f7f9; padding: 0; font-family: 'Segoe UI', Arial, sans-serif;}
        .container { max-width: 820px; margin: 0 auto; padding: 34px 0;}
        .title { color: #e63946; font-weight: 800; font-size: 2.2rem; text-align: center; margin-bottom: 34px; }
        .card { background: #fff; border-radius: 14px; box-shadow: 0 6px 24px 0 #eaeaea; padding: 28px 24px; margin-bottom: 24px; }
        .btn-analyze { background: linear-gradient(90deg,#e63946 0,#222 100%); color: #fff; font-weight: bold; border: none; border-radius: 8px; padding: 12px 30px; font-size: 1.1rem; margin: 18px 0; cursor: pointer; transition: opacity .15s;}
        .btn-analyze:disabled { opacity: 0.65; cursor: not-allowed; }
        .error-msg { color: #e63946; background: #ffeaea; border-radius: 8px; padding: 10px 18px; font-size: 1.1em; margin-bottom: 18px; }
      `}</style>
    </div>
  );
}

const selectStyle = { padding: "7px 18px", borderRadius: "6px", border: "1.2px solid #e63946", marginLeft: 8, fontSize: "1em" };
