import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Filter, Search } from 'lucide-react';
import { supabase } from '../supabase';

const Catalog = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = ['All', ...new Set(products.map(p => p.brand).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="container section-py">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="text-gradient">Product Catalog</h1>
        <div style={{ position: 'relative', minWidth: '300px' }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search products..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Filter size={20} /> <span style={{ fontWeight: 600 }}>Filters:</span>
          </div>
          
          <select 
            className="form-input" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            className="form-input" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
          >
            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading inventory from database...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
              <div key={product.id} className="glass" style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px -5px rgba(15, 179, 173, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)'; }}
              >
                <div style={{ height: '220px', background: 'linear-gradient(to bottom right, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '1px' }}>{product.part_number ? `PN: ${product.part_number}` : 'NO IMAGE'}</span>
                  {/* Stock Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '2rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: product.quantity_in_stock > 0 ? 'var(--primary-light)' : '#fee2e2',
                    color: product.quantity_in_stock > 0 ? 'var(--primary-dark)' : '#991b1b',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {product.quantity_in_stock > 0 ? `${product.quantity_in_stock} IN STOCK` : 'OUT OF STOCK'}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {product.brand} {product.sub_brand && <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>/ {product.sub_brand}</span>}
                    </span>
                    <span style={{ padding: '0.15rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {product.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', flex: 1, color: 'var(--text-primary)', lineHeight: 1.3 }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.1rem' }}>Price</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{Number(product.price).toFixed(2)}</span>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.6rem 1.25rem', borderRadius: '2rem', fontSize: '0.9rem', opacity: product.quantity_in_stock > 0 ? 1 : 0.5, cursor: product.quantity_in_stock > 0 ? 'pointer' : 'not-allowed' }} 
                      onClick={() => product.quantity_in_stock > 0 && addToCart(product)}
                      disabled={product.quantity_in_stock <= 0}
                    >
                      {product.quantity_in_stock > 0 ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                No products found. Please add products via the Admin panel.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
