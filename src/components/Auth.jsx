import React, { useState } from 'react';
import { register, login } from '../api';

function LoginRegister({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await login(email, password);
        onAuth(res.data.access_token);
      } else {
        await register(email, password);
        setIsLogin(true);
      }
    } catch (err) {
      setError('Erreur : ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '40px 32px',
        minWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <h2 style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '10px',
          letterSpacing: '1px'
        }}>{isLogin ? 'Connexion' : 'Inscription'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <button type="submit" style={{
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}>
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#b3b3b3',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          {isLogin ? "Créer un compte" : "Déjà inscrit ?"}
        </button>
        {error && <div style={{
          color: '#ff4d4f',
          background: 'rgba(255,0,0,0.07)',
          borderRadius: '6px',
          padding: '8px',
          textAlign: 'center'
        }}>{error}</div>}
      </form>
    </div>
  );
}

export default LoginRegister;