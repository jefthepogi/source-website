import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ZoomIn, ZoomOut, Maximize2, Clock } from 'lucide-react';

const supabase = createClient('https://ehjruxjzmxarulzfsotn.supabase.co', 'sb_publishable_bA_wjwQ1e2TdYLez_TzOpA_8dGhYER1');

const LasallianTree = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredLeaf, setHoveredLeaf] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mainRef = useRef(null);

  useEffect(() => {
    const lastPost = localStorage.getItem('last_post_time');
    if (lastPost) {
      const remaining = 60 - Math.floor((Date.now() - parseInt(lastPost)) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }

    const handleInitialView = () => {
      const isMobile = window.innerWidth < 768;
      setScale(isMobile ? 0.45 : 0.8);
      setPosition({ x: 0, y: isMobile ? -50 : 0 });
    };

    handleInitialView();
    fetchMessages();
    
    const handleWheel = (e) => {
      if (e.target.closest('.interactive-ui')) return;
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setScale(s => Math.min(Math.max(0.3, s + delta), 3));
    };

    const canvas = mainRef.current;
    if (canvas) canvas.addEventListener('wheel', handleWheel, { passive: false });

    const channel = supabase
      .channel('tree_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gratitude_tree' }, () => fetchMessages())
      .subscribe();
    
    return () => { 
      supabase.removeChannel(channel); 
      if (canvas) canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('gratitude_tree').select('*').order('created_at', { ascending: true });
    if (data) setMessages(data);
  };

  const handleSubmit = async () => {
    if (!input.trim() || input.length > 60 || isSubmitting || cooldown > 0) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('gratitude_tree').insert([{ message: input.trim() }]);
      if (!error) {
        setInput('');
        localStorage.setItem('last_post_time', Date.now().toString());
        setCooldown(60);
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePan = (e) => {
    if (isDragging) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    }
  };

  const startDragging = (e) => {
    if (e.target.closest('.interactive-ui')) return;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const treeData = useMemo(() => {
    const branches = [];
    const leaves = [];
    const trunkBaseX = 400;
    const trunkBaseY = 620;
    const trunkHeight = 160 + Math.min(messages.length * 1.2, 140);
    
    for (let i = 0; i < 15; i++) {
      branches.push({ 
        x1: trunkBaseX + Math.sin(i * 0.3) * 3, 
        y1: trunkBaseY - (i * trunkHeight / 15), 
        x2: trunkBaseX + Math.sin((i + 1) * 0.3) * 3, 
        y2: trunkBaseY - ((i + 1) * trunkHeight / 15), 
        depth: Math.max(14 - (i * 0.6), 5)
      });
    }

    const goldenAngle = 137.5;
    messages.forEach((msg, i) => {
      const angle = (i * goldenAngle) % 360;
      const hRatio = 0.25 + ((i / Math.max(messages.length - 1, 1)) * 0.7);
      const sY = trunkBaseY - (trunkHeight * hRatio);
      const bAngle = Math.cos(angle * Math.PI / 180) * (35 + Math.random() * 30);
      const bLen = 70 + (Math.random() * 30);
      const px = trunkBaseX + bLen * 0.6 * Math.sin(bAngle * Math.PI / 180);
      const py = sY - bLen * 0.6 * Math.cos(bAngle * Math.PI / 180);
      branches.push({ x1: trunkBaseX, y1: sY, x2: px, y2: py, depth: 4 });
      const lx = px + (bLen * 0.4) * Math.sin((bAngle + 10) * Math.PI / 180);
      const ly = py - (bLen * 0.4) * Math.cos((bAngle + 10) * Math.PI / 180);
      branches.push({ x1: px, y1: py, x2: lx, y2: ly, depth: 2 });
      
      // Seeded randoms for color persistence
      const hueShift = (i * 137) % 40; // Variation in green hue
      const lightShift = (i * 97) % 20; // Variation in brightness
      
      leaves.push({ 
        x: lx, 
        y: ly, 
        angle: bAngle + 10, 
        data: msg, 
        size: 0.9 + Math.random() * 0.3,
        color: `hsl(${120 + hueShift}, 70%, ${20 + lightShift}%)` 
      });
    });
    return { branches, leaves };
  }, [messages]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#f8fdf9] flex flex-col overflow-hidden touch-none select-none">
      
      <header className="relative z-50 pt-8 text-center pointer-events-none">
        <h1 className="text-[#00703C] text-3xl md:text-5xl font-black tracking-tighter uppercase">The Gratitude Tree</h1>
        <p className="text-gray-400 font-bold tracking-[0.2em] text-[10px]">LASALLIAN MENTORS DAY 2026</p>
        <div className="mt-2 bg-[#00703C] text-white text-[10px] px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-lg">
          <Sparkles size={10} /> {messages.length} BLOOMS
        </div>
      </header>

      <aside className="interactive-ui absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[ 
          { icon: ZoomIn, onClick: () => setScale(s => Math.min(s + 0.3, 3)) }, 
          { icon: ZoomOut, onClick: () => setScale(s => Math.max(s - 0.3, 0.3)) }, 
          { icon: Maximize2, onClick: () => { setScale(window.innerWidth < 768 ? 0.45 : 0.8); setPosition({ x: 0, y: window.innerWidth < 768 ? -50 : 0 }); } } 
        ].map((btn, i) => (
          <button key={i} onClick={btn.onClick} className="bg-white p-3 rounded-full shadow-2xl border border-gray-100 text-[#00703C] active:scale-90 transition-transform pointer-events-auto">
            <btn.icon size={22} />
          </button>
        ))}
      </aside>

      <main 
        ref={mainRef}
        className="absolute inset-0 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={startDragging}
        onMouseMove={handlePan}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={startDragging}
        onTouchMove={handlePan}
        onTouchEnd={() => { setIsDragging(false); setHoveredLeaf(null); }}
      >
        <motion.div
          animate={{ x: position.x, y: position.y, scale: scale }}
          transition={isDragging ? { type: 'just' } : { type: 'spring', stiffness: 200, damping: 30 }}
          className="w-[800px] h-[650px] overflow-visible"
        >
          <svg viewBox="0 0 800 650" className="w-full h-full overflow-visible">
            <ellipse cx="400" cy="625" rx="120" ry="18" fill="rgba(0,112,60,0.1)" />
            {treeData.branches.map((b, i) => (
              <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke="#4a3428" strokeWidth={b.depth} strokeLinecap="round" />
            ))}

            {[...treeData.leaves]
              .sort((a, b) => (a.data.id === hoveredLeaf ? 1 : b.data.id === hoveredLeaf ? -1 : 0))
              .map((leaf) => {
                const isHovered = hoveredLeaf === leaf.data.id;
                
                return (
                  <g 
                    key={leaf.data.id} 
                    className="interactive-ui cursor-pointer"
                    onMouseEnter={() => setHoveredLeaf(leaf.data.id)}
                    onMouseLeave={() => setHoveredLeaf(null)}
                    onTouchStart={(e) => { e.stopPropagation(); setHoveredLeaf(leaf.data.id); }}
                  >
                    <path
                      d={`M ${leaf.x} ${leaf.y} 
                          C ${leaf.x - 12 * leaf.size} ${leaf.y + 2 * leaf.size}, ${leaf.x - 14 * leaf.size} ${leaf.y - 18 * leaf.size}, ${leaf.x} ${leaf.y - 32 * leaf.size}
                          C ${leaf.x + 14 * leaf.size} ${leaf.y - 18 * leaf.size}, ${leaf.x + 12 * leaf.size} ${leaf.y + 2 * leaf.size}, ${leaf.x} ${leaf.y}`}
                      fill={isHovered ? "#00E676" : leaf.color}
                      stroke={isHovered ? "#fff" : "none"}
                      strokeWidth="1"
                      transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
                      className="transition-colors duration-300"
                    />

                    <AnimatePresence mode="wait">
                      {isHovered && (
                        <foreignObject x={leaf.x - 75} y={leaf.y - 115} width="150" height="95" className="overflow-visible pointer-events-none">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            className="relative bg-white p-3 rounded-xl shadow-2xl border-2 border-[#00703C] text-center"
                          >
                            <p className="text-[10px] md:text-[11px] font-bold text-[#1a3a2a] leading-tight italic">
                              "{leaf.data.message}"
                            </p>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#00703C]" />
                          </motion.div>
                        </foreignObject>
                      )}
                    </AnimatePresence>
                  </g>
                );
              })}
          </svg>
        </motion.div>
      </main>

      <footer className="relative z-[60] mt-auto w-full p-6 pb-10 pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto interactive-ui">
          <div className="flex bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full p-1.5 border-2 border-[#00703C]/20 overflow-hidden">
            <input 
              className="flex-1 px-5 py-3 outline-none text-gray-800 bg-transparent text-sm md:text-base min-w-0" 
              placeholder={cooldown > 0 ? "Wait for cooldown..." : "Type your message..."} 
              value={input} 
              maxLength={60} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isSubmitting || cooldown > 0} 
            />
            <button 
              onClick={handleSubmit} 
              className={`flex items-center justify-center gap-2 min-w-[50px] md:min-w-[100px] text-white py-3 md:py-4 px-4 rounded-full transition-all duration-300 ${cooldown > 0 ? 'bg-gray-400' : 'bg-[#00703C] active:scale-95'}`} 
              disabled={isSubmitting || !input.trim() || cooldown > 0}
            >
              {cooldown > 0 ? (
                <>
                  <Clock size={16} className="animate-pulse" />
                  <span className="hidden md:inline text-sm font-bold">{cooldown}s</span>
                </>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-center text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-3">
            {cooldown > 0 ? `Next bloom available in ${cooldown} seconds` : `${input.length}/60 Characters`}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LasallianTree;