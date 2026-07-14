import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';

const Shome = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${auth.token}` };
        const [booksRes, ordersRes] = await Promise.all([
          axios.get('/api/seller/books', { headers }),
          axios.get('/api/seller/orders', { headers })
        ]);
        setBooks(booksRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load merchant data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [auth]);

  if (loading) {
    return (
      <div>
        <Snavbar />
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Snavbar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // Calculate metrics
  const totalBooks = books.length;
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, order) => sum + (order.order.totalamount || 0), 0);
  
  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <Snavbar />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Merchant <span className="gradient-text-cyan">Dashboard</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of your inventory and sales performance</p>
        </div>
        <Link to="/seller/add-book" className="btn btn-primary" style={{ background: 'var(--gradient-cyan-purple)' }}>
          ➕ Add Book to Catalog
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card glass stats-card">
          <span className="stats-label">Total Listings</span>
          <span className="stats-number" style={{ background: 'var(--gradient-cyan-purple)', WebkitBackgroundClip: 'text' }}>{totalBooks}</span>
        </div>
        <div className="card glass stats-card">
          <span className="stats-label">Customer Orders</span>
          <span className="stats-number" style={{ background: 'var(--gradient-cyan-purple)', WebkitBackgroundClip: 'text' }}>{totalOrders}</span>
        </div>
        <div className="card glass stats-card">
          <span className="stats-label">Total Revenue</span>
          <span className="stats-number" style={{ background: 'var(--gradient-cyan-purple)', WebkitBackgroundClip: 'text' }}>${revenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Product Orders</h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No orders placed for your items yet.</p>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table style={{ minWidth: '600px' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ord._id}</td>
                    <td style={{ fontWeight: '600' }}>{ord.bookDetails.title}</td>
                    <td>{ord.buyer.userName}</td>
                    <td style={{ fontWeight: 'bold' }}>${ord.order.totalamount.toFixed(2)}</td>
                    <td>{new Date(ord.order.BookingDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: ord.order.Delivery === 'Delivered'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : ord.order.Delivery === 'Shipped'
                            ? 'rgba(6, 182, 212, 0.15)'
                            : 'rgba(251, 191, 36, 0.15)',
                        color: ord.order.Delivery === 'Delivered'
                          ? '#34d399'
                          : ord.order.Delivery === 'Shipped'
                            ? 'var(--accent-cyan)'
                            : '#fbbf24'
                      }}>
                        {ord.order.Delivery}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shome;
