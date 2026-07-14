import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Ssignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/seller/signup', {
        name,
        email,
        password
      });
      setSuccess(response.data.message || 'Registration successful! Waiting for approval.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container glass">
      <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Merchant <span className="gradient-text-cyan">Sign Up</span></h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Join our bookstore network as a merchant seller</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success}
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Please note: An admin must approve your profile before you can log in to your account.
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Business / Seller Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="e.g. Rare Finds Bookstore"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'var(--gradient-cyan-purple)' }} disabled={loading}>
            {loading ? 'Submitting Application...' : 'Register Merchant Account'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Already have a merchant account? <Link to="/seller/login" style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', textDecoration: 'none' }}>Log In</Link>
      </p>
    </div>
  );
};

export default Ssignup;
