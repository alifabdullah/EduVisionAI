'use client';
import { useApp } from '@/context/AppContext';
import TopNavbar from '@/components/layout/TopNavbar';

export default function DeptHeadProfilePage() {
  const { user } = useApp();
  const name = user?.name || 'Dr. Emily Carter';
  const email = user?.email || 'head.cse@edu.ai';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Profile & Settings ⚙️" subtitle="CSE Department Head — Account Management" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <img src={avatar} alt={name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #10B981', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>{name}</h1>
            <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Department Head — Computer Science & Engineering</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>🔐 Admin Access</span>
              <span style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>ID: DH-007</span>
              <span style={{ padding: '4px 12px', background: 'var(--surface-2)', color: 'var(--muted)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>📧 {email}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Account Info */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>👤 Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { label: 'Full Name', value: name },
                { label: 'Employee ID', value: 'DH-007' },
                { label: 'Email', value: email },
                { label: 'Phone', value: '+8801711000010' },
                { label: 'Department', value: 'Computer Science & Engineering' },
                { label: 'Role', value: 'Department Head (HoD)' },
                { label: 'Joining Date', value: 'March 15, 2018' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Permissions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔐 Portal Permissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Student Profiles (CSE)', access: true },
                { label: 'Faculty Profiles (CSE)', access: true },
                { label: 'Course Management', access: true },
                { label: 'Attendance Override', access: true },
                { label: 'Academic Result Review', access: true },
                { label: 'Mentorship Management', access: true },
                { label: 'Report Generation', access: true },
                { label: 'AI Department Assistant', access: true },
                { label: 'University-wide Analytics', access: false },
                { label: 'HR / Payroll / Salary', access: false },
                { label: 'Dean Portal Access', access: false },
                { label: 'Account Deletion', access: false },
              ].map(perm => (
                <div key={perm.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{perm.label}</span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: perm.access ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.08)', color: perm.access ? '#10B981' : '#DC2626', fontWeight: 700 }}>
                    {perm.access ? '✅ Granted' : '🚫 Restricted'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
