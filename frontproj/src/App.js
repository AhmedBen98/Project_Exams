import React, { useState } from "react";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import UserAnalyses from "./components/UserAnalyses";
import AdminDashboard from "./components/AdminDashboard";
import { getUser } from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(getUser());
  const [page, setPage] = useState("analyze");

  const onLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const onLogout = () => {
    setToken("");
    setUser(null);
    localStorage.clear();
  };

  if (!token || !user) return <Auth onLogin={onLogin} />;
  if (user.role === "admin")
    return (
      <AdminDashboard user={user} token={token} onLogout={onLogout} />
    );

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar page={page} setPage={setPage} onLogout={onLogout} user={user} />
      {page === "analyze" && <Home token={token} user={user} />}
      {page === "historique" && <UserAnalyses user={user} />}
    </div>
  );
}
