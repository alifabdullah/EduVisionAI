'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export default function TopNavbar({ title, subtitle, accentColor }: TopNavbarProps) {
  const { user } = useApp();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      height: 80, background: '#FFFFFF', borderBottom: '1px solid #E5E7EB',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button style={{ background: '#F1F5F9', border: '1px solid #E5E7EB', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F172A' }}>
          ≡
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4, margin: 0 }}>{subtitle}</p>}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} suppressHydrationWarning>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', fontSize: '1.2rem', color: '#64748B' }}>📅</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }} suppressHydrationWarning>{dateStr || 'Monday, May 25, 2026'}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }} suppressHydrationWarning>{timeStr || '11:09 AM'}</span>
          </div>
        </div>
        
        <div style={{ width: 1, height: 32, background: '#E5E7EB' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ position: 'relative', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}>
            🔔
            <span style={{ position: 'absolute', top: -2, right: -4, background: '#EF4444', color: '#FFFFFF', fontSize: '0.6rem', fontWeight: 700, padding: '2px 5px', borderRadius: 10, border: '2px solid #FFFFFF' }}>3</span>
          </button>
          
          <div style={{
            width: 40, height: 40, borderRadius: '50%', position: 'relative', cursor: 'pointer'
          }}>
            <img src={user?.avatar || "/profile_joy.png"} alt="User Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #EAF3FF' }} />
            <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#FFFFFF', borderRadius: '50%', padding: 2, fontSize: '0.5rem', color: '#003B95' }}>▼</span>
          </div>
        </div>
      </div>
    </header>
  );
}
