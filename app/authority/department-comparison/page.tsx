'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DeptComparisonPage() {
  const data = authorityData.departmentComparison;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Department Comparison" subtitle="Multi-metric comparison across all departments" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {[
          { title: 'Academic Performance', key: 'performance', color: '#F59E0B', desc: 'Average student marks (%)' },
          { title: 'Attendance Rate', key: 'attendance', color: '#22D3EE', desc: 'Average student attendance (%)' },
          { title: 'At-Risk Percentage', key: 'atRisk', color: '#F43F5E', desc: '% of at-risk students in department' },
          { title: 'Teacher Effectiveness', key: 'teacherEffectiveness', color: '#10B981', desc: 'Composite teacher effectiveness score' },
        ].map(chart => (
          <div key={chart.key} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{chart.title}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 16 }}>{chart.desc}</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                <Bar dataKey={chart.key} fill={chart.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </main>
    </div>
  );
}
