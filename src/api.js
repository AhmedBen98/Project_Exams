import axios from 'axios';
const API_URL = 'http://localhost:8000';

export const extractCLO = (syllabusFile, token) => {
  const formData = new FormData();
  formData.append('syllabus', syllabusFile);
  return axios.post(`${API_URL}/extract_clo`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const extractExam = (examFile, token) => {
  const formData = new FormData();
  formData.append('exam', examFile);
  return axios.post(`${API_URL}/extract_exam`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const analyze = (syllabusFile, examFile, token) => {
  const formData = new FormData();
  formData.append('syllabus', syllabusFile);
  formData.append('exam', examFile);
  return axios.post(`${API_URL}/analyze`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Ajout des fonctions d'authentification
export const register = (email, password) => {
  return axios.post(`${API_URL}/auth/register`, {
    email,
    password
  });
};

export const login = (email, password) => {
  // FastAPI Users attend application/x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  return axios.post(`${API_URL}/auth/jwt/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};