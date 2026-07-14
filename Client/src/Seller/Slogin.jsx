import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Slogin = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const response = await axios.post('/api/seller/login', {
        email,
        password
      });
      
      // Successful login
      login(response.data);
      navigate('/seller/dashboard');
    } catch (err) {
      if (err.response?.status === 403) {
        setInfo(err.response?.data?.message || 'Your account is pending admin approval.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container glass">
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Seller <span className="gradient-text">Log In</span></h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Access your bookstore merchant portal</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-info">{info}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Merchant Email Address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="seller@mybooks.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Logging In...' : 'Log In As Seller'}
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Want to sell books? <Link to="/seller/signup" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Slogin;
