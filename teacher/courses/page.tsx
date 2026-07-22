'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import teacherData from '@/data/teacher.json';

export default function CoursesPage() {
  const { courses } = teacherData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="My Courses" subtitle="All assigned courses with performance and risk overview" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {courses.map(c => (
            <div key={c.id} className="glass-card stat-card" style={{ padding: '1.5rem', borderTop: `3px solid ${c.riskLevel === 'high' ? 'var(--danger)' : c.riskLevel === 'medium' ? 'var(--warning)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{c.code} · {c.semester} Semester</p>
                </div>
                <AlertBadge priority={c.riskLevel as 'high' | 'medium' | 'low'} label={`${c.riskLevel} risk`} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: 16 }}>
                {[
                  { label: 'Students', value: c.totalStudents, color: '#22D3EE' },
                  { label: 'Avg Marks', value: `${c.avgMarks}%`, color: c.avgMarks < 60 ? 'var(--danger)' : '#6C63FF' },
                  { label: 'Attendance', value: `${c.avgAttendance}%`, color: c.avgAttendance < 75 ? 'var(--warning)' : 'var(--success)' },
                  { label: 'Assignments', value: `${c.assignmentCompletion}%`, color: '#F59E0B' },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{stat.label}</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Weak Topics</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.topicWeaknesses.map(t => (
                    <span key={t} style={{ padding: '3px 8px', background: 'rgba(244,63,94,0.12)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 6, fontSize: '0.72rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
