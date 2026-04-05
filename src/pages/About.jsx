import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

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
    <div className="container section-py">
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '1rem' }}>About Prompt Trading</h1>
      
      {settings?.goal && (
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '3rem', fontWeight: '500' }}>
          "{settings.goal}"
        </h2>
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.8' }} className="glass" >
        <div style={{ padding: '3rem', borderRadius: 'var(--radius-xl)' }}>
          {settings?.about_text ? (
             settings.about_text.split('\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
             ))
          ) : (
            <p>Welcome to Prompt Trading.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
