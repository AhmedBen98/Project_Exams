import React from "react";

export default function Navbar({ admin, page, setPage, onLogout, user }) {
  return (
    <nav style={{
      background: "#fff",
      borderBottom: "2px solid #e63946",
      padding: "16px 34px 10px 24px",
      display: "flex", alignItems: "center", gap: 32
    }}>
      <h2 style={{ color: "#e63946", fontWeight: 900, letterSpacing: 1, marginRight: 32 }}>
        {admin ? "ADMIN" : "ESB Exams"}
      </h2>
      {admin
        ? ["analyze", "historique", "dashboard"].map(tab => (
            <button key={tab}
              className={page === tab ? "nav-btn active" : "nav-btn"}
              onClick={() => setPage(tab)}
              style={{
                color: page === tab ? "#e63946" : "#222",
                fontWeight: page === tab ? 700 : 500,
                background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer"
              }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))
        : ["analyze", "historique"].map(tab => (
            <button key={tab}
              className={page === tab ? "nav-btn active" : "nav-btn"}
              onClick={() => setPage(tab)}
              style={{
                color: page === tab ? "#e63946" : "#222",
                fontWeight: page === tab ? 700 : 500,
                background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer"
              }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
      <div style={{ flex: 1 }} />
      <b style={{ color: "#e63946", marginRight: 18 }}>{user?.name}</b>
      <button onClick={onLogout} style={{
        background: "#e63946", color: "#fff", border: "none", borderRadius: 8,
        padding: "8px 20px", fontWeight: 700, fontSize: "1rem", cursor: "pointer"
      }}>Déconnexion</button>
    </nav>
  );
}
