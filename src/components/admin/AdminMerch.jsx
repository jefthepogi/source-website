import React, { useState, useEffect, useCallback } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import { ShoppingBag, Download, X, Eye, Users, CheckCircle, Circle, Trash2, AlertTriangle, TrendingUp, Pencil, Package } from 'lucide-react';

const MERCH_FIELDS = [
  { name: 'name',        label: 'Item Name',   type: 'text',     required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price',       label: 'Price (PHP)', type: 'number',   required: true, placeholder: '350' },
  { name: 'image_url',   label: 'Item Image',  type: 'image',    folder: 'merch', bucket: 'images' },
  { name: 'category',    label: 'Category',    type: 'select',   options: ['Jersey', 'Shirt', 'Hoodie', 'Cap', 'Lanyard', 'Sticker', 'Other'] },
  { name: 'sort_order',  label: 'Sort Order',  type: 'number',   placeholder: '0' },
  { name: 'available',         label: 'Available',              type: 'boolean' },
  { name: 'show_back_name',     label: 'Show Back Name field',   type: 'boolean' },
  { name: 'back_name_required', label: 'Back Name is Required',  type: 'boolean' },
  { name: 'show_back_number',   label: 'Show Back Number field', type: 'boolean' },
  { name: 'back_number_required', label: 'Back Number is Required', type: 'boolean' },
];

const MERCH_COLUMNS = [
  { key: 'image_url', label: '', render: (v) => <img src={v || 'https://placehold.co/40x40/191c1a/22c55e?text=?'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} /> },
  { key: 'name',      label: 'Item' },
  { key: 'category',  label: 'Category',  render: (v) => v || <span style={{ color: '#5a6560' }}>—</span> },
  { key: 'price',     label: 'Price',     render: (v) => `PHP ${Number(v).toFixed(2)}` },
  { key: 'available', label: 'Available', render: (v) => <span className={v ? 'adm-badge-yes' : 'adm-badge-no'}>{v ? 'Yes' : 'No'}</span> },
];

const fmt = (n) => `PHP ${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pct = (n, d) => d === 0 ? '0%' : Math.round((n / d) * 100) + '%';

// ── Claiming Tab ──────────────────────────────────────────────────────────────
function ClaimingTab({ orders, onToggleClaim }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClaim, setFilterClaim] = useState('unclaimed');
  const [filterItem,  setFilterItem]  = useState('all');

  const paidOrders = orders.filter((o) => o.is_paid === true || o.is_paid === null);
  const itemNames  = ['all', ...new Set(paidOrders.map((o) => o.item_name))];

  const filtered = paidOrders.filter((o) => {
    if (filterClaim === 'claimed')   return o.is_claimed;
    if (filterClaim === 'unclaimed') return !o.is_claimed;
    return true;
  }).filter((o) => {
    if (filterItem !== 'all') return o.item_name === filterItem;
    return true;
  }).filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return [o.first_name, o.last_name, o.email, o.item_name, o.size].some((v) => v?.toLowerCase().includes(q));
  });

  const totalPaid      = paidOrders.length;
  const totalClaimed   = paidOrders.filter((o) => o.is_claimed).length;
  const totalUnclaimed = totalPaid - totalClaimed;

  return (
    <div className="fade-in">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Ready to Claim', value: totalPaid,      color: '#f0f2f1', bg: 'rgba(255,255,255,0.04)' },
          { label: 'Claimed',        value: totalClaimed,   color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
          { label: 'Unclaimed',      value: totalUnclaimed, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 8 }}>{label}</p>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.6rem', color, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#9aa39d', fontWeight: 500 }}>Claiming progress</span>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{totalClaimed} / {totalPaid} claimed</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right, #22c55e, #4ade80)', width: totalPaid > 0 ? `${Math.round((totalClaimed / totalPaid) * 100)}%` : '0%', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {/* Claim status */}
        {[
          { id: 'all',       label: 'All',       activeBg: 'rgba(255,255,255,0.12)', activeColor: '#f0f2f1' },
          { id: 'unclaimed', label: 'Unclaimed', activeBg: 'rgba(251,191,36,0.15)',  activeColor: '#fbbf24' },
          { id: 'claimed',   label: 'Claimed',   activeBg: 'rgba(34,197,94,0.15)',   activeColor: '#22c55e' },
        ].map(({ id, label, activeBg, activeColor }) => (
          <button key={id} onClick={() => setFilterClaim(id)}
            style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
              background: filterClaim === id ? activeBg : 'rgba(255,255,255,0.06)',
              color:      filterClaim === id ? activeColor : '#9aa39d',
            }}>{label}</button>
        ))}
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
        {/* Item filter */}
        {itemNames.map((name) => (
          <button key={name} onClick={() => setFilterItem(name)}
            style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
              background: filterItem === name ? '#f0f2f1' : 'rgba(255,255,255,0.06)',
              color:      filterItem === name ? '#000'    : '#9aa39d',
            }}>{name === 'all' ? 'All Items' : name}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#5a6560' }}>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input className="adm-input" type="text" placeholder="Search by name, email, or item…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: 36 }} />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a6560', pointerEvents: 'none' }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 2, display: 'flex' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#5a6560' }}>
          <Package size={32} style={{ margin: '0 auto 12px', opacity: 0.25, display: 'block' }} />
          <p style={{ fontSize: 14 }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((o) => {
            const fullName = [o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ');
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: o.is_claimed ? 'rgba(34,197,94,0.04)' : '#131615', border: `1px solid ${o.is_claimed ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, transition: 'all 0.2s' }}>
                {/* Status indicator */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: o.is_claimed ? '#22c55e' : 'rgba(251,191,36,0.6)', boxShadow: o.is_claimed ? '0 0 6px rgba(34,197,94,0.5)' : 'none' }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f1', margin: 0 }}>{fullName}</p>
                    {o.size && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: '#9aa39d' }}>{o.size}</span>}
                    {o.is_paid === null && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'rgba(167,139,250,0.12)', color: '#c4b5fd' }}>FREE</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#5a6560', margin: '2px 0 0' }}>{o.item_name}</p>
                </div>

                {/* Date claimed or pending */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {o.is_claimed ? (
                    <p style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>✓ Claimed</p>
                  ) : (
                    <p style={{ fontSize: 11, color: '#fbbf24' }}>Pending</p>
                  )}
                  <p style={{ fontSize: 10, color: '#5a6560', marginTop: 2 }}>
                    {new Date(o.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Toggle button */}
                <button
                  onClick={(e) => onToggleClaim(e, o)}
                  style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", border: '1px solid', transition: 'all 0.2s',
                    background: o.is_claimed ? 'transparent' : '#22c55e',
                    color:      o.is_claimed ? '#5a6560'    : '#000',
                    borderColor: o.is_claimed ? 'rgba(255,255,255,0.1)' : '#22c55e',
                  }}
                  onMouseEnter={(e) => !o.is_claimed && (e.currentTarget.style.background = '#28d468')}
                  onMouseLeave={(e) => !o.is_claimed && (e.currentTarget.style.background = '#22c55e')}
                >
                  {o.is_claimed ? 'Undo' : 'Mark Claimed'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function EarningsTab({ orders, rows }) {
  const priceMap = {};
  rows.forEach((item) => { priceMap[item.name] = Number(item.price) || 0; });

  // Free orders (is_paid === null) are excluded from revenue calculations
  const paidOrders   = orders.filter((o) => o.is_paid === true);
  const unpaidOrders = orders.filter((o) => o.is_paid === false);
  const freeOrders   = orders.filter((o) => o.is_paid === null);
  const totalEarned  = paidOrders.reduce((s, o) => s + (priceMap[o.item_name] || 0), 0);
  const totalPending = unpaidOrders.reduce((s, o) => s + (priceMap[o.item_name] || 0), 0);
  const totalRevenue = totalEarned + totalPending; // free orders not counted

  const byItem = {};
  orders.forEach((o) => {
    if (!byItem[o.item_name]) byItem[o.item_name] = { name: o.item_name, price: priceMap[o.item_name] || 0, total: 0, paid: 0, unpaid: 0, free: 0 };
    byItem[o.item_name].total++;
    if (o.is_paid === true)  byItem[o.item_name].paid++;
    else if (o.is_paid === false) byItem[o.item_name].unpaid++;
    else byItem[o.item_name].free++;
  });
  const breakdown = Object.values(byItem).sort((a, b) => (b.paid * b.price) - (a.paid * a.price));
  const cols = '2fr 0.7fr 0.7fr 0.6fr 0.6fr 1fr 1fr';

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Revenue',   value: fmt(totalRevenue), sub: `${paidOrders.length + unpaidOrders.length} billable orders`, color: '#f0f2f1', bg: 'rgba(255,255,255,0.04)' },
          { label: 'Collected',       value: fmt(totalEarned),  sub: `${paidOrders.length} paid`,                                      color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
          { label: 'Pending',         value: fmt(totalPending), sub: `${unpaidOrders.length} unpaid`,                                   color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
          { label: 'Free / Exempt',   value: String(freeOrders.length), sub: 'not counted in revenue',                                  color: '#c4b5fd', bg: 'rgba(167,139,250,0.08)' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} style={{ background: bg, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 10 }}>{label}</p>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.5rem', color, lineHeight: 1, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 12, color: '#5a6560' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#9aa39d', fontWeight: 500 }}>Collection progress (billable only)</span>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{fmt(totalEarned)} / {fmt(totalRevenue)}</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(to right, #22c55e, #4ade80)', width: totalRevenue > 0 ? pct(totalEarned, totalRevenue) : '0%', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 16, height: 1, background: '#22c55e', display: 'inline-block' }} />
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Per-Item Breakdown</span>
      </div>

      {breakdown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#5a6560', fontSize: 14 }}>
          <TrendingUp size={32} style={{ margin: '0 auto 12px', opacity: 0.25, display: 'block' }} />
          No orders yet.
        </div>
      ) : (
        <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            {['Item', 'Price', 'Orders', 'Paid', 'Free', 'Collected', 'Pending'].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
            ))}
          </div>
          {breakdown.map((item, i) => (
            <div key={item.name} style={{ display: 'grid', gridTemplateColumns: cols, padding: '13px 16px', borderBottom: i < breakdown.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#f0f2f1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              <span style={{ fontSize: 12, color: '#9aa39d' }}>{fmt(item.price)}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#f0f2f1' }}>{item.total}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>{item.paid}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: item.free > 0 ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)', color: item.free > 0 ? '#c4b5fd' : '#5a6560' }}>{item.free}</span>
              <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{fmt(item.paid * item.price)}</span>
              <span style={{ fontSize: 13, color: item.unpaid > 0 ? '#fbbf24' : '#5a6560', fontWeight: item.unpaid > 0 ? 600 : 400 }}>{fmt(item.unpaid * item.price)}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '13px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#9aa39d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
            <span />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#f0f2f1' }}>{orders.length}</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#22c55e' }}>{paidOrders.length}</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#c4b5fd' }}>{freeOrders.length}</span>
            <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>{fmt(totalEarned)}</span>
            <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>{fmt(totalPending)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminMerch() {
  const [tab,               setTab]               = useState('items');
  const [rows,              setRows]              = useState([]);
  const [orders,            setOrders]            = useState([]);
  const [loadingItems,      setLoadingItems]      = useState(true);
  const [loadingOrders,     setLoadingOrders]     = useState(true);
  const [selectedOrder,     setSelectedOrder]     = useState(null);
  const [deleteOrderTarget, setDeleteOrderTarget] = useState(null);
  const [editOrderTarget, setEditOrderTarget] = useState(null);
  const [editForm,        setEditForm]        = useState({});
  const [savingEdit,      setSavingEdit]      = useState(false);
  const [filterItem,        setFilterItem]        = useState('all');
  const [filterPaid,        setFilterPaid]        = useState('all');
  const [searchQuery,       setSearchQuery]       = useState('');
  const [itemNames,         setItemNames]         = useState(['all']);
  const [togglingPaid,      setTogglingPaid]      = useState(null);

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

  const togglePaid = async (e, order) => {
    e.stopPropagation();
    setTogglingPaid(order.id);
    // Cycle: false (unpaid) → true (paid) → null (free) → false
    const next = order.is_paid === false ? true : order.is_paid === true ? null : false;
    await supabase.from('merch_preorders').update({ is_paid: next }).eq('id', order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, is_paid: next } : o));
    if (selectedOrder?.id === order.id) setSelectedOrder((p) => ({ ...p, is_paid: next }));
    setTogglingPaid(null);
  };

  const toggleClaim = async (e, order) => {
    e.stopPropagation();
    const newVal = !order.is_claimed;
    await supabase.from('merch_preorders').update({ is_claimed: newVal }).eq('id', order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, is_claimed: newVal } : o));
    if (selectedOrder?.id === order.id) setSelectedOrder((p) => ({ ...p, is_claimed: newVal }));
  };

  const deleteOrder = async () => {
    await supabase.from('merch_preorders').delete().eq('id', deleteOrderTarget.id);
    setOrders((prev) => prev.filter((o) => o.id !== deleteOrderTarget.id));
    if (selectedOrder?.id === deleteOrderTarget.id) setSelectedOrder(null);
    setDeleteOrderTarget(null);
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    const payload = {
      first_name:       editForm.first_name.trim()      || null,
      middle_initial:   editForm.middle_initial.trim()  || null,
      last_name:        editForm.last_name.trim()        || null,
      sex:              editForm.sex                     || null,
      phone_number:     editForm.phone_number.trim()    || null,
      email:            editForm.email.trim()            || null,
      size:             editForm.size                    || null,
      back_text:        editForm.back_text.trim()        || null,
      back_number:      editForm.back_number?.trim()     || null,
      payment_method:   editForm.payment_method          || null,
      gcash_reference:  editForm.gcash_reference.trim() || null,
    };
    await supabase.from('merch_preorders').update(payload).eq('id', editOrderTarget.id);
    const updated = { ...editOrderTarget, ...payload };
    setOrders((prev) => prev.map((o) => o.id === editOrderTarget.id ? updated : o));
    if (selectedOrder?.id === editOrderTarget.id) setSelectedOrder(updated);
    setEditOrderTarget(null);
    setSavingEdit(false);
  };

  const exportCSV = () => {
    const filtered = getFiltered();
    const csvRows = [
      ['Full Name', 'Email', 'Phone', 'Sex', 'Item', 'Size', 'Back Name', 'Back Number', 'Payment', 'GCash Ref', 'Paid', 'Claimed', 'Submitted'],
      ...filtered.map((o) => [
        `"${[o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ')}"`,
        `"${o.email}"`, `"${o.phone_number}"`, `"${o.sex || ''}"`,
        `"${o.item_name}"`, `"${o.size || ''}"`,`"${o.back_text || ''}"`,`"${o.payment_method}"`,
        `"${o.gcash_reference || ''}"`, o.is_paid === true ? 'Paid' : o.is_paid === null ? 'Free' : 'Unpaid', o.is_claimed ? 'Yes' : 'No',
        `"${new Date(o.created_at).toLocaleString('en-PH')}"`,
      ].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `preorders_${filterItem === 'all' ? 'all' : filterItem.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFiltered = () => {
    let f = orders;
    if (filterItem !== 'all') f = f.filter((o) => o.item_name === filterItem);
    if (filterPaid === 'paid')   f = f.filter((o) => o.is_paid === true);
    if (filterPaid === 'unpaid') f = f.filter((o) => o.is_paid === false);
    if (filterPaid === 'free')   f = f.filter((o) => o.is_paid === null);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      f = f.filter((o) =>
        [o.first_name, o.last_name, o.email, o.phone_number, o.item_name].some((v) => v?.toLowerCase().includes(q))
      );
    }
    return f;
  };

  const filteredOrders = getFiltered();
  const unpaidCount    = orders.filter((o) => o.is_paid === false).length;

  const unclaimedCount = orders.filter((o) => o.is_paid === true && !o.is_claimed).length;

  const TABS = [
    { id: 'items',    label: 'Items',      icon: <ShoppingBag size={13} /> },
    { id: 'orders',   label: 'Pre-Orders', icon: <Users size={13} />,      badge: unpaidCount > 0 ? unpaidCount : null },
    { id: 'claims',   label: 'Claiming',   icon: <Package size={13} />,    badge: unclaimedCount > 0 ? unclaimedCount : null },
    { id: 'earnings', label: 'Earnings',   icon: <TrendingUp size={13} /> },
  ];

  return (
    <div className="ds-root merch-admin">

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 16, height: 1, background: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Store</span>
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1.65rem' }}>Merch</h1>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {TABS.map(({ id, label, icon, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 100, fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
              background: tab === id ? '#22c55e' : 'rgba(255,255,255,0.06)',
              color:      tab === id ? '#000'    : '#9aa39d',
              fontWeight: tab === id ? 600       : 500,
            }}>
            {icon} {label}
            {badge && (
              <span style={{ background: 'rgba(239,68,68,0.8)', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 100, padding: '1px 7px', marginLeft: 2 }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

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
          defaultValues={{ available: true, category: 'Jersey', sort_order: 0, show_back_name: false, back_name_required: false, show_back_number: false, back_number_required: false }}
          imageFolder="merch"
          hideTitle
        />
      )}

      {tab === 'orders' && (
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              className="adm-input"
              type="text"
              placeholder="Search by name, email, phone, or item…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a6560', pointerEvents: 'none' }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 2, display: 'flex', borderRadius: 4 }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f0f2f1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {itemNames.map((name) => (
                  <button key={name} onClick={() => setFilterItem(name)}
                    style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", transition: 'all 0.15s',
                      background: filterItem === name ? '#22c55e' : 'rgba(255,255,255,0.06)',
                      color:      filterItem === name ? '#000'    : '#9aa39d',
                    }}>
                    {name === 'all' ? 'All Items' : name}
                  </button>
                ))}
              </div>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
              {[
                { id: 'all',    label: 'All Status', activeBg: 'rgba(255,255,255,0.12)', activeColor: '#f0f2f1' },
                { id: 'paid',   label: 'Paid',        activeBg: 'rgba(34,197,94,0.15)',  activeColor: '#22c55e' },
                { id: 'unpaid', label: 'Unpaid',      activeBg: 'rgba(239,68,68,0.15)',  activeColor: '#f87171' },
                { id: 'free',   label: 'Free',        activeBg: 'rgba(167,139,250,0.15)',activeColor: '#c4b5fd' },
              ].map(({ id, label, activeBg, activeColor }) => (
                <button key={id} onClick={() => setFilterPaid(id)}
                  style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", textTransform: 'capitalize', transition: 'all 0.15s',
                    background: filterPaid === id ? activeBg : 'rgba(255,255,255,0.06)',
                    color:      filterPaid === id ? activeColor : '#9aa39d',
                  }}>
                  {label}
                </button>
              ))}
              <span style={{ fontSize: 12, color: '#5a6560' }}>{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
            </div>
            <button onClick={exportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9aa39d', padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all 0.2s' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>

          {loadingOrders ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
              <div style={{ width: 24, height: 24, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#5a6560', fontSize: 14 }}>
              <ShoppingBag size={32} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
              No pre-orders found.
            </div>
          ) : (
            <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 0.6fr 0.9fr 0.85fr 68px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', minWidth: 520 }}>
                {['Customer', 'Item', 'Size', 'Payment', 'Paid', ''].map((h) => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
                ))}
              </div>
              {filteredOrders.map((o, i) => (
                <div key={o.id} className="order-row"
                  style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.4fr 0.6fr 0.9fr 0.85fr 68px', padding: '11px 16px', alignItems: 'center', cursor: 'pointer', minWidth: 520 }}
                  onClick={() => setSelectedOrder(o)}
                >
                  <span style={{ fontSize: 13, color: '#f0f2f1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {[o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ')}
                  </span>
                  <span style={{ fontSize: 12, color: '#f0f2f1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.item_name}</span>
                  <span style={{ fontSize: 12 }}>
                    {o.size
                      ? <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: 'rgba(255,255,255,0.07)', color: '#9aa39d' }}>{o.size}</span>
                      : <span style={{ color: '#5a6560' }}>—</span>
                    }
                  </span>
                  <span style={{ fontSize: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                      background: o.payment_method === 'GCash' ? 'rgba(96,165,250,0.12)' : 'rgba(34,197,94,0.1)',
                      color:      o.payment_method === 'GCash' ? '#93c5fd'               : '#86efac' }}>
                      {o.payment_method}
                    </span>
                  </span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <button className="paid-toggle"
                      onClick={(e) => togglePaid(e, o)}
                      disabled={togglingPaid === o.id}
                      style={{ opacity: togglingPaid === o.id ? 0.5 : 1,
                        background: o.is_paid === true ? 'rgba(34,197,94,0.12)' : o.is_paid === null ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.05)',
                        color: o.is_paid === true ? '#22c55e' : o.is_paid === null ? '#c4b5fd' : '#5a6560' }}>
                      {o.is_paid === true ? <CheckCircle size={13} /> : o.is_paid === null ? <Circle size={13} /> : <Circle size={13} />}
                      {o.is_paid === true ? 'Paid' : o.is_paid === null ? 'Free' : 'Unpaid'}
                    </button>
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                      onClick={(e) => { e.stopPropagation(); setEditOrderTarget(o); setEditForm({ first_name: o.first_name || '', middle_initial: o.middle_initial || '', last_name: o.last_name || '', sex: o.sex || '', phone_number: o.phone_number || '', email: o.email || '', size: o.size || '', back_text: o.back_text || '', back_number: o.back_number || '', payment_method: o.payment_method || '', gcash_reference: o.gcash_reference || '' }); }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#22c55e'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}>
                      <Pencil size={13} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#9aa39d'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}>
                      <Eye size={14} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 6, transition: 'color 0.15s' }}
                      onClick={(e) => { e.stopPropagation(); setDeleteOrderTarget(o); }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'claims'   && <ClaimingTab orders={orders} onToggleClaim={toggleClaim} />}
      {tab === 'earnings' && <EarningsTab orders={orders} rows={rows} />}

      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: 16 }}
          onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: '100%', maxWidth: 420, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1rem' }}>Order Details</p>
                <button className="paid-toggle"
                  onClick={(e) => togglePaid(e, selectedOrder)}
                  disabled={togglingPaid === selectedOrder.id}
                  style={{ background: selectedOrder.is_paid === true ? 'rgba(34,197,94,0.12)' : selectedOrder.is_paid === null ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.06)',
                           color: selectedOrder.is_paid === true ? '#22c55e' : selectedOrder.is_paid === null ? '#c4b5fd' : '#5a6560' }}>
                  {selectedOrder.is_paid === true ? <CheckCircle size={12} /> : <Circle size={12} />}
                  {selectedOrder.is_paid === true ? 'Paid' : selectedOrder.is_paid === null ? 'Free' : 'Mark as Paid'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => { setDeleteOrderTarget(selectedOrder); setSelectedOrder(null); }}
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 500, transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                  <Trash2 size={13} /> Delete
                </button>
                <button onClick={() => setSelectedOrder(null)}
                  style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9aa39d'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              {[
                ['Full Name', [selectedOrder.first_name, selectedOrder.middle_initial ? selectedOrder.middle_initial + '.' : '', selectedOrder.last_name].filter(Boolean).join(' ')],
                ['Email',     selectedOrder.email],
                ['Phone',     selectedOrder.phone_number],
                ['Sex',       selectedOrder.sex || '—'],
                ['Item',      selectedOrder.item_name],
                ['Size',      selectedOrder.size || '—'],
                ['Back Name', selectedOrder.back_text || '—'],
                ['Back Number', selectedOrder.back_number || '—'],
                ['Payment',   selectedOrder.payment_method],
                ['GCash Ref', selectedOrder.gcash_reference || '—'],
                ['Status',    selectedOrder.is_paid === true ? 'Paid' : selectedOrder.is_paid === null ? 'Free' : 'Unpaid'],
                ['Submitted', new Date(selectedOrder.created_at).toLocaleString('en-PH')],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: '#5a6560', fontWeight: 500, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 13, color: label === 'Status' ? (selectedOrder.is_paid === true ? '#22c55e' : selectedOrder.is_paid === null ? '#c4b5fd' : '#f87171') : '#f0f2f1', textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {editOrderTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: 16 }}>
          <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16, marginBottom: 20, position: 'sticky', top: 0, background: '#131615', zIndex: 1 }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1rem', margin: 0 }}>Edit Pre-Order</p>
              <p style={{ fontSize: 12, color: '#5a6560', marginTop: 3 }}>{editOrderTarget.item_name}</p>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>First Name</p>
                  <input className="adm-input" value={editForm.first_name} onChange={(e) => setEditForm((p) => ({ ...p, first_name: e.target.value }))} placeholder="First name" />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>M.I.</p>
                  <input className="adm-input" value={editForm.middle_initial} onChange={(e) => setEditForm((p) => ({ ...p, middle_initial: e.target.value }))} placeholder="M" maxLength={2} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>Last Name</p>
                  <input className="adm-input" value={editForm.last_name} onChange={(e) => setEditForm((p) => ({ ...p, last_name: e.target.value }))} placeholder="Last name" />
                </div>
              </div>

              {/* Sex */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 8 }}>Sex</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Male', 'Female'].map((s) => (
                    <button key={s} type="button" onClick={() => setEditForm((p) => ({ ...p, sex: s }))}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", border: '1px solid', transition: 'all 0.15s',
                        background: editForm.sex === s ? '#22c55e' : 'rgba(255,255,255,0.05)',
                        color:      editForm.sex === s ? '#000'    : '#9aa39d',
                        borderColor: editForm.sex === s ? '#22c55e' : 'rgba(255,255,255,0.1)',
                      }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>Email</p>
                  <input className="adm-input" type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>Phone</p>
                  <input className="adm-input" value={editForm.phone_number} onChange={(e) => setEditForm((p) => ({ ...p, phone_number: e.target.value }))} placeholder="09XXXXXXXXX" />
                </div>
              </div>

              {/* Size */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 8 }}>Size</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['XS','S','M','L','XL','2XL','3XL'].map((sz) => (
                    <button key={sz} type="button" onClick={() => setEditForm((p) => ({ ...p, size: sz }))}
                      style={{ minWidth: 44, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", border: '1px solid', padding: '0 10px', transition: 'all 0.15s',
                        background: editForm.size === sz ? '#22c55e' : 'rgba(255,255,255,0.05)',
                        color:      editForm.size === sz ? '#000'    : '#9aa39d',
                        borderColor: editForm.size === sz ? '#22c55e' : 'rgba(255,255,255,0.1)',
                      }}>{sz}</button>
                  ))}
                  <button type="button" onClick={() => setEditForm((p) => ({ ...p, size: '' }))}
                    style={{ minWidth: 44, height: 36, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", border: '1px solid rgba(255,255,255,0.1)', padding: '0 10px', transition: 'all 0.15s',
                      background: editForm.size === '' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', color: '#9aa39d' }}>
                    None
                  </button>
                </div>
              </div>

              {/* Back name */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>Back Name</p>
                <input className="adm-input" value={editForm.back_text} onChange={(e) => setEditForm((p) => ({ ...p, back_text: e.target.value }))} placeholder="e.g. DELA CRUZ" maxLength={20} />
              </div>

              {/* Back number */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>Back Number</p>
                <input className="adm-input" value={editForm.back_number || ''} onChange={(e) => setEditForm((p) => ({ ...p, back_number: e.target.value }))} placeholder="e.g. 23" maxLength={4} />
              </div>

              {/* Payment method */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 8 }}>Payment Method</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Cash', 'GCash'].map((m) => (
                    <button key={m} type="button" onClick={() => setEditForm((p) => ({ ...p, payment_method: m }))}
                      style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", border: '1px solid', transition: 'all 0.15s',
                        background: editForm.payment_method === m ? (m === 'GCash' ? 'rgba(96,165,250,0.15)' : 'rgba(34,197,94,0.12)') : 'rgba(255,255,255,0.05)',
                        color:      editForm.payment_method === m ? (m === 'GCash' ? '#93c5fd' : '#22c55e') : '#9aa39d',
                        borderColor: editForm.payment_method === m ? (m === 'GCash' ? 'rgba(96,165,250,0.3)' : 'rgba(34,197,94,0.3)') : 'rgba(255,255,255,0.1)',
                      }}>{m}</button>
                  ))}
                </div>
              </div>

              {/* GCash reference — only if GCash selected */}
              {editForm.payment_method === 'GCash' && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 6 }}>GCash Reference No.</p>
                  <input className="adm-input" value={editForm.gcash_reference} onChange={(e) => setEditForm((p) => ({ ...p, gcash_reference: e.target.value }))} placeholder="Reference number" />
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button onClick={() => setEditOrderTarget(null)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#9aa39d', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={savingEdit}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: savingEdit ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", opacity: savingEdit ? 0.6 : 1, transition: 'background 0.2s' }}
                  onMouseEnter={(e) => !savingEdit && (e.currentTarget.style.background = '#28d468')}
                  onMouseLeave={(e) => !savingEdit && (e.currentTarget.style.background = '#22c55e')}>
                  {savingEdit && <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.4)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteOrderTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: 16 }}>
          <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 360, padding: 32, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={22} style={{ color: '#f87171' }} />
            </div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '1rem', marginBottom: 6 }}>Delete Pre-Order?</p>
            <p style={{ color: '#9aa39d', fontSize: 13, marginBottom: 4 }}>
              {[deleteOrderTarget.first_name, deleteOrderTarget.last_name].join(' ')} — {deleteOrderTarget.item_name}
            </p>
            <p style={{ color: '#5a6560', fontSize: 12, marginBottom: 24, lineHeight: 1.6 }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteOrderTarget(null)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#9aa39d', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
                Cancel
              </button>
              <button onClick={deleteOrder}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
