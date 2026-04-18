import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0f13', color: '#dfe3e8', padding: '5rem 0', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--primary-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0f13' }}>
                <ShieldCheck size={20} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-1px' }}>Prompt Trading</h2>
            </div>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Redefining industrial tool procurement through precision, authorization, and digital excellence.
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontWeight: 600, fontSize: '0.9rem' }}>
              <a href="#" style={{ color: 'var(--primary-color)', transition: 'var(--transition)' }}>LinkedIn</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>Facebook</a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sourcing</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/catalog" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>Product Catalog</Link>
              <Link to="/brands" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>Authorized Brands</Link>
              <Link to="/about" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>About Us</Link>
              <Link to="/admin" className="btn-outline" style={{ 
                marginTop: '1.5rem', 
                padding: '0.6rem 1.25rem', 
                fontSize: '0.85rem', 
                textAlign: 'center',
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>Control Panel</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>Terms of Supply</a>
              <a href="#" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>Privacy Protocol</a>
              <a href="#" style={{ color: 'var(--text-dim)', transition: 'var(--transition)' }}>Certifications</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Headquarters</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-dim)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <MapPin size={18} color="var(--primary-color)" />
                <span>Industrial Hub, Phase II, New Delhi</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--primary-color)" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--primary-color)" />
                <span>procurement@prompttrading.com</span>
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          <p>&copy; {new Date().getFullYear()} Prompt Trading & Co. Optimized for Industrial Scale.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Certified ISO 9001</span>
            <span>Est. 2007</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
