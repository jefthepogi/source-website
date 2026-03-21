import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import HeaderBgImage from '../assets/events.jpg';

const STATUS = {
  upcoming: { label: 'Upcoming', dot: '#60a5fa', bg: 'rgba(96,165,250,0.12)', text: '#93c5fd' },
  ongoing:  { label: 'Ongoing',  dot: '#22c55e', bg: 'rgba(34,197,94,0.12)',  text: '#86efac' },
  past:     { label: 'Past',     dot: '#5a6560', bg: 'rgba(90,101,96,0.12)',  text: '#9aa39d' },
};

const CATEGORIES = ['All', 'Workshop', 'Webinar', 'Social', 'Competition', 'General'];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeStatus, setActiveStatus] = useState('all');

  useEffect(() => {
    supabase.from('events').select('*').eq('published', true).order('event_date', { ascending: false })
      .then(({ data, error }) => { if (!error && data) { setEvents(data); setFiltered(data); } setLoading(false); });
  }, []);

  useEffect(() => {
    let r = events;
    if (activeFilter !== 'All') r = r.filter((e) => e.category === activeFilter);
    if (activeStatus !== 'all') r = r.filter((e) => e.status === activeStatus);
    setFiltered(r);
  }, [activeFilter, activeStatus, events]);

  const upcoming = events.filter((e) => e.status === 'upcoming').length;
  const ongoing = events.filter((e) => e.status === 'ongoing').length;

  return (
    <>
      <div className="events-root">

        {/* Hero */}
        <div style={{ position: 'relative', height: 'clamp(300px,50vw,420px)', overflow: 'hidden', background: '#0a0c0b' }}>
          <img src={HeaderBgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,12,10,0.93) 0%, rgba(8,12,10,0.72) 55%, rgba(8,12,10,0.4) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(34,197,94,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.45 }} />

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 11vw 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e' }}>Calendar</span>
            </div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f0f2f1', lineHeight: 1.05, marginBottom: 12 }}>Events</h1>
            <p style={{ color: 'rgba(240,242,241,0.45)', fontWeight: 300, maxWidth: '380px', marginBottom: 28 }}>Workshops, webinars, competitions, and more.</p>

            {/* Stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: 32 }}>
              {[{ l: 'Upcoming', v: upcoming, c: '#93c5fd' }, { l: 'Ongoing', v: ongoing, c: '#86efac' }, { l: 'Total', v: events.length, c: '#f0f2f1' }].map(({ l, v, c }) => (
                <div key={l}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '2rem', color: c, lineHeight: 1 }}>{v}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(240,242,241,0.35)', marginTop: 4 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'linear-gradient(to bottom, transparent, #0d0f0e)' }} />
        </div>

        {/* Filter bar */}
        <div className="filter-bar" style={{ position: 'sticky', top: '60px', zIndex: 20 }}>
          <div style={{ padding: '12px 11vw', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['all', 'upcoming', 'ongoing', 'past'].map((s) => (
              <button key={s} onClick={() => setActiveStatus(s)}
                className={`filter-pill ${activeStatus === s ? 'active-green' : ''}`}
                style={{ textTransform: 'capitalize' }}>
                {s === 'all' ? 'All Status' : s}
              </button>
            ))}
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setActiveFilter(c)}
                className={`filter-pill ${activeFilter === c ? 'active-dark' : ''}`}>
                {c}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: '#5a6560' }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: '56px 11vw' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
              <div style={{ width: 28, height: 28, border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🌿</p>
              <p style={{ color: '#5a6560', fontSize: 14 }}>No events found for this filter.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,300px), 1fr))', gap: 20 }}>
              {filtered.map((ev, i) => <EventCard key={ev.id} event={ev} delay={i * 35} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function EventCard({ event, delay }) {
  const s = STATUS[event.status] || STATUS.past;
  const date = event.event_date ? new Date(event.event_date).toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : null;

  return (
    <div className={`event-card fade-in ${event.status === 'past' ? '' : ''}`} style={{ animationDelay: `${delay}ms`, opacity: event.status === 'past' ? 0.6 : 1 }}>
      <div style={{ height: '180px', overflow: 'hidden', background: '#191c1a', position: 'relative' }}>
        <img src={event.image_url || 'https://placehold.co/600x400/191c1a/22c55e?text=EVENT'} alt={event.title}
          className="card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: s.bg, color: s.text }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            {s.label}
          </span>
          {event.category && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(13,15,14,0.75)', color: '#9aa39d', backdropFilter: 'blur(4px)' }}>
              {event.category}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0f2f1', lineHeight: 1.3, marginBottom: 12 }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {date && <MetaRow icon={<Calendar size={11} />} text={date} />}
          {event.event_time && <MetaRow icon={<Clock size={11} />} text={event.event_time} />}
          {event.location && <MetaRow icon={<MapPin size={11} />} text={event.location} truncate />}
        </div>

        {event.description && (
          <p style={{ color: '#5a6560', fontSize: 13, lineHeight: 1.65, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {event.description}
          </p>
        )}

        {event.registration_link && event.status !== 'past' && (
          <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
            style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#22c55e', color: '#000', fontSize: 12, fontWeight: 600, padding: '9px 18px', borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s', fontFamily: "'Outfit',sans-serif" }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#28d468'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
          >
            Register Now <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

function MetaRow({ icon, text, truncate }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9aa39d', fontSize: 12 }}>
      <span style={{ color: '#22c55e', flexShrink: 0 }}>{icon}</span>
      <span style={truncate ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : {}}>{text}</span>
    </div>
  );
}
