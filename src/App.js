import React, { useState } from 'react';
import LoginRegister from './components/Auth';
import Home from './components/Home';

function App() {
  const [token, setToken] = useState('');
  if (!token) return <LoginRegister onAuth={setToken} />;
  return <Home token={token} />;
}
export default App;