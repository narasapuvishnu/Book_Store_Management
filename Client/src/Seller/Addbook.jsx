import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';

const genres = ['Fiction', 'Non Fiction', 'Science', 'Romance', 'Children', 'Biography', 'History', 'Fantasy'];

const Addbook = ({ auth }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState(genres[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [itemImage, setItemImage] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!itemImage) {
      setError('Please select a book cover image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('genre', genre);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('itemImage', itemImage);

      await axios.post('/api/seller/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth.token}`
        }
      });

      setSuccess('Book added successfully to catalog!');
      // Reset form
      setTitle('');
      setAuthor('');
      setGenre(genres[0]);
      setDescription('');
      setPrice('');
      setStock('');
      setItemImage(null);
      
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Snavbar />
      <div className="form-container glass" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Add <span className="gradient-text-cyan">New Book</span></h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill out the details to list a book in the catalog</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="title">Book Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                placeholder="The Great Gatsby"
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
                placeholder="F. Scott Fitzgerald"
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
                placeholder="14.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                min="1"
                id="stock"
                className="form-control"
                placeholder="25"
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
              placeholder="Describe the plot, condition, and binding of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="itemImage">Book Cover Image</label>
            <input
              type="file"
              id="itemImage"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
              required
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Upload JPG, PNG, or WEBP image. Max size: 5MB.
            </small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', background: 'var(--gradient-cyan-purple)' }} disabled={loading}>
            {loading ? 'Publishing Listing...' : 'Publish Book Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addbook;
