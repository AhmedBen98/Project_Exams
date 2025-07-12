import React, { useEffect, useState } from "react";
import { getAnalyses, getUsers } from "../api";
import Home from "./Home";
import Navbar from "./Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#e63946", "#222", "#f1c40f", "#6c757d", "#457b9d", "#43aa8b"];

// Renvoie la moyenne du taux CLO par utilisateur (pour tous ses analyses type 'analyze')
function getCloStatsByUser(analyses, users) {
  return users.map(u => {
    const cloTaux = analyses
      .filter(a => a.type === "analyze" && a.userId === u.id)
      .map(a => a.result?.taux_couvrance_clo || 0);
    const avgTaux = cloTaux.length ? (cloTaux.reduce((s, v) => s + v, 0) / cloTaux.length) : 0;
    return { name: u.name, taux: avgTaux };
  });
}

// Renvoie la distribution d’utilisateurs par intervalles de moyenne de taux CLO
function getCloIntervals(analyses, users) {
  const userStats = getCloStatsByUser(analyses, users);
  // Intervalles : [0–19], [20–39], [40–59], [60–79], [80–100]
  let intervals = [
    { name: "0–19%", users: [] },
    { name: "20–39%", users: [] },
    { name: "40–59%", users: [] },
    { name: "60–79%", users: [] },
    { name: "80–100%", users: [] },
  ];
  userStats.forEach(u => {
    if (u.taux < 20) intervals[0].users.push(u.name);
    else if (u.taux < 40) intervals[1].users.push(u.name);
    else if (u.taux < 60) intervals[2].users.push(u.name);
    else if (u.taux < 80) intervals[3].users.push(u.name);
    else intervals[4].users.push(u.name);
  });
  return intervals.map(i => ({
    interval: i.name,
    count: i.users.length,
    users: i.users
  }));
}

export default function AdminDashboard({ user, token, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [analyses, setAnalyses] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [sort, setSort] = useState("recent");
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalyses().then(setAnalyses).catch(e => setError("Erreur: " + e.message));
    getUsers().then(setUsers).catch(() => {});
  }, []);

  let filtered = analyses.filter(a => a.type === "analyze");
  if (userId) filtered = filtered.filter(a => a.userId === Number(userId));
  if (sort === "recent") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === "ancien") filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sort === "taux_desc") filtered.sort((a, b) => (b.result?.taux_couvrance_clo ?? 0) - (a.result?.taux_couvrance_clo ?? 0));
  if (sort === "taux_asc") filtered.sort((a, b) => (a.result?.taux_couvrance_clo ?? 0) - (b.result?.taux_couvrance_clo ?? 0));
  if (sort === "user") filtered.sort((a, b) => (a.User?.name || "").localeCompare(b.User?.name || ""));

  // Data pour les graphes (moyenne !)
  const cloByUser = getCloStatsByUser(analyses, users);
  const cloIntervals = getCloIntervals(analyses, users);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar admin page={page} setPage={setPage} onLogout={onLogout} user={user} />
      {page === "dashboard" && (
        <div style={{ maxWidth: 1150, margin: "36px auto" }}>
          <h3 style={{ color: "#e63946", marginBottom: 24 }}>
            Vue globale : Taux de couverture CLO <b>(moyenne)</b> par utilisateur
          </h3>
          <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={cloByUser}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="taux">
                    {cloByUser.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: 340 }}>
              <h4 style={{ color: "#111", marginBottom: 8 }}>Distribution analyses par utilisateur (moyenne)</h4>
              <ResponsiveContainer width={340} height={220}>
                <PieChart>
                  <Pie data={cloByUser} dataKey="taux" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#e63946" label>
                    {cloByUser.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: 340, marginLeft: 12 }}>
              <h4 style={{ color: "#111", marginBottom: 8 }}>
                Répartition des utilisateurs par intervalle de taux CLO (moyenne)
              </h4>
              <ResponsiveContainer width={340} height={220}>
                <BarChart data={cloIntervals}>
                  <XAxis dataKey="interval" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {cloIntervals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: "0.95em", marginTop: 10 }}>
                {cloIntervals.map(i =>
                  <div key={i.interval}>
                    <b>{i.interval} :</b> {i.count} utilisateur(s)
                    {i.users.length > 0 && (
                      <span style={{ color: "#aaa" }}> [{i.users.join(", ")}]</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {page === "historique" && (
        <div style={{ maxWidth: 950, margin: "32px auto" }}>
          <h3 style={{ color: "#e63946" }}>Historique des analyses de correspondance</h3>
          <div style={{ margin: "18px 0 22px 0", display: "flex", gap: 24 }}>
            <select value={userId} onChange={e => setUserId(e.target.value)}>
              <option value="">Tous les utilisateurs</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="recent">Date: récent</option>
              <option value="ancien">Date: ancien</option>
              <option value="taux_desc">Taux CLO décroissant</option>
              <option value="taux_asc">Taux CLO croissant</option>
              <option value="user">Nom utilisateur</option>
            </select>
          </div>
          <table className="dash-table" style={{ marginTop: 10, width: "100%" }}>
            <thead>
              <tr>
                <th>User</th><th>Fichier</th><th>Taux CLO (%)</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a =>
                <tr key={a.id}>
                  <td>{a.User?.name || "?"}</td>
                  <td>{a.filename}</td>
                  <td>{a.result?.taux_couvrance_clo?.toFixed(1)}</td>
                  <td>{new Date(a.createdAt).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
          {error && <div className="error-msg">{error}</div>}
        </div>
      )}
      {page === "analyze" && (
        <div>
          <Home token={token} user={user} />
        </div>
      )}
    </div>
  );
}
