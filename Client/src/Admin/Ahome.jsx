import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';

const Ahome = ({ auth }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth]);

  if (loading) {
    return (
      <div>
        <Anavbar />
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Anavbar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const { stats: s, genreStats, deliveryStats, recentActivities } = stats;

  return (
    <div>
      <Anavbar />
      <h1 style={{ marginBottom: '1.5rem' }}>Admin <span className="gradient-text">Dashboard</span></h1>
      
      {/* Counters Grid */}
      <div className="stats-grid">
        <div className="card glass stats-card">
          <span className="stats-label">Total Users</span>
          <span className="stats-number">{s.totalUsers}</span>
        </div>
        <div className="card glass stats-card">
          <span className="stats-label">Total Sellers</span>
          <span className="stats-number">{s.totalSellers}</span>
        </div>
        <div className="card glass stats-card">
          <span className="stats-label">Total Books</span>
          <span className="stats-number">{s.totalBooks}</span>
        </div>
        <div className="card glass stats-card">
          <span className="stats-label">Total Orders</span>
          <span className="stats-number">{s.totalOrders}</span>
        </div>
        <div className="card glass stats-card" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
          <span className="stats-label">Revenue</span>
          <span className="stats-number">${(s.totalRevenue || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Reports and CSS Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Genre Breakdown Chart */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Genre Distribution</h3>
          {genreStats.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No book details available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {genreStats.map((item) => {
                const percentage = Math.max(10, Math.min(100, (item.count / s.totalBooks) * 100));
                return (
                  <div key={item.genre}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      <span>{item.genre}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.count} books</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--gradient-accent)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Status Breakdown Chart */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Delivery Breakdown</h3>
          {deliveryStats.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No order logs available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {deliveryStats.map((item) => {
                const percentage = Math.max(10, Math.min(100, (item.count / s.totalOrders) * 100));
                return (
                  <div key={item.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                      <span>{item.status}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.count} orders</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--gradient-cyan-purple)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Logged Activities</h3>
        {recentActivities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No logged activities yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map((act, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-color)',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '1.25rem',
                    background: act.type === 'order' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    {act.type === 'order' ? '🛒' : '🏪'}
                  </span>
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{act.message}</p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(act.time).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  background: act.type === 'order' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                  color: act.type === 'order' ? 'var(--accent-primary)' : 'var(--accent-cyan)'
                }}>
                  {act.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ahome;
