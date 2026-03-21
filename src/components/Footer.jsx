import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0c0b',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '24px 11vw',
      fontFamily: "'Outfit', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <p style={{ fontSize: 12, color: '#5a6560' }}>
        © {new Date().getFullYear()} SOURCE · La Salle University – Ozamiz
      </p>
      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { label: 'Facebook', href: 'https://www.facebook.com/LSU.SOURCE' },
          { label: 'Discord', href: 'https://discord.gg/UEBu2gtETH' },
          { label: 'Contact', href: '/contacts' },
        ].map(({ label, href }) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
            style={{ fontSize: 12, color: '#5a6560', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#22c55e'}
            onMouseLeave={(e) => e.target.style.color = '#5a6560'}
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
