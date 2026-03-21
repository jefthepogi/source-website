import React, { useState, useEffect } from 'react';
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
    key: 'slug',
    label: 'Slug',
    render: (v) => (
      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
        /{v}
      </span>
    ),
  },
  { key: 'label', label: 'Label' },
  {
    key: 'destination_url',
    label: 'Destination',
    render: (v) => (
      <a
        href={v}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#087830] hover:underline flex items-center gap-1 max-w-xs truncate"
      >
        {v} <ExternalLink size={12} className="shrink-0" />
      </a>
    ),
  },
  {
    key: 'active',
    label: 'Active',
    render: (v) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {v ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

export default function AdminRedirects() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('redirect_links').select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async (data) => {
    await supabase.from('redirect_links').insert([{ ...data, active: data.active ?? true }]);
    fetch();
  };

  const handleEdit = async (id, data) => {
    await supabase.from('redirect_links').update(data).eq('id', id);
    fetch();
  };

  const handleDelete = async (id) => {
    await supabase.from('redirect_links').delete().eq('id', id);
    fetch();
  };

  return (
    <CRUDTable
      title="Redirect Links"
      description={`Manage short URLs. Visit lsu-source.org/{slug} to trigger a redirect.`}
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      defaultValues={{ active: true }}
    />
  );
}
