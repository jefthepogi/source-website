import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { UserPlus, Trash2, Shield, ShieldOff, RefreshCw, X, Check, Key, AlertCircle } from 'lucide-react';
import PasswordField from '../../utils/toggle_password';

const ALL_SECTIONS = [
  { id: 'news',      label: 'News' },
  { id: 'events',    label: 'Events' },
  { id: 'officers',  label: 'Officers' },
  { id: 'merch',     label: 'Merch' },
  { id: 'redirects', label: 'Redirects' },
  { id: 'contacts',  label: 'Contacts' },
];

const ROLE_PRESETS = {
  superadmin:      ALL_SECTIONS.map((s) => s.id),
  editor:          ['news', 'events'],
  officer_manager: ['officers'],
  store_manager:   ['merch'],
};

export default function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [showInvitePassword, setInviteShowPassword] = useState(false);
  const [inviteRole, setInviteRole] = useState('editor');
  const [invitePerms, setInvitePerms] = useState(['news', 'events']);
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  // Other state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editPermsFor, setEditPermsFor] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setAdminUsers(data || []);
    setLoading(false);
  };

  const applyPreset = (preset) => {
    setInviteRole(preset);
    setInvitePerms(ROLE_PRESETS[preset] || []);
  };

  const toggleInvitePerm = (id) => {
    setInvitePerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleTogglePassword = (e) => {
    // e.currentTarget always aims at the element where the onClick attribute is defined as oppose to -
    // e.target which gets the sub-element the cursor clicked on
    const wrapper_div = e.currentTarget.parentNode;
    const password_input = wrapper_div.querySelector('.adm-password-input');

    setShowPassword(!showPassword);

    if (showPassword) {
      password_input.type = "password"
    } else {
      password_input.type = "text"
    }
    
  }

  const handleInvite = async () => {
    setInviteError('');
    setInviteSuccess('');

    if (!inviteEmail.trim()) { setInviteError('Email is required.'); return; }
    if (!invitePassword || invitePassword.length < 8) { setInviteError('Password must be at least 8 characters.'); return; }
    if (invitePerms.length === 0) { setInviteError('Select at least one permission.'); return; }

    setInviting(true);
    try {
      // Call your new secure Cloudflare Pages Function
      const res = await fetch('/api/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          password: invitePassword,
          role: inviteRole,
          permissions: invitePerms,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin user.');
      }

      setInviteSuccess(`Admin account created for ${inviteEmail.trim()}. They can log in immediately at /admin.`);
      setInviteEmail('');
      setInvitePassword('');
      applyPreset('editor');
      fetchAdmins();
    } catch (err) {
      setInviteError(err.message || 'Failed to create admin user.');
    } finally {
      setInviting(false);
    }
  };

  const handleDelete = async () => {
    // Remove from admin_users table (removes their access)
    // Note: this does NOT delete from auth.users — the Supabase Auth user still exists.
    // To fully delete, use the Supabase Dashboard → Authentication → Users.
    await supabase.from('admin_users').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    fetchAdmins();
  };

  const savePermissions = async (userId, perms, role) => {
    await supabase.from('admin_users').update({ permissions: perms, role }).eq('id', userId);
    setAdminUsers((prev) => prev.map((u) => u.id === userId ? { ...u, permissions: perms, role } : u));
    setEditPermsFor(null);
  };

  return (
    <>
      
      <div className="ds-root users-root">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <span style={{ width:16, height:1, background:'#22c55e', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Superadmin</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'1.65rem', marginBottom:4 }}>Admin Users</h1>
            <p style={{ color:'#5a6560', fontSize:13 }}>Create Supabase Auth accounts and control which sections each admin can access.</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="adm-btn-ghost" onClick={fetchAdmins}><RefreshCw size={13} /> Refresh</button>
            <button className="adm-btn-primary" onClick={() => { setShowInvite(true); setInviteError(''); setInviteSuccess(''); }}>
              <UserPlus size={14} /> Add Admin
            </button>
          </div>
        </div>

        {/* How it works info */}
        <div className="info-box" style={{ marginBottom:20 }}>
          <strong style={{ color:'#22c55e' }}>How this works:</strong> Clicking "Add Admin" creates a real Supabase Auth user (visible in your Supabase Dashboard → Authentication → Users) and records their section permissions here. The new admin logs in at <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontSize:11 }}>/admin</code> with their email and password. To fully delete an auth account, also remove them from the Supabase Auth dashboard.
        </div>

        {/* Users table */}
        <div style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:48 }}>
              <div style={{ width:24, height:24, border:'2px solid #22c55e', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
            </div>
          ) : adminUsers.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#5a6560' }}>
              <Shield size={32} style={{ margin:'0 auto 12px', opacity:0.25, display:'block' }} />
              <p style={{ fontSize:14 }}>No admin users yet. Click "Add Admin" to create one.</p>
            </div>
          ) : (
            <>
              {/* Head */}
              <div style={{ display:'grid', gridTemplateColumns:'1.6fr 0.9fr 2fr auto', gap:0, padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
                {['Email / Auth', 'Role', 'Section Access', ''].map((h) => (
                  <span key={h} style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#5a6560' }}>{h}</span>
                ))}
              </div>

              {adminUsers.map((user) => {
                const isSelf = currentUser?.email === user.email;
                const isEditing = editPermsFor === user.id;
                return (
                  <div key={user.id} className="user-row" style={{ padding:'14px 20px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1.6fr 0.9fr 2fr auto', gap:0, alignItems:'center' }}>
                      {/* Email */}
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                          <p style={{ fontSize:13, color:'#f0f2f1', fontWeight:500 }}>{user.email}</p>
                          {isSelf && <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:100, background:'rgba(34,197,94,0.12)', color:'#22c55e' }}>You</span>}
                        </div>
                        <p style={{ fontSize:11, color:'#5a6560', marginTop:3 }}>
                          Added {new Date(user.created_at).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' })}
                        </p>
                        {/* Supabase Auth status indicator */}
                        <p style={{ fontSize:11, color:'#5a6560', marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
                          <span style={{ width:6, height:6, borderRadius:'50%', background:user.user_id ? '#22c55e' : '#f87171', display:'inline-block', flexShrink:0 }} />
                          {user.user_id ? 'Auth linked' : 'No auth user linked'}
                        </p>
                      </div>

                      {/* Role */}
                      <div>
                        <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:100, textTransform:'capitalize',
                          background: user.role === 'superadmin' ? 'rgba(251,191,36,0.12)' : 'rgba(34,197,94,0.1)',
                          color: user.role === 'superadmin' ? '#fbbf24' : '#86efac',
                        }}>
                          {user.role === 'superadmin' ? '⭐ ' : ''}{user.role?.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Permissions */}
                      <div>
                        {isEditing ? (
                          <EditPerms user={user} onSave={(p, r) => savePermissions(user.id, p, r)} onCancel={() => setEditPermsFor(null)} />
                        ) : (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                            {(user.permissions || []).length === 0
                              ? <span style={{ fontSize:12, color:'#5a6560' }}>No access</span>
                              : (user.permissions || []).map((p) => (
                                  <span key={p} className="perm-chip on" style={{ cursor:'default' }}>
                                    {ALL_SECTIONS.find((s) => s.id === p)?.label || p}
                                  </span>
                                ))
                            }
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                        {!isEditing && !isSelf && (
                          <>
                            <button className="adm-icon-btn edit" title="Edit permissions" onClick={() => setEditPermsFor(user.id)}><Key size={14} /></button>
                            <button className="adm-icon-btn del" title="Remove admin access" onClick={() => setDeleteTarget(user)}><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Invite modal ── */}
        {showInvite && (
          <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', padding:16 }}
            onClick={(e) => e.target === e.currentTarget && setShowInvite(false)}>
            <div className="fade-in" style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1' }}>Add Admin User</p>
                <button onClick={() => setShowInvite(false)} style={{ background:'transparent', border:'none', color:'#5a6560', cursor:'pointer', display:'flex' }}><X size={16} /></button>
              </div>

              <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>

                {/* Info */}
                <div className="info-box">
                  This creates a <strong style={{ color:'#f0f2f1' }}>real Supabase Auth account</strong> using your service role key — no confirmation email is sent. The new admin will appear in Supabase Dashboard → Authentication → Users.
                </div>

                {inviteError && (
                  <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', fontSize:12, borderRadius:8, padding:'10px 14px', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }} /> {inviteError}
                  </div>
                )}

                {inviteSuccess && (
                  <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', color:'#86efac', fontSize:12, borderRadius:8, padding:'10px 14px', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <Check size={14} style={{ flexShrink:0, marginTop:1 }} /> {inviteSuccess}
                  </div>
                )}

                <div>
                  <label className="adm-label">Email</label>
                  <input className="invite-input" type="email" placeholder="newadmin@lsu.edu.ph" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                </div>

                <div>
                  <label className="adm-label">Password</label>
                  <PasswordField>
                    <input className="invite-input" type="password" placeholder="Min. 8 characters" value={invitePassword} onChange={(e) => setInvitePassword(e.target.value)} />
                  </PasswordField>
                  <p style={{ fontSize:11, color:'#5a6560', marginTop:5 }}>Share this password with the new admin securely. They can change it later.</p>
                </div>  

                <div>
                  <label className="adm-label">Role Preset</label>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {Object.keys(ROLE_PRESETS).map((r) => (
                      <button key={r} onClick={() => applyPreset(r)}
                        style={{ padding:'5px 12px', borderRadius:100, fontSize:12, cursor:'pointer', border:'none', fontFamily:"'Outfit',sans-serif", textTransform:'capitalize', transition:'all 0.15s',
                          background: inviteRole === r ? '#22c55e' : 'rgba(255,255,255,0.06)',
                          color: inviteRole === r ? '#000' : '#9aa39d',
                          fontWeight: inviteRole === r ? 600 : 400,
                        }}>
                        {r.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize:11, color:'#5a6560', marginTop:6 }}>Presets auto-select sections below. You can customize them manually.</p>
                </div>

                <div>
                  <label className="adm-label">Section Access</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {ALL_SECTIONS.map(({ id, label }) => {
                      const on = invitePerms.includes(id);
                      return (
                        <button key={id} onClick={() => toggleInvitePerm(id)} className={`perm-chip ${on ? 'on' : 'off'}`}>
                          {on ? <Check size={10} /> : null}{label}
                        </button>
                      );
                    })}
                  </div>
                  <p style={{ fontSize:11, color:'#5a6560', marginTop:8 }}>The admin will only see sections checked above in their sidebar.</p>
                </div>

                <div className="info-box" style={{marginTop:0}}>
                  ✓ The account will be <strong style={{color:'#22c55e'}}>immediately active</strong> — no email confirmation required. The admin can log in at <code style={{background:'rgba(255,255,255,0.08)',padding:'1px 5px',borderRadius:4,fontSize:11}}>/admin</code> right away.
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'14px 24px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <button className="adm-btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
                <button className="adm-btn-primary" onClick={handleInvite} disabled={inviting}>
                  {inviting
                    ? <div style={{ width:14, height:14, border:'2px solid rgba(0,0,0,0.4)', borderTopColor:'#000', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                    : <UserPlus size={14} />
                  }
                  Create Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete confirm ── */}
        {deleteTarget && (
          <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', padding:16 }}>
            <div className="fade-in" style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, width:'100%', maxWidth:360, padding:'32px', textAlign:'center' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <ShieldOff size={22} style={{ color:'#f87171' }} />
              </div>
              <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', marginBottom:6 }}>Remove Admin Access?</p>
              <p style={{ color:'#9aa39d', fontSize:13, marginBottom:6 }}>{deleteTarget.email}</p>
              <p style={{ color:'#5a6560', fontSize:12, marginBottom:20, lineHeight:1.65 }}>
                This removes their section permissions from SOURCE admin. Their Supabase Auth account (<code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px', borderRadius:4 }}>auth.users</code>) is <strong style={{ color:'#f0f2f1' }}>not deleted</strong> — remove that separately in the Supabase Dashboard if needed.
              </p>
              <div style={{ display:'flex', gap:10 }}>
                <button className="adm-btn-ghost" style={{ flex:1, justifyContent:'center' }} onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button onClick={handleDelete}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#ef4444', color:'white', border:'none', borderRadius:8, padding:'9px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  Remove Access
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Inline permission editor ───────────────────────────────────────────────
function EditPerms({ user, onSave, onCancel }) {
  const [perms, setPerms] = useState(user.permissions || []);
  const [role, setRole] = useState(user.role || 'editor');

  const toggle = (id) => setPerms((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <select value={role} onChange={(e) => setRole(e.target.value)}
        style={{ padding:'5px 10px', background:'#191c1a', border:'1px solid rgba(255,255,255,0.11)', borderRadius:7, color:'#f0f2f1', fontFamily:"'Outfit',sans-serif", fontSize:12, outline:'none', width:'fit-content', cursor:'pointer' }}>
        {Object.keys(ROLE_PRESETS).map((r) => (
          <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
        {ALL_SECTIONS.map(({ id, label }) => (
          <button key={id} onClick={() => toggle(id)} className={`perm-chip ${perms.includes(id) ? 'on' : 'off'}`}>
            {perms.includes(id) ? <Check size={9} /> : null}{label}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', gap:6, marginTop:2 }}>
        <button onClick={() => onSave(perms, role)}
          style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#22c55e', color:'#000', border:'none', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
          <Check size={11} /> Save
        </button>
        <button onClick={onCancel}
          style={{ display:'inline-flex', alignItems:'center', gap:5, background:'transparent', color:'#5a6560', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'5px 12px', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
