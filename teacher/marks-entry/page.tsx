'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

type WorkflowStatus = 'Draft' | 'Reviewed' | 'Approved' | 'Published';

interface StudentMarks {
  id: string; name: string; roll: string;
  attendance: number;
  quiz1: number; quiz2: number; quiz3: number;
  assignment: number;
  lab: number;
  midterm: number;
  final: number;
}

const initialMarks: StudentMarks[] = [
  { id: 'CS21001', name: 'Joy Kumar Yuv', roll: '261-16-010', attendance: 14, quiz1: 8, quiz2: 7, quiz3: 9, assignment: 18, lab: 22, midterm: 36, final: 55 },
  { id: 'CS21002', name: 'Mia Reynolds', roll: 'CS21046', attendance: 10, quiz1: 6, quiz2: 5, quiz3: 7, assignment: 14, lab: 18, midterm: 28, final: 42 },
  { id: 'CS21003', name: 'Liam Scott', roll: 'CS21049', attendance: 8, quiz1: 4, quiz2: 3, quiz3: 5, assignment: 10, lab: 12, midterm: 22, final: 30 },
  { id: 'CS21004', name: 'Noah Wilson', roll: 'CS21050', attendance: 15, quiz1: 9, quiz2: 9, quiz3: 10, assignment: 20, lab: 25, midterm: 40, final: 62 },
  { id: 'CS21005', name: 'Ava Martinez', roll: 'CS21051', attendance: 13, quiz1: 8, quiz2: 8, quiz3: 9, assignment: 19, lab: 23, midterm: 38, final: 58 },
];

const maxMarks = { attendance: 15, quiz1: 10, quiz2: 10, quiz3: 10, assignment: 20, lab: 25, midterm: 40, final: 70 };

const totalMax = Object.values(maxMarks).reduce((a, b) => a + b, 0);
const getTotal = (s: StudentMarks) => s.attendance + s.quiz1 + s.quiz2 + s.quiz3 + s.assignment + s.lab + s.midterm + s.final;
const getGrade = (pct: number) => pct >= 90 ? 'A' : pct >= 80 ? 'A-' : pct >= 75 ? 'B+' : pct >= 70 ? 'B' : pct >= 65 ? 'B-' : pct >= 60 ? 'C+' : pct >= 55 ? 'C' : pct >= 50 ? 'C-' : pct >= 45 ? 'D' : 'F';
const gradeColor: Record<string, string> = { A: '#10B981', 'A-': '#34D399', 'B+': '#22D3EE', B: '#60A5FA', 'B-': '#818CF8', 'C+': '#F59E0B', C: '#FBBF24', 'C-': '#FB923C', D: '#F43F5E', F: '#EF4444' };

const courses = ['CSE301 – Data Structures', 'CSE303 – Database Systems', 'CSE401 – Algorithms'];
const wfColors: Record<WorkflowStatus, string> = { Draft: '#94A3B8', Reviewed: '#F59E0B', Approved: '#22D3EE', Published: '#10B981' };
const wfNext: Record<WorkflowStatus, WorkflowStatus | null> = { Draft: 'Reviewed', Reviewed: 'Approved', Approved: 'Published', Published: null };

