import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function FlexibleRedirect() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, ''); // strip leading slash
  const [status, setStatus] = useState('loading'); // loading | redirecting | notfound

  useEffect(() => {
    async function lookup() {
      const { data, error } = await supabase
        .from('redirect_links')
        .select('destination_url')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <div className="w-10 h-10 border-4 border-[#087830] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4 padding text-center">
      <p className="text-5xl">🌿</p>
      <h1 className="text-2xl font-bold text-gray-800">Link Not Found</h1>
      <p className="text-gray-500">
        No redirect found for <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">/{slug}</code>
      </p>
      <a href="/" className="mt-4 bg-[#087830] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#065d24] transition-colors">
        Go Home
      </a>
    </div>
  );
}

export default FlexibleRedirect;
