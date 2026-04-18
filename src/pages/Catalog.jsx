import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Filter, Search, X, Tag, Layers, Package } from 'lucide-react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';

const Catalog = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <span className="badge" style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>Inventory</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-1.5px', margin: 0 }}>Product <span className="text-gradient">Catalog</span></h1>
        </div>
        <div style={{ position: 'relative', minWidth: '320px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search precision tools..." 
            style={{ 
              paddingLeft: '3rem', 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              height: '50px'
            }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          flexWrap: 'wrap', 
          padding: '1.5rem', 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <Filter size={18} /> Filters
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              className="form-input" 
              style={{ width: 'auto', minWidth: '180px', height: '40px', background: 'var(--bg-color)', fontSize: '0.9rem' }}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
              className="form-input" 
              style={{ width: 'auto', minWidth: '180px', height: '40px', background: 'var(--bg-color)', fontSize: '0.9rem' }}
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
            >
              <option value="All">All Brands</option>
              {brands.filter(b => b !== 'All').map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>Loading inventory from database...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {filteredProducts.length > 0 ? filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="glass" 
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  background: 'rgba(27, 32, 36, 0.6)',
                  cursor: 'pointer'
                }}
                whileHover={{ y: -10, borderColor: 'rgba(130, 211, 222, 0.2)' }}
                onClick={() => setSelectedProduct(product)}
              >
                <div style={{ height: '240px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.5 }}>
                    {product.part_number ? `PN: ${product.part_number}` : 'MACHINED HARDWARE'}
                  </span>
                  {/* Stock Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    padding: '0.35rem 1rem',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    background: product.quantity_in_stock > 0 ? 'rgba(130, 211, 222, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: product.quantity_in_stock > 0 ? 'var(--primary-color)' : '#ef4444',
                    border: `1px solid ${product.quantity_in_stock > 0 ? 'rgba(130, 211, 222, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                  }}>
                    {product.quantity_in_stock > 0 ? `${product.quantity_in_stock} IN STOCK` : 'DEPLETED'}
                  </div>
                </div>
                
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <span style={{ color: 'var(--primary-color)' }}>
                      {product.brand} {product.sub_brand && <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}> / {product.sub_brand}</span>}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>
                      {product.category}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', flex: 1, color: 'var(--text-primary)', lineHeight: 1.3, letterSpacing: '-0.5px' }}>{product.name}</h3>
                  <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.5rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>Unit Price</span>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      style={{ 
                        padding: '0.8rem 1.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.85rem', 
                        fontWeight: 700,
                        opacity: product.quantity_in_stock > 0 ? 1 : 0.5, 
                        cursor: product.quantity_in_stock > 0 ? 'pointer' : 'not-allowed' 
                      }} 
                      onClick={(e) => {
                        e.stopPropagation(); // Stop card click from triggering
                        if(product.quantity_in_stock > 0) addToCart(product);
                      }}
                      disabled={product.quantity_in_stock <= 0}
                    >
                      {product.quantity_in_stock > 0 ? 'Acquire' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', color: 'var(--text-dim)' }}>
                No hardware found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedProduct(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass animate-fade-in-up" style={{ width: '100%', maxWidth: '650px', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--surface-color)' }}>
             <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%', color: 'white', display: 'flex', border: 'none', cursor: 'pointer', transition: 'var(--transition)' }}><X size={20} /></button>
             
             {/* Header Image Area */}
             <div style={{ height: '220px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span style={{ color: 'var(--primary-color)', fontSize: '4rem', opacity: 0.05, fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', position: 'absolute' }}>
                  {selectedProduct.brand}
                </span>
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} style={{ position: 'relative', zIndex: 1, maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} alt={selectedProduct.name} />
                ) : (
                   <span style={{ position: 'relative', zIndex: 1, color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.5 }}>
                     NO IMAGE AVAILABLE
                   </span>
                )}
             </div>

             {/* Content Area */}
             <div style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: 'rgba(130, 211, 222, 0.1)', color: 'var(--primary-color)', padding: '0.4rem 0.8rem' }}><Tag size={14} style={{ marginRight: '6px' }}/>{selectedProduct.brand}</span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem' }}><Layers size={14} style={{ marginRight: '6px' }}/>{selectedProduct.category}</span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem' }}><Package size={14} style={{ marginRight: '6px' }}/>PN: {selectedProduct.part_number || 'N/A'}</span>
                </div>
                
                <h2 style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: '1rem', color: 'var(--text-primary)' }}>{selectedProduct.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                   {selectedProduct.sub_brand ? `Series code: ${selectedProduct.sub_brand}. ` : ''}
                   This item is a precision-engineered piece of hardware matching the specification sheet. Since the bulk import does not contain a full descriptive text, please refer to the attached Part Number <strong>({selectedProduct.part_number})</strong> for verified manufacturer specifications.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.25rem' }}>Final Net Rate</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>₹{Number(selectedProduct.price).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: selectedProduct.quantity_in_stock > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>
                      {selectedProduct.quantity_in_stock > 0 ? `● ${selectedProduct.quantity_in_stock} Units in Warehouse` : '● Depleted / Out of Stock'}
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '8px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (selectedProduct.quantity_in_stock > 0) {
                          addToCart(selectedProduct);
                          // We can leave the modal open so they can click it multiple times, 
                          // but the cart notification will show.
                        }
                    }}
                    disabled={selectedProduct.quantity_in_stock <= 0}
                  >
                    Acquire Component
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Catalog;
