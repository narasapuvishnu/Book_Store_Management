import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';

const Users = ({ auth }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch registered users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [auth]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setSuccess('User deleted successfully.');
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <Anavbar />
      <h2 style={{ marginBottom: '1.5rem' }}>Manage <span className="gradient-text">Users</span></h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : users.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          No registered users found.
        </div>
      ) : (
        <div className="table-container glass">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user._id}</td>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Delete Account
                    </button>
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

export default Users;
