'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

type LeaveType = 'Casual' | 'Medical' | 'Duty' | 'Earned' | 'Semester Break';
type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';
type ESSTab = 'profile' | 'attendance' | 'leave' | 'holidays' | 'kpi';

interface LeaveRecord { id: string; type: LeaveType; from: string; to: string; days: number; reason: string; status: LeaveStatus; }

const leaveBalance: Record<LeaveType, { used: number; total: number; color: string }> = {
  Casual: { used: 3, total: 15, color: '#22D3EE' },
  Medical: { used: 0, total: 10, color: '#10B981' },
  Duty: { used: 2, total: 10, color: '#F59E0B' },
  Earned: { used: 5, total: 20, color: '#6C63FF' },
  'Semester Break': { used: 0, total: 30, color: '#A78BFA' },
};

const leaveHistory: LeaveRecord[] = [
  { id: 'LV-001', type: 'Casual', from: 'Jun 1, 2026', to: 'Jun 2, 2026', days: 2, reason: 'Personal work', status: 'Approved' },
  { id: 'LV-002', type: 'Duty', from: 'May 20, 2026', to: 'May 21, 2026', days: 2, reason: 'Conference attendance', status: 'Approved' },
  { id: 'LV-003', type: 'Casual', from: 'Jun 16, 2026', to: 'Jun 16, 2026', days: 1, reason: 'Family event', status: 'Pending' },
];

const attendanceLogs = [
  { date: 'Jun 14, 2026', day: 'Sat', in: '09:02', out: '17:15', hours: 8.2, status: 'On Time' },
  { date: 'Jun 13, 2026', day: 'Fri', in: '09:28', out: '17:00', hours: 7.5, status: 'Late' },
  { date: 'Jun 12, 2026', day: 'Thu', in: '08:55', out: '17:30', hours: 8.6, status: 'On Time' },
  { date: 'Jun 11, 2026', day: 'Wed', in: '09:00', out: '17:10', hours: 8.2, status: 'On Time' },
  { date: 'Jun 10, 2026', day: 'Tue', in: '09:45', out: '16:45', hours: 7.0, status: 'Late' },
  { date: 'Jun 9, 2026', day: 'Mon', in: '08:50', out: '17:20', hours: 8.5, status: 'On Time' },
];

const holidays = [
  { date: 'Jun 15, 2026', name: 'National Day', type: 'National' },
  { date: 'Jun 21, 2026', name: 'Eid Al-Adha', type: 'Religious' },
  { date: 'Jun 28, 2026', name: 'University Foundation Day', type: 'Institutional' },
  { date: 'Jul 4, 2026', name: 'Independence Day (Bangladesh)', type: 'National' },
];

const holColor: Record<string, string> = { National: '#F59E0B', Religious: '#10B981', Institutional: '#6C63FF' };
const leaveStatusColor: Record<LeaveStatus, string> = { Approved: '#10B981', Pending: '#F59E0B', Rejected: '#F43F5E' };

