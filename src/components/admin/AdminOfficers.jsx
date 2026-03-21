import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'position', label: 'Position', type: 'text', required: true, placeholder: 'e.g. President' },
  { name: 'category', label: 'Category / Committee', type: 'text', required: true, placeholder: 'e.g. Executive Officers' },
  { name: 'image_url', label: 'Photo URL', type: 'text', placeholder: 'https://... (Supabase Storage URL)' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const COLUMNS = [
  {
    key: 'image_url',
    label: '',
    render: (v) => (
      <img
        src={v || 'https://placehold.co/40x40/191c1a/22c55e?text=?'}
        alt=""
        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
      />
    ),
  },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'category', label: 'Committee' },
  {
    key: 'published',
    label: 'Visible',
    render: (v) => (
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
        background: v ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
        color: v ? '#22c55e' : '#5a6560',
      }}>
        {v ? 'Yes' : 'No'}
      </span>
    ),
  },
];

export default function AdminOfficers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('officers').select('*').order('sort_order');
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (data) => {
    await supabase.from('officers').insert([{ ...data, published: data.published ?? true, sort_order: data.sort_order ?? 0 }]);
    fetchData();
  };

  const handleEdit = async (id, data) => {
    await supabase.from('officers').update(data).eq('id', id);
    fetchData();
  };

  const handleDelete = async (id) => {
    await supabase.from('officers').delete().eq('id', id);
    fetchData();
  };

  return (
    <CRUDTable
      title="Officers"
      description="Manage council members. Upload photos to Supabase Storage and paste the public URL."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      defaultValues={{ published: true, sort_order: 0 }}
    />
  );
}
