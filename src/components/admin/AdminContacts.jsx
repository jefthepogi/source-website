import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { Mail, MailOpen, Trash2, RefreshCw } from 'lucide-react';
import { DeleteConfirm, DS } from './CRUDTable';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const markRead = async (id) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, read: true } : s));
  };

  const handleSelect = (sub) => {
    setSelected(sub);
    if (!sub.read) markRead(sub.id);
  };

  const handleDelete = async () => {
    await supabase.from('contact_submissions').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    if (selected?.id === deleteTarget.id) setSelected(null);
    fetchData();
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'unread') return !s.read;
    if (filter === 'read') return s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <>
      
      <div className="admin-root">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 16, height: 1, background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Inbox</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1.65rem' }}>
                Contact Submissions
              </h1>
              {unreadCount > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <p style={{ color: '#5a6560', fontSize: 13 }}>Messages from the contact form.</p>
          </div>
          <button className="adm-btn-ghost" onClick={fetchData}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {['all', 'unread', 'read'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", textTransform: 'capitalize', transition: 'all 0.15s',
                background: filter === f ? '#22c55e' : 'rgba(255,255,255,0.06)',
                color: filter === f ? '#000' : '#9aa39d',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Split pane */}
        <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 280px)', minHeight: 400 }}>
          {/* List */}
          <div style={{ width: 260, flexShrink: 0, background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div style={{ width: 22, height: 22, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 16px', color: '#5a6560' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>📭</p>
                <p style={{ fontSize: 13 }}>No messages</p>
              </div>
            ) : (
              filtered.map((sub) => (
                <button key={sub.id} onClick={() => handleSelect(sub)}
                  style={{ width: '100%', textAlign: 'left', padding: '13px 16px', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background 0.15s',
                    background: selected?.id === sub.id ? 'rgba(34,197,94,0.08)' : 'transparent',
                    borderLeft: selected?.id === sub.id ? '2px solid #22c55e' : '2px solid transparent',
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== sub.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={(e) => { if (selected?.id !== sub.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                      {sub.read
                        ? <MailOpen size={13} style={{ color: '#5a6560', flexShrink: 0 }} />
                        : <Mail size={13} style={{ color: '#22c55e', flexShrink: 0 }} />
                      }
                      <span style={{ fontSize: 13, fontWeight: sub.read ? 400 : 600, color: sub.read ? '#9aa39d' : '#f0f2f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.name}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: '#5a6560', flexShrink: 0 }}>
                      {new Date(sub.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {sub.subject && (
                    <p style={{ fontSize: 11, color: '#5a6560', marginTop: 3, paddingLeft: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.subject}</p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Detail pane */}
          <div style={{ flex: 1, background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflowY: 'auto' }}>
            {selected ? (
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1.1rem', marginBottom: 6 }}>
                      {selected.subject || '(No subject)'}
                    </h2>
                    <p style={{ fontSize: 13, color: '#9aa39d' }}>
                      From <strong style={{ color: '#f0f2f1' }}>{selected.name}</strong>
                      {' · '}
                      <a href={`mailto:${selected.email}`} style={{ color: '#22c55e', textDecoration: 'none' }}>{selected.email}</a>
                    </p>
                    <p style={{ fontSize: 11, color: '#5a6560', marginTop: 4 }}>
                      {new Date(selected.created_at).toLocaleString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button className="adm-icon-btn del" onClick={() => setDeleteTarget(selected)}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
                  <p style={{ color: '#c8ccc9', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
                </div>

                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#22c55e', color: '#000', textDecoration: 'none', fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, padding: '9px 18px', borderRadius: 8 }}>
                  <Mail size={13} /> Reply via Email
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#5a6560', textAlign: 'center', padding: 32 }}>
                <Mail size={36} style={{ opacity: 0.25 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>Select a message to read</p>
              </div>
            )}
          </div>
        </div>

        {deleteTarget && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      </div>
    </>
  );
}
