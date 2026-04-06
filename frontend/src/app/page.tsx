'use client';

import Navbar           from '@/components/layout/Navbar';
import HeroSection      from '@/components/sections/HeroSection';
import WorkspaceSection from '@/components/sections/WorkspaceSection';
import AgencySection    from '@/components/sections/AgencySection';
import DashboardSection from '@/components/sections/DashboardSection';

export default function Home() {
  return (
    <main style={{ background: '#050816' }}>
      <Navbar />
      <HeroSection />
      <div className="section-divider" />
      <WorkspaceSection />
      <div className="section-divider" />
      <AgencySection />
      <div className="section-divider" />
      <DashboardSection />

      <footer
        style={{
          background: '#030610',
          borderTop: '1px solid rgba(124,58,237,0.1)',
          padding: '40px 0',
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              className="font-orbitron"
              style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}
            >
              AceAgent
            </span>
          </div>
          <p style={{ color: '#334155', fontSize: 12 }}>
            © 2024 AceAgent. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  color: '#334155',
                  fontSize: 12,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = '#94a3b8')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = '#334155')
                }
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
