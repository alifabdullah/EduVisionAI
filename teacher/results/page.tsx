'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

interface StudentResult {
  id: string;
  regId: string;
  name: string;
  program: string;
  shift: string;
  creditCompleted: number;
  currentCGPA: number;
  completedCGPA: number;
  courses: { code: string; title: string; credit: number; grade: string; points: number }[];
}

const RESULTS: StudentResult[] = [
  {
    id: 'CS21001', regId: '261-16-010', name: 'Joy Kumar Yuv',
    program: 'B.Sc. in CSE', shift: 'Day', creditCompleted: 98, currentCGPA: 3.42, completedCGPA: 3.38,
    courses: [
      { code: 'CSE301', title: 'Data Structures', credit: 3, grade: 'A', points: 4.0 },
      { code: 'CSE303', title: 'Database Systems', credit: 3, grade: 'B+', points: 3.5 },
      { code: 'CSE305', title: 'Operating Systems', credit: 3, grade: 'A-', points: 3.7 },
      { code: 'MAT201', title: 'Discrete Math', credit: 3, grade: 'B', points: 3.0 },
    ],
  },
  {
    id: 'CS21002', regId: 'CS21046', name: 'Mia Reynolds',
    program: 'B.Sc. in CSE', shift: 'Day', creditCompleted: 72, currentCGPA: 2.85, completedCGPA: 2.90,
    courses: [
      { code: 'CSE301', title: 'Data Structures', credit: 3, grade: 'C+', points: 2.5 },
      { code: 'CSE303', title: 'Database Systems', credit: 3, grade: 'B', points: 3.0 },
      { code: 'CSE305', title: 'Operating Systems', credit: 3, grade: 'C', points: 2.0 },
    ],
  },
  {
    id: 'CS21003', regId: 'CS21049', name: 'Liam Scott',
    program: 'B.Sc. in CSE', shift: 'Evening', creditCompleted: 60, currentCGPA: 2.20, completedCGPA: 2.15,
    courses: [
      { code: 'CSE301', title: 'Data Structures', credit: 3, grade: 'D', points: 1.0 },
      { code: 'CSE305', title: 'Operating Systems', credit: 3, grade: 'C-', points: 1.7 },
    ],
  },
];

const gradeColor: Record<string, string> = {
  'A': '#10B981', 'A-': '#34D399', 'B+': '#22D3EE', 'B': '#60A5FA', 'B-': '#818CF8',
  'C+': '#F59E0B', 'C': '#FBBF24', 'C-': '#FB923C', 'D': '#F43F5E', 'F': '#EF4444',
};

export default function ResultsPage() {
  const [searchId, setSearchId] = useState('');
  const [selected, setSelected] = useState<StudentResult | null>(null);

  const handleSearch = () => {
    const found = RESULTS.find(r =>
      r.id.toLowerCase() === searchId.trim().toLowerCase() ||
      r.regId.toLowerCase() === searchId.trim().toLowerCase()
    );
    setSelected(found ?? null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Result Management" subtitle="Search and review individual student academic results" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Search */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>🔍 Search Student Result</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              value={searchId} onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Student ID or Registration ID (e.g. CS21001 or 261-16-010)"
              style={{ flex: 1, minWidth: 260, padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.875rem', color: 'var(--text)', outline: 'none' }}
            />
            <button onClick={handleSearch}
              style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
              🔍 Search
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {RESULTS.map(r => (
              <button key={r.id} onClick={() => { setSearchId(r.id); setSelected(r); }}
                style={{ padding: '4px 12px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* No result */}
        {searchId && !selected && (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</p>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>No student found</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Try a different Student ID or Registration ID</p>
          </div>
        )}

        {/* Result Card */}
        {selected && (
          <div className="fade-in">
            {/* Student Summary */}
            <div style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(34,211,238,0.08))', border: '1px solid rgba(29,78,216,0.2)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 2 }}>{selected.name}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>ID: {selected.id} · Reg: {selected.regId}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(29,78,216,0.2)' }}>📚 {selected.program}</span>
                <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(80,183,72,0.1)', color: '#50B748', fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(80,183,72,0.2)' }}>🕐 {selected.shift} Shift</span>
              </div>
            </div>

            {/* CGPA Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Credit Completed', value: selected.creditCompleted, unit: 'credits', color: '#1D4ED8' },
                { label: 'Current CGPA', value: selected.currentCGPA.toFixed(2), unit: '/ 4.00', color: '#22D3EE' },
                { label: 'Completed CGPA', value: selected.completedCGPA.toFixed(2), unit: '/ 4.00', color: '#10B981' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>{s.unit}</p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Course Results Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontWeight: 800, fontSize: '0.95rem' }}>📋 Individual Course Results</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                      {['Course Code', 'Course Title', 'Credit Hours', 'Grade', 'Grade Points'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.courses.map((c, i) => (
                      <tr key={c.code} style={{ borderBottom: i < selected.courses.length - 1 ? '1px solid var(--border)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1D4ED8' }}>{c.code}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.title}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{c.credit} CH</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '3px 12px', borderRadius: 999, fontWeight: 800, fontSize: '0.82rem', background: `${gradeColor[c.grade] ?? '#94A3B8'}20`, color: gradeColor[c.grade] ?? '#94A3B8', border: `1px solid ${gradeColor[c.grade] ?? '#94A3B8'}44` }}>{c.grade}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.points.toFixed(1)}</td>
                      </tr>
                    ))}
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
