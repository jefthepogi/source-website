import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, X, ArrowLeft, ZoomIn } from 'lucide-react';
import { FaMoneyBill, FaMobileAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import HeaderBgImage from '../assets/merch.png';
import QRCodeImg from '../assets/merch/qr-code.jpeg';
import toast, { Toaster } from 'react-hot-toast';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0d0f0e; --bg-2:#131615; --bg-3:#191c1a; --bg-4:#1f2421;
    --border:rgba(255,255,255,0.07); --border-md:rgba(255,255,255,0.11);
    --accent:#22c55e; --accent-dim:#22c55e18;
    --text:#f0f2f1; --text-2:#9aa39d; --text-3:#5a6560;
    --font-head:'Syne',sans-serif; --font-body:'Outfit',sans-serif; --radius:14px;
  }
  .merch-root { font-family:var(--font-body); background:var(--bg); color:var(--text); }
  .merch-card { background:var(--bg-2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; transition:transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
  .merch-card:hover { transform:translateY(-4px); border-color:var(--border-md); box-shadow:0 16px 48px rgba(0,0,0,0.5); }
  .merch-card-img { transition:transform 0.6s ease; }
  .merch-card:hover .merch-card-img { transform:scale(1.05); }
  .ds-input {
    width:100%; padding:11px 14px;
    background:var(--bg-3); border:1px solid var(--border-md);
    border-radius:8px; color:var(--text);
    font-family:var(--font-body); font-size:14px;
    outline:none; transition:border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none; appearance: none;
    box-sizing: border-box;
  }
  .ds-input::placeholder { color:var(--text-3); }
  .ds-input:focus { border-color:var(--accent); box-shadow: 0 0 0 3px rgba(34,197,94,0.08); }
  .modal-in { animation:modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:none} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .size-btn {
    min-width:44px; height:38px; border-radius:8px; font-size:13px; font-weight:600;
    cursor:pointer; font-family:'Outfit',sans-serif; border:1px solid;
    transition:all 0.15s; padding: 0 10px;
  }
  .pay-opt {
    display:flex; align-items:center; gap:14px; padding:14px 16px;
    background:transparent; border:1px solid rgba(255,255,255,0.11);
    border-radius:10px; cursor:pointer; text-align:left; width:100%;
    font-family:'Outfit',sans-serif; transition:all 0.2s;
  }
  .pay-opt:hover { border-color:#22c55e; background:rgba(34,197,94,0.06); }
  .back-btn {
    display:inline-flex; align-items:center; gap:6px;
    background:transparent; border:none; color:#5a6560;
    font-size:13px; font-weight:500; cursor:pointer;
    font-family:'Outfit',sans-serif; padding:0; transition:color 0.2s;
  }
  .back-btn:hover { color:#9aa39d; }
  .submit-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:#22c55e; color:#000; border:none; border-radius:8px;
    font-family:'Outfit',sans-serif; font-size:14px; font-weight:600;
    cursor:pointer; transition:background 0.2s; width:100%; padding:13px;
  }
  .submit-btn:hover:not(:disabled) { background:#28d468; }
  .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .submit-btn-sm { width:auto; padding:10px 22px; }
  @media (max-width: 480px) {
    .modal-grid-2 { grid-template-columns: 1fr !important; }
    .modal-grid-mi { grid-template-columns: 1fr 70px !important; }
  }
`;

// Items that have sizes (shirt-type items)
const SIZED_CATEGORIES = ['Jersey', 'Shirt', 'Hoodie'];
const hasSizes = (item) => {
  if (Array.isArray(item.sizes) && item.sizes.length) return true;
  return SIZED_CATEGORIES.includes(item.category);
};
const getSizes = (item) =>
  Array.isArray(item.sizes) && item.sizes.length
    ? item.sizes
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

const PAYMENT_OPTIONS = [
  { value: 'Cash', label: 'Cash on Hand', desc: 'Pay directly to an officer', icon: <FaMoneyBill size={16} /> },
  { value: 'GCash', label: 'GCash', desc: 'Scan QR, send reference number', icon: <FaMobileAlt size={16} /> },
];
const OFFICERS = [
  { name: 'Romeo S. Jagonia Jr.' },
  { name: 'Maricar C. Roda' },
  { name: 'Russel Ashley R. Dolera' },
];

// ── Step 1: Personal info + optional size ─────────────────────────────────
function Step1({ item, formData, setFormData, onNext }) {
  const needsSize = hasSizes(item);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, [setFormData]);

  const validate = () => {
    const errs = [];
    if (!formData.firstName.trim()) errs.push('First name is required');
    if (!formData.lastName.trim()) errs.push('Last name is required');
    if (!formData.sex) errs.push('Sex is required');
    if (!formData.phoneNumber.match(/^[0-9]{10,15}$/)) errs.push('Valid phone number required');
    if (!formData.email.match(/^[^\s@]+@lsu\.edu\.ph$/)) errs.push('Valid LSU email required');
    if (needsSize && !formData.size) errs.push('Please select a size');
    if (errs.length) { errs.forEach((e) => toast.error(e, { duration: 3000, style: { background: '#191c1a', color: '#f0f2f1', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'Outfit',sans-serif" } })); return false; }
    return true;
  };

  return (
    <div>
      {/* Item preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <img src={item.image_url || 'https://placehold.co/56x56/191c1a/22c55e?text=M'} alt={item.name}
          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 600, color: '#f0f2f1', fontSize: '0.95rem' }}>{item.name}</p>
          {item.category && <p style={{ fontSize: 11, color: '#5a6560', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.category}</p>}
          <p style={{ color: '#22c55e', fontWeight: 700, marginTop: 4 }}>₱{Number(item.price).toFixed(2)}</p>
        </div>
      </div>

      {/* Personal info */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 10 }}>Personal Information</p>

      <div className="modal-grid-mi" style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 8, marginBottom: 8 }}>
        <input className="ds-input" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        <input className="ds-input" name="middleInitial" placeholder="M.I." value={formData.middleInitial} onChange={handleChange} />
      </div>
      <input className="ds-input" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} style={{ marginBottom: 8 }} />

      <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <input className="ds-input" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <input className="ds-input" name="email" type="email" placeholder="LSU Email" value={formData.email} onChange={handleChange} />
      </div>

      <select className="ds-input" name="sex" value={formData.sex} onChange={handleChange} style={{ marginBottom: needsSize ? 20 : 0 }}>
        <option value="">Select Sex</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      {/* Size picker — only for shirts/jerseys/hoodies */}
      {needsSize && (
        <>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 10 }}>Select Size</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {getSizes(item).map((sz) => (
              <button key={sz} type="button" className="size-btn"
                onClick={() => setFormData((p) => ({ ...p, size: sz }))}
                style={{
                  background: formData.size === sz ? '#22c55e' : 'transparent',
                  color: formData.size === sz ? '#000' : '#9aa39d',
                  borderColor: formData.size === sz ? '#22c55e' : 'rgba(255,255,255,0.11)',
                }}>
                {sz}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#5a6560', marginBottom: 20 }}>
            Not sure about your size?{' '}
            <button type="button" onClick={() => document.getElementById('size-chart-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: 11, fontFamily: "'Outfit',sans-serif", padding: 0, textDecoration: 'underline' }}>
              View size chart ↓
            </button>
          </p>
        </>
      )}

      <button type="button" className="submit-btn" onClick={() => validate() && onNext()}>
        Continue to Payment
      </button>
    </div>
  );
}

// ── Step 2: Payment method ─────────────────────────────────────────────────
function Step2({ onSelect, onBack }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 14 }}>Payment Method</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {PAYMENT_OPTIONS.map((opt) => (
          <button key={opt.value} type="button" className="pay-opt" onClick={() => onSelect(opt.value)}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa39d', flexShrink: 0 }}>
              {opt.icon}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f1' }}>{opt.label}</p>
              <p style={{ fontSize: 12, color: '#5a6560', marginTop: 2 }}>{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <button type="button" className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Back</button>
    </div>
  );
}

// ── Step 3: Confirm ────────────────────────────────────────────────────────
function Step3({ formData, setFormData, onSubmit, onBack, submitting }) {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, [setFormData]);

  if (formData.paymentMethod === 'Cash') {
    return (
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 14 }}>Cash Payment</p>
        <p style={{ color: '#9aa39d', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          After submitting, contact one of the officers below to arrange your payment.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {OFFICERS.map((o) => (
            <div key={o.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {o.name[0]}
              </div>
              <span style={{ fontSize: 13, color: '#f0f2f1' }}>{o.name}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <button type="button" className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Back</button>
          <button type="button" className="submit-btn submit-btn-sm" onClick={onSubmit} disabled={submitting}>
            {submitting ? <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.4)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : 'Confirm Order'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a6560', marginBottom: 14 }}>GCash Payment</p>
      <img src={QRCodeImg} alt="GCash QR" style={{ width: 160, height: 160, display: 'block', margin: '0 auto 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }} />
      <p style={{ textAlign: 'center', fontSize: 12, color: '#9aa39d', marginBottom: 16 }}>
        GCash: <strong style={{ color: '#f0f2f1' }}>09157924836</strong>
      </p>
      <input className="ds-input" name="gcashReference" placeholder="Reference Number" value={formData.gcashReference} onChange={handleChange} style={{ marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <button type="button" className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Back</button>
        <button type="button" className="submit-btn submit-btn-sm" onClick={onSubmit} disabled={submitting}>
          {submitting ? <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.4)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
// ── Item Inspect Modal ────────────────────────────────────────────────────────
function ItemInspectModal({ item, onClose, onOrder }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPinchDist, setLastPinchDist] = useState(null);
  const imgRef = React.useRef();

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;

  // Reset when opened
  React.useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  // Close on Escape
  React.useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const clampPos = (x, y, s) => {
    // When zoomed, allow panning within bounds
    const maxX = (s - 1) * 200;
    const maxY = (s - 1) * 200;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((s) => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s + delta));
      if (next === MIN_SCALE) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  // Mouse drag
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const raw = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    setPos(clampPos(raw.x, raw.y, scale));
  };
  const handleMouseUp = () => setDragging(false);

  // Touch pinch-to-zoom
  const getPinchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setLastPinchDist(getPinchDist(e.touches));
    } else if (e.touches.length === 1 && scale > 1) {
      setDragging(true);
      setDragStart({ x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastPinchDist !== null) {
      const dist = getPinchDist(e.touches);
      const ratio = dist / lastPinchDist;
      setScale((s) => {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s * ratio));
        if (next === MIN_SCALE) setPos({ x: 0, y: 0 });
        return next;
      });
      setLastPinchDist(dist);
    } else if (e.touches.length === 1 && dragging) {
      const raw = { x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y };
      setPos(clampPos(raw.x, raw.y, scale));
    }
  };

  const handleTouchEnd = () => { setDragging(false); setLastPinchDist(null); };

  const resetZoom = () => { setScale(1); setPos({ x: 0, y: 0 }); };
  const zoomIn  = () => setScale((s) => Math.min(MAX_SCALE, +(s + 0.5).toFixed(1)));
  const zoomOut = () => { setScale((s) => { const n = Math.max(MIN_SCALE, +(s - 0.5).toFixed(1)); if (n === MIN_SCALE) setPos({ x: 0, y: 0 }); return n; }); };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)', zIndex: 10 }}>
        <div>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '0.95rem', margin: 0 }}>{item.name}</p>
          {item.category && <p style={{ fontSize: 11, color: '#5a6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{item.category}</p>}
        </div>
        <button onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f0f2f1', transition: 'background 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={18} />
        </button>
      </div>

      {/* Image viewport */}
      <div
        ref={imgRef}
        style={{ width: '100%', maxWidth: 680, height: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in', userSelect: 'none', touchAction: 'none' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => { if (scale === 1) setScale(2); }}
      >
        <img
          src={item.image_url || 'https://placehold.co/600x600/191c1a/22c55e?text=MERCH'}
          alt={item.name}
          draggable={false}
          style={{
            maxWidth: '90vw',
            maxHeight: '65vh',
            objectFit: 'contain',
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transition: dragging || lastPinchDist ? 'none' : 'transform 0.2s ease',
            borderRadius: scale > 1 ? 0 : 12,
          }}
        />
      </div>

      {/* Controls bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={zoomOut} disabled={scale <= MIN_SCALE}
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#f0f2f1', cursor: scale <= MIN_SCALE ? 'not-allowed' : 'pointer', opacity: scale <= MIN_SCALE ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 300, transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >−</button>

          <button onClick={resetZoom}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#f0f2f1', cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 500, minWidth: 52, textAlign: 'center', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >{Math.round(scale * 100)}%</button>

          <button onClick={zoomIn} disabled={scale >= MAX_SCALE}
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#f0f2f1', cursor: scale >= MAX_SCALE ? 'not-allowed' : 'pointer', opacity: scale >= MAX_SCALE ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 300, transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >+</button>

          <span style={{ fontSize: 11, color: '#5a6560', marginLeft: 4, display: 'none' }} className="hint-desktop">Scroll to zoom · Drag to pan</span>
          <span style={{ fontSize: 11, color: '#5a6560', marginLeft: 4, display: 'none' }} className="hint-mobile">Pinch to zoom · Drag to pan</span>
        </div>

        {/* Item info + order button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>₱{Number(item.price).toFixed(2)}</p>
          <button onClick={onOrder}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#28d468'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
          >
            <ShoppingCart size={14} /> Pre-Order
          </button>
        </div>
      </div>

      {/* Hint text - show on first open */}
      <style>{`
        @media (hover: hover) { .hint-desktop { display: inline !important; } }
        @media (hover: none)  { .hint-mobile  { display: inline !important; } }
      `}</style>
    </div>
  );
}

export default function MerchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inspectItem, setInspectItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', middleInitial: '', lastName: '',
    sex: '', phoneNumber: '', email: '',
    size: '', paymentMethod: '', gcashReference: '',
  });

  useEffect(() => {
    supabase.from('merch_items').select('*').eq('available', true).order('sort_order')
      .then(({ data, error }) => { if (!error && data) setItems(data); setLoading(false); });
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setFormStep(1);
    setFormData({ firstName: '', middleInitial: '', lastName: '', sex: '', phoneNumber: '', email: '', size: '', paymentMethod: '', gcashReference: '' });
  };

  const closeModal = () => { setShowModal(false); setSelectedItem(null); };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('merch_preorders').insert([{
        first_name: formData.firstName.trim(),
        middle_initial: formData.middleInitial.trim() || null,
        last_name: formData.lastName.trim(),
        sex: formData.sex,
        phone_number: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        size: formData.size || null,
        payment_method: formData.paymentMethod,
        gcash_reference: formData.gcashReference.trim() || null,
        item_name: selectedItem.name,
        item_id: selectedItem.id,
      }]);
      if (error) throw error;
      toast.success('Pre-order submitted! We\'ll be in touch soon.', {
        style: { background: '#131615', color: '#f0f2f1', border: '1px solid rgba(34,197,94,0.3)', fontFamily: "'Outfit',sans-serif" },
        duration: 4000,
      });
      closeModal();
    } catch {
      toast.error('Submission failed. Please try again.', {
        style: { background: '#131615', color: '#f0f2f1', border: '1px solid rgba(239,68,68,0.3)', fontFamily: "'Outfit',sans-serif" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasAnyShirt = items.some((i) => hasSizes(i));

  return (
    <>
      <style>{S}</style>
      <div className="merch-root">
        <Toaster position="top-center" />

        {/* Hero */}
        <div style={{ position: 'relative', height: 'clamp(280px, 50vw, 420px)', overflow: 'hidden', background: '#0a0c0b' }}>
          <img src={HeaderBgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,12,10,0.93) 0%, rgba(8,12,10,0.72) 55%, rgba(8,12,10,0.4) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.45 }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 11vw clamp(28px, 6vw, 48px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Exclusive Drops</span>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#f0f2f1', lineHeight: 1.05, marginBottom: 10 }}>Merch</h1>
            <p style={{ color: 'rgba(240,242,241,0.45)', fontWeight: 300, maxWidth: '360px', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Grab your exclusive SOURCE merch and represent with pride.</p>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
        </div>

        {/* Items grid */}
        <div style={{ padding: 'clamp(32px, 8vw, 64px) 11vw' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Collection</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: '#f0f2f1' }}>Available Items</h2>
            </div>
            {!loading && <span style={{ fontSize: 12, color: '#5a6560' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ width: 28, height: 28, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🛍</p>
              <p style={{ color: '#5a6560', fontSize: 14 }}>No merch available right now. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: 16 }}>
              {items.map((item) => (
                <div key={item.id} className="merch-card">
                  <div
                    style={{ aspectRatio: '1', overflow: 'hidden', background: '#191c1a', position: 'relative', cursor: 'zoom-in' }}
                    onClick={() => setInspectItem(item)}
                    title="Click to inspect"
                  >
                    <img src={item.image_url || 'https://placehold.co/400x400/191c1a/22c55e?text=MERCH'} alt={item.name}
                      className="merch-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '4px 6px', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.85 }}>
                      <ZoomIn size={12} style={{ color: '#fff' }} />
                      <span style={{ fontSize: 10, color: '#fff', fontFamily: "'Outfit',sans-serif", fontWeight: 500 }}>Inspect</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, color: '#f0f2f1', fontSize: '0.9rem' }}>{item.name}</p>
                    {item.category && <p style={{ fontSize: 11, color: '#5a6560', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.category}</p>}
                    {item.description && <p style={{ fontSize: 12, color: '#5a6560', marginTop: 6, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                      <p style={{ color: '#22c55e', fontWeight: 700 }}>₱{Number(item.price).toFixed(2)}</p>
                      <button type="button" onClick={() => openModal(item)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#28d468'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
                      >
                        <ShoppingCart size={12} /> Pre-Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Size Chart Section ── */}
        {hasAnyShirt && (
          <section id="size-chart-section" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: 'clamp(32px, 8vw, 64px) 11vw', background: '#0a0c0b' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Sizing</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 2rem)', color: '#f0f2f1', marginBottom: 8 }}>Size Reference</h2>
              <p style={{ color: '#5a6560', fontSize: 13, marginBottom: 24 }}>All measurements are in inches. Measure flat across the chest for width.</p>

              <div style={{ background: '#131615', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(34,197,94,0.1)', borderBottom: '1px solid rgba(34,197,94,0.15)' }}>
                  {['Size', 'Width', 'Length'].map((h) => (
                    <div key={h} style={{ padding: '13px 20px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#22c55e' }}>{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {[
                  ['3XL', '26 ½"', '35"'],
                  ['2XL', '24 ¼"', '32"'],
                  ['XL',  '22 ¼"', '30"'],
                  ['L',   '21"',   '29"'],
                  ['M',   '20"',   '28"'],
                  ['S',   '19"',   '27"'],
                  ['XS',  '18"',   '26"'],
                ].map(([size, width, length], i, arr) => (
                  <div key={size} style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(34,197,94,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ padding: '13px 20px', textAlign: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#22c55e', fontSize: 15 }}>{size}</div>
                    <div style={{ padding: '13px 20px', textAlign: 'center', color: '#c8ccc9', fontSize: 14, fontWeight: 400 }}>{width}</div>
                    <div style={{ padding: '13px 20px', textAlign: 'center', color: '#c8ccc9', fontSize: 14, fontWeight: 400 }}>{length}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Item Inspect Modal ── */}
        {inspectItem && (
          <ItemInspectModal
            item={inspectItem}
            onClose={() => setInspectItem(null)}
            onOrder={() => { setInspectItem(null); openModal(inspectItem); }}
          />
        )}

        {/* ── Pre-order Modal ── */}
        {showModal && selectedItem && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: '16px' }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            {/* On desktop center it; on mobile slide up from bottom */}
            <div className="modal-in"
              style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, background: '#131615', zIndex: 2 }}>
                <div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', fontSize: '0.95rem' }}>Pre-Order</p>
                  <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                    {[1, 2, 3].map((s) => (
                      <div key={s} style={{ height: 3, borderRadius: 2, transition: 'all 0.3s', background: formStep >= s ? '#22c55e' : 'rgba(255,255,255,0.1)', width: formStep === s ? 22 : 7 }} />
                    ))}
                  </div>
                </div>
                <button type="button" onClick={closeModal}
                  style={{ background: 'transparent', border: 'none', color: '#5a6560', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#9aa39d'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#5a6560'}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px 20px 32px' }}>
                {formStep === 1 && (
                  <Step1 item={selectedItem} formData={formData} setFormData={setFormData} onNext={() => setFormStep(2)} />
                )}
                {formStep === 2 && (
                  <Step2 onSelect={(method) => { setFormData((p) => ({ ...p, paymentMethod: method })); setFormStep(3); }} onBack={() => setFormStep(1)} />
                )}
                {formStep === 3 && (
                  <Step3 formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onBack={() => setFormStep(2)} submitting={submitting} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
