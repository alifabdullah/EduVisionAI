'use client';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

const roles = [
  {
    id: 'student',
    icon: '🎓',
    title: 'Student',
    description: 'Track performance, get AI insights, and grow your potential',
    color: '#6C63FF',
    glow: 'rgba(108,99,255,0.3)',
    accent: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(108,99,255,0.02))',
    stats: ['Academic Analytics', 'Skill Radar', 'AI Advisor'],
  },
  {
    id: 'teacher',
    icon: '👨‍🏫',
    title: 'Teacher',
    description: 'Monitor students, analyze courses, and guide improvement',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.3)',
    accent: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(34,211,238,0.02))',
    stats: ['At-Risk Monitoring', 'Course Analytics', 'AI Teaching Advisor'],
  },
  {
    id: 'authority',
    icon: '🏫',
    title: 'Authority',
    description: 'Monitor institutional performance and make strategic decisions',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    accent: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
    stats: ['Dept Comparison', 'Strategic Advisor', 'Institution KPIs'],
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole } = useApp();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (roleId: string) => {
    setSelected(roleId);
    setRole(roleId as 'student' | 'teacher' | 'authority');
    if (roleId === 'authority') {
      setTimeout(() => router.push('/authority-access'), 400);
    } else {
      setTimeout(() => router.push(`/login/${roleId}`), 400);
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F5F7FA' }}>
      
      {/* Subtle Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/diu_building.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.12, zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <img 
              src="/diu_crest.png" 
              alt="DIU Crest" 
              style={{ 
                width: 140, 
                height: 140, 
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,59,149,0.15))'
              }} 
            />
            <span style={{ fontWeight: 800, fontSize: '1.6rem', color: '#0F172A', letterSpacing: '-0.5px' }}>EduVision AI</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, color: '#0F172A' }}>
            Choose Your <span style={{ color: '#003B95' }}>Role</span>
          </h1>
          <p style={{ color: '#64748B', marginTop: 12, fontSize: '1.05rem', maxWidth: 480, margin: '12px auto 0' }}>
            Select your role to access your personalized intelligent dashboard
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: 960 }}>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelect(role.id)}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === role.id || selected === role.id ? role.accent : '#FFFFFF',
                border: `1px solid ${hovered === role.id || selected === role.id ? role.color : 'rgba(0,0,0,0.05)'}`,
                borderRadius: 20,
                padding: '2.5rem 2rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s ease',
                transform: hovered === role.id ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered === role.id ? `0 20px 60px ${role.glow}` : '0 10px 30px rgba(0,0,0,0.04)',
                opacity: selected && selected !== role.id ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>{role.icon}</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{role.title}</h2>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>{role.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {role.stats.map((stat) => (
                  <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{stat}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderRadius: 10,
                background: hovered === role.id ? `${role.color}15` : 'transparent',
                border: `1px solid ${hovered === role.id ? `${role.color}33` : 'transparent'}`,
                transition: 'all 0.2s ease',
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: hovered === role.id ? role.color : '#64748B' }}>
                  {selected === role.id ? 'Redirecting...' : 'Enter as ' + role.title}
                </span>
                <span style={{ color: role.color, fontSize: '1.1rem' }}>→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: '0.85rem', opacity: 0.8, textAlign: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', border: '1px solid currentColor' }}>✓</span>
          Each role provides a completely separate experience with tailored intelligence features.
        </div>
      </div>
    </div>
  );
}
