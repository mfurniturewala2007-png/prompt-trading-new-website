import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, HardHat, User, Phone } from 'lucide-react';
import { supabase } from '../supabase';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('customers')
        .insert([formData])
        .select()
        .single();

      if (dbError) throw dbError;
      
      // Use the login function from context
      login(data);
      setSuccess(true);
      setFormData({ name: '', phone_number: '', email: '' });
    } catch (err) {
      if (err.code === '23505') {
        // User already exists - log them in instead!
        const { data: existingUser } = await supabase
          .from('customers')
          .select()
          .eq('email', formData.email)
          .single();
          
        if (existingUser) {
          login(existingUser);
          setSuccess(true);
          setFormData({ name: '', phone_number: '', email: '' });
          return;
        }
      }
      
      console.error('Registration/Login Error:', err);
      setError('Failed to process. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, var(--bg-color), #000000)',
      padding: '6rem 2rem'
    }}>
      <div className="container" style={{ maxWidth: '1000px', display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Marketing / Info Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ flex: '1 1 400px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2rem', fontSize: '0.75rem' }}>
            <HardHat size={16} /> Partner Network
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Access Industrial <span className="text-gradient">Hardware</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Register your procurement profile to gain direct access to our authorized manufacturer network. Get rapid quotes on heavy-duty tools, power systems, and precision instruments.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)' }}>
              <ShieldCheck size={24} color="var(--primary-color)" /> <span style={{ fontWeight: 600 }}>Verified OEM Hardware</span>
            </div>
          </div>
        </motion.div>

        {/* Registration Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass"
          style={{ flex: '1 1 400px', padding: '3rem', borderRadius: '8px', borderTop: '4px solid var(--primary-color)' }}
        >
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={32} color="var(--primary-color)" />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Registration Successful</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your profile has been added to our network. A procurement specialist will contact you shortly.</p>
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', color: '#ffffff' }}>Create Account</h2>
              <p style={{ color: '#ffffff', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your details to join the distributor network.</p>
              
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '1rem', color: '#f8fafc', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input" 
                      style={{ paddingLeft: '3rem', height: '50px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-primary)' }} 
                      placeholder="John Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="tel" 
                      name="phone_number"
                      required
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="form-input" 
                      style={{ paddingLeft: '3rem', height: '50px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-primary)' }} 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input" 
                      style={{ paddingLeft: '3rem', height: '50px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-primary)' }} 
                      placeholder="john@engineering.com" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', height: '54px', fontSize: '1rem' }}>
                  {loading ? 'Processing...' : (
                    <>Register Profile <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