export default function MarksEntryPage() {
  const [course, setCourse] = useState(courses[0]);
  const [marks, setMarks] = useState<StudentMarks[]>(initialMarks);
  const [workflow, setWorkflow] = useState<WorkflowStatus>('Draft');
  const [saved, setSaved] = useState(false);

  const updateMark = (id: string, field: keyof StudentMarks, val: string) => {
    const num = Math.max(0, Math.min(Number(val) || 0, maxMarks[field as keyof typeof maxMarks] ?? 9999));
    setMarks(prev => prev.map(s => s.id === id ? { ...s, [field]: num } : s));
    setSaved(false);
  };

  const inputStyle: React.CSSProperties = {
    width: 52, padding: '5px 8px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--surface-2)',
    fontSize: '0.82rem', textAlign: 'center', color: 'var(--text)', outline: 'none',
  };

  const nextWf = wfNext[workflow];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Marks Entry System" subtitle="Enter, review and publish student marks with multi-step workflow" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={course} onChange={e => setCourse(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}>
            {courses.map(c => <option key={c}>{c}</option>)}
          </select>
          {/* Workflow status */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {(['Draft', 'Reviewed', 'Approved', 'Published'] as WorkflowStatus[]).map(s => (
              <span key={s} style={{ padding: '5px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s === workflow ? `${wfColors[s]}22` : 'var(--surface-2)', color: s === workflow ? wfColors[s] : 'var(--muted)', border: `1px solid ${s === workflow ? wfColors[s] + '44' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                {s === workflow ? '▶ ' : ''}{s}
              </span>
            ))}
          </div>
        </div>

        {/* Marks Table */}
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {[
                    { label: 'Student', sub: '' }, { label: 'Att.', sub: '/15' }, { label: 'Q1', sub: '/10' }, { label: 'Q2', sub: '/10' }, { label: 'Q3', sub: '/10' },
                    { label: 'Assign.', sub: '/20' }, { label: 'Lab', sub: '/25' }, { label: 'Mid', sub: '/40' }, { label: 'Final', sub: '/70' },
                    { label: 'Total', sub: `/${totalMax}` }, { label: 'Grade', sub: '' },
                  ].map(h => (
                    <th key={h.label} style={{ padding: '10px 10px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {h.label}<span style={{ fontSize: '0.6rem', opacity: 0.7 }}>{h.sub}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marks.map((s, i) => {
                  const total = getTotal(s);
                  const pct = Math.round((total / totalMax) * 100);
                  const grade = getGrade(pct);
                  const isDisabled = workflow === 'Published';
                  return (
                    <tr key={s.id} style={{ borderBottom: i < marks.length - 1 ? '1px solid var(--border)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '10px 10px', minWidth: 130 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.82rem' }}>{s.name}</p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{s.roll}</p>
                      </td>
                      {(['attendance', 'quiz1', 'quiz2', 'quiz3', 'assignment', 'lab', 'midterm', 'final'] as const).map(field => (
                        <td key={field} style={{ padding: '10px 8px' }}>
                          <input type="number" value={s[field]} disabled={isDisabled}
                            onChange={e => updateMark(s.id, field, e.target.value)}
                            style={{ ...inputStyle, opacity: isDisabled ? 0.6 : 1, cursor: isDisabled ? 'not-allowed' : 'text' }} />
                        </td>
                      ))}
                      <td style={{ padding: '10px 8px', fontWeight: 800, color: pct < 50 ? '#F43F5E' : pct < 70 ? '#F59E0B' : '#10B981' }}>{total}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 999, fontWeight: 800, fontSize: '0.75rem', background: `${gradeColor[grade] ?? '#94A3B8'}20`, color: gradeColor[grade] ?? '#94A3B8', border: `1px solid ${gradeColor[grade] ?? '#94A3B8'}44` }}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Actions Row */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setSaved(true)}
              style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              💾 Bulk Save
            </button>
            {nextWf && (
              <button onClick={() => { setSaved(false); setWorkflow(nextWf); }}
                style={{ padding: '9px 20px', background: `linear-gradient(135deg,${wfColors[nextWf]},${wfColors[nextWf]}cc)`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                ▶ Move to {nextWf}
              </button>
            )}
            <button style={{ padding: '9px 20px', border: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: 10, color: 'var(--muted)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              📊 Export Excel
            </button>
            {saved && <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>✅ Saved!</span>}
          </div>
        </div>

        {/* Workflow Info */}
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 12 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Result Workflow</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            Current status: <strong style={{ color: wfColors[workflow] }}>{workflow}</strong>.
            {workflow === 'Draft' && ' Enter all marks and save, then move to Reviewed.'}
            {workflow === 'Reviewed' && ' Marks are under review. Submit for approval when verified.'}
            {workflow === 'Approved' && ' Marks approved. Publish when ready to release to students.'}
            {workflow === 'Published' && ' Results are live. Students can now view their marks.'}
          </p>
        </div>
      </main>
    </div>
  );
}
