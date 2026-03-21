import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import '../admin.css'; // ← single shared stylesheet
import {
  LayoutDashboard, Newspaper, CalendarDays, Users, ShoppingBag,
  Link2, MessageSquare, LogOut, Menu, Shield, TrendingUp, X
} from 'lucide-react';
import AdminNews      from './admin/AdminNews';
import AdminEvents    from './admin/AdminEvents';
import AdminOfficers  from './admin/AdminOfficers';
import AdminMerch     from './admin/AdminMerch';
import AdminRedirects from './admin/AdminRedirects';
import AdminContacts  from './admin/AdminContacts';
import AdminUsers     from './admin/AdminUsers';

// ── Context ───────────────────────────────────────────────────────────────────
const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

// All possible nav items — visibility is filtered by user permissions
const ALL_NAV = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard, alwaysVisible: true },
  { id: 'news',       label: 'News',        icon: Newspaper },
  { id: 'events',     label: 'Events',      icon: CalendarDays },
  { id: 'officers',   label: 'Officers',    icon: Users },
  { id: 'merch',      label: 'Merch',       icon: ShoppingBag },
  { id: 'redirects',  label: 'Redirects',   icon: Link2 },
  { id: 'contacts',   label: 'Contacts',    icon: MessageSquare },
  { id: 'users',      label: 'Admin Users', icon: Shield, superadminOnly: true },
];

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0c0b', fontFamily: 'var(--font-body)' }}>
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex" style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '48px 64px', borderRight: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} style={{ color: 'var(--accent)' }} />
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', letterSpacing: '0.05em' }}>SOURCE Admin</span>
        </div>
        <div>
          <p className="adm-section-tag">Admin Panel</p>
          <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', lineHeight: 1.1, marginBottom: 16 }}>
            Manage your content<br />
            <span style={{ color: 'var(--accent)' }}>with ease.</span>
          </h1>
          <p style={{ color: 'var(--text-3)', fontWeight: 300, maxWidth: 320, lineHeight: 1.75, fontSize: 14 }}>
            Full control over news, events, officers, merch, redirects, and messages — all in one place.
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>SOURCE © {new Date().getFullYear()}</p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Shield size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>SOURCE Admin</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', fontSize: '1.4rem', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 28 }}>Sign in to continue</p>

          {error && <div className="adm-error" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="adm-label">Email</label>
              <input className="adm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@lsu.edu.ph" />
            </div>
            <div>
              <label className="adm-label">Password</label>
              <input className="adm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="adm-btn-primary" style={{ marginTop: 4, width: '100%' }}>
              {loading ? <div className="spin-anim" style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.4)', borderTopColor: '#000', borderRadius: '50%' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar (desktop only) ────────────────────────────────────────────────────
function Sidebar({ navItems, active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <aside
      className="admin-sidebar"
      style={{ width: collapsed ? 56 : 212, flexShrink: 0, background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)', flexDirection: 'column', transition: 'width 0.3s ease' }}
    >
      {/* Header */}
      <div style={{ height: 54, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '0' : '0 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {!collapsed && (
          <a href="/" style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem', letterSpacing: '0.05em', textDecoration: 'none' }}>
            SOURCE
          </a>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="adm-icon-btn edit">
          {collapsed ? <Menu size={15} /> : <X size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`sidebar-item ${active === id ? 'active' : ''}`}
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          >
            <Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px 8px 12px', borderTop: '1px solid var(--border)' }}>
        <button onClick={onLogout} className="sidebar-item" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Mobile bottom nav ─────────────────────────────────────────────────────────
function BottomNav({ navItems, active, setActive, onLogout }) {
  // Show max 5 items + logout in bottom nav to avoid overflow
  const visible = navItems.slice(0, 5);
  const hasMore  = navItems.length > 5;

  return (
    <div className="admin-bottom-nav">
      <div className="admin-bottom-nav-inner">
        {visible.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className={`admin-bottom-btn ${active === id ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
        {hasMore && (
          <button className="admin-bottom-btn" onClick={() => {
            // Cycle through remaining items
            const remaining = navItems.slice(5);
            const nextIdx = remaining.findIndex(n => n.id === active);
            setActive(remaining[(nextIdx + 1) % remaining.length]?.id || remaining[0].id);
          }}>
            <Menu size={20} />
            <span>More</span>
          </button>
        )}
        <button className="admin-bottom-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ setActive, permissions, isSuperadmin }) {
  const [counts, setCounts] = useState({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const tables = ['news', 'events', 'officers', 'merch_items', 'redirect_links', 'contact_submissions'];
    tables.forEach(async (t) => {
      const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
      setCounts((p) => ({ ...p, [t]: count ?? 0 }));
    });
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('read', false)
      .then(({ count }) => setUnread(count ?? 0));
  }, []);

  const ALL_STATS = [
    { label: 'News',      key: 'news',                section: 'news',      icon: Newspaper,    accent: '#60a5fa' },
    { label: 'Events',    key: 'events',              section: 'events',    icon: CalendarDays, accent: '#a78bfa' },
    { label: 'Officers',  key: 'officers',            section: 'officers',  icon: Users,        accent: '#22c55e' },
    { label: 'Merch',     key: 'merch_items',         section: 'merch',     icon: ShoppingBag,  accent: '#fbbf24' },
    { label: 'Redirects', key: 'redirect_links',      section: 'redirects', icon: Link2,        accent: '#fb923c' },
    { label: 'Messages',  key: 'contact_submissions', section: 'contacts',  icon: MessageSquare,accent: '#f87171', badge: true },
  ];

  // Only show stat cards for sections the user has access to
  const stats = ALL_STATS.filter(s => isSuperadmin || permissions.includes(s.section));

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="adm-section-tag">Overview</p>
          <h1 className="adm-h1">Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-3)', fontSize: 12 }}>
          <TrendingUp size={13} />
          {new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="stat-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
        {stats.map(({ label, key, section, icon: Icon, accent, badge }, i) => (
          <button
            key={label}
            onClick={() => setActive(section)}
            className="stat-card"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', animationDelay: `${i * 45}ms` }}
          >
            <div style={{ position: 'absolute', top: -12, right: -12, width: 64, height: 64, borderRadius: '50%', background: accent, opacity: 0.06 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                <Icon size={15} />
              </div>
              {badge && unread > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', lineHeight: 1 }}>{counts[key] ?? '—'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, fontWeight: 500 }}>{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [session,     setSession]     = useState(undefined);
  const [adminRecord, setAdminRecord] = useState(null); // row from admin_users
  const [loadingRole, setLoadingRole] = useState(true);
  const [active,      setActive]      = useState('dashboard');
  const [collapsed,   setCollapsed]   = useState(false);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Fetch the admin_users record for the logged-in user to get their permissions
  useEffect(() => {
    if (!session?.user) { setAdminRecord(null); setLoadingRole(false); return; }
    setLoadingRole(true);
    supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle()
      .then(({ data }) => {
        setAdminRecord(data);
        setLoadingRole(false);
      });
  }, [session]);

  const handleLogout = () => supabase.auth.signOut();

  // ── Loading ──
  if (session === undefined || (session && loadingRole)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0c0b' }}>
        <div className="spin-anim" style={{ width: 28, height: 28, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  // ── Permissions ──
  const isSuperadmin = !adminRecord || adminRecord?.role === 'superadmin';
  const permissions  = isSuperadmin ? ALL_NAV.map(n => n.id) : (adminRecord?.permissions || []);

  // Build visible nav based on permissions
  const navItems = ALL_NAV.filter(({ id, alwaysVisible, superadminOnly }) => {
    if (alwaysVisible) return true;
    if (superadminOnly) return isSuperadmin;
    return isSuperadmin || permissions.includes(id);
  });

  // Guard: if current active section is not permitted, reset to dashboard
  const effectiveActive = navItems.find(n => n.id === active) ? active : 'dashboard';

  const SECTIONS = {
    dashboard: <Dashboard setActive={setActive} permissions={permissions} isSuperadmin={isSuperadmin} />,
    news:      <AdminNews />,
    events:    <AdminEvents />,
    officers:  <AdminOfficers />,
    merch:     <AdminMerch />,
    redirects: <AdminRedirects />,
    contacts:  <AdminContacts />,
    users:     <AdminUsers />,
  };

  return (
    <AdminContext.Provider value={{ session, isSuperadmin, permissions }}>
      <div className="admin-root" style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>

        {/* Desktop sidebar */}
        <Sidebar
          navItems={navItems}
          active={effectiveActive}
          setActive={setActive}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="admin-main" style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>
          <div style={{ maxWidth: 1080 }}>
            {SECTIONS[effectiveActive] || <Dashboard setActive={setActive} permissions={permissions} isSuperadmin={isSuperadmin} />}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <BottomNav
          navItems={navItems}
          active={effectiveActive}
          setActive={setActive}
          onLogout={handleLogout}
        />
      </div>
    </AdminContext.Provider>
  );
}
