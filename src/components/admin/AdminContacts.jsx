import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MailOpen, Trash2, RefreshCw } from 'lucide-react';
import { DeleteConfirm } from './CRUDTable';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

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
    fetch();
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'unread') return !s.read;
    if (filter === 'read') return s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Contact Submissions
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Messages from the contact form.</p>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'unread', 'read'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === f ? 'bg-[#087830] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#087830]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        {/* List */}
        <div className="w-full md:w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-4 border-[#087830] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            filtered.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSelect(sub)}
                className={`w-full text-left px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  selected?.id === sub.id ? 'bg-green-50 border-l-2 border-l-[#087830]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {sub.read ? (
                      <MailOpen size={14} className="text-gray-400 shrink-0" />
                    ) : (
                      <Mail size={14} className="text-[#087830] shrink-0" />
                    )}
                    <span className={`text-sm truncate ${sub.read ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>
                      {sub.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {new Date(sub.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {sub.subject && (
                  <p className="text-xs text-gray-400 truncate mt-0.5 ml-5">{sub.subject}</p>
                )}
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selected.subject || '(No subject)'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    From <span className="font-medium text-gray-700">{selected.name}</span>
                    {' '}·{' '}
                    <a href={`mailto:${selected.email}`} className="text-[#087830] hover:underline">
                      {selected.email}
                    </a>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(selected.created_at).toLocaleString('en-PH', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                className="mt-4 inline-flex items-center gap-2 bg-[#087830] hover:bg-[#065d24] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
              <Mail size={40} className="mb-3 opacity-30" />
              <p className="font-medium">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
