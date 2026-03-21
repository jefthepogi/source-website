import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'News title' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Summary or body text' },
  { name: 'image_url', label: 'Cover Image', type: 'image', folder: 'news', bucket: 'images' },
  { name: 'tag', label: 'Tag', type: 'text', placeholder: 'e.g. Workshop, Announcement' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const COLUMNS = [
  {
    key: 'image_url', label: '',
    render: (v) => (
      <img src={v || 'https://placehold.co/48x48/191c1a/22c55e?text=?'} alt=""
        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
    ),
  },
  { key: 'title', label: 'Title' },
  { key: 'tag', label: 'Tag', render: (v) => v ? <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>{v}</span> : <span style={{ color: '#5a6560' }}>—</span> },
  { key: 'date', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—' },
  {
    key: 'published', label: 'Status',
    render: (v) => <span className={v ? 'adm-badge-yes' : 'adm-badge-no'}>{v ? 'Published' : 'Draft'}</span>,
  },
];

export default function AdminNews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('date', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <CRUDTable
      title="News & Announcements"
      description="Manage news articles shown on the homepage carousel."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={async (data) => { await supabase.from('news').insert([{ ...data, published: data.published ?? false }]); fetchData(); }}
      onEdit={async (id, data) => { await supabase.from('news').update(data).eq('id', id); fetchData(); }}
      onDelete={async (id) => { await supabase.from('news').delete().eq('id', id); fetchData(); }}
      defaultValues={{ published: true }}
      imageFolder="news"
    />
  );
}
