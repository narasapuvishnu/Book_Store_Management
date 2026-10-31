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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.45rem 1.15rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '1.25rem',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a5b4fc', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Welcome to Next-Gen Bookstore
            </span>
          </div>

          <h1>
            Discover Your Next <span className="gradient-text">Literary Adventure</span>
          </h1>
          <p>
            Explore our handpicked curation of bestsellers, classics, and academic titles. Shop seamlessly with instant verification or launch your bookstore merchant store in minutes.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Explore Catalog 📚
            </Link>
            <Link to="/seller/signup" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Sell Books With Us ✨
            </Link>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>{books.length > 0 ? `${books.length}+` : '10+'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Curated Titles</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: '#38bdf8' }}>4.8 ★</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer Rating</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: '#34d399' }}>100%</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Orders</span>
            </div>
          </div>
        </div>

        {/* Visual Hero Showcase */}
        <div className="hero-image">
          <div className="hero-visual-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🌟 Featured Spotlight
              </span>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                Bestseller
              </span>
            </div>

            {featuredBooks[0] ? (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img
                  src={`/uploads/${featuredBooks[0].itemImage}`}
                  alt={featuredBooks[0].title}
                  style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/120x160/111827/ffffff?text=Book';
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span className="book-card-genre" style={{ marginBottom: '0.4rem' }}>{featuredBooks[0].genre}</span>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', lineHeight: '1.3' }}>{featuredBooks[0].title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>by {featuredBooks[0].author}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>${featuredBooks[0].price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>★ {featuredBooks[0].averageRating || 5.0}</span>
                  </div>
                  <Link to={`/products/${featuredBooks[0]._id}`} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', marginTop: '0.85rem' }}>
                    View Spotlight
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', fontSize: '3rem' }}>
                📖✨
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Search Experience */}
      <section className="glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>What would you like to read today?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>Search across millions of words by title, author, or keyword</p>
        <form onSubmit={handleSearchSubmit} className="search-wrapper">
          <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.85rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by book title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)', padding: '0.75rem 2rem' }}>
            Search
          </button>
        </form>
      </section>

      {/* Popular Categories */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            Explore Popular <span className="gradient-text">Genres</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Handpicked categories designed for effortless discovery</p>
        </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Top Rated & Featured ⭐</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Highest rated reader favorites with verified feedback</p>
          </div>
          <Link to="/products?sortBy=popularity" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All Collection →
          </Link>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : featuredBooks.length === 0 ? (
          <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
            No books available yet.
          </div>
        ) : (
          <div className="grid-4">
            {featuredBooks.map((book) => (
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
                <span className="book-card-genre">{book.genre}</span>
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">by {book.author}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '0.9rem' }}>
                  <span>{'★'.repeat(Math.round(book.averageRating || 0)) || '☆'}</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{book.averageRating ? book.averageRating.toFixed(1) : '5.0'}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({book.reviews ? book.reviews.length : 0})</span>
                </div>

                <div className="book-card-footer">
                  <span className="book-card-price">${book.price.toFixed(2)}</span>
                  <Link to={`/products/${book._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Latest Books */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Fresh Additions 🌟</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Newest releases just added to our shelves</p>
          </div>
          <Link to="/products?sortBy=latest" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Browse All Releases →
          </Link>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : latestBooks.length === 0 ? (
          <div className="glass" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
            No new releases yet.
          </div>
        ) : (
          <div className="grid-4">
            {latestBooks.map((book) => (
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
                <span className="book-card-genre">{book.genre}</span>
                <h3 className="book-card-title">{book.title}</h3>
                <p className="book-card-author">by {book.author}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '0.9rem' }}>
                  <span>{'★'.repeat(Math.round(book.averageRating || 0)) || '☆'}</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{book.averageRating ? book.averageRating.toFixed(1) : '5.0'}</span>
                </div>

                <div className="book-card-footer">
                  <span className="book-card-price">${book.price.toFixed(2)}</span>
                  <Link to={`/products/${book._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
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
