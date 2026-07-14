import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';

const MyProducts = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <div>
      <Snavbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My listed <span className="gradient-text-cyan">Books Inventory</span></h2>
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
              <img
                src={`/uploads/${book.itemImage}`}
                alt={book.title}
                className="book-card-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300x400/111827/ffffff?text=Book+Cover';
                }}
              />
              <span className="book-card-genre" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9' }}>{book.genre}</span>
              <h3 className="book-card-title">{book.title}</h3>
              <p className="book-card-author">by {book.author}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Stock: <strong style={{ color: 'white' }}>{book.stock}</strong></span>
                <span style={{
                  color: book.availability ? '#34d399' : '#f87171',
                  fontWeight: 'bold'
                }}>
                  {book.availability ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="book-card-footer">
                <span className="book-card-price">${book.price.toFixed(2)}</span>
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
