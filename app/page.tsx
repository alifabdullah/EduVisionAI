'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => router.push('/role-selection'), 500);
    }, 2800);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
      }}
      className="dot-pattern"
    >
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)', top: '10%', left: '10%', filter: 'blur(60px)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)', bottom: '15%', right: '15%', filter: 'blur(50px)', animation: 'pulse-glow 4s ease-in-out infinite' }} />

      {/* Logo */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}>
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
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
          <span className="gradient-text">EduVision</span>
          <span style={{ color: 'var(--text)' }}> AI</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 400, letterSpacing: '0.5px' }}>
          Intelligent Academic Platform
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: 48, width: 220, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6C63FF, #22D3EE)',
            borderRadius: 99,
            transition: 'width 0.05s linear',
          }} />
        </div>
        <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: '0.75rem' }}>Loading platform...</p>
      </div>

      {/* Version tag */}
      <div style={{
        position: 'absolute', bottom: 32,
        background: 'var(--glass)', border: '1px solid var(--glass-border)',
        borderRadius: 999, padding: '6px 16px', color: 'var(--muted)', fontSize: '0.75rem'
      }}>
        v1.0.0 · Academic Intelligence Suite
      </div>
    </div>
  );
}
