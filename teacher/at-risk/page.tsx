'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';

export default function AtRiskPage() {
  const atRisk = teacherData.students.filter(s => s.segment === 'at-risk');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="At-Risk Students" subtitle="Students requiring immediate attention and intervention" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 12 }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)' }}>⚠️ {atRisk.length} students identified as at-risk based on marks and attendance thresholds.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {atRisk.map(s => {
            const problems = [];
            if (s.marks < 60) problems.push(`Low marks: ${s.marks}%`);
            if (s.attendance < 75) problems.push(`Low attendance: ${s.attendance}%`);
            return (
              <div key={s.id} className="glass-card stat-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--danger)' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(244,63,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: 'var(--danger)', flexShrink: 0 }}>
                    {s.name.split(' ').map((n:string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2 }}>{s.name}</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{s.roll} · {s.course}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Problems Identified</p>
                  {problems.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(244,63,94,0.08)', borderRadius: 8 }}>
                      <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>✕</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10 }}>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 4 }}>💡 Suggested Action</p>
                  <p style={{ fontSize: '0.8rem', color: '#22D3EE' }}>Schedule a one-on-one mentoring session. Focus on identified weak areas and create a recovery plan.</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
