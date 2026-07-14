import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = ({ auth, cart, updateQuantity, removeFromCart, clearCart }) => {
  const navigate = useNavigate();

  // Shipping details form
  const [flatno, setFlatno] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!auth || auth.role !== 'user') {
      alert('Please log in as a customer to checkout.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const itemsPayload = cart.map(item => ({
        bookId: item._id,
        quantity: item.quantity
      }));

      const headers = { Authorization: `Bearer ${auth.token}` };
      await axios.post('/api/user/orders', {
        shippingDetails: { flatno, city, state, pincode },
        items: itemsPayload
      }, { headers });

      // Simulated Payment Processing
      setTimeout(() => {
        setSuccess(true);
        clearCart();
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please check stock levels.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem' }}>🎉</span>
        <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Order Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Payment simulation succeeded. Your orders have been successfully placed with the respective merchants.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/user/orders" className="btn btn-primary">Track My Orders</Link>
          <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Shopping <span className="gradient-text">Cart</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review selected books and specify shipping details</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cart.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your shopping cart is empty.</p>
          <Link to="/products" className="btn btn-primary">Browse Book Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
          {/* Cart Items List */}
          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={`/uploads/${item.itemImage}`}
                    alt={item.title}
                    className="cart-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/80x100/111827/ffffff?text=Book';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>by {item.author}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                      Delete
                    </button>
                  </div>
                  
                  {/* Quantity Select Counter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.9rem' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '80px', marginLeft: '1rem' }}>
                    <strong style={{ fontSize: '1.1rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ${item.price.toFixed(2)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout & Summary Panel */}
          <div style={{ flex: '1 1 350px' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                <span style={{ color: '#34d399', fontWeight: 'bold' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '2rem' }}>
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit}>
                <h4 style={{ marginBottom: '1rem' }}>Shipping Details</h4>
                <div className="form-group">
                  <label htmlFor="flatno">Flat / Street Address</label>
                  <input
                    type="text"
                    id="flatno"
                    className="form-control"
                    placeholder="Apt 4B, 12 Main St"
                    value={flatno}
                    onChange={(e) => setFlatno(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className="form-control"
                    placeholder="Seattle"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      className="form-control"
                      placeholder="WA"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="pincode">Pincode / ZIP</label>
                    <input
                      type="text"
                      id="pincode"
                      className="form-control"
                      placeholder="98101"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.9rem' }}
                  disabled={loading}
                >
                  {loading ? 'Simulating Credit Charge...' : 'Place Order & Pay'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
