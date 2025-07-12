import React, { useState } from "react";
import { login, register } from "../api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      if (isLogin) {
        const { token, user } = await login(form.email, form.password);
        onLogin(token, user);
      } else {
        const { token, user } = await register(form.name, form.email, form.password);
        onLogin(token, user);
      }
    } catch (e) {
      setErr(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        minWidth: 320, maxWidth: 360, background: "#f7f7f7", borderRadius: 16,
        boxShadow: "0 2px 8px #e6394633", padding: 32, marginTop: -40
      }}>
        <h2 style={{ color: "#e63946", textAlign: "center" }}>{isLogin ? "Connexion" : "Créer un compte"}</h2>
        <form onSubmit={handle}>
          {!isLogin && (
            <input className="auth-input" placeholder="Nom" value={form.name} required
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          )}
          <input className="auth-input" type="email" placeholder="Email" value={form.email} required
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input className="auth-input" type="password" placeholder="Mot de passe" value={form.password} required
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <button className="main-btn" type="submit" disabled={loading}
            style={{ width: "100%", marginTop: 14 }}>{isLogin ? "Se connecter" : "S'inscrire"}</button>
        </form>
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <button onClick={() => setIsLogin(l => !l)} className="text-btn">
            {isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter"}
          </button>
        </div>
        {err && <div style={{ color: "#e63946", marginTop: 8 }}>{err}</div>}
      </div>
      <style>{`
        .auth-input { width:100%;padding:10px 12px;margin:8px 0 0 0;font-size:1rem;border-radius:8px;border:1px solid #ccc; }
        .main-btn { background:#e63946;color:#fff;padding:12px 0;border:none;border-radius:8px;font-weight:700;cursor:pointer;}
        .text-btn { color:#e63946;background:none;border:none;font-size:0.98rem;margin-top:10px;cursor:pointer;}
      `}</style>
    </div>
  );
}
