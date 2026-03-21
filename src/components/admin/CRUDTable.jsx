import React, { useState, useRef } from 'react';
import { Pencil, Trash2, Plus, X, Check, AlertTriangle, Upload, Link, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../admin.css';

// DS is kept as a no-op export so existing imports don't break
export const DS = '';

// ── Image Upload Field ────────────────────────────────────────────────────────
export function ImageUploadField({ value, onChange, bucket = 'images', folder = '' }) {
  const [mode,      setMode]      = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const [preview,   setPreview]   = useState(value || '');
  const inputRef = useRef();

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `${folder ? folder + '/' : ''}${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      setPreview(publicUrl);
      onChange('image_url', publicUrl);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {[{ id: 'upload', icon: <Upload size={12} />, label: 'Upload' }, { id: 'url', icon: <Link size={12} />, label: 'Paste URL' }].map(({ id, icon, label }) => (
          <button key={id} type="button" onClick={() => setMode(id)}
            className={`adm-pill ${mode === id ? 'active' : ''}`}
            style={{ fontSize: 12 }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <>
          <div
            className={`adm-upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => !uploading && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div className="spin-anim" style={{ width: 22, height: 22, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Uploading…</span>
              </div>
            ) : preview ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-md)' }} />
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>✓ Uploaded — click to replace</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Image size={28} style={{ color: 'var(--text-3)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>Click or drag & drop to upload</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>JPG, PNG, WEBP — stored in Supabase</span>
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0])} />
        </>
      ) : (
        <input className="adm-input" type="text" placeholder="https://..."
          value={value || ''}
          onChange={(e) => { setPreview(e.target.value); onChange('image_url', e.target.value); }} />
      )}
    </div>
  );
}

// ── Generic field renderer ────────────────────────────────────────────────────
export function FieldInput({ field, value, onChange, imageFolder }) {
  if (field.type === 'image') {
    return <ImageUploadField value={value} onChange={onChange} folder={imageFolder || field.folder || ''} bucket={field.bucket || 'images'} />;
  }
  if (field.type === 'textarea') {
    return <textarea className="adm-input" value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} rows={3} placeholder={field.placeholder || ''} style={{ resize: 'none' }} />;
  }
  if (field.type === 'select') {
    return (
      <select className="adm-input" value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} style={{ cursor: 'pointer' }}>
        <option value="">— Select —</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (field.type === 'boolean') {
    const on = Boolean(value);
    return (
      <button type="button" className="adm-toggle" style={{ background: on ? 'var(--accent)' : 'rgba(255,255,255,0.12)' }} onClick={() => onChange(field.name, !on)}>
        <span className="adm-toggle-thumb" style={{ left: on ? '21px' : '3px' }} />
      </button>
    );
  }
  if (field.type === 'number') {
    return <input className="adm-input" type="number" value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder || ''} />;
  }
  if (field.type === 'date') {
    return <input className="adm-input" type="date" value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} style={{ colorScheme: 'dark' }} />;
  }
  return <input className="adm-input" type={field.type || 'text'} value={value ?? ''} onChange={(e) => onChange(field.name, e.target.value)} placeholder={field.placeholder || ''} />;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ title, fields, data, onSave, onClose, saving, imageFolder }) {
  const [form, setForm] = useState({ ...data });
  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal modal-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{title}</p>
          <button className="adm-icon-btn edit" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map((field) => (
            <div key={field.name}>
              <label className="adm-label">
                {field.label}{field.required && <span style={{ color: '#f87171', marginLeft: 3 }}>*</span>}
              </label>
              <FieldInput field={field} value={form[field.name]} onChange={handleChange} imageFolder={imageFolder} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 24px', borderTop: '1px solid var(--border)' }}>
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn-primary" onClick={() => onSave(form)} disabled={saving}>
            {saving
              ? <div className="spin-anim" style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.4)', borderTopColor: '#000', borderRadius: '50%' }} />
              : <Check size={14} />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
export function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="adm-overlay">
      <div className="adm-modal modal-in" style={{ maxWidth: 360, padding: 36, textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertTriangle size={22} style={{ color: '#f87171' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', fontSize: '1.05rem', marginBottom: 8 }}>Delete Entry?</p>
        <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="adm-btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ef4444', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
          >Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── CRUDTable ─────────────────────────────────────────────────────────────────
export function CRUDTable({ title, description, columns, fields, rows, loading, onAdd, onEdit, onDelete, defaultValues, hideTitle, imageFolder }) {
  const [showAdd,   setShowAdd]   = useState(false);
  const [editRow,   setEditRow]   = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [saving,    setSaving]    = useState(false);

  const handleSave = async (data) => {
    setSaving(true);
    if (editRow) { await onEdit(editRow.id, data); setEditRow(null); }
    else         { await onAdd(data); setShowAdd(false); }
    setSaving(false);
  };

  return (
    <div>
      {/* Header */}
      {!hideTitle && (
        <div className="adm-panel-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <p className="adm-section-tag">Manage</p>
            <h1 className="adm-h1">{title}</h1>
            {description && <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{description}</p>}
          </div>
          <div className="adm-panel-actions" style={{ display: 'flex' }}>
            <button className="adm-btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> Add New</button>
          </div>
        </div>
      )}

      {hideTitle && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button className="adm-btn-primary" onClick={() => setShowAdd(true)}><Plus size={15} /> Add New</button>
        </div>
      )}

      {/* Table */}
      <div className="adm-surface">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
            <div className="spin-anim" style={{ width: 26, height: 26, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }} />
          </div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>📭</p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>No entries yet.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Click "Add New" to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                  {columns.map((col) => (
                    <th key={col.key} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '10px 16px', whiteSpace: 'nowrap' }}>
                      {col.label}
                    </th>
                  ))}
                  <th style={{ padding: '10px 16px' }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="adm-row">
                    {columns.map((col) => (
                      <td key={col.key} style={{ padding: '12px 16px', color: 'var(--text)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? <span style={{ color: 'var(--text-3)' }}>—</span>)}
                      </td>
                    ))}
                    <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="adm-icon-btn edit" onClick={() => setEditRow(row)}><Pencil size={14} /></button>
                        <button className="adm-icon-btn del"  onClick={() => setDeleteRow(row)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(showAdd || editRow) && (
        <Modal
          title={editRow ? `Edit ${title}` : `Add ${title}`}
          fields={fields}
          data={editRow || defaultValues || {}}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditRow(null); }}
          saving={saving}
          imageFolder={imageFolder}
        />
      )}
      {deleteRow && <DeleteConfirm onConfirm={async () => { await onDelete(deleteRow.id); setDeleteRow(null); }} onCancel={() => setDeleteRow(null)} />}
    </div>
  );
}
