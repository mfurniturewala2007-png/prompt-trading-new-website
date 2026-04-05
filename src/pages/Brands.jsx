import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Tag } from 'lucide-react';

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
    <div className="container section-py">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient">Our Authorized Brands</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          We partner with industry leaders to bring you the best.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading authorized brands...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {brands.length > 0 ? brands.map((brand) => (
            <div key={brand.id} className="glass" style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              transition: 'var(--transition)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '100px', height: '100px', background: 'var(--primary-light)', color: 'var(--primary-dark)',
                borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
              }}>
                {brand.image_url ? (
                  <img src={brand.image_url} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Tag size={40} />
                )}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{brand.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{brand.description}</p>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Brand details will appear here once added in the Admin panel.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Brands;
