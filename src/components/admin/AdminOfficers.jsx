import React, { useState, useEffect } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'position', label: 'Position', type: 'text', required: true, placeholder: 'e.g. President' },
  { name: 'category', label: 'Category / Committee', type: 'text', required: true, placeholder: 'e.g. Executive Officers' },
  { name: 'image_url', label: 'Photo', type: 'image', folder: 'officers', bucket: 'images' },
  { name: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const COLUMNS = [
  {
    key: 'image_url', label: '',
    render: (v) => <img src={v || 'https://placehold.co/40x40/191c1a/22c55e?text=?'} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />,
  },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'category', label: 'Committee' },
  { key: 'published', label: 'Visible', render: (v) => <span className={v ? 'adm-badge-yes' : 'adm-badge-no'}>{v ? 'Yes' : 'No'}</span> },
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

  return (
    <CRUDTable
      title="Officers"
      description="Manage council members. Upload photos directly or paste a URL."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={async (data) => { await supabase.from('officers').insert([{ ...data, published: data.published ?? true, sort_order: data.sort_order ?? 0 }]); fetchData(); }}
      onEdit={async (id, data) => { await supabase.from('officers').update(data).eq('id', id); fetchData(); }}
      onDelete={async (id) => { await supabase.from('officers').delete().eq('id', id); fetchData(); }}
      defaultValues={{ published: true, sort_order: 0 }}
      imageFolder="officers"
    />
  );
}
