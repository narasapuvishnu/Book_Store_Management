import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';

const genres = ['Fiction', 'Non Fiction', 'Science', 'Romance', 'Children', 'Biography', 'History', 'Fantasy'];

const Book = ({ auth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/user/books/${id}`);
        const b = response.data;
        
        // Verify this book belongs to the seller
        if (b.sellerId !== auth._id) {
          setError('Access denied: You do not own this listing.');
          setLoading(false);
          return;
        }

        setTitle(b.title);
        setAuthor(b.author);
        setGenre(b.genre);
        setDescription(b.description);
        setPrice(b.price.toString());
        setStock(b.stock.toString());
        setCurrentImage(b.itemImage);
      } catch (err) {
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, auth]);

  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('genre', genre);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      if (itemImage) {
        formData.append('itemImage', itemImage);
      }

      await axios.put(`/api/seller/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      });

      setSuccess('Book listing updated successfully!');
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Snavbar />
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Snavbar />
      <div className="form-container glass" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Edit <span className="gradient-text-cyan">Book Details</span></h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Modify attributes for this catalog listing</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!error && (
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="title">Book Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="author">Author Name</label>
                <input
                  type="text"
                  id="author"
                  className="form-control"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="genre">Genre / Category</label>
                <select
                  id="genre"
                  className="form-control"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  style={{ background: '#111827' }}
                >
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  id="stock"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Book Description</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Cover</label>
                <img
                  src={`/uploads/${currentImage}`}
                  alt="Current cover"
                  style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', background: 'var(--bg-secondary)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/80x100/111827/ffffff?text=Book';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="itemImage">Replace Cover Image (Optional)</label>
                <input
                  type="file"
                  id="itemImage"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Leave empty to keep existing image</small>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--gradient-cyan-purple)' }} disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Book Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Book;
