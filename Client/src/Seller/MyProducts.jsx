import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';

const MyProducts = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/seller/books', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [auth]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing? This will remove it from the store catalog.')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/seller/books/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setSuccess('Product listing deleted successfully.');
        setBooks(books.filter((b) => b._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete listing.');
      }
    }
  };

  // Quick Inline Stock Update
  const handleStockUpdate = async (bookId, delta) => {
    const book = books.find(b => b._id === bookId);
    if (!book) return;

    const newStock = Math.max(0, book.stock + delta);
    setUpdatingId(bookId);

    try {
      const formData = new FormData();
      formData.append('stock', newStock);

      const response = await axios.put(`/api/seller/books/${bookId}`, formData, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      setBooks(books.map(b => b._id === bookId ? response.data : b));
      setSuccess(`Updated stock for "${book.title}" to ${newStock}!`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError('Failed to dynamically update stock.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <Snavbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>My Listed <span className="gradient-text-cyan">Books Inventory</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage catalog titles, edit prices, and adjust stock dynamically</p>
        </div>
        <Link to="/seller/add-book" className="btn btn-primary" style={{ background: 'var(--gradient-cyan-purple)' }}>
          ➕ Add New Book
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : books.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You have not listed any books yet.</p>
          <Link to="/seller/add-book" className="btn btn-primary" style={{ background: 'var(--gradient-cyan-purple)' }}>Create Your First Listing</Link>
        </div>
      ) : (
        <div className="grid-4">
          {books.map((book) => (
            <div key={book._id} className="card glass glass-interactive book-card">
              <div className="book-card-image-wrapper">
                <img
                  src={`/uploads/${book.itemImage}`}
                  alt={book.title}
                  className="book-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x400/111827/ffffff?text=Book+Cover';
                  }}
                />
              </div>
              <span className="book-card-genre" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', borderColor: 'rgba(6, 182, 212, 0.3)' }}>{book.genre}</span>
              <h3 className="book-card-title">{book.title}</h3>
              <p className="book-card-author">by {book.author}</p>
              
              {/* Dynamic Quick Stock Controller */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                margin: '0.6rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Stock Inventory</span>
                  <span style={{
                    color: book.stock > 0 ? '#34d399' : '#f87171',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}>
                    {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    disabled={updatingId === book._id || book.stock <= 0}
                    onClick={() => handleStockUpdate(book._id, -1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                    title="Decrease stock by 1"
                  >
                    -
                  </button>
                  <button
                    disabled={updatingId === book._id}
                    onClick={() => handleStockUpdate(book._id, 1)}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                    title="Increase stock by 1"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="book-card-footer">
                <span className="book-card-price">₹{book.price.toFixed(2)}</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Link to={`/seller/edit-book/${book._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn btn-danger"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
