import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Tag, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from('brands').select('*');
      setBrands(data || []);
      setLoading(false);
    };
    fetchBrands();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}
        >
          Curated Partnerships
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-1.5px' }}
        >
          Authorized <span className="text-gradient">Hardware Partners</span>
        </motion.h1>
        <p style={{ color: 'var(--text-dim)', marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0', fontSize: '1.1rem' }}>
          We bridge the gap between global manufacturing and local industrial excellence.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}>Initializing network...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {brands.length > 0 ? brands.map((brand, i) => (
            <motion.div 
              key={brand.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass" 
              style={{
                padding: '3rem 2rem',
                borderRadius: '24px',
                transition: 'var(--transition)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              <div style={{
                width: '100%', height: '140px', background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {brand.image_url ? (
                  <img src={brand.image_url} alt={brand.name} style={{ width: '80%', height: '80%', objectFit: 'contain', filter: 'brightness(1.1)' }} />
                ) : (
                  <Award size={48} color="var(--primary-color)" style={{ opacity: 0.5 }} />
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>{brand.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{brand.description}</p>
              </div>
            </motion.div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '24px', color: 'var(--text-dim)' }}>
              Brand network details will appear here once authenticated.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Brands;
