import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyOrders = ({ auth }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/user/orders', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [auth]);

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Purchase <span className="gradient-text">History</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and view status of your ordered books</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You have not purchased any books yet.</p>
          <Link to="/products" className="btn btn-primary">Start Browsing Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((ord) => (
            <div key={ord._id} className="card glass" style={{ padding: '2rem', display: 'flex', flexFlow: 'row wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <img
                  src={`/uploads/${ord.bookDetails.itemImage}`}
                  alt={ord.bookDetails.title}
                  style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '4px', background: 'var(--bg-secondary)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/70x90/111827/ffffff?text=Book';
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{ord.bookDetails.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>by {ord.bookDetails.author}</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span><strong>Order ID:</strong> {ord._id}</span>
                    <span><strong>Ordered:</strong> {new Date(ord.order.BookingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center', textAlign: 'right' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Expected Delivery</span>
                  <strong style={{ color: 'white', fontSize: '0.95rem' }}>
                    {ord.order.expectedDeliveryDate ? new Date(ord.order.expectedDeliveryDate).toLocaleDateString() : 'Pending'}
                  </strong>
                </div>
                
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Delivery Status</span>
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
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Paid Amount</span>
                  <strong style={{ fontSize: '1.25rem', color: 'white' }}>${ord.order.totalamount.toFixed(2)}</strong>
                </div>

                <Link to={`/user/orders/${ord._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
