import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';

const FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
  { name: 'event_date', label: 'Date', type: 'date' },
  { name: 'event_time', label: 'Time', type: 'text', placeholder: 'e.g. 9:00 AM – 12:00 PM' },
  { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. CCSEA AVR' },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['Workshop', 'Webinar', 'Social', 'Competition', 'General'],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['upcoming', 'ongoing', 'past'],
  },
  { name: 'registration_link', label: 'Registration Link', type: 'text', placeholder: 'https://...' },
  { name: 'published', label: 'Published', type: 'boolean' },
];

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  {
    key: 'event_date',
    label: 'Date',
    render: (v) => v ? new Date(v).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (v) => {
      const colors = { upcoming: 'bg-blue-100 text-blue-700', ongoing: 'bg-green-100 text-green-700', past: 'bg-gray-100 text-gray-500' };
      return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colors[v] || colors.past}`}>{v}</span>
      );
    },
  },
  {
    key: 'published',
    label: 'Visible',
    render: (v) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {v ? 'Yes' : 'No'}
      </span>
    ),
  },
];

export default function AdminEvents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async (data) => {
    await supabase.from('events').insert([{ ...data, published: data.published ?? true, status: data.status || 'upcoming' }]);
    fetch();
  };

  const handleEdit = async (id, data) => {
    await supabase.from('events').update(data).eq('id', id);
    fetch();
  };

  const handleDelete = async (id) => {
    await supabase.from('events').delete().eq('id', id);
    fetch();
  };

  return (
    <CRUDTable
      title="Events"
      description="Manage workshops, webinars, competitions, and social events."
      columns={COLUMNS}
      fields={FIELDS}
      rows={rows}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      defaultValues={{ published: true, status: 'upcoming', category: 'General' }}
    />
  );
}
