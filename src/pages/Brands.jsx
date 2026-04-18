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
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
              style={{
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem'
              }}
            >
              <div style={{
                width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px'
              }}>
                {brand.image_url ? (
                  <motion.img 
                    src={brand.image_url} 
                    alt={brand.name} 
                    initial={{ filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))' }}
                    whileHover={{ 
                      scale: 1.15, 
                      filter: 'drop-shadow(0px 20px 35px rgba(255, 255, 255, 0.2))',
                      y: -10,
                      rotateX: 5
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain',
                      transformOrigin: 'bottom center'
                    }} 
                  />
                ) : (
                  <Award size={64} color="var(--primary-color)" style={{ opacity: 0.3 }} />
                )}
              </div>
              <div>
                <motion.h3 
                  whileHover={{ color: 'var(--primary-color)' }}
                  style={{ fontSize: '1.75rem', marginBottom: '0.75rem', letterSpacing: '-0.5px', transition: 'var(--transition)' }}
                >
                  {brand.name}
                </motion.h3>
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
