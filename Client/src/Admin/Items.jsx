import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';

const Items = ({ auth }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/admin/books', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setBooks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch catalog books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [auth]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book from the catalog?')) {
      try {
        setError('');
        setSuccess('');
        await axios.delete(`/api/admin/books/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setSuccess('Book deleted successfully from catalog.');
        setBooks(books.filter(b => b._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book.');
      }
    }
  };

  return (
    <div>
      <Anavbar />
      <h2 style={{ marginBottom: '1.5rem' }}>Manage <span className="gradient-text">Book Catalog</span></h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : books.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
          No books listed in the catalog yet.
        </div>
      ) : (
        <div className="table-container glass">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Seller</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img
                      src={`/uploads/${book.itemImage}`}
                      alt={book.title}
                      style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: 'var(--bg-secondary)' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/40x50/111827/ffffff?text=Book';
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: '600' }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      {book.genre}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>${book.price.toFixed(2)}</td>
                  <td>{book.stock} left</td>
                  <td style={{ color: 'var(--accent-cyan)' }}>{book.sellerName}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Delete Book
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

export default Items;
