import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ['Fiction', 'Non Fiction', 'Science', 'Romance', 'Children', 'Biography', 'History', 'Fantasy'];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/user/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching homepage books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Featured books (highest rating or first 4)
  const featuredBooks = [...books]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 4);

  // Latest books (most recent)
  const latestBooks = [...books]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span style={{
            background: 'var(--gradient-accent)',
            color: 'white',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            Welcome to Bookstore
          </span>
          <h1 style={{ lineHeight: '1.1', marginBottom: '1.5rem' }}>
            Discover Your Next <span className="gradient-text">Literary Adventure</span>
          </h1>
          <p>
            Explore our curated selection of top titles, textbooks, and novels. Buy directly from certified independent sellers, or register as a seller to list your inventory!
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/products" className="btn btn-primary">Browse All Books</Link>
            <Link to="/seller/signup" className="btn btn-secondary">Become a Seller</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-img-fallback">
            📚✨
          </div>
        </div>
      </section>

      {/* Search Bar section */}
      <section className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>What are you looking for today?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Search by title, author, genre or key terms</p>
        <form onSubmit={handleSearchSubmit} className="search-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Type book title, author, genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: 'var(--radius-xl)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)', padding: '0.75rem 2rem' }}>
            Search
          </button>
        </form>
      </section>

      {/* Popular Categories */}
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.2rem' }}>
          Explore Popular <span className="gradient-text">Categories</span>
        </h2>
        <div className="category-list" style={{ justifyContent: 'center' }}>
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => navigate(`/products?genre=${encodeURIComponent(cat)}`)}
              className="category-badge"
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Featured Books ⭐</h2>
          <Link to="/products?sort=popularity" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>View All →</Link>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : featuredBooks.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
            No books available yet. Sellers are registering products!
          </div>
        ) : (
          <div className="grid-4">
            {featuredBooks.map((book) => (
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
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24' }}>
                  {'★'.repeat(Math.round(book.averageRating || 0)) || '☆'} ({book.reviews ? book.reviews.length : 0})
                </div>
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

      {/* Latest Books */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Latest Arrivals 🌟</h2>
          <Link to="/products?sort=latest" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>View All →</Link>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : latestBooks.length === 0 ? (
          <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
            No new releases yet.
          </div>
        ) : (
          <div className="grid-4">
            {latestBooks.map((book) => (
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
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24' }}>
                  {'★'.repeat(Math.round(book.averageRating || 0)) || '☆'}
                </div>
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

export default Home;
