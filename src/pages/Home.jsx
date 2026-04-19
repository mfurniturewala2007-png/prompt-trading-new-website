import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Box, ArrowRight, Award, Compass, Globe } from 'lucide-react';
import { supabase } from '../supabase';

const Home = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from('brands').select('*');
      if (data) {
        const sortedData = [...data].sort((a, b) => {
          const aIsSnap = a.name.toLowerCase().includes('snap');
          const bIsSnap = b.name.toLowerCase().includes('snap');
          if (aIsSnap && !bIsSnap) return -1;
          if (!aIsSnap && bIsSnap) return 1;
          return a.name.localeCompare(b.name);
        });
        setBrands(sortedData);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      {/* Bento Layout Hero Section */}
      <section className="bento-hero">
        <div className="bento-grid">
          
          {/* Background / Right Image Area */}
          <div className="bento-image-area">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="/editorial_tools_hero.png" 
              alt="Premium Industrial Precision Tools" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>

          {/* Main TEXT box (Large Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bento-box bento-text-main"
          >
            <span style={{ 
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '1rem',
                display: 'block'
              }}>
                Industrial Sophistication
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1.5rem', letterSpacing: '-1.5px', lineHeight: 1.1, fontWeight: 800 }}>
              Premium Tools for Professionals
            </h1>
            <p style={{ fontSize: '1rem', color: '#A1A1AA', lineHeight: 1.6, maxWidth: '400px' }}>
              Prompt Trading redefines industrial excellence. Every project is built with authorized, precision hardware.
            </p>
          </motion.div>

          {/* Secondary TEXT box (Center Bottom) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bento-box bento-text-sub"
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Award size={24} />
              </div>
              <div>
                <h4 style={{ marginBottom: '2px', fontSize: '1.1rem' }}>Authorized Distributor</h4>
                <p style={{ fontSize: '0.8rem', color: '#A1A1AA', margin: 0 }}>Partners with top manufacturers</p>
              </div>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>150+</h2>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#A1A1AA', margin: 0 }}>Premium Brands</p>
              </div>
              <div>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>24/7</h2>
                <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#A1A1AA', margin: 0 }}>Industrial Support</p>
              </div>
            </div>
          </motion.div>

          {/* MICRORITM 1 (Bottom Left CTA) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bento-microritm-left"
          >
            <Link to="/catalog" className="bento-cta-btn">
              Explore Catalog <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </motion.div>

          {/* MICRORITM 2 (Bottom Right CTA) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bento-microritm-right"
          >
            <Link to="/brands" className="bento-cta-btn">
              Certified Brands
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Brands We Carry - Premium Grid */}
      <section className="section-py">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Brands We Carry</h2>
              <p style={{ color: 'var(--text-dim)' }}>Authorized distributor for the world's most trusted manufacturing hardware.</p>
            </div>
            <Link to="/brands" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              Explore Brand Network <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {brands.length > 0 ? brands.map((brand, i) => (
              <Link to={`/brands/${encodeURIComponent(brand.name)}`} key={brand.id} style={{ display: 'block' }}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                  style={{
                    height: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '1.5rem',
                    position: 'relative'
                  }}
                >
                  {brand.image_url ? (
                    <motion.img 
                      src={brand.image_url} 
                      alt={brand.name} 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('h3');
                        fallback.innerText = brand.name;
                        fallback.style.cssText = "font-size: 1.35rem; color: var(--text-primary); letter-spacing: 2px; font-weight: 900; text-transform: uppercase; margin: 0;";
                        e.currentTarget.parentNode.appendChild(fallback);
                      }}
                      initial={{ filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))' }}
                      whileHover={{ 
                        scale: 1.15, 
                        filter: 'drop-shadow(0px 15px 25px rgba(255, 255, 255, 0.2))',
                        y: -10
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        transformOrigin: 'center'
                      }} 
                    />
                  ) : (
                    <motion.h3 
                      whileHover={{ scale: 1.1, color: 'var(--primary-color)', y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      style={{ 
                        fontSize: '1.5rem', 
                        color: 'var(--text-secondary)', 
                        letterSpacing: '2px', 
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        margin: 0
                      }}
                    >
                      {brand.name}
                    </motion.h3>
                  )}
                </motion.div>
              </Link>
            )) : (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-color)', color: 'var(--text-dim)' }}>
                Waiting for manufacturer data sync... Please configure brands in Admin Panel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Precision Icons */}
      <section className="section-py" style={{ background: 'var(--surface-color)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
            >
              The Machined Advantage
            </motion.h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>We bridge the gap between heavy industry and digital precision.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {[
              { icon: <Shield size={32} />, title: "Precision Shield", desc: "Every tool is manually inspected for tolerance and certification before shipping." },
              { icon: <Zap size={32} />, title: "Machined Speed", desc: "Our logistics network is built for industrial urgency. Same-day dispatch on in-stock toolsets." },
              { icon: <Globe size={32} />, title: "Global Network", desc: "Sourcing authorized hardware from top-tier engineering hubs across the globe." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '2rem', background: 'transparent' }}
              >
                <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>{item.icon}</div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="glass" style={{
            borderRadius: '32px',
            padding: '5rem 2rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(130, 211, 222, 0.1) 0%, rgba(15, 20, 24, 0.4) 100%)',
            border: '1px solid rgba(130, 211, 222, 0.2)'
          }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Ready to optimize your industrial workflow?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Connect with our procurement experts or browse our authorized hardware catalog for the latest in machining technology.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '4px' }}>Browse Catalog</Link>
              <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 3rem', borderRadius: '4px' }}>About Our Mission</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
