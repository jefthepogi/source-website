import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'News title' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Summary or body text' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
  { name: 'tag', label: 'Tag', type: 'text', placeholder: 'e.g. Workshop, Announcement' },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'tag', label: 'Tag' },
  {
    key: 'date',
    label: 'Date',
    render: (v) => v ? new Date(v).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
  {
    key: 'published',
    label: 'Status',
    render: (v) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {v ? 'Published' : 'Draft'}
      </span>
    ),
  },
];

export default function AdminNews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('news').select('*').order('date', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async (data) => {
    await supabase.from('news').insert([{ ...data, published: data.published ?? false }]);
    fetch();
  };

  const handleEdit = async (id, data) => {
    await supabase.from('news').update(data).eq('id', id);
    fetch();
  };

  const handleDelete = async (id) => {
    await supabase.from('news').delete().eq('id', id);
    fetch();
  };

  return (
    <CRUDTable
      title="News & Announcements"
      description="Manage news articles shown on the homepage carousel."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      defaultValues={{ published: true }}
    />
  );
}
