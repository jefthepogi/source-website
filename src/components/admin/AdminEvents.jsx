import React, { useState, useEffect } from 'react';
import { Images, Upload, Trash2, X } from 'lucide-react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import {
  uploadImageToImageKit,
  deleteImageFromImageKit
} from '../../utils/imagekit';

const FIELDS = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'slug',label: 'Slug', type: 'text', required: true, placeholder: 'e.g. cpp-bootcamp'},
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

export default function AdminEvents({ startInAdd, onIntentConsumed } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [galleryEvent, setGalleryEvent] = useState(null);

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

  const handleAdd = async (data) => {
    const slug = (data.slug || data.title || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
    const { error } = await supabase
      .from('events')
      .insert([{
        ...data,
        slug,
        published: data.published ?? true,
        status: data.status || 'upcoming'
      }]);
  
    if (error) throw error;
  
    fetchData();
  }

  // created handlers for both edit and delete to manage the proper deletion of imagekit files
  const handleEdit = async (id, data) => {
    const slug = (data.slug || data.title || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
    const { error } = await supabase
      .from('events')
      .update({
        ...data,
        slug
      })
      .eq('id', id);
  
    if (error) throw error;
  
    fetchData();
  };
  
  const handleDelete = async (id) => {
  // Get gallery ImageKit file IDs before deleting the event
  const { data: galleryImages, error: galleryError } =
    await supabase
      .from('event_images')
      .select('image_file_id')
      .eq('event_id', id);

  if (galleryError) throw galleryError;

  // Delete the event
  // event_images rows will automatically cascade-delete
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Delete gallery files from ImageKit
  for (const image of galleryImages || []) {
    if (image.image_file_id) {
      await deleteImageFromImageKit(
        image.image_file_id
      );
    }
  }

  fetchData();
  };

  const columns = [
  ...COLUMNS,
  {
    key: 'gallery',
    label: 'Gallery',

    render: (_, row) => (
      <button
        type="button"
        className="adm-btn-ghost"
        onClick={() => setGalleryEvent(row)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <Images size={13} />
        Images
      </button>
    )
  }
  ];


  // changed the onAdd and onEdit. Format the slug before inserting or updating the event
  return (
    <>
      <CRUDTable
        title="Events"
        description="Manage workshops, webinars, competitions, and social events."
        columns={columns}
        fields={FIELDS}
        rows={rows}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        defaultValues={{ published: true, status: 'upcoming', category: 'General' }}
        imageFolder="events"
        startInAdd={startInAdd}
        onIntentConsumed={onIntentConsumed}
      />
      {galleryEvent && (
        <EventGalleryManager
          event={galleryEvent}
          onClose={() => setGalleryEvent(null)}
        />
      )}
    </>
  );

    function EventGalleryManager({ event, onClose }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchImages = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('event_images')
        .select('*')
        .eq('event_id', event.id)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error(
          'Failed to load event gallery:',
          error
        );
      }

      setImages(data || []);
      setLoading(false);
    };

    useEffect(() => {
      fetchImages();
    }, [event.id]);

    const handleUpload = async (files) => {
      if (!files?.length) return;

      setUploading(true);

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          const uploaded =
            await uploadImageToImageKit(
              file,
              `lsu-source-web/events/gallery/${event.id}`
            );

          const { error } = await supabase
            .from('event_images')
            .insert([
              {
                event_id: event.id,
                image_url: uploaded.url,
                image_file_id: uploaded.fileId,
                sort_order: images.length + i
              }
            ]);

          // If database insert fails,
          // remove the ImageKit upload again
          if (error) {
            await deleteImageFromImageKit(
              uploaded.fileId
            );

            throw error;
          }
        }

        await fetchImages();

      } catch (error) {
        console.error(
          'Gallery upload failed:',
          error
        );

        alert(
          error.message ||
          'Gallery upload failed.'
        );

      } finally {
        setUploading(false);
      }
    };

    const handleDelete = async (image) => {
      try {
        // Delete DB record first
        const { error } = await supabase
          .from('event_images')
          .delete()
          .eq('id', image.id);

        if (error) throw error;

        // Then remove actual ImageKit file
        if (image.image_file_id) {
          await deleteImageFromImageKit(
            image.image_file_id
          );
        }

        await fetchImages();

      } catch (error) {
        console.error(
          'Failed to delete gallery image:',
          error
        );

        alert(
          error.message ||
          'Failed to delete gallery image.'
        );
      }
    };

    return (
      <div
        className="adm-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) { onClose(); } }}
      >
        <div
          className="adm-modal modal-in"
          style={{
            width: '95%',
            maxWidth: 800
          }}
        >
          {/* Header */}
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <p
                style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)' }}
              >
                Event Gallery
              </p>

              <p
                style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 3 }}
              >
                {event.title}
              </p>
            </div>

            <button
              type="button"
              className="adm-icon-btn edit"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 24 }}>
            {/* Upload Button */}
            <label
              className="adm-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploading ? 'not-allowed' : 'pointer', marginBottom: 20 }}
            >
              <Upload size={14} />

              {uploading
                ? 'Uploading...'
                : 'Add Images'}

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => { const files = Array.from( e.target.files || [] ); handleUpload(files); e.target.value = ''; }}
              />
            </label>

            {/* Loading */}
            {loading ? (
              <div
              style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-3)' }}
              >
                Loading gallery...
              </div>

            ) : images.length === 0 ? (

              /* Empty */
              <div
            style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-3)' }}
              >
                <Images
                  size={34}
                style={{ marginBottom: 10, opacity: 0.5 }}
                />

                <p>No gallery images yet.</p>
              </div>

            ) : (

              /* Gallery */
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}
              >
                {images.map((image) => (
                  <div
                    key={image.id}
                 style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: 10, border: '1px solid var(--border)' }}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(image)
                      }
                      title="Delete image"
                      style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.72)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
