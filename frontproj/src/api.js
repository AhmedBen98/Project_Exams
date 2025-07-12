const API_URL = "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token");
}
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export async function extractCLO(syllabusFile, token) {
  const formData = new FormData();
  formData.append("file", syllabusFile);
  const res = await fetch(`${API_URL}/analyses/syllabus`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error("Erreur lors de l'extraction des CLO");
  return await res.json();
}

export async function extractExam(examFile, token) {
  const formData = new FormData();
  formData.append("file", examFile);
  const res = await fetch(`${API_URL}/analyses/exam`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error("Erreur lors de l'extraction de l'examen");
  return await res.json();
}

export async function analyze(syllabusId, examId, token) {
  const res = await fetch(`${API_URL}/analyses/analyze`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ syllabusId, examId })
  });
  if (!res.ok) throw new Error("Erreur lors de l'analyse croisée");
  return await res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Erreur de connexion");
  return await res.json();
}
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Erreur d'inscription");
  return await res.json();
}

export async function getAnalyses() {
  const res = await fetch(`${API_URL}/analyses/`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Non autorisé");
  return res.json();
}

export async function deleteAnalysis(id) {
  const res = await fetch(`${API_URL}/analyses/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Erreur de suppression");
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users/`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("Non autorisé");
  return res.json();
}
