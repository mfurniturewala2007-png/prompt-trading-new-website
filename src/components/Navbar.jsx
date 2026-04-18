import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout, isRegistered } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="logo-box">
            <img src="/logo.jpg" alt="Prompt Trading Logo" className="logo-image" />
          </div>
          <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Prompt Trading Co.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
          <Link to="/brands" className={`nav-link ${location.pathname === '/brands' ? 'active' : ''}`}>Authorized Brands</Link>
          <Link to="/catalog" className={`nav-link ${location.pathname === '/catalog' ? 'active' : ''}`}>Products</Link>
        </nav>

        <div className="nav-actions">
          {isRegistered ? (
            <div className="nav-register-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '4px',
                border: '1px solid rgba(130, 211, 222, 0.4)',
                color: 'var(--primary-color)', fontWeight: 700
              }}>
                ✓ {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline nav-register-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid var(--primary-color)' }}>Register</Link>
          )}
          <Link to="/checkout" className="cart-btn">
            <ShoppingCart size={24} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/brands">Authorized Brands</Link>
        <Link to="/catalog">Products</Link>
        <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Login / Register</Link>
      </div>
    </header>
  );
};

export default Navbar;
