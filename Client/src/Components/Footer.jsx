import React from 'react';

const Footer = () => {
  return (
    <footer className="glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', maxWidth: '1200px', margin: '0 auto 2rem', textAlign: 'left' }}>
        <div>
          <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>BookStore</h3>
          <p style={{ maxWidth: '300px' }}>Your ultimate destination for discovering literature, textbooks, and bestsellers. Read, sell, and manage efficiently.</p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Explore</h4>
          <ul style={{ listStyle: 'none', lineHeight: '2' }}>
            <li>Fiction & Fantasy</li>
            <li>Academic & Science</li>
            <li>Biographies</li>
            <li>History</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>For Partners</h4>
          <ul style={{ listStyle: 'none', lineHeight: '2' }}>
            <li>Sell on Bookstore</li>
            <li>Merchant Dashboard</li>
            <li>Admin Control Panel</li>
            <li>Developer APIs</li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem' }}>Support</h4>
          <ul style={{ listStyle: 'none', lineHeight: '2' }}>
            <li>Help Center</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Contact Us: support@bookstore.com</li>
          </ul>
        </div>
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} BookStore Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
