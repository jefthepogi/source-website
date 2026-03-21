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

function Body() {
  const [isMinecraftModalOpen, setMinecraftModalOpen] = useState(false);

  return (
    <div className="body-root">
      {/* Intro */}
      <section style={{ padding: 'clamp(40px,8vw,80px) 11vw', borderBottom: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-2)', fontWeight: 300, fontSize: 'clamp(0.9rem,1.4vw,1.05rem)', lineHeight: 1.85, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>Student Organization Utilizing the Realm of Computer Eclecticism (SOURCE)</span> is a student organization dedicated to the exploration and application of cutting-edge computing technologies. We foster a collaborative environment where students enhance skills, share knowledge, and contribute to the advancement of ICT.
        </p>
      </section>

      {/* News */}
      <section className="section-pad" style={{ padding: 'clamp(40px,8vw,80px) 11vw', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="section-tag">Updates</span>
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2.2rem)', color: 'var(--text)', lineHeight: 1.1 }}>
              News &amp; Announcements
            </h2>
          </div>
        </div>
        <NewsCarousel />
      </section>

      {/* Explore */}
      <section className="section-pad" style={{ padding: 'clamp(40px,8vw,80px) 11vw', borderBottom: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 36 }}>
          <span className="section-tag">Explore</span>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2.2rem)', color: 'var(--text)' }}>
            What SOURCE offers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <ExploreCard title="SOURCE Student Council" description="Meet the dedicated officers of the SOURCE Student Council and learn about their roles." image={StudentCouncil} href="/officers" icon={<FaUserFriends size={20} />} tall />
          <div className="explore-sub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,220px), 1fr))', gap: 16 }}>
            <ExploreCard title="Events" description="Workshops, webinars, competitions, and more." image={Events} href="/events" icon={<FaCalendarAlt size={18} />} />
            <ExploreCard title="Merch" description="Exclusive SOURCE merch. Represent with style." image={Merch} href="/merch" icon={<FaTshirt size={18} />} />
            <ExploreCard title="Discord" description="Connect with CS/IT students and faculty." image={Discord} href="https://discord.gg/UEBu2gtETH" icon={<FaDiscord size={18} />} />
            <ExploreCard title="Minecraft" description="Take a break and build on our server." image={Minecraft} href="#"
              onClick={(e) => { e.preventDefault(); setMinecraftModalOpen(true); }} icon={<TbBrandMinecraft size={18} />} />
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="section-pad" style={{ padding: 'clamp(40px,8vw,80px) 11vw' }}>
        <div style={{ marginBottom: 36 }}>
          <span className="section-tag">Programs</span>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2.2rem)', color: 'var(--text)' }}>
            Our Initiatives
          </h2>
        </div>
        <InitiativesSection />
      </section>

      {isMinecraftModalOpen && <MinecraftModal onClose={() => setMinecraftModalOpen(false)} />}
    </div>
  );
}

function ExploreCard({ title, description, image, href, onClick, icon, tall }) {
  return (
    <a href={href} onClick={onClick} className="explore-card" style={tall ? { height: 'clamp(180px,25vw,240px)' } : { height: 'clamp(160px,20vw,200px)' }}>
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
      <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 360, width: '100%', fontFamily: 'var(--font-body)' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Minecraft Server</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: 6 }}><strong style={{ color: 'var(--text)' }}>IP:</strong> mc.lsu-source.org</p>
        <p style={{ color: 'var(--text-2)', marginBottom: 24 }}><strong style={{ color: 'var(--text)' }}>Version:</strong> 1.21+</p>
        <button onClick={onClose} className="btn-primary">Close</button>
      </div>
    </div>
  );
}

export default Body;
