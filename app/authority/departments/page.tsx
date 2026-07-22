'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import authorityData from '@/data/authority.json';

export default function DepartmentsPage() {
  const { departments } = authorityData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Departments" subtitle="All department performance and health overview" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {departments.map(d => (
            <div key={d.id} className="glass-card stat-card" style={{ padding: '1.5rem', borderTop: `3px solid ${d.riskLevel === 'high' ? 'var(--danger)' : d.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{d.name}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{d.id}</p>
                </div>
                <AlertBadge priority={d.riskLevel as 'high' | 'medium' | 'low'} label={`${d.riskLevel} risk`} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Students', value: d.students, color: '#F59E0B' },
                  { label: 'Teachers', value: d.teachers, color: '#22D3EE' },
                  { label: 'Avg GPA', value: d.avgGPA.toFixed(1), color: d.avgGPA < 3.0 ? 'var(--danger)' : '#6C63FF' },
                  { label: 'Attendance', value: `${d.avgAttendance}%`, color: d.avgAttendance < 75 ? 'var(--warning)' : 'var(--success)' },
                  { label: 'At-Risk', value: d.atRiskCount, color: 'var(--danger)' },
                  { label: 'Skill Score', value: `${d.skillScore}%`, color: '#22D3EE' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
