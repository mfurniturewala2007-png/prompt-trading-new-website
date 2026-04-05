import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, var(--bg-color) 0%, var(--primary-light) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
          background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(100px)', opacity: '0.2'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px' }}
          >
            <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>New Collection 2026</span>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Premium Tools for <span className="text-gradient">Professionals</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Prompt Trading offers the highest quality authorized brands and equipment for your next big project. Explore our vast catalog.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/catalog" className="btn btn-primary">Browse Products</Link>
              <Link to="/brands" className="btn btn-outline">Our Brands</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories - Placeholder for later */}
      <section className="section-py container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>Popular Categories</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Find exactly what you need.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass" style={{ height: '200px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h3>Category {i}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
