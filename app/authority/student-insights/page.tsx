'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function StudentInsightsPage() {
  const { studentInsights, universityStats } = authorityData;
  const pieData = [
    { name: 'High Performers', value: studentInsights.highPerformers, color: '#10B981' },
    { name: 'Average Students', value: studentInsights.averageStudents, color: '#22D3EE' },
    { name: 'At-Risk Students', value: studentInsights.atRiskStudents, color: '#F43F5E' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Student Population Insights" subtitle="Aggregated performance and risk analysis of the student body" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Students', value: universityStats.totalStudents.toLocaleString(), color: '#F59E0B' },
            { label: 'First Year At-Risk', value: `${studentInsights.firstYearAtRiskPercent}%`, color: '#F43F5E' },
            { label: 'Communication Gap', value: `${studentInsights.communicationGapPercent}%`, color: '#F59E0B' },
            { label: 'Leadership Gap', value: `${studentInsights.leadershipGapPercent}%`, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Student Segmentation</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 16 }}>Distribution by performance level</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Common Weak Areas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--danger)', marginBottom: 8 }}>🔴 Common Weak Subjects</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {studentInsights.commonWeakSubjects.map(s => (
                    <span key={s} style={{ padding: '4px 12px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--danger)' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--warning)', marginBottom: 8 }}>🟠 Common Skill Gaps</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {studentInsights.commonWeakSkills.map(s => (
                    <span key={s} style={{ padding: '4px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--warning)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '12px 14px', background: 'rgba(34,211,238,0.08)', borderRadius: 10, border: '1px solid rgba(34,211,238,0.2)' }}>
              <p style={{ fontSize: '0.72rem', color: '#22D3EE', fontWeight: 700, marginBottom: 4 }}>💡 AI Insight</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                {studentInsights.firstYearAtRiskPercent}% of first-year students are at risk. Implementing an early-warning intervention program in the first semester is highly recommended.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
