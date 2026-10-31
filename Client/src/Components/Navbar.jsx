import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ auth, logout, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="logo gradient-text">
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.3))',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          fontSize: '1.25rem'
        }}>
          📚
        </span>
        BookStore
      </Link>
      
      <ul className="nav-links">
        {/* Public routes */}
        {!auth && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Browse Catalog</Link></li>
            <li><Link to="/login" className="btn btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem' }}>Sign In</Link></li>
            <li><Link to="/seller/login" className="btn btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#38bdf8' }}>Seller Portal</Link></li>
            <li><Link to="/admin/login" className="btn btn-secondary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem', background: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.3)', color: '#c084fc' }}>Admin</Link></li>
          </>
        )}

        {/* User authenticated routes */}
        {auth && auth.role === 'user' && (
          <>
            <li><Link to="/products">Browse</Link></li>
            <li><Link to="/user/dashboard">Dashboard</Link></li>
            <li><Link to="/user/orders">My Orders</Link></li>
            <li style={{ position: 'relative' }}>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)' }}>
                🛒 Cart
                {cartCount > 0 && (
                  <span style={{
                    background: 'var(--accent-rose)',
                    color: 'white',
                    fontSize: '0.72rem',
                    borderRadius: '12px',
                    padding: '0.1rem 0.45rem',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99, 102, 241, 0.12)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              👤 {auth.name}
            </li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Logout</button></li>
          </>
        )}

        {/* Seller authenticated routes */}
        {auth && auth.role === 'seller' && (
          <>
            <li><Link to="/seller/dashboard">Dashboard</Link></li>
            <li><Link to="/seller/products">My Inventory</Link></li>
            <li><Link to="/seller/add-book">Add Book</Link></li>
            <li><Link to="/seller/orders">Customer Orders</Link></li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(6, 182, 212, 0.15)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#38bdf8',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              🏪 {auth.name}
            </li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Logout</button></li>
          </>
        )}

        {/* Admin authenticated routes */}
        {auth && auth.role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/sellers">Sellers</Link></li>
            <li><Link to="/admin/books">Catalog</Link></li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              ⚡ Admin: {auth.name}
            </li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
