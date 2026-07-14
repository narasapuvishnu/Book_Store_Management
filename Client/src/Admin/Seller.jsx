import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';

const Seller = ({ auth }) => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSellers = async () => {
    try {
      const response = await axios.get('/api/admin/sellers', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setSellers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sellers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [auth]);

  const handleApprove = async (id) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(`/api/admin/sellers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setSuccess('Seller approved successfully.');
      setSellers(sellers.map(s => s._id === id ? { ...s, isApproved: true } : s));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve seller.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this seller? This will delete their vendor portal access.')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/admin/sellers/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setSuccess('Seller deleted successfully.');
        setSellers(sellers.filter(s => s._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete seller.');
      }
    }
  };

  return (
    <div>
      <Anavbar />
      <h2 style={{ marginBottom: '1.5rem' }}>Manage <span className="gradient-text">Sellers</span></h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : sellers.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          No registered sellers found.
        </div>
      ) : (
        <div className="table-container glass">
          <table>
            <thead>
              <tr>
                <th>Seller ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{seller._id}</td>
                  <td style={{ fontWeight: '600' }}>{seller.name}</td>
                  <td>{seller.email}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      background: seller.isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: seller.isApproved ? '#34d399' : '#fbbf24'
                    }}>
                      {seller.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!seller.isApproved && (
                        <button
                          onClick={() => handleApprove(seller._id)}
                          className="btn btn-success"
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(seller._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Seller;
