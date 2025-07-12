// src/App.js
import React, { useState } from "react";
import Auth from "./components/Auth";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  if (!user) return <Auth onLogin={setUser} />;

  const isAdmin = user.role === "admin";

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#1a1a1a" }}>
      <header style={{
        background: "#e63946",
        color: "#fff",
        padding: "20px 0",
        marginBottom: 32,
        boxShadow: "0 2px 12px #eee"
      }}>
        <h1 style={{ textAlign: "center", fontWeight: 800, letterSpacing: 2, margin: 0 }}>
          ExamTracer
        </h1>
        <div style={{
          display: "flex", justifyContent: "flex-end", alignItems: "center",
          maxWidth: 1100, margin: "0 auto"
        }}>
          <span style={{ marginRight: 16 }}>Bonjour, <b>{user.name}</b> ({user.role})</span>
          <button
            onClick={() => { localStorage.clear(); setUser(null); }}
            style={{
              background: "#fff", color: "#e63946", border: "2px solid #e63946",
              borderRadius: 24, padding: "6px 24px", fontWeight: 600, cursor: "pointer"
            }}
          >Déconnexion</button>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto" }}>
        {isAdmin ? <AdminDashboard user={user} /> : <Home token={localStorage.getItem("token")} user={user} />}
      </main>
    </div>
  );
}
