import React, { useState, useEffect, useCallback } from 'react';
import '../../admin.css';
import { supabase } from '../../lib/supabase';
import { CRUDTable } from './CRUDTable';
import { ShoppingBag, Download, X, Eye, Users, CheckCircle, Circle, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';

const MERCH_FIELDS = [
  { name: 'name',        label: 'Item Name',   type: 'text',     required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'price',       label: 'Price (PHP)', type: 'number',   required: true, placeholder: '350' },
  { name: 'image_url',   label: 'Item Image',  type: 'image',    folder: 'merch', bucket: 'images' },
  { name: 'category',    label: 'Category',    type: 'select',   options: ['Jersey', 'Shirt', 'Hoodie', 'Cap', 'Lanyard', 'Sticker', 'Other'] },
  { name: 'sort_order',  label: 'Sort Order',  type: 'number',   placeholder: '0' },
  { name: 'available',   label: 'Available',   type: 'boolean' },
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

function EarningsTab({ orders, rows }) {
  const priceMap = {};
  rows.forEach((item) => { priceMap[item.name] = Number(item.price) || 0; });

  const paidOrders   = orders.filter((o) => o.is_paid);
  const unpaidOrders = orders.filter((o) => !o.is_paid);
  const totalEarned  = paidOrders.reduce((s, o) => s + (priceMap[o.item_name] || 0), 0);
  const totalPending = unpaidOrders.reduce((s, o) => s + (priceMap[o.item_name] || 0), 0);
  const totalRevenue = totalEarned + totalPending;

  const byItem = {};
  orders.forEach((o) => {
    if (!byItem[o.item_name]) byItem[o.item_name] = { name: o.item_name, price: priceMap[o.item_name] || 0, total: 0, paid: 0, unpaid: 0 };
    byItem[o.item_name].total++;
    if (o.is_paid) byItem[o.item_name].paid++;
    else byItem[o.item_name].unpaid++;
  });
  const breakdown = Object.values(byItem).sort((a, b) => (b.paid * b.price) - (a.paid * a.price));
  const cols = '2fr 0.8fr 0.8fr 0.8fr 1fr 1fr';

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Revenue',   value: fmt(totalRevenue), sub: `${orders.length} order${orders.length !== 1 ? 's' : ''}`, color: '#f0f2f1', bg: 'rgba(255,255,255,0.04)' },
          { label: 'Collected',       value: fmt(totalEarned),  sub: `${paidOrders.length} paid`,                               color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
          { label: 'Pending',         value: fmt(totalPending), sub: `${unpaidOrders.length} unpaid`,                           color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
          { label: 'Collection Rate', value: pct(paidOrders.length, orders.length), sub: 'of orders paid',                      color: '#93c5fd', bg: 'rgba(96,165,250,0.08)'  },
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
          <span style={{ fontSize: 12, color: '#9aa39d', fontWeight: 500 }}>Collection progress</span>
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
            {['Item', 'Price', 'Orders', 'Paid', 'Collected', 'Pending'].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
            ))}
          </div>
          {breakdown.map((item, i) => (
            <div key={item.name} style={{ display: 'grid', gridTemplateColumns: cols, padding: '13px 16px', borderBottom: i < breakdown.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#f0f2f1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              <span style={{ fontSize: 12, color: '#9aa39d' }}>{fmt(item.price)}</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#f0f2f1' }}>{item.total}</span>
              <span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>{item.paid}</span>
                {item.unpaid > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 100, background: 'rgba(251,191,36,0.1)', color: '#fbbf24', marginLeft: 4 }}>{item.unpaid}</span>
                )}
              </span>
              <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{fmt(item.paid * item.price)}</span>
              <span style={{ fontSize: 13, color: item.unpaid > 0 ? '#fbbf24' : '#5a6560', fontWeight: item.unpaid > 0 ? 600 : 400 }}>{fmt(item.unpaid * item.price)}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '13px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#9aa39d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
            <span />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#f0f2f1' }}>{orders.length}</span>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: '#22c55e' }}>{paidOrders.length}</span>
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
  const [filterItem,        setFilterItem]        = useState('all');
  const [filterPaid,        setFilterPaid]        = useState('all');
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
    const newVal = !order.is_paid;
    await supabase.from('merch_preorders').update({ is_paid: newVal }).eq('id', order.id);
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, is_paid: newVal } : o));
    if (selectedOrder?.id === order.id) setSelectedOrder((p) => ({ ...p, is_paid: newVal }));
    setTogglingPaid(null);
  };

  const deleteOrder = async () => {
    await supabase.from('merch_preorders').delete().eq('id', deleteOrderTarget.id);
    setOrders((prev) => prev.filter((o) => o.id !== deleteOrderTarget.id));
    if (selectedOrder?.id === deleteOrderTarget.id) setSelectedOrder(null);
    setDeleteOrderTarget(null);
  };

  const exportCSV = () => {
    const filtered = getFiltered();
    const csvRows = [
      ['Full Name', 'Email', 'Phone', 'Sex', 'Item', 'Size', 'Back Text', 'Payment', 'GCash Ref', 'Paid', 'Submitted'],
      ...filtered.map((o) => [
        `"${[o.first_name, o.middle_initial ? o.middle_initial + '.' : '', o.last_name].filter(Boolean).join(' ')}"`,
        `"${o.email}"`, `"${o.phone_number}"`, `"${o.sex || ''}"`,
        `"${o.item_name}"`, `"${o.size || ''}"`, `"${o.payment_method}"`,
        `"${o.gcash_reference || ''}"`, o.is_paid ? 'Yes' : 'No',
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
    if (filterPaid === 'paid')   f = f.filter((o) => o.is_paid);
    if (filterPaid === 'unpaid') f = f.filter((o) => !o.is_paid);
    return f;
  };

  const filteredOrders = getFiltered();
  const unpaidCount    = orders.filter((o) => !o.is_paid).length;

  const TABS = [
    { id: 'items',    label: 'Items',      icon: <ShoppingBag size={13} /> },
    { id: 'orders',   label: 'Pre-Orders', icon: <Users size={13} />,      badge: unpaidCount > 0 ? unpaidCount : null },
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
          defaultValues={{ available: true, category: 'Jersey', sort_order: 0 }}
          imageFolder="merch"
          hideTitle
        />
      )}

      {tab === 'orders' && (
        <div>
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
              {['all', 'paid', 'unpaid'].map((f) => (
                <button key={f} onClick={() => setFilterPaid(f)}
                  style={{ padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'Outfit',sans-serif", textTransform: 'capitalize', transition: 'all 0.15s',
                    background: filterPaid === f ? (f === 'paid' ? 'rgba(34,197,94,0.15)' : f === 'unpaid' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.06)',
                    color:      filterPaid === f ? (f === 'paid' ? '#22c55e' : f === 'unpaid' ? '#f87171' : '#f0f2f1') : '#9aa39d',
                  }}>
                  {f === 'all' ? 'All Status' : f}
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
              <div style={{ display: 'grid', gridTemplateColumns: '28px 1.8fr 1.2fr 0.8fr 0.9fr 0.6fr 0.85fr 0.75fr 56px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                {['#', 'Customer', 'Email', 'Phone', 'Item', 'Size', 'Payment', 'Paid', ''].map((h) => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a6560' }}>{h}</span>
                ))}
              </div>
              {filteredOrders.map((o, i) => (
                <div key={o.id} className="order-row"
                  style={{ display: 'grid', gridTemplateColumns: '28px 1.8fr 1.2fr 0.8fr 0.9fr 0.6fr 0.85fr 0.75fr 56px', padding: '11px 16px', alignItems: 'center', cursor: 'pointer' }}
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
                      style={{ background: o.is_paid ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: o.is_paid ? '#22c55e' : '#5a6560', opacity: togglingPaid === o.id ? 0.5 : 1 }}>
                      {o.is_paid ? <CheckCircle size={13} /> : <Circle size={13} />}
                      {o.is_paid ? 'Paid' : 'Unpaid'}
                    </button>
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
          )}
        </div>
      )}

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
                  style={{ background: selectedOrder.is_paid ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', color: selectedOrder.is_paid ? '#22c55e' : '#5a6560' }}>
                  {selectedOrder.is_paid ? <CheckCircle size={12} /> : <Circle size={12} />}
                  {selectedOrder.is_paid ? 'Paid' : 'Mark as Paid'}
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
                ['Back Text', selectedOrder.back_text || '—'],
                ['Payment',   selectedOrder.payment_method],
                ['GCash Ref', selectedOrder.gcash_reference || '—'],
                ['Status',    selectedOrder.is_paid ? 'Paid' : 'Unpaid'],
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
