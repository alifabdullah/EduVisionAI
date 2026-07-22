'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';

export default function TeachersOverviewPage() {
  const { teachers } = authorityData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Teacher Effectiveness" subtitle="Professional development analytics across faculty" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Teacher', 'Department', 'Courses', 'Avg Improvement', 'Course Outcome', 'Mentorship', 'Effectiveness'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachers.sort((a, b) => b.effectivenessScore - a.effectivenessScore).map((t, i) => (
                  <tr key={t.id} style={{ borderBottom: i < teachers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{t.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{t.dept}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{t.courses}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ color: 'var(--success)', fontWeight: 700 }}>+{t.avgImprovement}%</span></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 700, color: t.courseOutcome < 70 ? 'var(--danger)' : '#6C63FF' }}>{t.courseOutcome}%</span></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 700, color: '#22D3EE' }}>{t.mentorship}%</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${t.effectivenessScore}%`, background: t.effectivenessScore >= 80 ? 'var(--success)' : t.effectivenessScore >= 65 ? 'var(--warning)' : 'var(--danger)', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: 32, color: t.effectivenessScore >= 80 ? 'var(--success)' : t.effectivenessScore >= 65 ? 'var(--warning)' : 'var(--danger)' }}>{t.effectivenessScore}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
