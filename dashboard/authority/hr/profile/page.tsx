'use client';
import { useApp } from '@/context/AppContext';
import TopNavbar from '@/components/layout/TopNavbar';

export default function HRProfilePage() {
  const { user } = useApp();
  const name = user?.name || 'Sarah Jenkins';
  const email = user?.email || 'hr.director@edu.ai';
  const avatar = user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop';

  const permissions = [
    { label: 'Employee Profiles (View & Edit)', access: true },
    { label: 'Recruitment & Hiring', access: true },
    { label: 'Attendance Management', access: true },
    { label: 'Leave Approvals', access: true },
    { label: 'Payroll & Salary Management', access: true },
    { label: 'Department Workforce Planning', access: true },
    { label: 'KPI & Performance Reviews', access: true },
    { label: 'HR Documents Management', access: true },
    { label: 'HR Reports Generation', access: true },
    { label: 'Student Academic Records', access: false },
    { label: 'Course Grades & CGPA', access: false },
    { label: 'System Administration', access: false },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="HR Profile 👤" subtitle="Account Management & Access Permissions" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Profile Hero */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', background: 'linear-gradient(135deg, rgba(14,165,233,0.06), transparent)' }}>
          <img src={avatar} alt={name} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid #0EA5E9', boxShadow: '0 10px 30px rgba(14,165,233,0.3)' }} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>{name}</h1>
            <p style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '1rem', margin: '0 0 1rem' }}>HR Director — Human Resources Department</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '5px 14px', background: 'rgba(14,165,233,0.1)', color: '#0369A1', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>🔐 HR Admin</span>
              <span style={{ padding: '5px 14px', background: 'rgba(16,185,129,0.1)', color: '#065F46', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>ID: HR-1003</span>
              <span style={{ padding: '5px 14px', background: 'var(--surface-2)', color: 'var(--muted)', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>📧 {email}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Account Info */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>👤 Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Full Name', value: name },
                { label: 'Employee ID', value: 'HR-1003' },
                { label: 'Email', value: email },
                { label: 'Phone', value: '+8801711000002' },
                { label: 'Department', value: 'Human Resources' },
                { label: 'Designation', value: 'HR Director' },
                { label: 'Joining Date', value: 'January 15, 2019' },
                { label: 'Last Login', value: 'Today, 09:05 AM' },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔐 Access Permissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {permissions.map(perm => (
                <div key={perm.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{perm.label}</span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: perm.access ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.08)', color: perm.access ? '#10B981' : '#DC2626', fontWeight: 700, flexShrink: 0 }}>
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
