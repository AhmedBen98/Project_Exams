import React, { useEffect, useState } from "react";
import { getAnalyses } from "../api";

export default function UserAnalyses({ user }) {
  const [analyses, setAnalyses] = useState([]);
  useEffect(() => {
    if (user) {
      getAnalyses().then(a => setAnalyses(a.filter(x => x.userId === user.id)));
    }
  }, [user]);
  return (
    <div style={{ maxWidth: 880, margin: "34px auto" }}>
      <h3 style={{ color: "#e63946" }}>Mes analyses de correspondance</h3>
      <table className="dash-table" style={{ marginTop: 16, width: "100%" }}>
        <thead>
          <tr>
            <th>Fichier</th><th>Taux CLO (%)</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {analyses.filter(a => a.type === "analyze").map(a =>
            <tr key={a.id}>
              <td>{a.filename}</td>
              <td>{a.result?.taux_couvrance_clo?.toFixed(1)}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
