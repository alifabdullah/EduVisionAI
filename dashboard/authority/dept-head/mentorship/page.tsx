'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';

const mentorships = [
  { student: 'Mehedi Hasan Shanto', studentPhoto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop', mentor: 'Dr. Md. Sarwar Hossain', mentorPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop', cgpa: 2.75, sessions: 3, lastMeeting: '2026-06-28', status: 'Active', progress: 'Improving' },
  { student: 'Sabbir Rahman', studentPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop', mentor: 'Dr. Sumaiya Khanam', mentorPhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop', cgpa: 2.50, sessions: 1, lastMeeting: '2026-07-01', status: 'Active', progress: 'Needs Attention' },
  { student: 'Tanvir Ahmed', studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', mentor: 'Mr. Faisal Hasan', mentorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', cgpa: 3.10, sessions: 5, lastMeeting: '2026-07-04', status: 'Active', progress: 'Stable' },
  { student: 'Arafat Islam Rafi', studentPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop', mentor: 'Dr. Anika Rahman', mentorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop', cgpa: 3.85, sessions: 4, lastMeeting: '2026-07-05', status: 'Active', progress: 'Excellent' },
];

const progressColor = (p: string) => {
  if (p === 'Excellent') return { bg: 'rgba(16,185,129,0.1)', color: '#10B981' };
  if (p === 'Stable') return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' };
  if (p === 'Improving') return { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' };
  return { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' };
};

export default function DeptHeadMentorshipPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Mentorship Management 🤝" subtitle="CSE Department — Mentorship Coordination Center" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Mentees" value="168" sub="All mentorship programs" icon="🎓" color="#3B82F6" />
          <StatCard label="Active Mentors" value="32" sub="Faculty-led sessions" icon="👨‍🏫" color="#10B981" />
          <StatCard label="Sessions This Month" value="94" sub="Total meetings logged" icon="📅" color="#8B5CF6" />
          <StatCard label="Pending Assignments" value="12" sub="Needs mentor" icon="⏳" color="#F59E0B" />
        </div>

        {/* AI Suggestions */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), transparent)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Mentorship Suggestions</h3>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.7, margin: 0, paddingLeft: '1rem' }}>
                <li>Sabbir Rahman (CGPA 2.50) requires an increase in session frequency from 1 to 3 sessions/month.</li>
                <li>12 new at-risk students in Batch 65 need mentor assignments before Week 5.</li>
                <li>Dr. Sumaiya Khanam's mentees show the highest improvement rate — consider expanding her mentee pool.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mentorship Directory */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📋 Active Mentorship Pairings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {mentorships.map(m => {
              const pc = progressColor(m.progress);
              return (
                <div key={m.student} style={{ padding: '1.1rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1rem', alignItems: 'center' }}>
                  {/* Pairing avatars */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={m.studentPhoto} alt={m.student} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3B82F6' }} />
                    <div style={{ width: 20, height: 2, background: 'var(--border)', margin: '0 -2px' }}></div>
                    <span style={{ fontSize: '1.2rem', zIndex: 1 }}>🤝</span>
                    <div style={{ width: 20, height: 2, background: 'var(--border)', margin: '0 -2px' }}></div>
                    <img src={m.mentorPhoto} alt={m.mentor} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{m.student} <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.8rem' }}>mentored by</span> {m.mentor}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                      CGPA: <strong style={{ color: 'var(--text)' }}>{m.cgpa}</strong> | Sessions: {m.sessions} | Last Meeting: {m.lastMeeting}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '8px', background: pc.bg, color: pc.color, fontWeight: 700 }}>{m.progress}</span>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>Change Mentor</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
