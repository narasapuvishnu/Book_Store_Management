import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderItem = ({ auth }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/user/orders/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, auth]);

  if (loading) return <div className="spinner"></div>;

  if (error || !order) {
    return <div className="alert alert-danger" style={{ margin: '2rem 0' }}>{error || 'Order not found'}</div>;
  }

  // Define tracking progress percentage and step states based on Delivery status
  let progressWidth = '10%';
  let step1Class = 'tracker-step active';
  let step2Class = 'tracker-step';
  let step3Class = 'tracker-step';

  if (order.order.Delivery === 'Shipped') {
    progressWidth = '50%';
    step1Class = 'tracker-step completed';
    step2Class = 'tracker-step active';
  } else if (order.order.Delivery === 'Delivered') {
    progressWidth = '100%';
    step1Class = 'tracker-step completed';
    step2Class = 'tracker-step completed';
    step3Class = 'tracker-step active completed';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/user/orders" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Orders</Link>
          <h1 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Track Order <span className="gradient-text">#{order._id}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Placed on {new Date(order.order.BookingDate).toLocaleString()}</p>
        </div>
        <span style={{
          padding: '0.4rem 1.2rem',
          borderRadius: '30px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          background: order.order.Delivery === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(251, 191, 36, 0.15)',
          color: order.order.Delivery === 'Delivered' ? '#34d399' : '#fbbf24',
          border: '1px solid currentColor'
        }}>
          {order.order.Delivery.toUpperCase()}
        </span>
      </div>

      {/* Progress Line Tracker */}
      <div className="card glass" style={{ padding: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Delivery Tracking Timeline</h3>
        <div className="tracker-container">
          <div className="tracker-progress-line" style={{ width: progressWidth }}></div>
          
          <div className={step1Class}>
            <div className="tracker-dot">✓</div>
            <span className="tracker-label">Ordered & Packed</span>
          </div>
          
          <div className={step2Class}>
            <div className="tracker-dot">🚚</div>
            <span className="tracker-label">Shipped in Transit</span>
          </div>
          
          <div className={step3Class}>
            <div className="tracker-dot">🎁</div>
            <span className="tracker-label">Delivered Successfully</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>Expected Delivery</span>
            <strong style={{ color: 'white' }}>
              {order.order.expectedDeliveryDate ? new Date(order.order.expectedDeliveryDate).toLocaleDateString() : 'TBD'}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>Shipping Carrier</span>
            <strong style={{ color: 'white' }}>BookStore Express Delivery</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'block' }}>Tracking ID</span>
            <strong style={{ color: 'white', fontFamily: 'monospace' }}>BSE-{order._id.slice(-8).toUpperCase()}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Book Details Card */}
        <div className="card glass" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', flexDirection: 'row' }}>
          <img
            src={`/uploads/${order.bookDetails.itemImage}`}
            alt={order.bookDetails.title}
            style={{ width: '100px', height: '130px', objectFit: 'cover', borderRadius: '8px', background: 'var(--bg-secondary)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x130/111827/ffffff?text=Book';
            }}
          />
          <div>
            <span className="book-card-genre" style={{ marginBottom: '0.5rem' }}>{order.bookDetails.genre}</span>
            <h3 style={{ marginBottom: '0.25rem' }}>{order.bookDetails.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>by {order.bookDetails.author}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {order.bookDetails.description.slice(0, 120)}...
            </p>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Seller: <strong style={{ color: 'var(--accent-cyan)' }}>{order.seller.sellerName}</strong>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Card */}
        <div className="card glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Shipping Details 🏠</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Flat No / Building: {order.shippingDetails.flatno}<br />
              {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}
            </p>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Payment Summary 💳</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <strong style={{ color: '#34d399' }}>Simulated Success</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Charged:</span>
              <strong style={{ color: 'white' }}>${order.order.totalamount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
