import React from "react";

export default function Report({ report }) {
  if (!report) return null;
  // utf8 fix pour accents si jamais
  function fixUtf8(str) {
    try { return decodeURIComponent(escape(str)); } catch { return str; }
  }
  return (
    <div className="report-card">
      <h4 className="report-title">📝 Rapport d'analyse de correspondance</h4>
      <div className="report-section">
        <b>Taux de couverture CLO :</b>{" "}
        <span style={{ color: "#e63946", fontWeight: 600 }}>
          {report.taux_couvrance_clo?.toFixed(1)}%
        </span>
      </div>
      <div className="report-section">
        <b>CLO non couverts :</b> {report.clo_non_couverts?.length}
        {report.clo_non_couverts && report.clo_non_couverts.length > 0 && (
          <ul>
            {report.clo_non_couverts.map((c, i) => <li key={i}>{fixUtf8(c)}</li>)}
          </ul>
        )}
      </div>
      <div className="report-section">
        <b>Résumé pédagogique :</b>
        <div style={{
          color: "#222",
          background: "#f9f9f9",
          borderRadius: 8,
          padding: 12,
          marginTop: 4
        }}>
          {fixUtf8(report.resume_pedagogique)}
        </div>
      </div>
      <div className="report-section">
        <b>Répartition Bloom :</b>
        <ul>
          {report.repartition_bloom && Object.entries(report.repartition_bloom).map(([niveau, [nb, pct]]) => (
            <li key={niveau}>{fixUtf8(niveau)} : {nb} question(s) ({pct.toFixed(1)}%)</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
