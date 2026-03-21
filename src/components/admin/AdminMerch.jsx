import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import { ShoppingBag, Download, X, Eye, Users } from 'lucide-react';

const DS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Outfit:wght@400;500;600&display=swap');
  .merch-admin { font-family: 'Outfit', sans-serif; }
  .tab-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;
    font-family: 'Outfit', sans-serif; cursor: pointer; border: none;
    transition: background 0.15s, color 0.15s;
  }
  .tab-btn.active { background: #22c55e; color: #000; font-weight: 600; }
  .tab-btn:not(.active) { background: rgba(255,255,255,0.05); color: #9aa39d; }
  .tab-btn:not(.active):hover { background: rgba(255,255,255,0.09); color: #f0f2f1; }
  .order-row { border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.15s; }
  .order-row:hover { background: rgba(255,255,255,0.02); }
  .order-row:last-child { border-bottom: none; }
  .badge { display:inline-flex; align-items:center; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .dl-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #22c55e; color: #000; border: none; border-radius: 8px;
    padding: 9px 18px; font-size: 13px; font-weight: 600;
    font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .dl-btn:hover { background: #28d468; transform: translateY(-1px); }
  .order-detail-modal { position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); padding:16px; }
`;

// ── Merch CRUD fields ──────────────────────────────────────────────────────
const MERCH_FIELDS = [
  { name: 'name', label: 'Item Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price', label: 'Price (₱)', type: 'number', required: true, placeholder: '350' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
  { name: 'category', label: 'Category', type: 'select', options: ['Jersey', 'Shirt', 'Hoodie', 'Cap', 'Sticker', 'Other'] },
  { name: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
  { name: 'available', label: 'Available', type: 'boolean' },
];

const MERCH_COLUMNS = [
  {
    key: 'image_url', label: '',
    render: (v) => <img src={v || 'https://placehold.co/40x40/191c1a/22c55e?text=?'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />,
  },
  { key: 'name', label: 'Item' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (v) => `₱${Number(v).toFixed(2)}` },
  {
    key: 'available', label: 'Available',
    render: (v) => (
      <span className="badge" style={{ background: v ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)', color: v ? '#22c55e' : '#f87171' }}>
        {v ? 'Available' : 'Unavailable'}
      </span>
    ),
  },
];

// ── Pre-orders table columns ───────────────────────────────────────────────
const ORDER_COLS = ['#', 'Name', 'Email', 'Phone', 'Item', 'Size', 'Payment', 'Ref #', 'Submitted'];

export default function AdminMerch() {
  const [tab, setTab] = useState('items');
  const [rows, setRows] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterItem, setFilterItem] = useState('all');
  const [itemNames, setItemNames] = useState([]);

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

  // ── CRUD handlers ──────────────────────────────────────────────────────
  const handleAdd = async (data) => { await supabase.from('merch_items').insert([{ ...data, available: data.available ?? true }]); fetchItems(); };
  const handleEdit = async (id, data) => { await supabase.from('merch_items').update(data).eq('id', id); fetchItems(); };
  const handleDelete = async (id) => { await supabase.from('merch_items').delete().eq('id', id); fetchItems(); };

  // ── Export CSV ─────────────────────────────────────────────────────────
  const exportCSV = () => {
    const filtered = filterItem === 'all' ? orders : orders.filter((o) => o.item_name === filterItem);
    const headers = ['Full Name', 'Email', 'Phone', 'Sex', 'Item', 'Size', 'Payment Method', 'GCash Reference', 'Submitted At'];
    const csvRows = [
      headers.join(','),
      ...filtered.map((o) => [
        `"${o.first_name} ${o.middle_initial ? o.middle_initial + '.' : ''} ${o.last_name}"`,
        `"${o.email}"`,
        `"${o.phone_number}"`,
        `"${o.sex}"`,
        `"${o.item_name}"`,
        `"${o.size}"`,
        `"${o.payment_method}"`,
        `"${o.gcash_reference || ''}"`,
        `"${new Date(o.created_at).toLocaleString('en-PH')}"`,
      ].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preorders_${filterItem === 'all' ? 'all' : filterItem.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = filterItem === 'all' ? orders : orders.filter((o) => o.item_name === filterItem);

  return (
    <>
      <style>{DS}</style>
      <div className="merch-admin">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 16, height: 1, background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Store</span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1.7rem' }}>Merch</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button className={`tab-btn ${tab === 'items' ? 'active' : ''}`} onClick={() => setTab('items')}>
            <ShoppingBag size={14} /> Items
          </button>
          <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            <Users size={14} /> Pre-Orders
            {orders.length > 0 && (
              <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 10, fontWeight: 700, borderRadius: 100, padding: '1px 7px' }}>
                {orders.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Items tab ── */}
        {tab === 'items' && (
          <CRUDTable
            title=""
            description="Manage merchandise. Items marked Available will appear on the Merch page."
            columns={MERCH_COLUMNS}
            fields={MERCH_FIELDS}
            rows={rows}
            loading={loadingItems}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            defaultValues={{ available: true, category: 'Jersey', sort_order: 0 }}
            hideTitle
          />
        )}

        {/* ── Pre-orders tab ── */}
        {tab === 'orders' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#5a6560', fontWeight: 500 }}>Filter by item:</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
                <span style={{ fontSize: 12, color: '#5a6560' }}>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
              </div>

              <button className="dl-btn" onClick={exportCSV}>
                <Download size={14} />
                Download CSV {filterItem !== 'all' ? `(${filterItem})` : ''}
              </button>
            </div>

            {/* Table */}
            {loadingOrders ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
                <div style={{ width: 24, height: 24, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#5a6560', fontSize: 14 }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                No pre-orders yet.
              </div>
            ) : (
              <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1.6fr 1.4fr 0.9fr 1fr 0.6fr 0.9fr 0.6fr', gap: 0, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                  {['#', 'Customer', 'Email', 'Phone', 'Item', 'Size', 'Payment', ''].map((h) => (
                    <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
                  ))}
                </div>

                {/* Rows */}
                {filteredOrders.map((o, i) => (
                  <div key={o.id} className="order-row"
                    style={{ display: 'grid', gridTemplateColumns: '36px 1.6fr 1.4fr 0.9fr 1fr 0.6fr 0.9fr 0.6fr', gap: 0, padding: '12px 16px', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => setSelectedOrder(o)}
                  >
                    <span style={{ fontSize: 12, color: '#5a6560', fontWeight: 600 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#f0f2f1', fontWeight: 500 }}>
                      {o.first_name} {o.middle_initial ? o.middle_initial + '. ' : ''}{o.last_name}
                    </span>
                    <span style={{ fontSize: 12, color: '#9aa39d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.email}</span>
                    <span style={{ fontSize: 12, color: '#9aa39d' }}>{o.phone_number}</span>
                    <span style={{ fontSize: 12, color: '#f0f2f1' }}>{o.item_name}</span>
                    <span style={{ fontSize: 12 }}>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#9aa39d' }}>{o.size}</span>
                    </span>
                    <span style={{ fontSize: 12 }}>
                      <span className="badge" style={{ background: o.payment_method === 'GCash' ? 'rgba(96,165,250,0.12)' : 'rgba(34,197,94,0.1)', color: o.payment_method === 'GCash' ? '#93c5fd' : '#86efac' }}>
                        {o.payment_method}
                      </span>
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 4, display: 'flex' }}
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}>
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Detail modal ── */}
        {selectedOrder && (
          <div className="order-detail-modal" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
            <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: '100%', maxWidth: 440, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1rem' }}>Order Details</p>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', display: 'flex', padding: 4 }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  ['Full Name', `${selectedOrder.first_name} ${selectedOrder.middle_initial ? selectedOrder.middle_initial + '. ' : ''}${selectedOrder.last_name}`],
                  ['Email', selectedOrder.email],
                  ['Phone', selectedOrder.phone_number],
                  ['Sex', selectedOrder.sex],
                  ['Item', selectedOrder.item_name],
                  ['Size', selectedOrder.size],
                  ['Payment', selectedOrder.payment_method],
                  ['GCash Ref', selectedOrder.gcash_reference || '—'],
                  ['Submitted', new Date(selectedOrder.created_at).toLocaleString('en-PH')],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: '#5a6560', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 13, color: '#f0f2f1', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
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
