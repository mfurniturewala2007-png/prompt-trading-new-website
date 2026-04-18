import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      setSettings(data || { goal: 'Providing high quality tools.', about_text: 'Information will appear here once added.' });
      setLoading(false);
    };
    fetchSettings();
  }, []);

  if (loading) return <div className="container section-py" style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '8rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="badge" style={{ 
            background: 'rgba(130, 211, 222, 0.1)', 
            color: 'var(--primary-color)',
            padding: '4px 12px',
            borderRadius: '100px',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            fontWeight: 800,
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            Our Legacy
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2rem', letterSpacing: '-1.5px' }}>
            Who <span className="text-gradient">We Are</span>
          </h1>

          <div className="glass" style={{ padding: '4rem', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.03, color: 'var(--primary-color)' }}>
              <ShieldCheck size={200} />
            </div>
            
            <div style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.9' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Since 2000, Prompt Trading Co. has been Pune's trusted source for premium industrial and professional tools. We supply authorized hardware from the world's top brands to factories, workshops, and professionals across the region.
              </p>
              <p>
                Our team of knowledgeable sales engineers provides expert guidance, on-site visits, torque wrench calibration, new facility setups, and tool storage solutions. We don't just sell tools — we build long-term partnerships built on precision and trust.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Why Us Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
          {[
            { title: "Authorized Only", desc: "We only deal in certified, factory-direct industrial hardware." },
            { title: "Technical Support", desc: "Expert guidance for machining and project requirements." },
            { title: "Fast Procurement", desc: "Minimized downtime through optimized logistics pipelines." }
          ].map((item, i) => (
             <div key={i} className="glass-light" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>{item.title}</h4>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{item.desc}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
