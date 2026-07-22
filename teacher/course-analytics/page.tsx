'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import teacherData from '@/data/teacher.json';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CourseAnalyticsPage() {
  const { courses, coursePerformanceTrend } = teacherData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course Analytics" subtitle="Deep-dive into course performance trends and topic weaknesses" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Weekly Performance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={coursePerformanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 90]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
              <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="CSE303" stroke="#22D3EE" strokeWidth={2.5} dot={{ r: 4 }} name="Database Systems" />
              <Line type="monotone" dataKey="CSE301" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 4 }} name="Data Structures" />
              <Line type="monotone" dataKey="CSE201" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Discrete Math" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {courses.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{c.name}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{c.code}</p>
                </div>
                <AlertBadge priority={c.riskLevel as 'high' | 'medium' | 'low'} />
              </div>
              <div style={{ padding: '12px', background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 10, marginBottom: 12 }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, marginBottom: 6 }}>🔴 Struggling Topics</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {c.topicWeaknesses.map(t => (
                    <p key={t} style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>• {t}</p>
                  ))}
                </div>
              </div>
              <div style={{ padding: '10px 12px', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.72rem', color: '#22D3EE', fontWeight: 700, marginBottom: 4 }}>💡 AI Insight</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Students are struggling in {c.topicWeaknesses[0]}. Consider scheduling an extra revision session focused on this topic.
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
