import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Send, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import emailjs from '@emailjs/browser';

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user, isRegistered } = useUser();
  const [enquiryEmail, setEnquiryEmail] = useState('mfurniturewala2007@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch the admin enquiry email from settings
  useEffect(() => {
    const fetchEmail = async () => {
      const { data } = await supabase.from('site_settings').select('enquiry_email').limit(1).single();
      if (data?.enquiry_email) setEnquiryEmail(data.enquiry_email);
    };
    fetchEmail();
  }, []);

  const handleSendEnquiry = async () => {
    if (cartItems.length === 0 || !isRegistered) return;
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase enquiries table
      const { error: dbError } = await supabase.from('enquiries').insert([{
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone || '',
        items: cartItems,
        total_amount: getCartTotal()
      }]);

      if (dbError) throw dbError;

      // 2. Send via EmailJS (Gmail-based)
      // NOTE: You need to replace these placeholders with your actual EmailJS keys
      const templateParams = {
        to_email: enquiryEmail,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone || 'N/A',
        total_amount: `₹${getCartTotal().toLocaleString('en-IN')}`,
        items_list: cartItems.map(item => 
          `${item.name} (${item.brand}) - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        ).join('\n')
      };

      await emailjs.send(
        'YOUR_SERVICE_ID', 
        'YOUR_TEMPLATE_ID', 
        templateParams, 
        'YOUR_PUBLIC_KEY'
      );

      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Enquiry Error:', err);
      alert('Failed to send enquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.75rem' }}>
          Your Selection
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-1.5px', margin: 0 }}>
          Cart & <span className="text-gradient">Enquiry</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
          Review your selected tools, then send us an enquiry via email and we'll get back to you with pricing and availability.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <ShoppingBag size={48} color="var(--text-dim)" style={{ marginBottom: '1.5rem', opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your cart is empty</h3>
          <Link to="/catalog" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'start' }}>

          {/* Cart Items */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''} Selected
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass"
                  style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                      {item.brand}
                    </div>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1rem' }}>{item.name}</h4>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>₹{Number(item.price).toLocaleString('en-IN')} each</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.35rem 0.75rem' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1 }}>−</button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1 }}>+</button>
                    </div>
                    <strong style={{ minWidth: '80px', textAlign: 'right' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', padding: '0.35rem' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary & Action */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(130, 211, 222, 0.15)', position: 'sticky', top: '8rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.5rem' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Estimated Total</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                ₹{getCartTotal().toLocaleString('en-IN')}
              </span>
            </div>

            {isRegistered && (
              <div style={{ background: 'rgba(130, 211, 222, 0.05)', border: '1px solid rgba(130, 211, 222, 0.15)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.25rem' }}>Sending as:</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{user.name} — {user.email}</span>
              </div>
            )}

            <button
              onClick={handleSendEnquiry}
              className="btn btn-primary"
              disabled={isSubmitting || !isRegistered}
              style={{ 
                width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                gap: '0.75rem', borderRadius: '8px',
                opacity: (isSubmitting || !isRegistered) ? 0.6 : 1
              }}
            >
              <Send size={20} className={isSubmitting ? 'animate-pulse' : ''} />
              {isSubmitting ? 'Sending Enquiry...' : 'Send Enquiry via Gmail'}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '1rem' }}>
              Directly notifies the Prompt Trading team about your selection.
            </p>

            {!isRegistered && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(249,115,22,0.05)', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.15)', fontSize: '0.85rem', textAlign: 'center' }}>
                <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Register first</Link>
                <span style={{ color: 'var(--text-dim)' }}> to auto-include your details in the enquiry.</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Success Modal/Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass"
              style={{ maxWidth: '500px', width: '100%', padding: '4rem 2rem', textAlign: 'center', borderRadius: '24px' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <CheckCircle2 size={40} color="#22c55e" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Enquiry Sent!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                Your request has been received. Our procurement team will review the availability of the selected tools and contact you at <strong>{user.email}</strong> shortly.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Continue Browsing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
