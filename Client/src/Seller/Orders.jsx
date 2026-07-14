import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Snavbar from './Snavbar';

const Orders = ({ auth }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/seller/orders', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(`/api/seller/orders/${id}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setSuccess('Order delivery status updated successfully.');
      setOrders(orders.map(o => o._id === id ? { ...o, order: { ...o.order, Delivery: newStatus } } : o));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div>
      <Snavbar />
      <h2 style={{ marginBottom: '1.5rem' }}>Customer <span className="gradient-text-cyan">Order Management</span></h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : orders.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          No customer orders found for your listed books.
        </div>
      ) : (
        <div className="table-container glass">
          <table>
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Book Purchased</th>
                <th>Buyer & Shipping</th>
                <th>Total Earnings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>ID:</strong> <span style={{ fontFamily: 'monospace' }}>{ord._id}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      <strong>Date:</strong> {new Date(ord.order.BookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={`/uploads/${ord.bookDetails.itemImage}`}
                        alt={ord.bookDetails.title}
                        style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: 'var(--bg-secondary)' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/40x50/111827/ffffff?text=Book';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '600' }}>{ord.bookDetails.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>by {ord.bookDetails.author}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{ord.buyer.userName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {ord.shippingDetails.flatno}, {ord.shippingDetails.city}, {ord.shippingDetails.state} - {ord.shippingDetails.pincode}
                    </div>
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                    ${ord.order.totalamount.toFixed(2)}
                  </td>
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
                  <td>
                    <select
                      className="form-control"
                      value={ord.order.Delivery}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      style={{
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.85rem',
                        width: 'auto',
                        minWidth: '130px',
                        background: '#111827'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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

export default Orders;
