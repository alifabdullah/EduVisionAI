'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import authorityData from '@/data/authority.json';

export default function InstitutionalAlertsPage() {
  const { institutionalAlerts } = authorityData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Institutional Alerts" subtitle="University-wide alerts requiring strategic action" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {institutionalAlerts.map(a => (
            <div key={a.id} className="glass-card stat-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${a.priority === 'high' ? 'var(--danger)' : a.priority === 'medium' ? 'var(--warning)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{a.title}</h3>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <AlertBadge priority={a.priority as 'high' | 'medium' | 'low'} />
                  <span className="badge badge-info">{a.dept}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>{a.detail}</p>
              <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F59E0B' }}>Suggested Action: </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{a.action}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
