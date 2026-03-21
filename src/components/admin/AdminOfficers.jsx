import React, { useState, useEffect, useRef } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { Modal, DeleteConfirm } from './CRUDTable';
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

const FIELDS = [
  { name: 'name',      label: 'Full Name',            type: 'text',   required: true },
  { name: 'position',  label: 'Position',             type: 'text',   required: true, placeholder: 'e.g. President' },
  { name: 'category',  label: 'Category / Committee', type: 'text',   required: true, placeholder: 'e.g. Executive Officers' },
  { name: 'image_url', label: 'Photo',                type: 'image',  folder: 'officers', bucket: 'images' },
  { name: 'published', label: 'Published',            type: 'boolean' },
  // sort_order is managed via drag-and-drop, not a manual field
];


// ── Drag-and-drop sortable list ───────────────────────────────────────────────
function SortableOfficerList({ rows, onReorder, onEdit, onDelete }) {
  const [items,     setItems]     = useState(rows);
  const [dragging,  setDragging]  = useState(null); // index being dragged
  const [dragOver,  setDragOver]  = useState(null); // index being hovered over
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const dragNode = useRef(null);

  useEffect(() => { setItems(rows); }, [rows]);

  const handleDragStart = (e, idx) => {
    setDragging(idx);
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    // Small delay so the drag image renders before we apply the dragging style
    setTimeout(() => { if (dragNode.current) dragNode.current.style.opacity = '0.4'; }, 0);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    dragNode.current = null;
    setDragging(null);
    setDragOver(null);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== dragging) setDragOver(idx);
  };

  const handleDrop = (e, idx) => {
    e.preventDefault();
    if (dragging === null || dragging === idx) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(idx, 0, moved);
    setItems(next);
    setDragging(null);
    setDragOver(null);
  };

  const move = (idx, dir) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
  };

  const saveOrder = async () => {
    setSaving(true);
    await Promise.all(
      items.map((item, i) => supabase.from('officers').update({ sort_order: i }).eq('id', item.id))
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onReorder(items);
  };

  const hasChanges = items.some((item, i) => rows[i]?.id !== item.id);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p className="adm-section-tag">Manage</p>
          <h1 className="adm-h1">Officers</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 4 }}>Drag rows or use arrows to reorder. Click Save Order when done.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {hasChanges && (
            <button onClick={saveOrder} disabled={saving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: saving ? '#22c55e88' : '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}>
              {saving
                ? <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                : null}
              {saving ? 'Saving…' : 'Save Order'}
            </button>
          )}
          {saved && !hasChanges && (
            <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>✓ Order saved</span>
          )}
          <button onClick={() => onEdit(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
            + Add Officer
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', minWidth: 620 }}>
        {/* Head */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 44px 1.8fr 1.2fr 1.2fr 70px 140px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          {['', '', 'Name', 'Position', 'Committee', 'Visible', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{h}</span>
          ))}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: 32, marginBottom: 10 }}>👤</p>
            <p style={{ fontSize: 14 }}>No officers yet. Click "Add Officer" to get started.</p>
          </div>
        ) : (
          items.map((row, idx) => (
            <div
              key={row.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 44px 1.8fr 1.2fr 1.2fr 70px 140px',
                gap: 0,
                padding: '11px 16px',
                alignItems: 'center',
                borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.15s',
                background: dragOver === idx ? 'rgba(34,197,94,0.06)' : 'transparent',
                borderLeft: dragOver === idx ? '2px solid #22c55e' : '2px solid transparent',
              }}
            >
              {/* Drag handle */}
              <span style={{ color: 'var(--text-3)', cursor: 'grab', display: 'flex', alignItems: 'center', opacity: 0.5 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}>
                <GripVertical size={14} />
              </span>

              {/* Avatar */}
              <img src={row.image_url || 'https://placehold.co/40x40/191c1a/22c55e?text=?'} alt=""
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />

              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              <span style={{ fontSize: 13, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.position}</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.category}</span>

              <span>
                <span className={row.published ? 'adm-badge adm-badge-yes' : 'adm-badge adm-badge-no'}>
                  {row.published ? 'Yes' : 'No'}
                </span>
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Up / Down */}
                <button onClick={() => move(idx, -1)} disabled={idx === 0}
                  style={{ background: 'transparent', border: 'none', color: idx === 0 ? 'var(--text-3)' : 'var(--text-2)', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: 3, borderRadius: 5, opacity: idx === 0 ? 0.3 : 0.8, display: 'flex', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => idx !== 0 && (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1}
                  style={{ background: 'transparent', border: 'none', color: idx === items.length - 1 ? 'var(--text-3)' : 'var(--text-2)', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer', padding: 3, borderRadius: 5, opacity: idx === items.length - 1 ? 0.3 : 0.8, display: 'flex', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => idx !== items.length - 1 && (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}>
                  <ChevronDown size={14} />
                </button>
                {/* Edit */}
                <button onClick={() => onEdit(row)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s, background 0.15s', fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}>
                  Edit
                </button>
                {/* Delete */}
                <button onClick={() => onDelete(row)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s, background 0.15s', fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      </div>

      {hasChanges && (
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 10 }}>
          ⚠ Unsaved order changes — click <strong style={{ color: 'var(--accent)' }}>Save Order</strong> to persist.
        </p>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminOfficers() {
  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showAdd,     setShowAdd]     = useState(false);
  const [editRow,     setEditRow]     = useState(null);
  const [deleteRow,   setDeleteRow]   = useState(null);
  const [saving,      setSaving]      = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('officers').select('*').order('sort_order');
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    if (editRow) {
      await supabase.from('officers').update(formData).eq('id', editRow.id);
    } else {
      const nextOrder = rows.length;
      await supabase.from('officers').insert([{ ...formData, published: formData.published ?? true, sort_order: nextOrder }]);
    }
    setSaving(false);
    setEditRow(null);
    setShowAdd(false);
    fetchData();
  };

  const handleDelete = async () => {
    await supabase.from('officers').delete().eq('id', deleteRow.id);
    setDeleteRow(null);
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div style={{ width: 26, height: 26, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <SortableOfficerList
        rows={rows}
        onReorder={(sorted) => setRows(sorted)}
        onEdit={(row) => { if (row) { setEditRow(row); setShowAdd(false); } else { setShowAdd(true); setEditRow(null); } }}
        onDelete={(row) => setDeleteRow(row)}
      />

      {/* Add / Edit modal */}
      {(showAdd || editRow) && (
        <Modal
          title={editRow ? 'Edit Officer' : 'Add Officer'}
          fields={FIELDS}
          data={editRow || { published: true }}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditRow(null); }}
          saving={saving}
          imageFolder="officers"
        />
      )}

      {/* Delete confirm */}
      {deleteRow && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteRow(null)} />}
    </div>
  );
}
