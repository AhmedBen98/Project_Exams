import React, { useEffect, useState } from "react";
import SyllabusUpload from "./SyllabusUpload";
import ExamUpload from "./ExamUpload";
import Report from "./Report";
import { getAnalyses, analyze } from "../api";

export default function Home({ token, user }) {
  const [syllabusList, setSyllabusList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [syllabusId, setSyllabusId] = useState("");
  const [examId, setExamId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's own analyses
  const refresh = () => {
    getAnalyses().then(res => {
      setSyllabusList(res.filter(a => a.type === "syllabus" && a.userId === user.id));
      setExamList(res.filter(a => a.type === "exam" && a.userId === user.id));
    });
    setReport(null);
  };

  useEffect(refresh, [user.id]);

  const handleAnalyze = async () => {
    if (!syllabusId || !examId) return;
    setLoading(true); setReport(null);
    try {
      const data = await analyze(syllabusId, examId, token);
      setReport(data.report);
    } catch (e) {
      setReport({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "32px 0 0 0", maxWidth: 720, margin: "0 auto" }}>
      <SyllabusUpload token={token} onDone={refresh} />
      <ExamUpload token={token} onDone={refresh} />
      <div style={{ marginTop: 38 }}>
        <b>3. Analyser la correspondance</b>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <select value={syllabusId} onChange={e => setSyllabusId(e.target.value)} style={{ minWidth: 120 }}>
            <option value="">Syllabus...</option>
            {syllabusList.map(a =>
              <option value={a.id} key={a.id}>{a.filename} ({new Date(a.createdAt).toLocaleDateString()})</option>
            )}
          </select>
          <select value={examId} onChange={e => setExamId(e.target.value)} style={{ minWidth: 120 }}>
            <option value="">Examen...</option>
            {examList.map(a =>
              <option value={a.id} key={a.id}>{a.filename} ({new Date(a.createdAt).toLocaleDateString()})</option>
            )}
          </select>
          <button className="main-btn" style={{ minWidth: 180 }} disabled={!syllabusId || !examId || loading}
            onClick={handleAnalyze}>{loading ? "Analyse..." : "Analyser la correspondance"}</button>
        </div>
        <div style={{ marginTop: 24 }}>
          <Report report={report} />
        </div>
      </div>
    </div>
  );
}
