'use client';
import { useApp } from '@/context/AppContext';
import TopNavbar from '@/components/layout/TopNavbar';

export default function DeanProfilePage() {
  const { user } = useApp();
  const name = user?.name || 'Prof. Dr. Md. Fokhray Hossain';
  const email = user?.email || 'dean@daffodilvarsity.edu.bd';
  const avatar = user?.avatar || '/images/authority/dean_fokhray.png';

  const permissions = [
    { label: 'Student Profiles (All Departments)', access: true },
    { label: 'Administrative Override — Students', access: true },
    { label: 'Faculty Profiles (All Departments)', access: true },
    { label: 'Administrative Override — Teachers', access: true },
    { label: 'Department Management', access: true },
    { label: 'Course Creation & Management', access: true },
    { label: 'Attendance Management', access: true },
    { label: 'Academic Results', access: true },
    { label: 'University-wide Analytics', access: true },
    { label: 'Reports Center (All Types)', access: true },
    { label: 'AI Dean Assistant', access: true },
    { label: 'HR / Payroll / Salary', access: false },
    { label: 'Finance / Tuition Records', access: false },
    { label: 'System Administration', access: false },
    { label: 'Student Private AI Chat', access: false },
    { label: 'Account Permanent Deletion', access: false },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Dean Profile 👤" subtitle="Account Management & Access Permissions" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Profile Hero */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.06), transparent)' }}>
          <img src={avatar} alt={name} style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid #3B82F6', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }} />
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>{name}</h1>
            <p style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '1rem', margin: '0 0 1rem' }}>Dean — Faculty of Science & Information Technology</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '5px 14px', background: 'rgba(59,130,246,0.1)', color: '#1E40AF', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>🔐 Academic Admin</span>
              <span style={{ padding: '5px 14px', background: 'rgba(16,185,129,0.1)', color: '#065F46', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>ID: DEAN-001</span>
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
                { label: 'Employee ID', value: 'DEAN-001' },
                { label: 'Email', value: email },
                { label: 'Faculty', value: 'Science & Information Technology' },
                { label: 'Role', value: 'Dean' },
                { label: 'Ph.D. (1998)', value: 'Computer methods for investigation hydrogen - bonded equilibria in alcohols (Univ. of Glamorgan UK)' },
                { label: 'M.Sc. (1989)', value: 'Physics, Jahangirnagar University' },
                { label: 'B.Sc. Hons (1988)', value: 'Physics, Jahangirnagar University' },
                { label: 'Scholarship', value: 'Scholar of ODASSS (1993-96)' },
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