export default function ESSPage() {
  const [tab, setTab] = useState<ESSTab>('profile');
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual' as LeaveType, from: '', to: '', reason: '' });

  const totalHours = attendanceLogs.reduce((a, l) => a + l.hours, 0);
  const avgHours = (totalHours / attendanceLogs.length).toFixed(1);

  const tabBtn = (key: ESSTab, icon: string, label: string) => (
    <button key={key} onClick={() => setTab(key)}
      style={{ padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', transition: 'all 0.2s', background: tab === key ? 'linear-gradient(135deg,#1D4ED8,#22D3EE)' : 'var(--surface)', color: tab === key ? '#fff' : 'var(--muted)', boxShadow: tab === key ? '0 4px 12px rgba(29,78,216,0.3)' : 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span><span>{label}</span>
    </button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Employee Self Service (ESS)" subtitle="Faculty HR portal — attendance, leave, KPI, and profile management" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabBtn('profile', '👤', 'My Profile')}
          {tabBtn('attendance', '🕐', 'Attendance')}
          {tabBtn('leave', '🌴', 'Leave Management')}
          {tabBtn('holidays', '📅', 'Holidays & Events')}
          {tabBtn('kpi', '📊', 'KPI')}
        </div>

        {/* ─── PROFILE ─── */}
        {tab === 'profile' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(34,211,238,0.07))', border: '1px solid rgba(29,78,216,0.2)', borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.6rem', color: '#fff', flexShrink: 0 }}>DS</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4 }}>Dr. Shuvo Das</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 6 }}>Assistant Professor · Department of Computer Science & Engineering</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(29,78,216,0.2)' }}>Faculty ID: DIU-0042</span>
                  <span style={{ padding: '3px 10px', borderRadius: 8, background: 'rgba(80,183,72,0.1)', color: '#50B748', fontSize: '0.72rem', fontWeight: 700, border: '1px solid rgba(80,183,72,0.2)' }}>🟢 Active</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Employee ID', value: 'DIU-0042' },
                { label: 'Designation', value: 'Assistant Professor' },
                { label: 'Department', value: 'CSE' },
                { label: 'Email', value: 'shuvo.das@diu.edu.bd' },
                { label: 'Phone', value: '+880-1700-000000' },
                { label: 'Join Date', value: 'March 1, 2021' },
                { label: 'Contract Type', value: 'Permanent' },
                { label: 'Shift', value: 'Day' },
              ].map(f => (
                <div key={f.label} style={{ padding: '1rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4, fontWeight: 700 }}>{f.label}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ATTENDANCE ─── */}
        {tab === 'attendance' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Days', value: attendanceLogs.length, color: '#1D4ED8' },
                { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, color: '#22D3EE' },
                { label: 'Avg Hours/Day', value: `${avgHours}h`, color: '#10B981' },
                { label: 'Late Days', value: attendanceLogs.filter(l => l.status === 'Late').length, color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="glass-card stat-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      {['Date', 'Day', 'In Time', 'Out Time', 'Hours', 'Status'].map(h => (
                        <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((l, i) => (
                      <tr key={l.date} style={{ borderBottom: i < attendanceLogs.length - 1 ? '1px solid var(--border)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '11px 14px', fontWeight: 600 }}>{l.date}</td>
                        <td style={{ padding: '11px 14px', color: 'var(--muted)' }}>{l.day}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: '#22D3EE', fontWeight: 700 }}>{l.in}</td>
                        <td style={{ padding: '11px 14px', fontFamily: 'monospace', color: 'var(--muted)' }}>{l.out}</td>
                        <td style={{ padding: '11px 14px', fontWeight: 700, color: l.hours >= 8 ? '#10B981' : '#F59E0B' }}>{l.hours}h</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, background: l.status === 'On Time' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: l.status === 'On Time' ? '#10B981' : '#F59E0B', border: `1px solid ${l.status === 'On Time' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                            {l.status === 'On Time' ? '✅' : '⚠️'} {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── LEAVE ─── */}
        {tab === 'leave' && (
          <div>
            {/* Balance Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {(Object.entries(leaveBalance) as [LeaveType, { used: number; total: number; color: string }][]).map(([type, bal]) => (
                <div key={type} className="glass-card" style={{ padding: '1.125rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>{type}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: bal.color }}>{bal.total - bal.used}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>of {bal.total} remaining</p>
                  <div style={{ height: 4, background: 'var(--surface-3)', borderRadius: 99, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(bal.used / bal.total) * 100}%`, background: bal.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Leave */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>📝 Apply for Leave</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Leave Type</label>
                  <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value as LeaveType }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                    {Object.keys(leaveBalance).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {[{ label: 'From Date', key: 'from' }, { label: 'To Date', key: 'to' }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input type="date" onChange={e => setLeaveForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none' }} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Reason</label>
                  <textarea rows={2} placeholder="Brief reason for leave..." onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
                </div>
              </div>
              <button style={{ marginTop: '1rem', padding: '9px 24px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                📤 Submit Leave Request
              </button>
            </div>

            {/* Leave History */}
            <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Leave History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {leaveHistory.map(l => (
                <div key={l.id} className="glass-card" style={{ padding: '1.125rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, borderLeft: `4px solid ${leaveStatusColor[l.status]}` }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{l.type} Leave — {l.days} day{l.days > 1 ? 's' : ''}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{l.from} → {l.to} · {l.reason}</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${leaveStatusColor[l.status]}20`, color: leaveStatusColor[l.status], border: `1px solid ${leaveStatusColor[l.status]}44` }}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── HOLIDAYS ─── */}
        {tab === 'holidays' && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>🗓️ Upcoming Holidays & Events</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {holidays.map((h, i) => (
                <div key={i} className="glass-card stat-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${holColor[h.type]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, background: `${holColor[h.type]}20`, color: holColor[h.type], border: `1px solid ${holColor[h.type]}44` }}>{h.type}</span>
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 4 }}>{h.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>📅 {h.date}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1.125rem 1.25rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12 }}>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#F59E0B', marginBottom: 4 }}>🎂 Upcoming Faculty Birthdays</p>
              {['Dr. A. Rahman — Jun 18', 'Prof. M. Karim — Jun 25', 'Ms. S. Akter — Jul 2'].map(b => (
                <p key={b} style={{ fontSize: '0.8rem', color: 'var(--muted)', padding: '4px 0' }}>🎉 {b}</p>
              ))}
            </div>
          </div>
        )}

        {/* ─── ESS KPI ─── */}
        {tab === 'kpi' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Teaching Efficiency', score: 87, target: 90, color: '#22D3EE' },
                { label: 'Research Output', score: 60, target: 75, color: '#A78BFA' },
                { label: 'Student Satisfaction', score: 92, target: 90, color: '#10B981' },
                { label: 'Attendance Score', score: 95, target: 95, color: '#1D4ED8' },
              ].map(k => (
                <div key={k.label} className="glass-card" style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 6 }}>{k.label}</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, color: k.score >= k.target ? '#10B981' : '#F59E0B', marginBottom: 6 }}>{k.score}<span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>/{k.target}</span></p>
                  <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${k.score}%`, background: k.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem 1.25rem', background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 12 }}>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--primary)', marginBottom: 4 }}>📋 HR Review Status</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Last reviewed: <strong>April 2026</strong> by HR Manager. Next review scheduled: <strong>July 2026</strong>.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
