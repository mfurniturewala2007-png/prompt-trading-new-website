import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#f1f5f9', padding: '3rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Prompt Trading</h2>
          <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
            Your premium destination for authorized tools and hardware.
            Quality guaranteed.
          </p>
        </div>
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', color: '#64748b' }}>
          <p>&copy; {new Date().getFullYear()} Prompt Trading. All rights reserved.</p>
          <Link to="/admin" style={{ color: '#475569', fontSize: '0.875rem' }}>Admin Console</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
