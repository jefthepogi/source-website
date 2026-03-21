import React, { useState } from 'react';
import StudentCouncil from '../assets/student_council.jpg';
import Discord from '../assets/discord.png';
import Minecraft from '../assets/minecraft.png';
import Events from '../assets/events.jpg';
import Merch from '../assets/merch.png';
import NewsCarousel from './NewsCarousel';
import InitiativesSection from './InitiativesSection';
import { FaUserFriends, FaCalendarAlt, FaTshirt, FaDiscord } from 'react-icons/fa';
import { TbBrandMinecraft } from 'react-icons/tb';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0d0f0e; --bg-2:#131615; --bg-3:#191c1a; --bg-4:#1f2421;
    --border:rgba(255,255,255,0.07); --border-md:rgba(255,255,255,0.11);
    --accent:#22c55e; --accent-dim:#22c55e18;
    --text:#f0f2f1; --text-2:#9aa39d; --text-3:#5a6560;
    --font-head:'Syne',sans-serif; --font-body:'Outfit',sans-serif;
    --radius:14px; --radius-lg:20px;
  }
  .body-root { font-family: var(--font-body); background: var(--bg); color: var(--text); }
  .explore-card {
    position: relative; height: 200px; border-radius: var(--radius-lg); overflow: hidden;
    display: flex; align-items: flex-end; text-decoration: none;
    border: 1px solid var(--border);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .explore-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
  .explore-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease; }
  .explore-card:hover img { transform: scale(1.06); }
  .explore-card .overlay { position:absolute; inset:0; background: linear-gradient(to top, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.35) 60%, transparent 100%); }
  .explore-card .content { position:relative; z-index:10; padding: 18px 20px; width:100%; }
  .explore-card-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 2px; }
  .explore-card-desc  { font-size: 12px; color: rgba(240,242,241,0.55); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .explore-card .icon-badge { position:absolute; top:14px; right:14px; z-index:10; color: var(--accent); opacity: 0.85; }
`;

function Body() {
  const [isMinecraftModalOpen, setMinecraftModalOpen] = useState(false);

  return (
    <>
      <style>{STYLES}</style>
      <div className="body-root">

        {/* Intro */}
        <section style={{ padding: '64px 11vw', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ color: '#9aa39d', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', lineHeight: 1.85, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ color: '#f0f2f1', fontWeight: 500 }}>Student Organization Utilizing the Realm of Computer Eclecticism (SOURCE)</span> is a student organization dedicated to the exploration and application of cutting-edge computing technologies. We foster a collaborative environment where students enhance skills, share knowledge, and contribute to the advancement of ICT.
          </p>
        </section>

        {/* News */}
        <section style={{ padding: '80px 11vw', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
                Updates
              </span>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#f0f2f1', lineHeight: 1.1 }}>
                News & Announcements
              </h2>
            </div>
          </div>
          <NewsCarousel />
        </section>

        {/* Explore */}
        <section style={{ padding: '80px 11vw', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              Explore
            </span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#f0f2f1' }}>
              What SOURCE offers
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {/* Full-width card */}
            <ExploreCard title="SOURCE Student Council" description="Meet the dedicated officers of the SOURCE Student Council and learn about their roles." image={StudentCouncil} href="/officers" icon={<FaUserFriends size={20} />} tall />

            {/* 2-col */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <ExploreCard title="Events" description="Workshops, webinars, competitions, and more." image={Events} href="/events" icon={<FaCalendarAlt size={18} />} />
              <ExploreCard title="Merch" description="Exclusive SOURCE merch. Represent with style." image={Merch} href="/merch" icon={<FaTshirt size={18} />} />
              <ExploreCard title="Discord" description="Connect with CS/IT students and faculty." image={Discord} href="https://discord.gg/UEBu2gtETH" icon={<FaDiscord size={18} />} />
              <ExploreCard title="Minecraft" description="Take a break and build on our server." image={Minecraft} href="#" onClick={(e) => { e.preventDefault(); setMinecraftModalOpen(true); }} icon={<TbBrandMinecraft size={18} />} />
            </div>
          </div>
        </section>

        {/* Initiatives */}
        <section style={{ padding: '80px 11vw' }}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 20, height: 1, background: '#22c55e', display: 'inline-block' }} />
              Programs
            </span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#f0f2f1' }}>
              Our Initiatives
            </h2>
          </div>
          <InitiativesSection />
        </section>

        {isMinecraftModalOpen && <MinecraftModal onClose={() => setMinecraftModalOpen(false)} />}
      </div>
    </>
  );
}

function ExploreCard({ title, description, image, href, onClick, icon, tall }) {
  return (
    <a href={href} onClick={onClick} className="explore-card" style={tall ? { height: '240px' } : {}}>
      <img src={image} alt={title} loading="lazy" />
      <div className="overlay" />
      <div className="icon-badge">{icon}</div>
      <div className="content">
        <p className="explore-card-title">{title}</p>
        <p className="explore-card-desc">{description}</p>
      </div>
    </a>
  );
}

function MinecraftModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }}>
      <div style={{ background: '#131615', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 360, width: '100%', fontFamily: "'Outfit',sans-serif" }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#f0f2f1', marginBottom: 16 }}>Minecraft Server</h2>
        <p style={{ color: '#9aa39d', marginBottom: 6 }}><strong style={{ color: '#f0f2f1' }}>IP:</strong> mc.lsu-source.org</p>
        <p style={{ color: '#9aa39d', marginBottom: 24 }}><strong style={{ color: '#f0f2f1' }}>Version:</strong> 1.21+</p>
        <button onClick={onClose} style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Body;
