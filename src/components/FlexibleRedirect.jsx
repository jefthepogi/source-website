import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function FlexibleRedirect() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, '').toLowerCase();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function lookup() {
      const { data, error } = await supabase
        .from('redirect_links').select('destination_url')
        .eq('slug', slug).eq('active', true).maybeSingle();
      if (!error && data?.destination_url) {
        setStatus('redirecting');
        window.location.replace(data.destination_url);
      } else {
        setStatus('notfound');
      }
    }
    lookup();
  }, [slug]);

  if (status === 'loading' || status === 'redirecting') {
    return (
      <div className="redirect-root">
        <div className="spin-anim" style={{ width: 28, height: 28, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="redirect-root">
      <p style={{ fontSize: 48 }}>🌿</p>
      <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text)', margin: 0 }}>Link Not Found</h1>
      <p style={{ color: 'var(--text-3)', fontSize: 14 }}>
        No redirect found for <code style={{ background: 'var(--bg-2)', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>/{slug}</code>
      </p>
      <a href="/" className="btn-primary" style={{ marginTop: 8 }}>Go Home</a>
    </div>
  );
}

export default FlexibleRedirect;
