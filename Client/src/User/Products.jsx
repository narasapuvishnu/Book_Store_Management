import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const genres = ['All', 'Fiction', 'Non Fiction', 'Science', 'Romance', 'Children', 'Biography', 'History', 'Fantasy'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state initialized from search parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'latest');

  // Trigger search when searchParams changes
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      const searchVal = searchParams.get('search');
      const genreVal = searchParams.get('genre');
      const minP = searchParams.get('minPrice');
      const maxP = searchParams.get('maxPrice');
      const sort = searchParams.get('sortBy');

      if (searchVal) params.search = searchVal;
      if (genreVal && genreVal !== 'All') params.genre = genreVal;
      if (minP) params.minPrice = minP;
      if (maxP) params.maxPrice = maxP;
      if (sort) params.sortBy = sort;

      const response = await axios.get('/api/user/books', { params });
      setBooks(response.data);
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  // Handle URL updates when user clicks search/filter
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search;
    if (genre !== 'All') params.genre = genre;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenre('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('latest');
    setSearchParams({});
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Browse our <span className="gradient-text">Book Collection</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find books across academic genres, literature, fiction, and biography</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Filters Panel Form */}
        <form onSubmit={applyFilters} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Search Keyword</label>
              <input
                type="text"
                placeholder="Title, Author..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Genre / Category</label>
              <select
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Price Range</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Sort By</label>
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: '#111827' }}
              >
                <option value="latest">Latest Releases</option>
                <option value="popularity">Popularity (Stars)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem 0.5rem' }}
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {/* Catalog Results Grid */}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="spinner"></div>
        ) : books.length === 0 ? (
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
            No books found matching the selected filters. Try clearing your search parameters!
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: '500' }}>
              Showing {books.length} books in catalog
            </p>
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
                  <span className="book-card-genre">{book.genre}</span>
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">by {book.author}</p>
                  
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '0.85rem' }}>
                    {'★'.repeat(Math.round(book.averageRating || 0)) || '☆'} ({book.reviews?.length || 0} reviews)
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
