import React, { useState, useEffect, useCallback } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import { ShoppingBag, Download, X, Eye, Users, CheckCircle, Circle } from 'lucide-react';

const MERCH_FIELDS = [
  { name: 'name', label: 'Item Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (₱)', type: 'number', required: true, placeholder: '350' },
  { name: 'image_url', label: 'Item Image', type: 'image', folder: 'merch', bucket: 'images' },
  { name: 'category', label: 'Category', type: 'select', options: ['Jersey', 'Shirt', 'Hoodie', 'Cap', 'Lanyard', 'Sticker', 'Other'] },
  { name: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
  { name: 'available', label: 'Available', type: 'boolean' },
];

const MERCH_COLUMNS = [
  { key: 'image_url', label: '', render: (v) => <img src={v || 'https://placehold.co/40x40/191c1a/22c55e?text=?'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} /> },
  { key: 'name', label: 'Item' },
  { key: 'category', label: 'Category', render: (v) => v || <span style={{ color: '#5a6560' }}>—</span> },
  { key: 'price', label: 'Price', render: (v) => `₱${Number(v).toFixed(2)}` },
  { key: 'available', label: 'Available', render: (v) => <span className={v ? 'ds-badge-yes' : 'ds-badge-no'}>{v ? 'Yes' : 'No'}</span> },
];

export default function AdminMerch() {
  const [tab, setTab] = useState('items');
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterItem, setFilterItem] = useState('all');
  const [filterPaid, setFilterPaid] = useState('all'); // all | paid | unpaid
  const [itemNames, setItemNames] = useState([]);
  const [togglingPaid, setTogglingPaid] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    const { data } = await supabase.from('merch_items').select('*').order('sort_order');
    setRows(data || []);
    setItemNames(['all', ...(data || []).map((d) => d.name)]);
    setLoadingItems(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from('merch_preorders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoadingOrders(false);
  }, []);

  useEffect(() => { fetchItems(); fetchOrders(); }, [fetchItems, fetchOrders]);

  // Toggle paid status
  const togglePaid = async (e, order) => {
    e.stopPropagation();
    setTogglingPaid(order.id);
    const newVal = !order.is_paid;
    await supabase.from('merch_preorders').update({ is_paid: newVal }).eq('id', order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, is_paid: newVal } : o));
    if (selectedOrder?.id === order.id) setSelectedOrder((p) => ({ ...p, is_paid: newVal }));
    setTogglingPaid(null);
  };

  // CSV export
  const exportCSV = () => {
    const filtered = getFiltered();
    const rows = [
      ['Full Name', 'Email', 'Phone', 'Sex', 'Item', 'Size', 'Payment', 'GCash Ref', 'Paid', 'Submitted'],
      ...filtered.map((o) => [
        `"${[o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ')}"`,
        `"${o.email}"`, `"${o.phone_number}"`, `"${o.sex || ''}"`,
        `"${o.item_name}"`, `"${o.size || '—'}"`, `"${o.payment_method}"`,
        `"${o.gcash_reference || ''}"`, o.is_paid ? 'Yes' : 'No',
        `"${new Date(o.created_at).toLocaleString('en-PH')}"`,
      ].join(',')),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preorders_${filterItem === 'all' ? 'all' : filterItem.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFiltered = () => {
    let f = orders;
    if (filterItem !== 'all') f = f.filter((o) => o.item_name === filterItem);
    if (filterPaid === 'paid') f = f.filter((o) => o.is_paid);
    if (filterPaid === 'unpaid') f = f.filter((o) => !o.is_paid);
    return f;
  };

  const filteredOrders = getFiltered();
  const unpaidCount = orders.filter((o) => !o.is_paid).length;

  return (
    <>
      
      <div className="ds-root merch-admin">

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 16, height: 1, background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Store</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1.65rem' }}>Merch</h1>
        </div>

        {/* ── Tab pills — same pattern as AdminContacts filter ── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {[
            { id: 'items', label: 'Items', icon: <ShoppingBag size={13} /> },
            { id: 'orders', label: 'Pre-Orders', icon: <Users size={13} />, badge: unpaidCount > 0 ? unpaidCount : null },
          ].map(({ id, label, icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 100, fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
                background: tab === id ? '#22c55e' : 'rgba(255,255,255,0.06)',
                color: tab === id ? '#000' : '#9aa39d',
                fontWeight: tab === id ? 600 : 500,
              }}>
              {icon} {label}
              {badge && (
                <span style={{ background: tab === id ? 'rgba(0,0,0,0.2)' : 'rgba(239,68,68,0.8)', color: tab === id ? '#000' : 'white', fontSize: 10, fontWeight: 700, borderRadius: 100, padding: '1px 7px', marginLeft: 2 }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Items tab ── */}
        {tab === 'items' && (
          <CRUDTable
            title="Merch Items"
            description="Manage merchandise. Items marked Available will appear on the Merch page."
            columns={MERCH_COLUMNS}
            fields={MERCH_FIELDS}
            rows={rows}
            loading={loadingItems}
            onAdd={async (data) => { await supabase.from('merch_items').insert([{ ...data, available: data.available ?? true }]); fetchItems(); }}
            onEdit={async (id, data) => { await supabase.from('merch_items').update(data).eq('id', id); fetchItems(); }}
            onDelete={async (id) => { await supabase.from('merch_items').delete().eq('id', id); fetchItems(); }}
            defaultValues={{ available: true, category: 'Jersey', sort_order: 0 }}
            imageFolder="merch"
            hideTitle
          />
        )}

        {/* ── Pre-orders tab ── */}
        {tab === 'orders' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {/* Item filter */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {itemNames.map((name) => (
                    <button key={name} onClick={() => setFilterItem(name)}
                      style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
                        background: filterItem === name ? '#22c55e' : 'rgba(255,255,255,0.06)',
                        color: filterItem === name ? '#000' : '#9aa39d',
                      }}>
                      {name === 'all' ? 'All Items' : name}
                    </button>
                  ))}
                </div>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
                {/* Paid filter */}
                {['all', 'paid', 'unpaid'].map((f) => (
                  <button key={f} onClick={() => setFilterPaid(f)}
                    style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", textTransform: 'capitalize', transition: 'all 0.15s',
                      background: filterPaid === f ? (f === 'paid' ? 'rgba(34,197,94,0.15)' : f === 'unpaid' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.06)',
                      color: filterPaid === f ? (f === 'paid' ? '#22c55e' : f === 'unpaid' ? '#f87171' : '#f0f2f1') : '#9aa39d',
                    }}>
                    {f === 'all' ? 'All Status' : f}
                  </button>
                ))}
                <span style={{ fontSize: 12, color: '#5a6560' }}>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
              </div>
              <button className="dl-btn" onClick={exportCSV}>
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Orders table */}
            {loadingOrders ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                <div style={{ width: 24, height: 24, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#5a6560', fontSize: 14 }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                No pre-orders found.
              </div>
            ) : (
              <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Table head */}
                <div style={{ display: 'grid', gridTemplateColumns: '28px 1.8fr 1.2fr 0.8fr 0.9fr 0.6fr 0.85fr 0.75fr 40px', gap: 0, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  {['#', 'Customer', 'Email', 'Phone', 'Item', 'Size', 'Payment', 'Paid', ''].map((h) => (
                    <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
                  ))}
                </div>

                {filteredOrders.map((o, i) => (
                  <div key={o.id} className="order-row"
                    style={{ display: 'grid', gridTemplateColumns: '28px 1.8fr 1.2fr 0.8fr 0.9fr 0.6fr 0.85fr 0.75fr 40px', gap: 0, padding: '11px 16px', alignItems: 'center' }}
                    onClick={() => setSelectedOrder(o)}
                  >
                    <span style={{ fontSize: 11, color: '#5a6560', fontWeight: 600 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#f0f2f1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ')}
                    </span>
                    <span style={{ fontSize: 12, color: '#9aa39d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.email}</span>
                    <span style={{ fontSize: 12, color: '#9aa39d' }}>{o.phone_number}</span>
                    <span style={{ fontSize: 12, color: '#f0f2f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.item_name}</span>
                    <span style={{ fontSize: 12 }}>
                      {o.size ? <span className="adm-badge-no" style={{ background: 'rgba(255,255,255,0.06)', color: '#9aa39d' }}>{o.size}</span> : <span style={{ color: '#5a6560' }}>—</span>}
                    </span>
                    <span style={{ fontSize: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                        background: o.payment_method === 'GCash' ? 'rgba(96,165,250,0.12)' : 'rgba(34,197,94,0.1)',
                        color: o.payment_method === 'GCash' ? '#93c5fd' : '#86efac' }}>
                        {o.payment_method}
                      </span>
                    </span>
                    {/* Paid toggle */}
                    <span onClick={(e) => e.stopPropagation()}>
                      <button
                        className="paid-toggle"
                        onClick={(e) => togglePaid(e, o)}
                        disabled={togglingPaid === o.id}
                        style={{
                          background: o.is_paid ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                          color: o.is_paid ? '#22c55e' : '#5a6560',
                          opacity: togglingPaid === o.id ? 0.5 : 1,
                        }}
                      >
                        {o.is_paid ? <CheckCircle size={13} /> : <Circle size={13} />}
                        {o.is_paid ? 'Paid' : 'Unpaid'}
                      </button>
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#9aa39d'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Order detail modal ── */}
        {selectedOrder && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: 16 }}
            onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: '100%', maxWidth: 420, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1rem' }}>Order Details</p>
                  <button
                    className="paid-toggle"
                    onClick={(e) => togglePaid(e, selectedOrder)}
                    disabled={togglingPaid === selectedOrder.id}
                    style={{ background: selectedOrder.is_paid ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: selectedOrder.is_paid ? '#22c55e' : '#5a6560' }}
                  >
                    {selectedOrder.is_paid ? <CheckCircle size={12} /> : <Circle size={12} />}
                    {selectedOrder.is_paid ? 'Paid' : 'Mark as Paid'}
                  </button>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', display: 'flex', padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                {[
                  ['Full Name', [selectedOrder.first_name, selectedOrder.middle_initial ? selectedOrder.middle_initial + '.' : '', selectedOrder.last_name].filter(Boolean).join(' ')],
                  ['Email', selectedOrder.email],
                  ['Phone', selectedOrder.phone_number],
                  ['Sex', selectedOrder.sex || '—'],
                  ['Item', selectedOrder.item_name],
                  ['Size', selectedOrder.size || '—'],
                  ['Payment', selectedOrder.payment_method],
                  ['GCash Ref', selectedOrder.gcash_reference || '—'],
                  ['Status', selectedOrder.is_paid ? '✓ Paid' : 'Unpaid'],
                  ['Submitted', new Date(selectedOrder.created_at).toLocaleString('en-PH')],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: '#5a6560', fontWeight: 500, flexShrink: 0 }}>{label}</span>
                    <span style={{ fontSize: 13, color: label === 'Status' ? (selectedOrder.is_paid ? '#22c55e' : '#f87171') : '#f0f2f1', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
