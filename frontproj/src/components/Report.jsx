import React from "react";
export default function Report({ report }) {
  if (!report) return null;
  return (
    <div className="report-card">
      <h4 className="report-title">📝 Rapport d'analyse de correspondance</h4>
      <div className="report-section">
        <b>Taux de couverture CLO :</b> <span style={{ color: "#e63946" }}>{report.taux_couvrance_clo?.toFixed(1)}%</span>
      </div>
      <div className="report-section">
        <b>CLO non couverts :</b> {report.clo_non_couverts?.length}
        {report.clo_non_couverts && report.clo_non_couverts.length > 0 && (
          <ul>{report.clo_non_couverts.map((c, i) => <li key={i}>{c}</li>)}</ul>
        )}
      </div>
      <div className="report-section">
        <b>Résumé pédagogique :</b>
        <div style={{ color: "#222", background: "#f9f9f9", borderRadius: 4, padding: 10, marginTop: 4 }}>
          {report.resume_pedagogique}
        </div>
      </div>
      <div className="report-section">
        <b>Répartition Bloom :</b>
        <ul>
          {report.repartition_bloom && Object.entries(report.repartition_bloom).map(([niveau, [nb, pct]]) => (
            <li key={niveau}>{niveau} : {nb} question(s) ({pct.toFixed(1)}%)</li>
          ))}
        </ul>
      </div>
      <style>{`
        .report-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 10px 0 #f3f3f3; padding: 22px 30px; margin: 16px 0 0 0;}
        .report-title { color: #e63946; margin-bottom: 12px; font-weight: 700; }
        .report-section { margin-bottom: 11px; }
      `}</style>
    </div>
  );
}
