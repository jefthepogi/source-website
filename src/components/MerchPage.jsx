import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { FaMoneyBill, FaMobileAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import HeaderBgImage from '../assets/merch.png';
import QRCodeImg from '../assets/merch/qr-code.jpg';
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
  .merch-card img { transition:transform 0.6s ease; }
  .merch-card:hover img { transform:scale(1.05); }
  .ds-input { width:100%; padding:10px 14px; background:var(--bg-3); border:1px solid var(--border-md); border-radius:8px; color:var(--text); font-family:var(--font-body); font-size:13px; outline:none; margin-bottom:8px; transition:border-color 0.2s; }
  .ds-input::placeholder { color:var(--text-3); }
  .ds-input:focus { border-color:var(--accent); }
  .modal-in { animation:modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes modalIn { from{opacity:0;transform:scale(0.92) translateY(10px)} to{opacity:1;transform:none} }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

// Pre-orders are saved to Supabase (merch_preorders table)
const PAYMENT_OPTIONS = [
  { value: 'Cash', label: 'Cash on Hand', desc: 'Pay directly to an officer', icon: <FaMoneyBill size={16} /> },
  { value: 'GCash', label: 'GCash', desc: 'Scan QR, send reference number', icon: <FaMobileAlt size={16} /> },
];
const OFFICERS = [{ name: 'Romeo S. Jagonia Jr.' }, { name: 'Maricar C. Roda' }, { name: 'Russel Ashley R. Dolera' }];

export default function MerchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ firstName:'', middleInitial:'', lastName:'', sex:'', phoneNumber:'', email:'', size:'', paymentMethod:'', gcashReference:'' });

  useEffect(() => {
    supabase.from('merch_items').select('*').eq('available', true).order('sort_order')
      .then(({ data, error }) => { if (!error && data) setItems(data); setLoading(false); });
  }, []);

  const openModal = (item) => { setSelectedItem(item); setShowModal(true); setFormStep(1); setFormData({ firstName:'', middleInitial:'', lastName:'', sex:'', phoneNumber:'', email:'', size:'', paymentMethod:'', gcashReference:'' }); };
  const closeModal = () => { setShowModal(false); setSelectedItem(null); };
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const getSizes = (item) => Array.isArray(item.sizes) && item.sizes.length ? item.sizes : ['XS','S','M','L','XL','XXL'];

  const validate1 = () => {
    const errs = [];
    if (!formData.firstName.trim()) errs.push('First name required');
    if (!formData.lastName.trim()) errs.push('Last name required');
    if (!formData.sex) errs.push('Sex required');
    if (!formData.phoneNumber.match(/^[0-9]{10,15}$/)) errs.push('Valid phone number required');
    if (!formData.email.match(/^[^\s@]+@lsu\.edu\.ph$/)) errs.push('Valid LSU email required');
    if (!formData.size) errs.push('Size required');
    if (errs.length) { errs.forEach((e) => toast.error(e, { duration: 3000 })); return false; }
    return true;
  };

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
        size: formData.size,
        payment_method: formData.paymentMethod,
        gcash_reference: formData.gcashReference.trim() || null,
        item_name: selectedItem.name,
        item_id: selectedItem.id,
      }]);
      if (error) throw error;
      toast.success('Pre-order submitted!');
      closeModal();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const ModalContent = () => {
    switch(formStep) {
      case 1: return (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <img src={selectedItem.image_url || 'https://placehold.co/64x64/191c1a/22c55e?text=M'} alt={selectedItem.name} style={{ width:56, height:56, objectFit:'cover', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }} />
            <div>
              <p style={{ fontWeight:600, color:'#f0f2f1', fontSize:'0.9rem' }}>{selectedItem.name}</p>
              <p style={{ color:'#22c55e', fontWeight:600, marginTop:2 }}>₱{Number(selectedItem.price).toFixed(2)}</p>
            </div>
          </div>

          <Label>Personal Information</Label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 80px', gap:8 }}>
            <input className="ds-input" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} style={{ marginBottom:0 }} />
            <input className="ds-input" name="middleInitial" placeholder="M.I." value={formData.middleInitial} onChange={handleChange} style={{ marginBottom:0 }} />
          </div>
          <input className="ds-input" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
          <input className="ds-input" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
          <input className="ds-input" name="email" type="email" placeholder="LSU Email (juan@lsu.edu.ph)" value={formData.email} onChange={handleChange} />
          <select className="ds-input" name="sex" value={formData.sex} onChange={handleChange}>
            <option value="">Select Sex</option>
            <option>Male</option><option>Female</option>
          </select>

          <Label style={{ marginTop:8 }}>Select Size</Label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {getSizes(selectedItem).map((sz) => (
              <button key={sz} onClick={() => setFormData((p) => ({ ...p, size:sz }))}
                style={{ width:44, height:36, borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", border:'1px solid', transition:'all 0.15s',
                  background: formData.size===sz ? '#22c55e' : 'transparent',
                  color: formData.size===sz ? '#000' : '#9aa39d',
                  borderColor: formData.size===sz ? '#22c55e' : 'rgba(255,255,255,0.11)',
                }}>
                {sz}
              </button>
            ))}
          </div>

          <Btn onClick={() => validate1() && setFormStep(2)}>Continue to Payment</Btn>
        </div>
      );
      case 2: return (
        <div>
          <Label>Payment Method</Label>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {PAYMENT_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => { setFormData((p) => ({ ...p, paymentMethod:opt.value })); setFormStep(3); }}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.11)', borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all 0.2s', fontFamily:"'Outfit',sans-serif" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor='#22c55e'; e.currentTarget.style.background='rgba(34,197,94,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor='rgba(255,255,255,0.11)'; e.currentTarget.style.background='transparent'; }}
              >
                <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', color:'#9aa39d' }}>{opt.icon}</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#f0f2f1' }}>{opt.label}</p>
                  <p style={{ fontSize:12, color:'#5a6560', marginTop:1 }}>{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <BackBtn onClick={() => setFormStep(1)} />
        </div>
      );
      case 3:
        if (formData.paymentMethod === 'Cash') return (
          <div>
            <Label>Cash Payment</Label>
            <p style={{ color:'#9aa39d', fontSize:13, marginBottom:16 }}>Contact an officer to arrange payment.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              {OFFICERS.map((o) => (
                <div key={o.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'#22c55e', fontWeight:700, fontSize:13 }}>{o.name[0]}</div>
                  <span style={{ fontSize:13, color:'#f0f2f1' }}>{o.name}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <BackBtn onClick={() => setFormStep(2)} />
              <Btn onClick={handleSubmit} disabled={submitting} small>{submitting ? 'Submitting…' : 'Confirm Order'}</Btn>
            </div>
          </div>
        );
        return (
          <div>
            <Label>GCash Payment</Label>
            <img src={QRCodeImg} alt="QR" style={{ width:160, height:160, display:'block', margin:'0 auto 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.07)' }} />
            <p style={{ textAlign:'center', fontSize:12, color:'#9aa39d', marginBottom:16 }}>GCash: <strong style={{ color:'#f0f2f1' }}>09157924836</strong></p>
            <input className="ds-input" name="gcashReference" placeholder="Reference Number" value={formData.gcashReference} onChange={handleChange} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
              <BackBtn onClick={() => setFormStep(2)} />
              <Btn onClick={handleSubmit} disabled={submitting} small>{submitting ? 'Submitting…' : 'Confirm Order'}</Btn>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="merch-root">
        <Toaster position="top-center" toastOptions={{ style:{ background:'#191c1a', color:'#f0f2f1', border:'1px solid rgba(255,255,255,0.07)', fontFamily:"'Outfit',sans-serif" } }} />

        {/* Hero */}
        <div style={{ position:'relative', height:'420px', overflow:'hidden', background:'#0a0c0b' }}>
          <img src={HeaderBgImage} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, rgba(8,12,10,0.93) 0%, rgba(8,12,10,0.72) 55%, rgba(8,12,10,0.4) 100%)' }} />
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize:'32px 32px', opacity:0.45 }} />
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 11vw 48px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ width:20, height:1, background:'#22c55e', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Exclusive Drops</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'clamp(2.5rem, 5vw, 4rem)', color:'#f0f2f1', lineHeight:1.05, marginBottom:12 }}>Merch</h1>
            <p style={{ color:'rgba(240,242,241,0.45)', fontWeight:300, maxWidth:'360px' }}>Grab your exclusive SOURCE merch and represent with pride.</p>
          </div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:64, background:'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
        </div>

        {/* Grid */}
        <div style={{ padding:'64px 11vw' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ width:20, height:1, background:'#22c55e', display:'inline-block' }} />
                <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'#22c55e' }}>Collection</span>
              </div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:'clamp(1.5rem, 3vw, 2rem)', color:'#f0f2f1' }}>Available Items</h2>
            </div>
            {!loading && <span style={{ fontSize:12, color:'#5a6560' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>}
          </div>

          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
              <div style={{ width:28, height:28, border:'2px solid #22c55e', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <p style={{ fontSize:40, marginBottom:12 }}>🛍</p>
              <p style={{ color:'#5a6560', fontSize:14 }}>No merch available right now.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:20 }}>
              {items.map((item) => (
                <div key={item.id} className="merch-card">
                  <div style={{ aspectRatio:'1', overflow:'hidden', background:'#191c1a' }}>
                    <img src={item.image_url || 'https://placehold.co/400x400/191c1a/22c55e?text=MERCH'} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                  </div>
                  <div style={{ padding:'16px 18px' }}>
                    <p style={{ fontWeight:600, color:'#f0f2f1', fontSize:'0.9rem' }}>{item.name}</p>
                    {item.description && <p style={{ fontSize:12, color:'#5a6560', marginTop:4, lineHeight:1.5, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{item.description}</p>}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
                      <p style={{ color:'#22c55e', fontWeight:700 }}>₱{Number(item.price).toFixed(2)}</p>
                      <button onClick={() => openModal(item)}
                        style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#22c55e', color:'#000', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background='#28d468'}
                        onMouseLeave={(e) => e.currentTarget.style.background='#22c55e'}
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

        {/* Modal */}
        {showModal && selectedItem && (
          <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', padding:16 }}
            onClick={(e) => e.target===e.currentTarget && closeModal()}>
            <div className="modal-in" style={{ background:'#131615', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, width:'100%', maxWidth:420, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'#f0f2f1', fontSize:'0.95rem' }}>Pre-Order</p>
                  <div style={{ display:'flex', gap:6, marginTop:8 }}>
                    {[1,2,3].map((s) => (
                      <div key={s} style={{ height:3, borderRadius:2, transition:'all 0.3s', background: formStep>=s ? '#22c55e' : 'rgba(255,255,255,0.1)', width: formStep===s ? 24 : 8 }} />
                    ))}
                  </div>
                </div>
                <button onClick={closeModal} style={{ background:'transparent', border:'none', color:'#5a6560', cursor:'pointer', padding:6, borderRadius:8, display:'flex' }}
                  onMouseEnter={(e) => e.currentTarget.style.color='#9aa39d'}
                  onMouseLeave={(e) => e.currentTarget.style.color='#5a6560'}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding:'20px 24px 24px' }}><ModalContent /></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Label({ children, style }) {
  return <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#5a6560', marginBottom:10, ...style }}>{children}</p>;
}
function Btn({ children, onClick, disabled, small }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, background: disabled?'#22c55e66':'#22c55e', color:'#000', border:'none', borderRadius:8, padding: small?'9px 20px':'11px 100%', fontSize:13, fontWeight:600, cursor: disabled?'not-allowed':'pointer', fontFamily:"'Outfit',sans-serif", transition:'background 0.2s', width: small?'auto':'100%' }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.background='#28d468')}
      onMouseLeave={(e) => !disabled && (e.currentTarget.style.background='#22c55e')}
    >
      {children}
    </button>
  );
}
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'transparent', border:'none', color:'#5a6560', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:"'Outfit',sans-serif", padding:0, transition:'color 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.color='#9aa39d'}
      onMouseLeave={(e) => e.currentTarget.style.color='#5a6560'}
    >
      <ArrowLeft size={13} /> Back
    </button>
  );
}
