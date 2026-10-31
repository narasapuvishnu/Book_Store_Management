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
  }, [id, auth?._id]);

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
    alert(`"${book.title}" added to your shopping cart! 🛒`);
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

      setReviewSuccess('Thank you! Your review has been published.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '0.5rem' }}>
      {/* Product Details Section */}
      <div className="glass" style={{ display: 'flex', flexWrap: 'wrap', gap: '3.5rem', padding: '3.5rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <img
              src={`/uploads/${book.itemImage}`}
              alt={book.title}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/360x500/111827/ffffff?text=Book+Cover';
              }}
            />
          </div>
        </div>

        <div style={{ flex: '2 1 420px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span className="book-card-genre" style={{ marginBottom: '0.85rem' }}>{book.genre}</span>
            <h1 style={{ fontSize: '2.85rem', marginBottom: '0.5rem' }}>{book.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              by <strong style={{ color: 'white' }}>{book.author}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
            <div className="stars" style={{ fontSize: '1.25rem' }}>
              {'★'.repeat(Math.round(book.averageRating || 0)) || '☆'}
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{book.averageRating ? book.averageRating.toFixed(1) : 'Unrated'} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ 5</span></span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{book.reviews?.length || 0} customer reviews</span>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '4px solid var(--accent-primary)',
            padding: '1.25rem 1.5rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            margin: '0.5rem 0'
          }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Synopsis & Overview
            </h4>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {book.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', margin: '0.75rem 0' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Merchant Price</span>
              <strong style={{ fontSize: '2.5rem', color: 'white', fontFamily: 'var(--font-heading)' }}>₹{book.price.toFixed(2)}</strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Availability</span>
              <span style={{
                color: book.stock > 0 ? '#34d399' : '#f87171',
                fontWeight: '700',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.2rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: book.stock > 0 ? '#34d399' : '#f87171' }}></span>
                {book.stock > 0 ? `In Stock (${book.stock} copies)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: '1 1 220px', padding: '0.95rem 1.75rem', fontSize: '1.05rem' }}
              disabled={book.stock <= 0}
            >
              🛒 {book.stock > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="btn btn-secondary"
              style={{ padding: '0.95rem 1.75rem', color: inWishlist ? 'var(--accent-rose)' : 'white' }}
            >
              {inWishlist ? '❤️ In Your Wishlist' : '🤍 Save to Wishlist'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span>Verified Merchant: <strong style={{ color: 'var(--accent-cyan)' }}>{book.sellerName}</strong></span>
          </div>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
        {/* User Review Form */}
        <div className="card glass" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Leave a Customer Review 📝</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Share your genuine feedback with the book community</p>

          {auth && auth.role === 'user' ? (
            <form onSubmit={handleReviewSubmit}>
              {reviewError && <div className="alert alert-danger" style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{reviewError}</div>}
              {reviewSuccess && <div className="alert alert-success" style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{reviewSuccess}</div>}

              <div className="form-group">
                <label>Rating (1 to 5 Stars)</label>
                <div className="stars stars-interactive" style={{ margin: '0.5rem 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        color: star <= rating ? '#fbbf24' : 'var(--text-muted)',
                        marginRight: '0.4rem',
                        fontSize: '2rem'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Feedback</label>
                <textarea
                  id="comment"
                  className="form-control"
                  placeholder="Tell readers about the writing style, storyline, and takeaways..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: '100px' }}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Posting Feedback...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div style={{ padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '1rem' }}>Please log in to leave your feedback and rating for this book.</p>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign In as Customer</Link>
            </div>
          )}
        </div>

        {/* Customer Reviews Feed */}
        <div className="card glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Reader Feedback ({book.reviews?.length || 0}) 🗣️</h3>
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold' }}>★ {book.averageRating || '0'} Rating</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Verified reader impressions and testimonials</p>

          {!book.reviews || book.reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 1rem' }}>No reviews yet. Be the first reader to review this book!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {book.reviews.map((rev) => (
                <div key={rev._id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                      </span>
                      <strong style={{ fontSize: '0.95rem' }}>{rev.userName}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="stars" style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    {'★'.repeat(rev.rating) || '☆'}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>"{rev.comment}"</p>
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
