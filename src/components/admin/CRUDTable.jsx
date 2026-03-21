import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Check, AlertTriangle } from 'lucide-react';

// ── Generic field renderer ─────────────────────────────────────────────────
export function FieldInput({ field, value, onChange }) {
  const base =
    'w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#087830] focus:ring-2 focus:ring-[#087830]/10 transition';

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        rows={3}
        placeholder={field.placeholder || ''}
        className={`${base} resize-none`}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={base}
      >
        <option value="">— Select —</option>
        {field.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'boolean') {
    return (
      <button
        type="button"
        onClick={() => onChange(field.name, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-[#087830]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder || ''}
        className={base}
      />
    );
  }

  if (field.type === 'date') {
    return (
      <input
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={base}
      />
    );
  }

  return (
    <input
      type={field.type || 'text'}
      value={value ?? ''}
      onChange={(e) => onChange(field.name, e.target.value)}
      placeholder={field.placeholder || ''}
      className={base}
    />
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ title, fields, data, onSave, onClose, saving }) {
  const [form, setForm] = useState({ ...data });

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <FieldInput
                field={field}
                value={form[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#087830] hover:bg-[#065d24] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
export function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="flex justify-center mb-4 text-red-500">
          <AlertTriangle size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Entry?</h2>
        <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CRUDTable ─────────────────────────────────────────────────────────────
export function CRUDTable({
  title,
  description,
  columns,     // { key, label, render? }[]
  fields,      // FieldInput configs for the form
  rows,
  loading,
  onAdd,
  onEdit,
  onDelete,
  defaultValues,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    setSaving(true);
    if (editRow) {
      await onEdit(editRow.id, data);
      setEditRow(null);
    } else {
      await onAdd(data);
      setShowAdd(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    await onDelete(deleteRow.id);
    setDeleteRow(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {description && <p className="text-gray-500 text-sm mt-0.5">{description}</p>}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#087830] hover:bg-[#065d24] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors self-start"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#087830] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No entries yet.</p>
            <p className="text-sm">Click "Add New" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      i === rows.length - 1 ? 'border-0' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5 text-gray-700 max-w-xs truncate">
                        {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditRow(row)}
                          className="p-1.5 text-gray-400 hover:text-[#087830] hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteRow(row)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {(showAdd || editRow) && (
        <Modal
          title={editRow ? 'Edit Entry' : 'Add New Entry'}
          fields={fields}
          data={editRow || defaultValues || {}}
          onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditRow(null); }}
          saving={saving}
        />
      )}
      {deleteRow && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteRow(null)} />
      )}
    </div>
  );
}
