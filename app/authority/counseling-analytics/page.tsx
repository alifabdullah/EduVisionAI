'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import { useCounseling } from '@/context/CounselingContext';
import { BarChart3, Users, Clock, CheckCircle2 } from 'lucide-react';

export default function AuthorityCounselingAnalytics() {
  const { getAnalytics } = useCounseling();
  const analytics = getAnalytics();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Counseling Analytics" subtitle="Global monitoring of student-teacher mentorship sessions" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        
        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Requests', val: analytics.totalRequests, icon: <Users size={20}/>, color: '#3B82F6' },
            { label: 'Pending Approvals', val: analytics.pendingRequests, icon: <Clock size={20}/>, color: '#F59E0B' },
            { label: 'Completed Sessions', val: analytics.completedSessions, icon: <CheckCircle2 size={20}/>, color: '#10B981' },
            { label: 'Avg Response Time', val: `${analytics.avgResponseTimeHours} hrs`, icon: <BarChart3 size={20}/>, color: '#8B5CF6' }
          ].map(s => (
            <div key={s.label} style={{ background: '#FFF', padding: '1.25rem', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 4 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Department-wise Stats */}
          <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>Department-wise Mentorship</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analytics.deptStats.map(d => (
                <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 60, fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{d.dept}</div>
                  <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${(d.completed / d.total) * 100}%`, background: '#3B82F6', borderRadius: 99 }} />
                  </div>
                  <div style={{ width: 100, fontSize: '0.8rem', color: '#64748B', textAlign: 'right' }}>
                    {d.completed} / {d.total} completed
                  </div>
                </div>
              ))}
              {analytics.deptStats.length === 0 && <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No departmental data available.</p>}
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>Request Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {analytics.categoryBreakdown.map(c => (
                <div key={c.category} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{c.category}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{Math.round((c.count / analytics.totalRequests) * 100)}%</span>
                </div>
              ))}
              {analytics.categoryBreakdown.length === 0 && <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No data available.</p>}
            </div>
          </div>
        </div>

        {/* Top Teachers */}
        <div style={{ background: '#FFF', padding: '1.5rem', borderRadius: 16, border: '1px solid #E2E8F0', marginTop: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>Teacher Performance & Responsiveness</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Teacher</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Sessions</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Requests</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Response</th>
              </tr>
            </thead>
            <tbody>
              {analytics.teacherStats.map(t => (
                <tr key={t.teacherId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '16px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                    {t.teacherName}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>
                    {t.completed}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: t.pending > 3 ? '#EF4444' : '#F59E0B' }}>
                    {t.pending}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontSize: '0.9rem', color: '#64748B' }}>
                    {t.avgResponse} hrs
                  </td>
                </tr>
              ))}
              {analytics.teacherStats.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>No teacher activity data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
