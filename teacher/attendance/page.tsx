'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

const courses = ['CSE301 – Data Structures', 'CSE303 – Database Systems', 'CSE401 – Algorithms'];

const students = [
  { id: 'CS21001', name: 'Joy Kumar Yuv', roll: '261-16-010' },
  { id: 'CS21002', name: 'Mia Reynolds', roll: 'CS21046' },
  { id: 'CS21003', name: 'Liam Scott', roll: 'CS21049' },
  { id: 'CS21004', name: 'Noah Wilson', roll: 'CS21050' },
  { id: 'CS21005', name: 'Ava Martinez', roll: 'CS21051' },
  { id: 'CS21006', name: 'Ethan Brown', roll: 'CS21052' },
];

type Status = 'P' | 'A' | 'L' | '';

const days = ['Jun 1', 'Jun 3', 'Jun 5', 'Jun 8', 'Jun 10', 'Jun 12'];

const colorMap: Record<Status, string> = {
  P: '#10B981', A: '#F43F5E', L: '#F59E0B', '': '#94A3B8',
};
const labelMap: Record<Status, string> = {
  P: 'Present', A: 'Absent', L: 'Late', '': '—',
};

type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
interface ApprovalItem { id: string; student: string; date: string; change: string; status: ApprovalStatus; }

const initialApprovals: ApprovalItem[] = [
  { id: 'APR-001', student: 'Joy Kumar Yuv', date: 'Jun 1', change: 'A → P (Medical)', status: 'Pending' },
  { id: 'APR-002', student: 'Liam Scott', date: 'Jun 3', change: 'A → L (Late arrival)', status: 'Pending' },
  { id: 'APR-003', student: 'Mia Reynolds', date: 'Jun 5', change: 'A → P (Class duty)', status: 'Approved' },
];

