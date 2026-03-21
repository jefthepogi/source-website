import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Send, CheckCircle, Facebook } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import HeaderBgImage from '../assets/header-bg.jpg';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0d0f0e; --bg-2:#131615; --bg-3:#191c1a; --bg-4:#1f2421;
    --border:rgba(255,255,255,0.07); --border-md:rgba(255,255,255,0.11);
    --accent:#22c55e; --accent-dim:#22c55e18;
    --text:#f0f2f1; --text-2:#9aa39d; --text-3:#5a6560;
    --font-head:'Syne',sans-serif; --font-body:'Outfit',sans-serif; --radius:14px;
  }
  .contacts-root { font-family:var(--font-body); background:var(--bg); color:var(--text); }
  .ds-input { width:100%; padding:11px 14px; background:var(--bg-3); border:1px solid var(--border-md); border-radius:8px; color:var(--text); font-family:var(--font-body); font-size:13px; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  .ds-input::placeholder { color:var(--text-3); }
  .ds-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(34,197,94,0.08); }
  .channel-card { display:flex; align-items:center; gap:14px; padding:14px 16px; background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); text-decoration:none; transition:border-color 0.2s, transform 0.2s; }
  .channel-card:hover { border-color:var(--border-md); transform:translateY(-2px); }
`;

const CHANNELS = [
  { icon: <Facebook size={18} />, label: 'Facebook', handle: 'LSU-SOURCE', href: 'https://www.facebook.com/LSU.SOURCE', color: '#1877f2' },
  { icon: <FaDiscord size={18} />, label: 'Discord', handle: 'Join our server', href: 'https://discord.gg/UEBu2gtETH', color: '#5865f2' },
  { icon: <Mail size={18} />, label: 'Email', handle: 'source@lsu.edu.ph', href: 'mailto:source@lsu.edu.ph', color: '#22c55e' },
];

export default function ContactsPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setError('Please fill in all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    const { error: dbError } = await supabase.from('contact_submissions').insert([{ name:form.name.trim(), email:form.email.trim(), subject:form.subject.trim()||null, message:form.message.trim() }]);
    setLoading(false);
    if (dbError) setError('Something went wrong. Please try again.');
    else { setSubmitted(true); setForm({ name:'', email:'', subject:'', message:'' }); }
  };

  return (
    <>
      <style>{S}</style>
      <div className="contacts-root">

        {/* Hero */}
        <div style={{ position:'relative', height:'360px', overflow:'hidden', background:'#0a0c0b' }}>
          <img src={HeaderBgImage} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, rgba(8,12,10,0.93) 0%, rgba(8,12,10,0.72) 55%, rgba(8,12,10,0.4) 100%)' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize:'32px 32px', opacity:0.45 }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 11vw 48px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ width:20, height:1, background:'#22c55e', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Get in Touch</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(2.5rem, 5vw, 4rem)', color:'#f0f2f1', lineHeight:1.05, marginBottom:12 }}>Contact Us</h1>
            <p style={{ color:'rgba(240,242,241,0.45)', fontWeight:300, maxWidth:'360px' }}>Questions, suggestions, or just want to say hi?</p>
          </div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:64, background:'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
        </div>

        {/* Content */}
        <div style={{ padding:'72px 11vw' }}>
          <div style={{ maxWidth:'960px', margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 3fr', gap:'64px' }}>

            {/* Left */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ width:20, height:1, background:'#22c55e', display:'inline-block' }} />
                  <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Channels</span>
                </div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'1.4rem', color:'#f0f2f1', marginBottom:10 }}>Find us online</h2>
                <p style={{ color:'#9aa39d', fontWeight:300, fontSize:14, lineHeight:1.75 }}>
                  Reach out through any of our platforms or send a direct message. We respond within 1–2 school days.
                </p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {CHANNELS.map(({ icon, label, handle, href, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="channel-card">
                    <div style={{ width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background: color+'18', color, flexShrink:0 }}>
                      {icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:600, color:'#f0f2f1', fontSize:'0.85rem' }}>{label}</p>
                      <p style={{ color:'#5a6560', fontSize:12, marginTop:1 }}>{handle}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color:'#5a6560' }}>
                      <path d="M5 4l4 3.5L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>

              <div style={{ padding:'16px 20px', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14 }}>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#5a6560', marginBottom:8 }}>Office Hours</p>
                <p style={{ color:'#9aa39d', fontSize:13, lineHeight:1.75, fontWeight:300 }}>
                  Monday – Friday, during school hours.<br />
                  CCSEA dept., La Salle University – Ozamiz.
                </p>
              </div>
            </div>

            {/* Right */}
            <div style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, padding:'36px 36px 40px' }}>
              {submitted ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'48px 0', gap:16 }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(34,197,94,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle size={28} style={{ color:'#22c55e' }} />
                  </div>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'1.25rem' }}>Message Sent</h3>
                  <p style={{ color:'#9aa39d', fontSize:13, maxWidth:260, lineHeight:1.65 }}>Thanks for reaching out. We'll get back to you as soon as possible.</p>
                  <button onClick={() => setSubmitted(false)}
                    style={{ background:'transparent', border:'none', color:'#22c55e', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", textDecoration:'underline', textUnderlineOffset:3, marginTop:4 }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <span style={{ width:16, height:1, background:'#22c55e', display:'inline-block' }} />
                      <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Direct Message</span>
                    </div>
                    <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'1.25rem' }}>Send us a message</h2>
                  </div>

                  {error && (
                    <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, borderRadius:8, padding:'10px 14px', marginBottom:16 }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      <Field label="Name *"><input className="ds-input" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" /></Field>
                      <Field label="Email *"><input className="ds-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" /></Field>
                    </div>
                    <Field label="Subject">
                      <input className="ds-input" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
                    </Field>
                    <Field label="Message *">
                      <textarea className="ds-input" name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Write your message here…" style={{ resize:'none' }} />
                    </Field>

                    <button type="submit" disabled={loading}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading?'#22c55e99':'#22c55e', color:'#000', border:'none', borderRadius:8, padding:'12px', fontSize:13, fontWeight:600, cursor: loading?'not-allowed':'pointer', fontFamily:"'Outfit',sans-serif", transition:'background 0.2s', marginTop:4 }}
                      onMouseEnter={(e) => !loading && (e.currentTarget.style.background='#28d468')}
                      onMouseLeave={(e) => !loading && (e.currentTarget.style.background='#22c55e')}
                    >
                      {loading ? <div style={{ width:16, height:16, border:'2px solid #000', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : <><Send size={13} /> Send Message</>}
                    </button>
                  </form>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#5a6560', marginBottom:6 }}>{label}</p>
      {children}
    </div>
  );
}
