import React, { useState } from 'react';
import { extractCLO, extractExam, analyze } from '../api';
import SyllabusUpload from './SyllabusUpload';
import ExamUpload from './ExamUpload';
import Report from './Report';

function Home({ token }) {
  const [syllabus, setSyllabus] = useState(null);
  const [exam, setExam] = useState(null);
  const [clo, setClo] = useState([]);
  const [examData, setExamData] = useState([]);
  const [report, setReport] = useState(null);

  const handleSyllabusUpload = e => setSyllabus(e.target.files[0]);
  const handleExamUpload = e => setExam(e.target.files[0]);

  const handleExtractCLO = async () => {
    const res = await extractCLO(syllabus, token);
    setClo(res.data.clo || res.data);
  };

  const handleExtractExam = async () => {
    const res = await extractExam(exam, token);
    setExamData(res.data.questions || res.data);
  };

  const handleAnalyze = async () => {
    const res = await analyze(syllabus, exam, token);
    setReport(res.data);
  };

  function formatCLO(clo) {
    if (!clo || clo.length === 0) return null;
    return (
      <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 24 }}>
        {clo.map((item, idx) => (
          <li key={idx} style={{ color: '#232526', marginBottom: 4 }}>{item}</li>
        ))}
      </ul>
    );
  }

  function formatExamData(examData) {
    if (!examData || examData.length === 0) return null;
    return (
      <ol style={{ marginTop: 10, marginBottom: 0, paddingLeft: 24 }}>
        {examData.map((q, idx) => (
          <li key={idx} style={{ color: '#232526', marginBottom: 8 }}>
            {typeof q === 'string'
              ? q
              : <>
                  <div><b>Question:</b> {q.question}</div>
                  <div><b>Compétence:</b> {q.competence}</div>
                  <div><b>Niveau Bloom:</b> {q.niveau_bloom}</div>
                </>
            }
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
      padding: '0',
      margin: '0',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 0'
      }}>
        <h2 style={{
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '2.2rem',
          letterSpacing: '1px',
          marginBottom: '32px'
        }}>Accueil</h2>
        <div style={{
          background: 'rgba(255,255,255,0.09)',
          borderRadius: '18px',
          boxShadow: '0 4px 24px 0 rgba(31,38,135,0.17)',
          padding: '32px 28px',
          marginBottom: '32px'
        }}>
          <h3 style={{ color: '#b3b3b3', marginBottom: '12px' }}>1. Extraire les compétences (CLO) du syllabus</h3>
          <SyllabusUpload
            onFileChange={handleSyllabusUpload}
            onExtract={handleExtractCLO}
            disabled={!syllabus}
          />
          {clo.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.13)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '12px',
              fontSize: '1rem'
            }}>
              <b>Compétences extraites :</b>
              {formatCLO(clo)}
            </div>
          )}
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.09)',
          borderRadius: '18px',
          boxShadow: '0 4px 24px 0 rgba(31,38,135,0.17)',
          padding: '32px 28px',
          marginBottom: '32px'
        }}>
          <h3 style={{ color: '#b3b3b3', marginBottom: '12px' }}>2. Extraire les questions et niveaux de Bloom de l'examen</h3>
          <ExamUpload
            onFileChange={handleExamUpload}
            onExtract={handleExtractExam}
            disabled={!exam}
          />
          {examData.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.13)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '12px',
              fontSize: '1rem'
            }}>
              <b>Questions extraites :</b>
              {formatExamData(examData)}
            </div>
          )}
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.09)',
          borderRadius: '18px',
          boxShadow: '0 4px 24px 0 rgba(31,38,135,0.17)',
          padding: '32px 28px'
        }}>
          <h3 style={{ color: '#b3b3b3', marginBottom: '12px' }}>3. Analyser la correspondance</h3>
          <button
            onClick={handleAnalyze}
            disabled={!syllabus || !exam}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: (!syllabus || !exam) ? 'not-allowed' : 'pointer',
              marginBottom: '18px'
            }}
          >Analyser</button>
          <Report report={report} />
        </div>
      </div>
    </div>
  );
}

export default Home;