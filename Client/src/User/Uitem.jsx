import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Uitem = ({ auth, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/api/user/books/${id}`);
      setBook(response.data);
      
      // Check if in wishlist if user is authenticated
      if (auth && auth.role === 'user') {
        const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${auth._id}`)) || [];
        setInWishlist(localWishlist.some(item => item._id === response.data._id));
      }
    } catch (err) {
      setError('Book listing not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id, auth]);

  const handleToggleWishlist = () => {
    if (!auth || auth.role !== 'user') {
      alert('Please log in as a customer to manage your wishlist.');
      navigate('/login');
      return;
    }

    const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${auth._id}`)) || [];
    let updated;
    if (inWishlist) {
      updated = localWishlist.filter(item => item._id !== book._id);
      setInWishlist(false);
    } else {
      updated = [...localWishlist, book];
      setInWishlist(true);
    }
    localStorage.setItem(`wishlist_${auth._id}`, JSON.stringify(updated));
  };

  const handleAddToCart = () => {
    if (!auth || auth.role !== 'user') {
      alert('Please log in as a customer to purchase books.');
      navigate('/login');
      return;
    }
    addToCart(book);
    alert(`"${book.title}" added to shopping cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    
    if (!comment.trim()) {
      setReviewError('Please write your review comment.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${auth.token}` };
      await axios.post('/api/user/rate', {
        bookId: book._id,
        rating,
        comment
      }, { headers });

      setReviewSuccess('Thank you for rating this book!');
      setComment('');
      setRating(5);
      
      // Refresh details to show new review
      fetchBookDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  if (error || !book) {
    return <div className="alert alert-danger" style={{ margin: '2rem 0' }}>{error || 'Listing not found'}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '1rem' }}>
      {/* Product Details Section */}
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={`/uploads/${book.itemImage}`}
            alt={book.title}
            style={{ width: '100%', maxWidth: '350px', height: 'auto', maxHeight: '480px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/350x480/111827/ffffff?text=Book+Cover';
            }}
          />
        </div>
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span className="book-card-genre" style={{ marginBottom: '0.75rem' }}>{book.genre}</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{book.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
              by <strong style={{ color: 'white' }}>{book.author}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="stars" style={{ fontSize: '1.25rem' }}>
              {'★'.repeat(Math.round(book.averageRating || 0)) || '☆'}
            </div>
            <span style={{ fontWeight: 'bold' }}>{book.averageRating || 'Unrated'} / 5</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>{book.reviews?.length || 0} reviews</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontSize: '1.05rem', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', margin: '0.5rem 0' }}>
            {book.description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '300px', margin: '1rem 0' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>Merchant Price</span>
              <strong style={{ fontSize: '2.25rem', color: 'white' }}>${book.price.toFixed(2)}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>Availability</span>
              <span style={{
                color: book.stock > 0 ? '#34d399' : '#f87171',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                {book.stock > 0 ? `In Stock (${book.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: '1 1 200px', minWidth: '180px' }}
              disabled={book.stock <= 0}
            >
              🛒 {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="btn btn-secondary"
              style={{ color: inWishlist ? 'var(--accent-rose)' : 'white' }}
            >
              {inWishlist ? '❤️ Saved to Wishlist' : '🤍 Wishlist'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Listed by merchant: <strong style={{ color: 'var(--accent-cyan)' }}>{book.sellerName}</strong></span>
          </div>
        </div>
      </div>

      {/* Review Submission & Reviews Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* User Review Form */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3>Submit Your Review 📝</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Share your feedback with other readers</p>

          {auth && auth.role === 'user' ? (
            <form onSubmit={handleReviewSubmit}>
              {reviewError && <div className="alert alert-danger" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{reviewError}</div>}
              {reviewSuccess && <div className="alert alert-success" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{reviewSuccess}</div>}

              <div className="form-group">
                <label>Rating (1-5 Stars)</label>
                <div className="stars stars-interactive" style={{ margin: '0.5rem 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        color: star <= rating ? '#fbbf24' : 'var(--text-muted)',
                        marginRight: '0.3rem',
                        fontSize: '1.75rem'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  className="form-control"
                  placeholder="I loved the plot twist in the second half..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: '80px' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Please <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Log In</Link> as a customer to post reviews.
            </div>
          )}
        </div>

        {/* Reviews Feed */}
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3>Reviews Feed ({book.reviews?.length || 0}) 🗣️</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Latest reviews from fellow customers</p>

          {!book.reviews || book.reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews posted yet. Be the first to rate!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {book.reviews.map((rev) => (
                <div key={rev._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{rev.userName}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="stars" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {'★'.repeat(rev.rating) || '☆'}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uitem;
