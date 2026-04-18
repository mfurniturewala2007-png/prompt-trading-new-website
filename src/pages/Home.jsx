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
      if (data) setBrands(data);
    };
    fetchBrands();
  }, []);

  return (
    <div style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      {/* Heavy-Duty Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: `linear-gradient(rgba(9, 9, 11, 0.8), rgba(9, 9, 11, 0.95)), url('/rugged_tools_hero_1776493354746.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '6rem'
      }}>
        {/* Luminous Glows */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px',
          background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(150px)', opacity: '0.1'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="badge" 
                style={{ 
                  background: 'rgba(130, 211, 222, 0.1)', 
                  color: 'var(--primary-color)',
                  border: '1px solid rgba(130, 211, 222, 0.2)',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem',
                  display: 'inline-block'
                }}
              >
                Industrial Sophistication
              </motion.span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1.1, fontWeight: 800 }}>
                Premium Tools for <span className="text-gradient">Professionals</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
                Prompt Trading redefines industrial excellence. We treat precision tools as instruments, ensuring every project is built with the highest authorized hardware.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '4px', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  Explore Catalog <ArrowRight size={18} />
                </Link>
                <Link to="/brands" className="btn btn-outline" style={{ 
                  padding: '1rem 2.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.9rem', 
                  letterSpacing: '1px',
                  borderColor: 'rgba(130, 211, 222, 0.3)',
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  Certified Brands
                </Link>
              </div>
            </motion.div>

            {/* Floating Asset Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="glass"
              style={{
                borderRadius: '32px',
                padding: '2.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxHeight: '400px',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--primary-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-color)' }}>
                  <Award size={30} />
                </div>
                <div>
                  <h4 style={{ marginBottom: '2px' }}>Authorized Distributor</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Direct partnership with top manufacturers</p>
                </div>
              </div>
              <div style={{ height: '1px', background: 'var(--border-color)' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '0' }}>150+</h2>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Premium Brands</p>
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '0' }}>24/7</h2>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Industrial Support</p>
                </div>
              </div>
            </motion.div>
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
              <motion.div 
                key={brand.id}
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
            )) : (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-color)', color: 'var(--text-dim)' }}>
                Waiting for manufacturer data sync... Please configure brands in Admin Panel.
              </div>
            )}
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
