'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function SkillGapPage() {
  const students = teacherData.students;
  const skillKeys = ['Communication', 'Leadership', 'Teamwork', 'Critical Thinking', 'Problem Solving'];
  const classAvg = skillKeys.map(k => ({
    subject: k,
    avg: Math.round(students.reduce((sum, s) => sum + (s.skills[k as keyof typeof s.skills] || 0), 0) / students.length),
    fullMark: 100,
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Skill Gap Analysis" subtitle="Class and individual student skill profile visualization" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>Class Average Skill Radar</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 12 }}>Average skill levels across all your students</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={classAvg}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.8rem' }} />
                <Radar name="Class Avg" dataKey="avg" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Skill Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {classAvg.map(item => (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.82rem' }}>{item.subject}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.avg < 60 ? 'var(--danger)' : item.avg < 75 ? 'var(--warning)' : 'var(--success)' }}>{item.avg}%</span>
                  </div>
                  <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.avg}%`, background: item.avg < 60 ? 'var(--danger)' : item.avg < 75 ? 'var(--warning)' : '#22D3EE', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14 }}>Individual Student Skill Scores</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Student', ...skillKeys].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.name}</td>
                    {skillKeys.map(k => {
                      const val = s.skills[k as keyof typeof s.skills];
                      return (
                        <td key={k} style={{ padding: '10px 12px' }}>
                          <span style={{ fontWeight: 600, color: val < 55 ? 'var(--danger)' : val < 70 ? 'var(--warning)' : 'var(--success)' }}>{val}%</span>
                        </td>
                      );
                    })}
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
