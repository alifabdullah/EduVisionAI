'use client';
import Link from 'next/link';
import TopNavbar from '@/components/layout/TopNavbar';

const portals = [
  {
    id: 'teacher', title: 'Teacher Portal', icon: '👨‍🏫', description: 'Academic management, marks entry, mentorship, and course control.', color: '#22D3EE', href: '/teacher/faculty-workspace', tag: 'Current',
  },
  {
    id: 'employee', title: 'Employee Application', icon: '💼', description: 'HR functions, leave management, and employee records.', color: '#6C63FF', href: '/teacher/ess', tag: 'Available',
  },
  {
    id: 'ess', title: 'ESS Portal', icon: '📊', description: 'Employee self-service — KPI, attendance logs, and benefits.', color: '#10B981', href: '/teacher/ess', tag: 'Available',
  },
  {
    id: 'edu', title: 'Smart EDU System', icon: '🎓', description: 'Integrated academic records, results, and course registration hub.', color: '#F59E0B', href: '/teacher/results', tag: 'Available',
  },
];

const quickLinks = [
  { label: '📝 Attendance Entry', href: '/teacher/attendance' },
  { label: '📋 Marks Entry', href: '/teacher/marks-entry' },
  { label: '🧾 Result Lookup', href: '/teacher/results' },
  { label: '💰 Accounts Clearance', href: '/teacher/accounts-clearance' },
  { label: '🧑‍🏫 Mentor Clearance', href: '/teacher/mentor-clearance' },
  { label: '📚 Course Registration', href: '/teacher/course-registration' },
  { label: '📊 Grade Sheet', href: '/teacher/grade-sheet' },
  { label: '🏛️ Faculty Workspace', href: '/teacher/faculty-workspace' },
];

export default function SSOPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Daffodil SSO Portal" subtitle="Single Sign-On — Central hub for all university systems" accentColor="#6C63FF" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.12),rgba(34,211,238,0.08))', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 18, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>Daffodil University — Single Sign-On</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
            One login access to all university systems. Switch seamlessly between portals without re-authentication.
          </p>
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 999 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>Authenticated as: Dr. Shuvo Das</span>
          </div>
        </div>

        {/* Portal Cards */}
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>🖥️ Available Portals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {portals.map(p => (
            <Link key={p.id} href={p.href} style={{ textDecoration: 'none' }}>
              <div className="glass-card stat-card" style={{ padding: '1.5rem', cursor: 'pointer', borderTop: `4px solid ${p.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.color}18`, border: `1px solid ${p.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {p.icon}
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, background: p.tag === 'Current' ? `${p.color}20` : 'var(--surface-2)', color: p.tag === 'Current' ? p.color : 'var(--muted)', border: `1px solid ${p.tag === 'Current' ? p.color + '44' : 'var(--border)'}` }}>{p.tag}</span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4, color: 'var(--text)' }}>{p.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>{p.description}</p>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 6, color: p.color, fontWeight: 700, fontSize: '0.78rem' }}>
                  Launch Portal <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {quickLinks.map(l => (
            <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '0.875rem 1.125rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = 'var(--soft-blue)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'rgba(29,78,216,0.3)'; }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                {l.label}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
