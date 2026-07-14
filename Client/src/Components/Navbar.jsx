import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ auth, logout, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-container glass">
      <Link to="/" className="logo gradient-text">
        📚 BookStore
      </Link>
      
      <ul className="nav-links">
        {/* Public routes */}
        {!auth && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Browse Books</Link></li>
            <li><Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>User Login</Link></li>
            <li><Link to="/seller/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', background: 'rgba(99, 102, 241, 0.15)' }}>Seller Portal</Link></li>
            <li><Link to="/admin/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', background: 'rgba(168, 85, 247, 0.15)' }}>Admin</Link></li>
          </>
        )}

        {/* User authenticated routes */}
        {auth && auth.role === 'user' && (
          <>
            <li><Link to="/products">Browse</Link></li>
            <li><Link to="/user/dashboard">Dashboard</Link></li>
            <li><Link to="/user/orders">My Orders</Link></li>
            <li style={{ position: 'relative' }}>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Cart 🛒 
                {cartCount > 0 && (
                  <span style={{
                    background: 'var(--accent-rose)',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '50%',
                    padding: '0.1rem 0.4rem',
                    position: 'absolute',
                    top: '-10px',
                    right: '-15px',
                    fontWeight: 'bold'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Hi, {auth.name}</li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Logout</button></li>
          </>
        )}

        {/* Seller authenticated routes */}
        {auth && auth.role === 'seller' && (
          <>
            <li><Link to="/seller/dashboard">Dashboard</Link></li>
            <li><Link to="/seller/products">My Inventory</Link></li>
            <li><Link to="/seller/add-book">Add Book</Link></li>
            <li><Link to="/seller/orders">Customer Orders</Link></li>
            <li style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>Seller: {auth.name}</li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Logout</button></li>
          </>
        )}

        {/* Admin authenticated routes */}
        {auth && auth.role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
            <li><Link to="/admin/sellers">Manage Sellers</Link></li>
            <li><Link to="/admin/books">Manage Catalog</Link></li>
            <li style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Admin: {auth.name}</li>
            <li><button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
