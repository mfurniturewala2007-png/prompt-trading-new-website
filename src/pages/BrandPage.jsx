import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, Layers, Package, CheckCircle, X } from 'lucide-react';

const BrandPage = () => {
  const { brandName } = useParams();
  const decodedBrandName = decodeURIComponent(brandName);
  const { addToCart } = useCart();
  
  const [brandData, setBrandData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  // Check if it's the Snap-on theme
  const isSnapOn = decodedBrandName.toLowerCase().includes('snap');
  const themeClass = isSnapOn ? 'theme-snapon' : '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch Brand details
      const { data: brandRes } = await supabase
        .from('brands')
        .select('*')
        .ilike('name', decodedBrandName)
        .single();
      
      if (brandRes) setBrandData(brandRes);

      // Fetch Products for this brand
      const { data: prodRes } = await supabase
        .from('products')
        .select('*')
        .ilike('brand', decodedBrandName);
      
      if (prodRes) setProducts(prodRes);
      
      setLoading(false);
    };
    
    fetchData();
  }, [decodedBrandName]);

  return (
    <div className={`brand-page ${themeClass}`} style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Brand Hero Section */}
      <section className="brand-hero">
        <div className="container">
          <Link to="/brands" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ArrowLeft size={16} /> Back to Network
          </Link>
          
          <div className="brand-hero-content glass" style={{ padding: '4rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background for Hero */}
            <div className="brand-hero-ambient"></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {brandData?.image_url ? (
                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'inline-block', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <img src={brandData.image_url} alt={brandData.name} style={{ maxHeight: '120px', maxWidth: '300px', objectFit: 'contain' }} />
                </div>
              ) : (
                <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', margin: 0, textTransform: 'uppercase', letterSpacing: '-2px' }}>
                  {brandData ? brandData.name : decodedBrandName}
                </h1>
              )}
              
              {brandData?.description && (
                <p style={{ maxWidth: '600px', margin: '1rem auto 0', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {brandData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="section-py" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Authorized Inventory</h2>
              <p style={{ color: 'var(--text-dim)' }}>Showing official {brandData ? brandData.name : decodedBrandName} hardware.</p>
            </div>
            <div style={{ background: 'var(--primary-color)', color: '#000', padding: '0.5rem 1rem', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>
              {products.length} UNITS FOUND
            </div>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>Accessing manufacturer database...</div>
          ) : (
            <div className="catalog-grid">
              {products.length > 0 ? products.map(product => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="glass product-card" 
                  style={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-card-img-container">
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px', opacity: 0.5 }}>
                      {product.part_number ? `PN: ${product.part_number}` : 'MACHINED HARDWARE'}
                    </span>
                    {/* Stock Badge */}
                    <div className="product-stock-badge" style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      padding: '0.35rem 1rem',
                      borderRadius: '100px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}>
                      {product.quantity_in_stock > 0 ? `${product.quantity_in_stock} IN STOCK` : 'DEPLETED'}
                    </div>
                  </div>
                  
                  <div className="product-card-body">
                    <div className="product-card-brand-row">
                      <span className="brand-text-highlight">
                        {product.brand} {product.sub_brand && <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}> / {product.sub_brand}</span>}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>
                        {product.category}
                      </span>
                    </div>
                    <h3 className="product-card-title">{product.name}</h3>
                    <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.5rem', width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.25rem' }}>Unit Price</span>
                        <span className="product-card-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        className="btn btn-primary product-card-btn" 
                        style={{ 
                          opacity: product.quantity_in_stock > 0 ? 1 : 0.5, 
                          cursor: product.quantity_in_stock > 0 ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: addedProductId === product.id ? '#10b981' : ''
                        }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(product.quantity_in_stock > 0) {
                            addToCart(product);
                            setAddedProductId(product.id);
                            setTimeout(() => setAddedProductId(null), 2000);
                          }
                        }}
                        disabled={product.quantity_in_stock <= 0}
                      >
                        {addedProductId === product.id ? (
                          <><CheckCircle size={16} /> Acquired</>
                        ) : (
                          product.quantity_in_stock > 0 ? 'Acquire' : 'Unavailable'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', color: 'var(--text-dim)' }}>
                  No inventory currently synced for this manufacturer.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal (Same as Catalog) */}
      <AnimatePresence>
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedProduct(null)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} 
            className="glass" 
            style={{ width: '100%', maxWidth: '650px', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1 }}
          >
             <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '50%', color: 'white', display: 'flex', border: 'none', cursor: 'pointer', transition: 'var(--transition)' }}><X size={20} /></button>
             
             <div style={{ height: '220px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span className="brand-text-highlight" style={{ fontSize: '4rem', opacity: 0.05, fontWeight: 900, letterSpacing: '4px', textTransform: 'uppercase', position: 'absolute' }}>
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

             <div className="modal-content-container">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem' }}><Tag size={14} style={{ marginRight: '6px' }}/>{selectedProduct.brand}</span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem' }}><Layers size={14} style={{ marginRight: '6px' }}/>{selectedProduct.category}</span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '0.4rem 0.8rem' }}><Package size={14} style={{ marginRight: '6px' }}/>PN: {selectedProduct.part_number || 'N/A'}</span>
                </div>
                
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-desc">
                   {selectedProduct.sub_brand ? `Series code: ${selectedProduct.sub_brand}. ` : ''}
                   This item is a precision-engineered piece of hardware matching the specification sheet. Please refer to the attached Part Number <strong>({selectedProduct.part_number})</strong> for verified manufacturer specifications.
                </p>

                <div className="modal-bottom-row">
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.25rem' }}>Final Net Rate</div>
                    <div className="modal-price-value">₹{Number(selectedProduct.price).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: selectedProduct.quantity_in_stock > 0 ? '#4ade80' : '#ef4444', fontWeight: 600 }}>
                      {selectedProduct.quantity_in_stock > 0 ? `● ${selectedProduct.quantity_in_stock} Units in Warehouse` : '● Depleted / Out of Stock'}
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary modal-btn" 
                    style={{ 
                      background: addedProductId === selectedProduct.id ? '#10b981' : ''
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (selectedProduct.quantity_in_stock > 0) {
                          addToCart(selectedProduct);
                          setAddedProductId(selectedProduct.id);
                          setTimeout(() => setAddedProductId(null), 2000); // Reset after 2s
                        }
                    }}
                    disabled={selectedProduct.quantity_in_stock <= 0}
                  >
                    {addedProductId === selectedProduct.id ? (
                      <><CheckCircle size={20} /> Component Acquired</>
                    ) : (
                      'Acquire Component'
                    )}
                  </button>
                </div>
             </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default BrandPage;
