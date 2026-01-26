import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

const supabase = createClient('https://ehjruxjzmxarulzfsotn.supabase.co', 'sb_publishable_bA_wjwQ1e2TdYLez_TzOpA_8dGhYER1');

const LasallianTree = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time changes - listen for all events
    const channel = supabase
      .channel('gratitude_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'gratitude_tree' 
        },
        (payload) => {
          console.log('Change received:', payload);
          // Immediately refetch when any change happens
          fetchMessages();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('gratitude_tree')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) {
      setMessages(data);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || input.length > 60 || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('gratitude_tree')
        .insert([{ message: input.trim() }])
        .select();
      
      if (error) {
        console.error('Insert error:', error);
      } else {
        console.log('Message inserted:', data);
        setInput('');
        // Force a refetch after successful insert
        await fetchMessages();
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Enhanced tree generation with natural branching
  const treeData = useMemo(() => {
    const branches = [];
    const leaves = [];
    
    const trunkBaseX = 400;
    const trunkBaseY = 620;
    const baseTrunkHeight = 140;
    const extraHeight = Math.min(messages.length * 1.5, 120);
    const trunkHeight = baseTrunkHeight + extraHeight;
    
    // Main trunk with slight curve and taper
    const trunkSegments = 15;
    for (let i = 0; i < trunkSegments; i++) {
      const y1 = trunkBaseY - (i * trunkHeight / trunkSegments);
      const y2 = trunkBaseY - ((i + 1) * trunkHeight / trunkSegments);
      const x1 = trunkBaseX + Math.sin(i * 0.3) * 3;
      const x2 = trunkBaseX + Math.sin((i + 1) * 0.3) * 3;
      const width = 12 - (i * 0.4);
      
      branches.push({ 
        x1, y1, x2, y2, 
        depth: Math.max(width, 4),
        delay: i * 0.02,
        isTrunk: true
      });
    }

    // Generate organic branch structure
    const goldenAngle = 137.5; // Golden angle for natural distribution
    
    messages.forEach((msg, i) => {
      const angle = (i * goldenAngle) % 360;
      const normalizedIndex = i / Math.max(messages.length - 1, 1);
      
      // Height along trunk (higher messages go higher)
      const heightRatio = 0.3 + (normalizedIndex * 0.65);
      const sproutY = trunkBaseY - (trunkHeight * heightRatio);
      const sproutX = trunkBaseX + Math.sin(sproutY * 0.1) * 3;
      
      // Branch parameters
      const side = Math.cos(angle * Math.PI / 180);
      const branchAngle = side * (25 + Math.random() * 35);
      const branchLength = 50 + (Math.random() * 50) + (normalizedIndex * 20);
      
      // Primary branch
      const primaryX = sproutX + branchLength * 0.6 * Math.sin(branchAngle * Math.PI / 180);
      const primaryY = sproutY - branchLength * 0.6 * Math.cos(branchAngle * Math.PI / 180);
      
      branches.push({ 
        x1: sproutX, 
        y1: sproutY, 
        x2: primaryX, 
        y2: primaryY, 
        depth: 5,
        delay: 0.3 + i * 0.05,
        isTrunk: false
      });
      
      // Secondary branch (extends from primary)
      const secondaryAngle = branchAngle + (Math.random() * 30 - 15);
      const secondaryLength = branchLength * 0.5;
      const leafX = primaryX + secondaryLength * Math.sin(secondaryAngle * Math.PI / 180);
      const leafY = primaryY - secondaryLength * Math.cos(secondaryAngle * Math.PI / 180);
      
      branches.push({ 
        x1: primaryX, 
        y1: primaryY, 
        x2: leafX, 
        y2: leafY, 
        depth: 3,
        delay: 0.4 + i * 0.05,
        isTrunk: false
      });

      // Attach leaf to end of secondary branch
      leaves.push({ 
        x: leafX, 
        y: leafY, 
        angle: secondaryAngle,
        data: msg,
        delay: 0.5 + i * 0.05,
        size: 0.8 + Math.random() * 0.4
      });
    });

    return { branches, leaves };
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fdf9] to-[#e8f5e9] flex flex-col items-center font-sans overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00703C]/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px'
            }}
            animate={{ 
              y: ['0vh', '110vh'],
              x: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-8 text-center z-20 pointer-events-none">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[#00703C] text-6xl font-black tracking-tighter drop-shadow-lg">
            THE GRATITUDE TREE
          </h1>
          <p className="text-gray-500 font-bold tracking-[0.3em] text-xs uppercase mt-1">
            LASALLIAN MENTORS DAY 2026
          </p>
          <motion.div 
            className="mt-3 bg-gradient-to-r from-[#00703C] to-[#00a85a] text-white text-xs px-6 py-2 rounded-full inline-flex items-center gap-2 font-bold shadow-xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={14} />
            {messages.length} BLOOMS
          </motion.div>
        </motion.div>
      </div>

      {/* Tree Canvas */}
      <div className="relative flex-1 w-full max-w-5xl">
        <svg viewBox="0 0 800 650" className="w-full h-full overflow-visible">
          <defs>
            {/* Gradient for trunk */}
            <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d2817" />
              <stop offset="50%" stopColor="#5c3d2e" />
              <stop offset="100%" stopColor="#3d2817" />
            </linearGradient>

            {/* Shadow filter */}
            <filter id="leafShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="400" cy="625" rx="120" ry="18" fill="rgba(0,112,60,0.08)" />

          {/* BRANCHES */}
          <g>
            {treeData.branches.map((b, i) => (
              <motion.line
                key={`branch-${i}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                stroke={b.isTrunk ? "url(#trunkGradient)" : "#4a3428"}
                strokeWidth={b.depth}
                strokeLinecap="round"
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: b.delay 
                }}
              />
            ))}
          </g>

          {/* LEAVES */}
          <AnimatePresence>
            {treeData.leaves.map((leaf) => (
              <motion.g
                key={leaf.data.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: leaf.delay,
                  ease: "easeOut"
                }}
                className="group cursor-pointer"
              >
                {/* Stem - connects leaf to branch */}
                <line
                  x1={leaf.x}
                  y1={leaf.y}
                  x2={leaf.x - Math.sin(leaf.angle * Math.PI / 180) * 12}
                  y2={leaf.y + Math.cos(leaf.angle * Math.PI / 180) * 12}
                  stroke="#4a3428"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Simple Leaf Design - Clean and Minimal */}
                <motion.g
                  animate={{ 
                    rotate: [0, 3, 0, -3, 0],
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                  }}
                >
                  {/* Main leaf body - simple solid color */}
                  <ellipse
                    cx={leaf.x}
                    cy={leaf.y}
                    rx={11 * leaf.size}
                    ry={16 * leaf.size}
                    fill="#00703C"
                    transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
                    className="group-hover:fill-[#00a85a] transition-colors duration-300"
                    filter="url(#leafShadow)"
                  />
                  
                  {/* Single central vein - minimal detail */}
                  <line
                    x1={leaf.x}
                    y1={leaf.y + 10 * leaf.size}
                    x2={leaf.x}
                    y2={leaf.y - 14 * leaf.size}
                    stroke="#005028"
                    strokeWidth="1"
                    opacity="0.4"
                    transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
                    strokeLinecap="round"
                  />
                </motion.g>

                {/* Hover Message Bubble */}
                <foreignObject 
                  x={leaf.x - 85} 
                  y={leaf.y - 125} 
                  width="170" 
                  height="110" 
                  className="pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
                >
                  <motion.div 
                    className="bg-white/98 backdrop-blur-xl shadow-2xl p-4 rounded-3xl border-2 border-[#00703C] relative"
                    initial={{ scale: 0.8, y: 10 }}
                    whileHover={{ scale: 1, y: 0 }}
                  >
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00703C] rounded-full flex items-center justify-center">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <p className="text-xs text-[#1a3a2a] font-semibold leading-relaxed text-center italic">
                      "{leaf.data.message}"
                    </p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#00703C] rotate-45"></div>
                  </motion.div>
                </foreignObject>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </div>

      {/* Enhanced Input UI */}
      <motion.div 
        className="fixed bottom-10 w-full max-w-lg px-6 z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00703C]/20 to-[#00a85a]/20 rounded-full blur-xl"></div>
          <div className="relative flex bg-white/95 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,112,60,0.15)] rounded-full p-2 border-2 border-[#00703C]/10">
            <input 
              className="flex-1 px-6 py-2 outline-none text-gray-800 font-medium bg-transparent placeholder:text-gray-400"
              placeholder="Plant a message of gratitude..."
              value={input}
              maxLength={60}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
            />
            <motion.button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#00703C] to-[#00a85a] text-white p-4 rounded-full disabled:opacity-50 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting || !input.trim()}
            >
              <Send size={18} />
            </motion.button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            {input.length}/60 characters
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LasallianTree;