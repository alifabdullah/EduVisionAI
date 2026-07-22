'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

interface LoginPageProps {
  role: 'student' | 'teacher' | 'authority';
  accentColor: string;
  glow: string;
  icon: string;
  demoEmail: string;
  demoPassword: string;
  redirectPath: string;
  mockUser: { name: string; email: string; role: 'student' | 'teacher' | 'authority'; id: string; avatar?: string };
  titleOverride?: string;
  btnTextOverride?: string;
  backLinkOverride?: { href: string; label: string };
}

export default function LoginPage({
  role, accentColor, glow, icon, demoEmail, demoPassword, redirectPath, mockUser, titleOverride, btnTextOverride, backLinkOverride
}: LoginPageProps) {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if (email === demoEmail && password === demoPassword) {
      login(mockUser);
      router.push(redirectPath);
    } else {
      setError('Invalid credentials. Use the demo credentials below.');
    }
    setLoading(false);
  };

  const fillDemo = () => { setEmail(demoEmail); setPassword(demoPassword); setError(''); };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }} className="dot-pattern">
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${accentColor}18, transparent)`,
        borderRight: '1px solid var(--border)', padding: '3rem'
      }} className="hidden md:flex">
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: '5rem', marginBottom: 24 }}>{icon}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
            <span style={{ color: accentColor }}>{roleLabel}</span> Portal
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {role === 'student' && 'Access your personalized academic intelligence dashboard. Track performance, get AI insights, and achieve your goals.'}
            {role === 'teacher' && 'Monitor your students, identify risks early, and get AI-powered teaching suggestions to maximize student outcomes.'}
            {role === 'authority' && 'Oversee institutional performance, compare departments, and receive strategic AI recommendations for decision-making.'}
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              role === 'student' ? ['📊', 'Academic Analytics'] : role === 'teacher' ? ['⚠️', 'At-Risk Monitoring'] : ['🏛️', 'University Overview'],
              role === 'student' ? ['🎯', 'Skill Radar'] : role === 'teacher' ? ['📈', 'Course Analytics'] : ['📊', 'Department Comparison'],
              role === 'student' ? ['🤖', 'AI Advisor'] : role === 'teacher' ? ['🤖', 'AI Teaching Advisor'] : ['🤖', 'Strategic AI Advisor'],
            ].map(([emoji, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: `${accentColor}11`, border: `1px solid ${accentColor}22`, borderRadius: 10 }}>
                <span>{emoji}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Back link */}
          <Link href={backLinkOverride ? backLinkOverride.href : "/role-selection"} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32, transition: 'color 0.2s' }}>
            ← {backLinkOverride ? backLinkOverride.label : "Back to Role Selection"}
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>
              {titleOverride ? titleOverride : <>Sign in as <span style={{ color: accentColor }}>{roleLabel}</span></>}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Access your EduVision AI dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Enter your email"
                style={{
                  width: '100%', padding: '12px 16px', background: 'var(--surface)',
                  border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: 10, color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '12px 16px', background: 'var(--surface)',
                  border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
                  borderRadius: 10, color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = accentColor}
                onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? 'var(--surface)' : `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                color: loading ? 'var(--muted)' : '#fff',
                border: 'none', transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : `0 4px 20px ${glow}`,
              }}
            >
              {loading ? 'Authenticating...' : (btnTextOverride ? btnTextOverride : `Sign In as ${roleLabel}`)}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Credentials</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'monospace' }}>{demoEmail}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', fontFamily: 'monospace' }}>{demoPassword}</p>
            <button onClick={fillDemo} style={{ marginTop: 10, fontSize: '0.8rem', color: accentColor, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
              → Auto-fill credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
