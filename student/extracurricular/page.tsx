'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import studentData from '@/data/student.json';

export default function ExtracurricularPage() {
  const { extracurricular } = studentData;
  const allSkills = [...new Set(extracurricular.flatMap(e => e.skills))];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Extra-Curricular" subtitle="Club participation, events, and skill development mapping" accentColor="#6C63FF" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {extracurricular.map((item, i) => (
            <div key={i} className="glass-card stat-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{item.club}</h3>
                  <span style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'rgba(108,99,255,0.2)', color: '#6C63FF', borderRadius: 999, fontWeight: 600, border: '1px solid rgba(108,99,255,0.3)' }}>{item.role}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22D3EE' }}>{item.events}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Events</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Skills Developed</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {item.skills.map(skill => (
                    <span key={skill} style={{ padding: '4px 10px', background: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>Skills Being Developed Through Activities</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {allSkills.map(skill => (
              <div key={skill} style={{ padding: '8px 16px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 10, fontSize: '0.85rem', fontWeight: 600, color: '#6C63FF' }}>
                ✦ {skill}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            Your extra-curricular activities are contributing to <strong style={{ color: 'var(--text)' }}>{allSkills.length} professional skills</strong>. Increasing your involvement, especially in leadership roles, will significantly improve your overall skill profile.
          </p>
        </div>
      </main>
    </div>
  );
}
