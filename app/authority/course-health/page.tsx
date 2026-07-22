'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import authorityData from '@/data/authority.json';

export default function CourseHealthPage() {
  const { courseHealth } = authorityData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course & Program Health" subtitle="Identify problematic courses based on performance and engagement metrics" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Course Name', 'Department', 'Avg Performance', 'Attendance', 'Engagement', 'Failure Risk'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courseHealth.map((c, i) => (
                  <tr key={c.course} style={{ borderBottom: i < courseHealth.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.course}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{c.dept}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: c.avgPerformance < 60 ? 'var(--danger)' : '#6C63FF' }}>{c.avgPerformance}%</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: c.attendance < 75 ? 'var(--warning)' : 'var(--success)' }}>{c.attendance}%</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: c.engagement < 70 ? 'var(--warning)' : '#22D3EE' }}>{c.engagement}%</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <AlertBadge priority={c.failureRisk as 'high' | 'medium' | 'low'} />
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
