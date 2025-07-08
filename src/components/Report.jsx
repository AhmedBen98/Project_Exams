import React from 'react';

function Report({ report }) {
  if (!report) return null;

  if (typeof report === 'string') {
    return (
      <div style={{
        marginTop: '18px',
        background: 'rgba(255,255,255,0.13)',
        borderRadius: '10px',
        padding: '18px',
        color: '#232526',
        fontSize: '1rem',
        boxShadow: '0 2px 8px 0 rgba(31,38,135,0.07)'
      }}>
        <h4 style={{
          color: '#764ba2',
          marginBottom: '10px'
        }}>Rapport d'analyse</h4>
        <pre style={{
          background: 'none',
          color: '#232526',
          fontSize: '1rem',
          margin: 0,
          padding: 0,
          whiteSpace: 'pre-wrap'
        }}>
          {report}
        </pre>
      </div>
    );
  }

  // Affichage structuré pour l'objet rapport
  return (
    <div style={{
      marginTop: '18px',
      background: 'rgba(255,255,255,0.13)',
      borderRadius: '10px',
      padding: '18px',
      color: '#232526',
      fontSize: '1rem',
      boxShadow: '0 2px 8px 0 rgba(31,38,135,0.07)'
    }}>
      <h4 style={{
        color: '#764ba2',
        marginBottom: '10px'
      }}>Rapport d'analyse</h4>
      {report.verdict && (
        <div style={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: report.verdict.includes('qualité') ? '#2ecc40' : '#ff4136',
          marginBottom: 10
        }}>
          {report.verdict}
        </div>
      )}
      {report.verdict_details && report.verdict_details.length > 0 && (
        <ul style={{ color: '#ff4136', marginBottom: 10 }}>
          {report.verdict_details.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}
      <div>
        <b>Taux de couverture des CLO :</b> {report.taux_couvrance_clo?.toFixed(1)}%
        <br />
        <b>CLO couverts :</b>
        <ul>
          {report.clo_couverts?.map((clo, i) => <li key={i}>{clo}</li>)}
        </ul>
        <b>CLO non couverts :</b>
        <ul>
          {report.clo_non_couverts?.map((clo, i) => <li key={i}>{clo}</li>)}
        </ul>
        <b>Répartition des niveaux de Bloom :</b>
        <ul>
          {report.repartition_bloom && Object.entries(report.repartition_bloom).map(([niveau, [nb, pct]]) => (
            <li key={niveau}>{niveau} : {nb} question(s) ({pct.toFixed(1)}%)</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Report;
