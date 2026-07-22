'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

const semesters = ['Spring 2026', 'Fall 2025', 'Summer 2025'];
const courseOptions = ['CSE301 – Data Structures', 'CSE303 – Database Systems', 'CSE401 – Algorithms'];

type ClearanceStatus = 'Cleared' | 'Not Cleared' | 'Pending';

interface Student {
  id: string; name: string; roll: string;
  regClearance: ClearanceStatus;
  midtermEligible: ClearanceStatus;
  finalEligible: ClearanceStatus;
  examPermission: boolean;
}

const initialStudents: Student[] = [
  { id: 'CS21001', name: 'Joy Kumar Yuv', roll: '261-16-010', regClearance: 'Cleared', midtermEligible: 'Cleared', finalEligible: 'Cleared', examPermission: true },
  { id: 'CS21002', name: 'Mia Reynolds', roll: 'CS21046', regClearance: 'Cleared', midtermEligible: 'Cleared', finalEligible: 'Not Cleared', examPermission: false },
  { id: 'CS21003', name: 'Liam Scott', roll: 'CS21049', regClearance: 'Not Cleared', midtermEligible: 'Not Cleared', finalEligible: 'Not Cleared', examPermission: false },
  { id: 'CS21004', name: 'Noah Wilson', roll: 'CS21050', regClearance: 'Cleared', midtermEligible: 'Cleared', finalEligible: 'Pending', examPermission: false },
  { id: 'CS21005', name: 'Ava Martinez', roll: 'CS21051', regClearance: 'Cleared', midtermEligible: 'Cleared', finalEligible: 'Cleared', examPermission: true },
  { id: 'CS21006', name: 'Ethan Brown', roll: 'CS21052', regClearance: 'Pending', midtermEligible: 'Pending', finalEligible: 'Not Cleared', examPermission: false },
];

const statusColor: Record<ClearanceStatus, string> = {
  Cleared: '#10B981', 'Not Cleared': '#F43F5E', Pending: '#F59E0B',
};

const StatusBadge = ({ status }: { status: ClearanceStatus }) => (
  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${statusColor[status]}20`, color: statusColor[status], border: `1px solid ${statusColor[status]}44`, whiteSpace: 'nowrap' }}>
    {status === 'Cleared' ? '✔' : status === 'Not Cleared' ? '✖' : '⏳'} {status}
  </span>
);

export default function AccountsClearancePage() {
  const [semester, setSemester] = useState(semesters[0]);
  const [course, setCourse] = useState(courseOptions[0]);
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const togglePermission = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, examPermission: !s.examPermission } : s));
  };

  const cleared = students.filter(s => s.regClearance === 'Cleared').length;
  const finalCleared = students.filter(s => s.finalEligible === 'Cleared').length;
  const permitted = students.filter(s => s.examPermission).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Accounts Clearance" subtitle="Manage exam eligibility and clearance workflow" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Selectors */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <select value={semester} onChange={e => setSemester(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            {semesters.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={course} onChange={e => setCourse(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            {courseOptions.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Registration Cleared', value: `${cleared}/${students.length}`, color: '#10B981' },
            { label: 'Final Eligible', value: `${finalCleared}/${students.length}`, color: '#22D3EE' },
            { label: 'Exam Permitted', value: `${permitted}/${students.length}`, color: '#1D4ED8' },
            { label: 'Not Cleared', value: students.filter(s => s.finalEligible === 'Not Cleared').length, color: '#F43F5E' },
          ].map(s => (
            <div key={s.label} className="glass-card stat-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Clearance Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ fontWeight: 800, fontSize: '0.95rem' }}>📋 Student Clearance Status</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                ✅ Clear All Eligible
              </button>
              <button style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--muted)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                📥 Export List
              </button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'ID / Roll', 'Registration', 'Midterm Eligible', 'Final Eligible', 'Exam Permission', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{s.roll}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={s.regClearance} /></td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={s.midtermEligible} /></td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={s.finalEligible} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s.examPermission ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', color: s.examPermission ? '#10B981' : '#F43F5E', border: `1px solid ${s.examPermission ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}` }}>
                        {s.examPermission ? '🟢 Permitted' : '🔴 Blocked'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => togglePermission(s.id)}
                        style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${s.examPermission ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`, background: s.examPermission ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', color: s.examPermission ? '#F43F5E' : '#10B981', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
                        {s.examPermission ? '🚫 Revoke' : '✅ Permit'}
                      </button>
                    </td>
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
