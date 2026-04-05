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
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ height: '200px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{product.part_number || 'No Image'}</span>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{product.brand}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{product.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', flex: 1 }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${Number(product.price).toFixed(2)}</span>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addToCart(product)}>
                      Add to Cart
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
