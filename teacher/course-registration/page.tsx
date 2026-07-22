'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

type RegStatus = 'Registered' | 'Pending' | 'Not Registered' | 'Withdrawn';

interface StudentReg {
  id: string; name: string; roll: string; program: string;
  courses: string[];
  status: RegStatus;
}

const programs = ['B.Sc. in CSE', 'B.Sc. in EEE', 'B.Sc. in BBA'];
const allCourses = ['CSE301', 'CSE303', 'CSE305', 'CSE401', 'MAT201'];

const initialRegs: StudentReg[] = [
  { id: 'CS21001', name: 'Joy Kumar Yuv', roll: '261-16-010', program: 'B.Sc. in CSE', courses: ['CSE301', 'CSE303', 'MAT201'], status: 'Registered' },
  { id: 'CS21002', name: 'Mia Reynolds', roll: 'CS21046', program: 'B.Sc. in CSE', courses: ['CSE301', 'CSE303'], status: 'Registered' },
  { id: 'CS21003', name: 'Liam Scott', roll: 'CS21049', program: 'B.Sc. in CSE', courses: ['CSE301'], status: 'Pending' },
  { id: 'CS21004', name: 'Noah Wilson', roll: 'CS21050', program: 'B.Sc. in CSE', courses: ['CSE301', 'CSE303', 'CSE305', 'CSE401'], status: 'Registered' },
  { id: 'CS21005', name: 'Ava Martinez', roll: 'CS21051', program: 'B.Sc. in CSE', courses: [], status: 'Not Registered' },
];

const statusColor: Record<RegStatus, string> = { Registered: '#10B981', Pending: '#F59E0B', 'Not Registered': '#F43F5E', Withdrawn: '#94A3B8' };

export default function CourseRegistrationPage() {
  const [regs, setRegs] = useState<StudentReg[]>(initialRegs);
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterStatus, setFilterStatus] = useState<RegStatus | 'All'>('All');
  const [searchQ, setSearchQ] = useState('');

  const filtered = regs.filter(r =>
    (filterProgram === 'All' || r.program === filterProgram) &&
    (filterStatus === 'All' || r.status === filterStatus) &&
    (r.name.toLowerCase().includes(searchQ.toLowerCase()) || r.roll.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const verifyReg = (id: string) => {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status: 'Registered' } : r));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course Registration" subtitle="Student registration verification and course allocation management" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Students', value: regs.length, color: '#1D4ED8' },
            { label: 'Registered', value: regs.filter(r => r.status === 'Registered').length, color: '#10B981' },
            { label: 'Pending', value: regs.filter(r => r.status === 'Pending').length, color: '#F59E0B' },
            { label: 'Not Registered', value: regs.filter(r => r.status === 'Not Registered').length, color: '#F43F5E' },
          ].map(s => (
            <div key={s.label} className="glass-card stat-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="🔍 Search by name or roll..."
            style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none' }} />
          <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            <option value="All">All Programs</option>
            {programs.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as RegStatus | 'All')}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            <option value="All">All Statuses</option>
            {(['Registered', 'Pending', 'Not Registered', 'Withdrawn'] as RegStatus[]).map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'ID / Roll', 'Program', 'Courses Registered', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 14px', fontWeight: 700 }}>{r.name}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{r.roll}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--muted)', fontSize: '0.8rem' }}>{r.program}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {r.courses.length > 0 ? r.courses.map(c => (
                          <span key={c} style={{ padding: '2px 7px', borderRadius: 6, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', border: '1px solid rgba(29,78,216,0.2)', fontSize: '0.7rem', fontWeight: 700 }}>{c}</span>
                        )) : <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>None</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${statusColor[r.status]}20`, color: statusColor[r.status], border: `1px solid ${statusColor[r.status]}44` }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {r.status === 'Pending' && (
                        <button onClick={() => verifyReg(r.id)}
                          style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
                          ✅ Verify
                        </button>
                      )}
                      {r.status === 'Not Registered' && (
                        <button style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid rgba(29,78,216,0.3)', background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
                          📋 Assign Course
                        </button>
                      )}
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
