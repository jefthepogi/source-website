import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Cover Image', type: 'image', folder: 'events', bucket: 'images' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'text', placeholder: 'e.g. 9:00 AM – 12:00 PM' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. CCSEA AVR' },
  { name: 'category', label: 'Category', type: 'select', options: ['Workshop', 'Webinar', 'Social', 'Competition', 'General'] },
  { name: 'status', label: 'Status', type: 'select', options: ['upcoming', 'ongoing', 'past'] },
  { name: 'registration_link', label: 'Registration Link', type: 'text', placeholder: 'https://...' },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const STATUS_STYLE = {
  upcoming: { bg: 'rgba(96,165,250,0.12)', color: '#93c5fd' },
  ongoing:  { bg: 'rgba(34,197,94,0.12)',  color: '#86efac' },
  past:     { bg: 'rgba(255,255,255,0.06)', color: '#9aa39d' },
};

const COLUMNS = [
  {
    key: 'image_url', label: '',
    render: (v) => <img src={v || 'https://placehold.co/48x48/191c1a/22c55e?text=?'} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />,
  },
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category', render: (v) => v || <span style={{ color: '#5a6560' }}>—</span> },
  { key: 'event_date', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—' },
  {
    key: 'status', label: 'Status',
    render: (v) => {
      const s = STATUS_STYLE[v] || STATUS_STYLE.past;
      return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.color, textTransform: 'capitalize' }}>{v || '—'}</span>;
    },
  },
  { key: 'published', label: 'Visible', render: (v) => <span className={v ? 'adm-badge-yes' : 'adm-badge-no'}>{v ? 'Yes' : 'No'}</span> },
];

export default function AdminEvents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*');
    // Sort: ongoing first, then upcoming (soonest first), then past (most recent first)
    const order = { ongoing: 0, upcoming: 1, past: 2 };
    const sorted = (data || []).sort((a, b) => {
      const statusDiff = (order[a.status] ?? 1) - (order[b.status] ?? 1);
      if (statusDiff !== 0) return statusDiff;
      const da = a.event_date ? new Date(a.event_date) : new Date(0);
      const db = b.event_date ? new Date(b.event_date) : new Date(0);
      return a.status === 'past' ? db - da : da - db;
    });
    setRows(sorted);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <CRUDTable
      title="Events"
      description="Manage workshops, webinars, competitions, and social events."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={async (data) => { await supabase.from('events').insert([{ ...data, published: data.published ?? true, status: data.status || 'upcoming' }]); fetchData(); }}
      onEdit={async (id, data) => { await supabase.from('events').update(data).eq('id', id); fetchData(); }}
      onDelete={async (id) => { await supabase.from('events').delete().eq('id', id); fetchData(); }}
      defaultValues={{ published: true, status: 'upcoming', category: 'General' }}
      imageFolder="events"
    />
  );
}
