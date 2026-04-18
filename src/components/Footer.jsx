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
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>Instagram</a>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              
              {/* Addresses */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>Camp Office</strong>
                    <span style={{ lineHeight: 1.5 }}>Shop No 9 & 20, City Center, 930 Synagogue Street, Camp, Pune – 411001</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>City Office</strong>
                    <span style={{ lineHeight: 1.5 }}>978 Raviwar Peth, Sonyamaruti Chowk, Pune – 411002</span>
                  </div>
                </div>
              </div>

              {/* Phones */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '45px' }}>Office</span>
                    <span>020 46040218, +91 96570 78640</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '45px' }}>Admin</span>
                    <span>+91 91300 35948</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)', minWidth: '45px' }}>Sales</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span>+91 85307 84567</span>
                      <span>+91 88888 61772</span>
                      <span>+91 88888 97955</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Mail size={20} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span>ptc7786@gmail.com</span>
                  <span>zoeb@prompttrading.com</span>
                </div>
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
