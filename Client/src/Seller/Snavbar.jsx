import React from 'react';
import { NavLink } from 'react-router-dom';

const Snavbar = () => {
  return (
    <div className="glass" style={{ display: 'flex', gap: '1rem', padding: '1rem 2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
      <NavLink
        to="/seller/dashboard"
        end
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        📈 Dashboard
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/seller/products"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        📦 My Inventory
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/seller/add-book"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        ➕ Add New Book
      </NavLink>
      <span style={{ color: 'var(--border-color)' }}>|</span>
      <NavLink
        to="/seller/orders"
        style={({ isActive }) => ({
          color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem'
        })}
      >
        📋 Customer Orders
      </NavLink>
    </div>
  );
};

export default Snavbar;
