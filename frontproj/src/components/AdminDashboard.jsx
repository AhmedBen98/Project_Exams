import React, { useEffect, useState } from "react";
import { getAnalyses, getUsers } from "../api";
import Home from "./Home";
import UserAnalyses from "./UserAnalyses";
import Navbar from "./Navbar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#e63946", "#222", "#f1c40f", "#6c757d", "#457b9d", "#43aa8b"];

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

  const cloByUser = users.map(u => ({
    name: u.name,
    taux: Math.max(...analyses.filter(a => a.userId === u.id && a.type === "analyze").map(a => a.result?.taux_couvrance_clo || 0), 0)
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar admin page={page} setPage={setPage} onLogout={onLogout} user={user} />
      {page === "dashboard" && (
        <div style={{ maxWidth: 1100, margin: "36px auto" }}>
          <h3 style={{ color: "#e63946", marginBottom: 24 }}>Vue globale : Taux de couverture CLO par utilisateur</h3>
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
          <div style={{ marginTop: 40 }}>
            <h4 style={{ color: "#111" }}>Distribution analyses par utilisateur</h4>
            <ResponsiveContainer width={340} height={220}>
              <PieChart>
                <Pie data={cloByUser} dataKey="taux" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#e63946" label>
                  {cloByUser.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
