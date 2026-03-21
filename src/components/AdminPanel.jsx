import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Newspaper, CalendarDays, Users, ShoppingBag, Link2, MessageSquare, LogOut, Menu, X, ChevronRight, Shield, TrendingUp } from 'lucide-react';
import AdminNews from './admin/AdminNews';
import AdminEvents from './admin/AdminEvents';
import AdminOfficers from './admin/AdminOfficers';
import AdminMerch from './admin/AdminMerch';
import AdminRedirects from './admin/AdminRedirects';
import AdminContacts from './admin/AdminContacts';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0d0f0e; --bg-2:#131615; --bg-3:#191c1a; --bg-4:#1f2421;
    --sidebar:#0a0c0b;
    --border:rgba(255,255,255,0.07); --border-md:rgba(255,255,255,0.11);
    --accent:#22c55e; --accent-dim:#22c55e18;
    --text:#f0f2f1; --text-2:#9aa39d; --text-3:#5a6560;
    --font-head:'Syne',sans-serif; --font-body:'Outfit',sans-serif; --radius:12px;
  }
  .admin-root { font-family:var(--font-body); }
  .admin-input { width:100%; padding:10px 14px; background:var(--bg-3); border:1px solid var(--border-md); border-radius:8px; color:var(--text); font-family:var(--font-body); font-size:13px; outline:none; transition:border-color 0.2s; }
  .admin-input::placeholder { color:var(--text-3); }
  .admin-input:focus { border-color:var(--accent); }
  .sidebar-item { display:flex; align-items:center; gap:12px; padding:9px 12px; border-radius:var(--radius); cursor:pointer; border:none; width:100%; text-align:left; font-family:var(--font-body); font-size:13px; font-weight:500; transition:background 0.15s, color 0.15s; background:transparent; }
  .sidebar-item:hover { background:rgba(255,255,255,0.05); color:var(--text-2); }
  .sidebar-item.active { background:rgba(34,197,94,0.1); color:var(--accent); }
  .stat-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); padding:20px; cursor:pointer; transition:transform 0.2s, border-color 0.2s, box-shadow 0.2s; text-align:left; width:100%; border:none; font-family:var(--font-body); }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
  .fade-in { animation:fadeUp 0.4s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

const NAV = [
  { id:'dashboard', label:'Dashboard', icon:LayoutDashboard },
  { id:'news',      label:'News',      icon:Newspaper },
  { id:'events',    label:'Events',    icon:CalendarDays },
  { id:'officers',  label:'Officers',  icon:Users },
  { id:'merch',     label:'Merch',     icon:ShoppingBag },
  { id:'redirects', label:'Redirects', icon:Link2 },
  { id:'contacts',  label:'Contacts',  icon:MessageSquare },
];

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#0a0c0b', fontFamily:"'Outfit',sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 64px', borderRight:'1px solid rgba(255,255,255,0.06)' }} className="hidden lg:flex">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Shield size={18} style={{ color:'#22c55e' }} />
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', letterSpacing:'0.05em' }}>SOURCE Admin</span>
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <span style={{ width:24, height:1, background:'#22c55e', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(2rem, 3.5vw, 3rem)', color:'#f0f2f1', lineHeight:1.1, marginBottom:16 }}>
            Manage your content<br />
            <span style={{ color:'#22c55e' }}>with ease.</span>
          </h1>
          <p style={{ color:'#5a6560', fontWeight:300, maxWidth:320, lineHeight:1.75, fontSize:14 }}>
            Full control over news, events, officers, merch, redirects, and messages — all in one place.
          </p>
        </div>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.15)' }}>SOURCE © {new Date().getFullYear()}</p>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:32 }}>
        <div style={{ width:'100%', maxWidth:360 }} className="fade-in">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Shield size={16} style={{ color:'#22c55e' }} />
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'0.9rem' }}>SOURCE Admin</span>
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'1.4rem', marginBottom:4 }}>Welcome back</h2>
          <p style={{ color:'#5a6560', fontSize:13, marginBottom:28 }}>Sign in to continue</p>

          {error && <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, borderRadius:8, padding:'10px 14px', marginBottom:16 }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#5a6560', marginBottom:6 }}>Email</p>
              <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@lsu.edu.ph" />
            </div>
            <div>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#5a6560', marginBottom:6 }}>Password</p>
              <input className="admin-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading?'#22c55e88':'#22c55e', color:'#000', border:'none', borderRadius:8, padding:'12px', fontSize:13, fontWeight:600, cursor: loading?'not-allowed':'pointer', fontFamily:"'Outfit',sans-serif", marginTop:4, transition:'background 0.2s' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background='#28d468')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background='#22c55e')}
            >
              {loading ? <div style={{ width:16, height:16, border:'2px solid rgba(0,0,0,0.4)', borderTopColor:'#000', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <aside style={{ width: collapsed ? 56 : 212, flexShrink:0, background:'#0a0c0b', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', transition:'width 0.3s ease' }}>
      {/* Header */}
      <div style={{ height:54, display:'flex', alignItems:'center', justifyContent: collapsed?'center':'space-between', padding: collapsed?'0':'0 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        {!collapsed && <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'0.9rem', letterSpacing:'0.05em' }}>SOURCE</span>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:'transparent', border:'none', color:'#5a6560', cursor:'pointer', display:'flex', padding:6, borderRadius:8, transition:'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color='#9aa39d'}
          onMouseLeave={(e) => e.currentTarget.style.color='#5a6560'}
        >
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className={`sidebar-item ${active===id?'active':''}`} style={{ color: active===id?'#22c55e':'#5a6560', justifyContent: collapsed?'center':'flex-start' }}>
            <Icon size={15} style={{ flexShrink:0 }} />
            {!collapsed && <><span style={{ flex:1 }}>{label}</span>{active===id && <ChevronRight size={11} style={{ opacity:0.5 }} />}</>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding:'8px 8px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onLogout} className="sidebar-item" style={{ color:'#5a6560', justifyContent: collapsed?'center':'flex-start' }}>
          <LogOut size={15} style={{ flexShrink:0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ setActive }) {
  const [counts, setCounts] = useState({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    ['news','events','officers','merch_items','redirect_links','contact_submissions'].forEach(async (t) => {
      const { count } = await supabase.from(t).select('*', { count:'exact', head:true });
      setCounts((p) => ({ ...p, [t]: count ?? 0 }));
    });
    supabase.from('contact_submissions').select('*',{count:'exact',head:true}).eq('read',false).then(({ count }) => setUnread(count ?? 0));
  }, []);

  const STATS = [
    { label:'News',      key:'news',               icon:Newspaper,   accent:'#60a5fa' },
    { label:'Events',    key:'events',             icon:CalendarDays,accent:'#a78bfa' },
    { label:'Officers',  key:'officers',           icon:Users,       accent:'#22c55e' },
    { label:'Merch',     key:'merch_items',        icon:ShoppingBag, accent:'#fbbf24' },
    { label:'Redirects', key:'redirect_links',     icon:Link2,       accent:'#fb923c' },
    { label:'Messages',  key:'contact_submissions',icon:MessageSquare,accent:'#f87171', badge:true },
  ];

  return (
    <div className="fade-in">
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ width:16, height:1, background:'#22c55e', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Overview</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'1.7rem' }}>Dashboard</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, color:'#5a6560', fontSize:12 }}>
          <TrendingUp size={13} />
          {new Date().toLocaleDateString('en-PH', { weekday:'short', month:'short', day:'numeric' })}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:14 }}>
        {STATS.map(({ label, key, icon:Icon, accent, badge }, i) => (
          <button key={label} onClick={() => setActive(key.replace('_items','').replace('_links','s').replace('contact_submissions','contacts'))} className="stat-card" style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20, cursor:'pointer', textAlign:'left', animationDelay:`${i*45}ms`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-12, right:-12, width:64, height:64, borderRadius:'50%', background:accent, opacity:0.06 }} />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:`${accent}15`, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>
                <Icon size={15} />
              </div>
              {badge && unread > 0 && (
                <span style={{ background:'#ef4444', color:'white', fontSize:10, fontWeight:700, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</span>
              )}
            </div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'1.75rem', color:'#f0f2f1', lineHeight:1 }}>{counts[key] ?? '—'}</p>
            <p style={{ fontSize:12, color:'#5a6560', marginTop:4, fontWeight:500 }}>{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [session, setSession] = useState(undefined);
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_,s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0c0b' }}>
      <div style={{ width:28, height:28, border:'2px solid #22c55e', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!session) return <><style>{S}</style><LoginScreen /></>;

  const sections = { dashboard:<Dashboard setActive={setActive} />, news:<AdminNews />, events:<AdminEvents />, officers:<AdminOfficers />, merch:<AdminMerch />, redirects:<AdminRedirects />, contacts:<AdminContacts /> };

  return (
    <>
      <style>{S}</style>
      <AdminContext.Provider value={{ session }}>
        <div className="admin-root" style={{ display:'flex', height:'100vh', background:'#0d0f0e', overflow:'hidden' }}>
          <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => supabase.auth.signOut()} />
          <main style={{ flex:1, overflowY:'auto', padding:'36px 40px' }}>
            <div style={{ maxWidth:1000 }}>
              {sections[active] || <Dashboard setActive={setActive} />}
            </div>
          </main>
        </div>
      </AdminContext.Provider>
    </>
  );
}
