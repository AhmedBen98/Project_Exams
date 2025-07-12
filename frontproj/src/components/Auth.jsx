// src/components/Auth.jsx
import React, { useState } from "react";
import { login, register } from "../api";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      let data;
      if (mode === "login") {
        data = await login(email, password);
      } else {
        data = await register(name, email, password);
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (e) {
      setError(e.message || "Erreur d'authentification");
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", background: "#fff"
    }}>
      <div style={{
        background: "#fff", borderRadius: 18, boxShadow: "0 4px 32px #f1f1f1",
        padding: 32, maxWidth: 400, width: "100%"
      }}>
        <h2 style={{ color: "#e63946", marginBottom: 18, textAlign: "center" }}>
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text" placeholder="Nom" value={name}
              onChange={e => setName(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              background: "#e63946", color: "#fff", border: "none", borderRadius: 8,
              fontSize: "1.1rem", fontWeight: "bold", padding: "11px 32px",
              cursor: "pointer", width: "100%", marginTop: 14
            }}
          >
            {mode === "login" ? "Connexion" : "Inscription"}
          </button>
          {error && <div style={{ color: "#e63946", marginTop: 12 }}>{error}</div>}
        </form>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          {mode === "login" ?
            <>
              Pas encore de compte ?{" "}
              <span onClick={() => setMode("register")} style={{ color: "#e63946", cursor: "pointer" }}>Inscris-toi</span>
            </> :
            <>
              Déjà inscrit ?{" "}
              <span onClick={() => setMode("login")} style={{ color: "#e63946", cursor: "pointer" }}>Connecte-toi</span>
            </>
          }
        </div>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1.5px solid #e63946",
  fontSize: "1.05rem"
};