export default function AttendancePage() {
  const [tab, setTab] = useState<'entry' | 'update' | 'approval' | 'overview'>('entry');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedDate, setSelectedDate] = useState(days[days.length - 1]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setAttendance(prev => {
      const cur: Status = prev[id] ?? '';
      const next: Record<Status, Status> = { '': 'P', P: 'A', A: 'L', L: 'P' };
      return { ...prev, [id]: next[cur] };
    });
    setSaved(false);
  };

  const markAll = (s: Status) => {
    const upd: Record<string, Status> = {};
    students.forEach(st => { upd[st.id] = s; });
    setAttendance(upd);
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  const stats = {
    present: Object.values(attendance).filter(v => v === 'P').length,
    absent: Object.values(attendance).filter(v => v === 'A').length,
    late: Object.values(attendance).filter(v => v === 'L').length,
  };

  const cardStyle = (active: boolean, col: string) => ({
    padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s',
    background: active ? col : 'var(--surface)', color: active ? '#fff' : 'var(--muted)',
    boxShadow: active ? `0 4px 14px ${col}44` : '0 1px 4px rgba(0,0,0,0.06)',
  } as React.CSSProperties);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Attendance Management" subtitle="Course-wise attendance entry, update & approval workflow" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {([['entry', '📝 Attendance Entry'], ['update', '✏️ Update'], ['approval', '✅ Approval'], ['overview', '📊 Overview']] as [string, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              style={cardStyle(tab === key, '#1D4ED8')}>{label}</button>
          ))}
        </div>

        {/* Course & Date Selectors */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            {days.map(d => <option key={d}>{d}, 2026</option>)}
          </select>
        </div>

        {/* ─── ENTRY TAB ─── */}
        {tab === 'entry' && (
          <div>
            {/* Quick summary */}
            <div style={{ display: 'flex', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Present', value: stats.present, color: '#10B981' },
                { label: 'Absent', value: stats.absent, color: '#F43F5E' },
                { label: 'Late', value: stats.late, color: '#F59E0B' },
                { label: 'Not Marked', value: students.length - stats.present - stats.absent - stats.late, color: '#94A3B8' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Bulk actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600 }}>Mark All:</span>
              {(['P', 'A', 'L'] as Status[]).map(s => (
                <button key={s} onClick={() => markAll(s)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${colorMap[s]}55`, background: `${colorMap[s]}15`, color: colorMap[s], fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                  {labelMap[s]}
                </button>
              ))}
            </div>

            {/* Student table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Student Name', 'Roll', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st, i) => {
                      const s = attendance[st.id] ?? '';
                      const c = colorMap[s];
                      return (
                        <tr key={st.id} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 600 }}>{i + 1}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 700 }}>{st.name}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{st.roll}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ padding: '3px 12px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: s ? `${c}20` : 'var(--surface-3)', color: s ? c : 'var(--muted)', border: `1px solid ${s ? c + '44' : 'var(--border)'}` }}>
                              {s ? labelMap[s] : 'Not Marked'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button onClick={() => toggle(st.id)}
                              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${c || '#94A3B8'}55`, background: `${c || '#94A3B8'}15`, color: c || '#94A3B8', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                              Click to Toggle
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={handleSave}
                  style={{ padding: '9px 24px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                  💾 Save Attendance
                </button>
                {saved && <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>✅ Saved successfully!</span>}
              </div>
            </div>
          </div>
        )}

        {/* ─── UPDATE TAB ─── */}
        {tab === 'update' && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>✏️ Attendance Update Request</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>Submit corrections for previously recorded attendance. Changes will go through approval workflow.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Student ID / Roll', placeholder: 'e.g. CS21001' },
                { label: 'Date of Attendance', placeholder: 'e.g. Jun 1, 2026' },
                { label: 'Current Status', placeholder: 'e.g. Absent' },
                { label: 'Requested Status', placeholder: 'e.g. Present' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none' }} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Reason / Justification</label>
                <textarea rows={3} placeholder="Explain the reason for attendance update..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
              </div>
            </div>
            <button style={{ marginTop: '1rem', padding: '9px 24px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
              📤 Submit Update Request
            </button>
          </div>
        )}

        {/* ─── APPROVAL TAB ─── */}
        {tab === 'approval' && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>✅ Attendance Approval Queue</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {approvals.map(a => (
                <div key={a.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${a.status === 'Approved' ? '#10B981' : a.status === 'Rejected' ? '#F43F5E' : '#F59E0B'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{a.student}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Date: {a.date} · Change: <strong>{a.change}</strong></p>
                    </div>
                    <span style={{ padding: '3px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: a.status === 'Approved' ? '#10B98122' : a.status === 'Rejected' ? '#F43F5E22' : '#F59E0B22', color: a.status === 'Approved' ? '#10B981' : a.status === 'Rejected' ? '#F43F5E' : '#F59E0B', border: `1px solid ${a.status === 'Approved' ? '#10B98144' : a.status === 'Rejected' ? '#F43F5E44' : '#F59E0B44'}` }}>
                      {a.status}
                    </span>
                  </div>
                  {a.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'Approved' } : x))}
                        style={{ padding: '6px 16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>✅ Approve</button>
                      <button onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: 'Rejected' } : x))}
                        style={{ padding: '6px 16px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: '#F43F5E', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>❌ Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── OVERVIEW TAB ─── */}
        {tab === 'overview' && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem' }}>📊 Course-wise Attendance Overview</h3>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      {['Student', 'Roll', ...days, 'Attendance %'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(st => {
                      const sample: Status[] = ['P', 'P', 'A', 'P', 'L', 'P'];
                      const pct = Math.round((sample.filter(s => s === 'P').length / days.length) * 100);
                      return (
                        <tr key={st.id} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '10px 14px', fontWeight: 700 }}>{st.name}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{st.roll}</td>
                          {sample.map((s, i) => (
                            <td key={i} style={{ padding: '10px 14px' }}>
                              <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${colorMap[s]}20`, color: colorMap[s], border: `1px solid ${colorMap[s]}44` }}>{s}</span>
                            </td>
                          ))}
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: pct < 75 ? '#F43F5E' : '#10B981' }}>{pct}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
