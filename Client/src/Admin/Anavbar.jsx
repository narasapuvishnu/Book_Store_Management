import React from 'react';
import { NavLink } from 'react-router-dom';

const Anavbar = () => {
  return (
    <div className="glass" style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
      <NavLink
        to="/admin/dashboard"
        end
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        📊 Dashboard
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/admin/users"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        👥 Users
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/admin/sellers"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        🏪 Sellers
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/admin/books"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        📚 Catalog
      </NavLink>
    </div>
  );
};

export default Anavbar;
