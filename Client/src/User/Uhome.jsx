import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const genres = ['Fiction', 'Non Fiction', 'Science', 'Romance', 'Children', 'Biography', 'History', 'Fantasy'];

const Uhome = ({ auth }) => {
  const [orders, setOrders] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${auth.token}` };
        const [ordersRes, booksRes] = await Promise.all([
          axios.get('/api/user/orders', { headers }),
          axios.get('/api/user/books')
        ]);
        
        setOrders(ordersRes.data);
        
        // Recommendations (High rating & in stock)
        const recommendedBooks = booksRes.data
          .filter(b => b.stock > 0)
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
        setRecommended(recommendedBooks);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Load wishlist from localStorage
    const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${auth._id}`)) || [];
    setWishlist(localWishlist);
  }, [auth]);

  const handleRemoveWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem(`wishlist_${auth._id}`, JSON.stringify(updated));
  };

  if (loading) return <div className="spinner"></div>;

  const recentOrders = orders.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.25rem' }}>User <span className="gradient-text">Dashboard</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {auth.name}! View your recommendations and orders</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Categories Banner */}
      <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Select Book Category</h3>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {genres.map((g) => (
            <div
              key={g}
              onClick={() => navigate(`/products?genre=${encodeURIComponent(g)}`)}
              className="category-badge"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders Cards */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Recent Orders 📦</h3>
            <Link to="/user/orders" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>View All</Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '1rem' }}>No orders placed yet.</p>
              <Link to="/products" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Shop Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map((ord) => (
                <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{ord.bookDetails.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: 'var(--accent-primary)' }}>{ord.order.Delivery}</strong></span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold', display: 'block', fontSize: '0.95rem' }}>${ord.order.totalamount.toFixed(2)}</span>
                    <Link to={`/user/orders/${ord._id}`} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>Track Order</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Cards */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3>My Wishlist ❤️</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Items you saved for later purchase</p>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No items in your wishlist. Start adding books while browsing!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlist.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', alignItems: 'center' }}>
                  <img
                    src={`/uploads/${item.itemImage}`}
                    alt={item.title}
                    style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/40x50/111827/ffffff?text=Book';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>by {item.author}</span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>${item.price.toFixed(2)}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/products/${item._id}`} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Buy</Link>
                      <button onClick={() => handleRemoveWishlist(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--accent-rose)' }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Books Grid */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recommended for You 📚🌟</h2>
        {recommended.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recommendations available right now.</p>
        ) : (
          <div className="grid-4">
            {recommended.map((book) => (
              <div key={book._id} className="card glass glass-interactive book-card">
                <img
                  src={`/uploads/${book.itemImage}`}
                  alt={book.title}
                  className="book-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x400/111827/ffffff?text=Book+Cover';
                  }}
                />
                <span className="book-card-genre">{book.genre}</span>
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">by {book.author}</p>
                <div className="book-card-footer">
                  <span className="book-card-price">${book.price.toFixed(2)}</span>
                  <Link to={`/products/${book._id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Uhome;
