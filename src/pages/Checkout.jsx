import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [formData, setFormData] = useState({ name: '', idNumber: '', phone: '', address: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally we'd send to backend here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container section-py" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'var(--surface-color)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✓</div>
          <h2 style={{ marginBottom: '1rem' }}>Order Received!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Thank you {formData.name}. We will contact you shortly at {formData.phone} regarding your order.</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-py">
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        
        {/* Cart Summary */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Summary</h2>
          {cartItems.length === 0 ? (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <p>Your cart is empty.</p>
              <Link to="/catalog" className="btn btn-outline" style={{ marginTop: '1rem' }}>Browse Products</Link>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>${item.price}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{ width: '60px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                    <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444' }}><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* User Details Form */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Details</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name *</label>
              <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>ID Number *</label>
              <input required type="text" className="form-input" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} placeholder="National ID / Passport" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Phone Number *</label>
              <input required type="tel" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Delivery / Contact Address *</label>
              <textarea required className="form-input" rows="4" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address details..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={cartItems.length === 0}>
              Place Request Order
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Checkout;
