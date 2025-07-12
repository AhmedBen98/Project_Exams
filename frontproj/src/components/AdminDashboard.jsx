import React, { useEffect, useState } from "react";
import { getUsers, getAnalyses } from "../api";

// Bonus: mini graphe avec Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState("");

  // 1. Charge users et analyses
  useEffect(() => {
    getUsers().then(setUsers).catch(e => setError("Erreur users: " + e.message));
    getAnalyses().then(setAnalyses).catch(e => setError("Erreur analyses: " + e.message));
  }, []);

  // 2. Filtrage dynamique
  const filtered = analyses.filter(a =>
    (!selectedUserId || String(a.userId) === String(selectedUserId)) &&
    (filterType === "all" || a.type === filterType)
  );

  // Pour stats: nombre d’analyses par user
  const analysesPerUser = users.map(u => ({
    name: u.name,
    eval: analyses.filter(a => a.userId === u.id && a.type === "exam").length,
    syllabus: analyses.filter(a => a.userId === u.id && a.type === "syllabus").length,
    correspondance: analyses.filter(a => a.userId === u.id && a.type === "analyze").length,
    total: analyses.filter(a => a.userId === u.id).length,
  }));

  return (
    <div>
      <div className="card" style={{ marginBottom: 34 }}>
        <h2 className="card-title">Tableau de bord administrateur</h2>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ marginRight: 8 }}>Utilisateur :</label>
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} style={selectStyle}>
              <option value="">Tous</option>
              {users.map(u => <option value={u.id} key={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Type analyse :</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={selectStyle}>
              <option value="all">Tous</option>
              <option value="exam">Examen</option>
              <option value="syllabus">Syllabus</option>
              <option value="analyze">Correspondance</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRAPHIQUE - analyses par user */}
      <div className="card" style={{ marginBottom: 40 }}>
        <h3 className="card-title" style={{ fontSize: "1.1rem" }}>Statistiques par utilisateur</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analysesPerUser} margin={{ top: 18, right: 32, left: 6, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="eval" stackId="a" fill="#e63946" name="Examens" />
            <Bar dataKey="syllabus" stackId="a" fill="#222" name="Syllabus" />
            <Bar dataKey="correspondance" stackId="a" fill="#ffb703" name="Correspondance" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLEAU analyses */}
      <div className="card">
        <h3 className="card-title">Analyses {selectedUserId && ("de " + (users.find(u => String(u.id) === String(selectedUserId))?.name || ""))}</h3>
        {error && <div style={{ color: "#e63946" }}>{error}</div>}
        <table style={{ width: "100%", background: "#fff", borderRadius: 8, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f8f8", color: "#1a1a1a" }}>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Nom fichier</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Utilisateur</th>
              <th style={thStyle}>Résultat (résumé)</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .filter(a => a.type === "analyze" || a.type === "exam" || a.type === "syllabus")
              .map(a => (
                <tr key={a.id}>
                  <td style={tdStyle}>{a.type}</td>
                  <td style={tdStyle}>{a.filename}</td>
                  <td style={tdStyle}>{new Date(a.createdAt).toLocaleString()}</td>
                  <td style={tdStyle}>{a.User?.name || "?"}</td>
                  <td style={{ ...tdStyle, maxWidth: 450, overflowX: "auto", fontSize: ".97em" }}>
                    {a.type === "analyze" && a.result && a.result.taux_couvrance_clo != null
                      ? (<>
                        <b>Taux couverture CLO : </b>{a.result.taux_couvrance_clo?.toFixed(1)}%<br />
                        <b>CLO non couverts : </b>{(a.result.clo_non_couverts || []).length}<br />
                        <b>Résumé : </b>
                        {a.result.resume_pedagogique ? <span style={{ color: "#e63946" }}>{a.result.resume_pedagogique.slice(0, 90)}…</span> : null}
                      </>)
                      : <pre style={{ background: "#f9f9f9", borderRadius: 5, fontSize: "0.95em" }}>
                          {a.type === "exam"
                            ? (Array.isArray(a.result)
                                ? `${a.result.length} questions`
                                : JSON.stringify(a.result).slice(0, 80) + "…")
                            : (Array.isArray(a.result)
                                ? `${a.result.length} CLO extraits`
                                : JSON.stringify(a.result).slice(0, 80) + "…")
                          }
                        </pre>
                    }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .card { background: #fff; border: 1.5px solid #f1f1f1; border-radius: 16px; box-shadow: 0 6px 20px 0 #eee; padding: 28px 32px; margin-bottom: 32px;}
        .card-title { color: #e63946; font-weight: 700; font-size: 1.5rem; margin-bottom: 12px; }
        select { padding: 9px 20px; border-radius: 7px; border: 1.5px solid #e63946; margin-bottom: 6px; }
        th, td { border-bottom: 1px solid #f2f2f2; padding: 10px; }
        tr:last-child td { border-bottom: none; }
      `}</style>
    </div>
  );
}

const selectStyle = { minWidth: 200, fontSize: "1rem" };
const thStyle = { textAlign: "left", fontWeight: "600", color: "#e63946", padding: "10px 6px", fontSize: "1em" };
const tdStyle = { verticalAlign: "top", padding: "10px 6px", borderBottom: "1px solid #f1f1f1" };
