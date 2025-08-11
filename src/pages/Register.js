import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(email, password);
      navigate('/dashboard');
    } catch {
      setError('Failed to create an account.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label><br />
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <label>Password</label><br />
        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <label>Confirm Password</label><br />
        <input type="password" required value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 16 }} />
        <button type="submit" style={{ padding: 12, width: '100%' }}>Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
