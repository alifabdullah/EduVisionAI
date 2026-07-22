'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';

export default function AuthorityProfilePage() {
  const { profile } = authorityData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Profile" subtitle="Authority profile and access settings" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ maxWidth: 700 }}>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #F59E0B, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
              {(profile as any).avatar ? (
                <img src={(profile as any).avatar} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.name.split(' ').filter(n => !['Dr.','Prof.'].includes(n)).map(n => n[0]).join('').slice(0,2)
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{profile.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 10 }}>{profile.role} · {profile.institution}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-warning">🏛️ Authority</span>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>{profile.accessLevel} Access</span>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 14 }}>Account Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Authority ID', value: profile.id },
                { label: 'Email', value: profile.email },
                { label: 'Role', value: profile.role },
                { label: 'Institution', value: profile.institution },
              ].map(f => (
                <div key={f.label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
             <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 14 }}>Access Permissions</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {['Full Institutional Overview', 'Department Comparison Analytics', 'Strategic AI Decision Support', 'Faculty Effectiveness Reports', 'Institution-wide Alerts'].map(p => (
                 <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8 }}>
                   <span style={{ color: 'var(--success)' }}>✓</span>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{p}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
