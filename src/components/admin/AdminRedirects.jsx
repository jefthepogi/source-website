import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import { ExternalLink } from 'lucide-react';

const FIELDS = [
  { name: 'slug', label: 'Slug (URL path)', type: 'text', required: true, placeholder: 'e.g. Git-Webinar (no leading slash)' },
  { name: 'destination_url', label: 'Destination URL', type: 'text', required: true, placeholder: 'https://...' },
  { name: 'label', label: 'Label (for reference)', type: 'text', placeholder: 'e.g. Git Webinar Registration' },
  { name: 'active', label: 'Active', type: 'boolean' },
];

const COLUMNS = [
  {
    key: 'slug', label: 'Slug',
    render: (v) => (
      <span style={{ fontFamily: 'monospace', fontSize: 12, padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#9aa39d' }}>
        /{v}
      </span>
    ),
  },
  { key: 'label', label: 'Label', render: (v) => v || <span style={{ color: '#5a6560' }}>—</span> },
  {
    key: 'destination_url', label: 'Destination',
    render: (v) => (
      <a href={v} target="_blank" rel="noopener noreferrer"
        style={{ color: '#22c55e', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {v} <ExternalLink size={11} style={{ flexShrink: 0 }} />
      </a>
    ),
  },
  { key: 'active', label: 'Status', render: (v) => <span className={v ? 'adm-badge-yes' : 'adm-badge-no'}>{v ? 'Active' : 'Inactive'}</span> },
];

export default function AdminRedirects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('redirect_links').select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <CRUDTable
      title="Redirect Links"
      description="Manage short URLs. Visit lsu-source.org/{slug} to trigger a redirect."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={async (data) => { await supabase.from('redirect_links').insert([{ ...data, active: data.active ?? true }]); fetchData(); }}
      onEdit={async (id, data) => { await supabase.from('redirect_links').update(data).eq('id', id); fetchData(); }}
      onDelete={async (id) => { await supabase.from('redirect_links').delete().eq('id', id); fetchData(); }}
      defaultValues={{ active: true }}
    />
  );
}
