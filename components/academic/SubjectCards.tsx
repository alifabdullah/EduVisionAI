'use client';
import { useState } from 'react';
import { SubjectData } from '@/data/academicData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface Props { subjects: SubjectData[]; }

function riskColor(r: SubjectData['riskLevel']) {
  return r === 'high' ? '#F43F5E' : r === 'medium' ? '#F59E0B' : '#10B981';
}
function riskBg(r: SubjectData['riskLevel']) {
  return r === 'high' ? 'rgba(244,63,94,0.12)' : r === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)';
}
function riskLabel(r: SubjectData['riskLevel']) {
  return r === 'high' ? '🔴 High Risk' : r === 'medium' ? '🟡 Moderate' : '🟢 On Track';
}
function gradeColor(g: string) {
  if (g.startsWith('A')) return '#10B981';
  if (g.startsWith('B')) return '#22D3EE';
  if (g.startsWith('C')) return '#F59E0B';
  return '#F43F5E';
}

function ProgressBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 99, transition: 'width 0.8s ease', boxShadow: `0 0 6px ${color}66` }} />
      </div>
    </div>
  );
}

function SubjectCard({ sub }: { sub: SubjectData }) {
  const [expanded, setExpanded] = useState(false);
  const rc = riskColor(sub.riskLevel);
  const gc = gradeColor(sub.grade);
  const assignPct = Math.round((sub.assignmentsDone / sub.assignmentsTotal) * 100);

  const chartData = [
    { name: 'Quiz', value: sub.quiz },
    { name: 'Mid', value: sub.mid },
    { name: 'Final', value: sub.final },
    { name: 'Assign', value: sub.assignment },
    ...(sub.lab > 0 ? [{ name: 'Lab', value: sub.lab }] : []),
    { name: 'Attend', value: sub.attendance },
  ];

  return (
    <div
      className="glass-card"
      style={{
        border: `1px solid ${rc}30`,
        borderLeft: `4px solid ${rc}`,
        overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
        boxShadow: expanded ? `0 0 24px ${rc}20` : 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${rc}20`; }}
      onMouseLeave={e => { if (!expanded) { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; } }}
    >
      {/* Header */}
      <div
        style={{ padding: '1.1rem 1.25rem', cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{sub.name}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{sub.code}</p>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Grade badge */}
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 800,
              background: `${gc}18`, color: gc, border: `1px solid ${gc}40`,
            }}>{sub.grade}</span>
            {/* Risk badge */}
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
              background: riskBg(sub.riskLevel), color: rc, border: `1px solid ${rc}30`,
            }}>{riskLabel(sub.riskLevel)}</span>
            {/* Expand arrow */}
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 4, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', display: 'inline-block' }}>▼</span>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Quiz', val: sub.quiz, color: '#A78BFA' },
            { label: 'Midterm', val: sub.mid, color: '#22D3EE' },
            { label: 'Final', val: sub.final, color: '#10B981' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 800, color }}>{val}%</p>
            </div>
          ))}
        </div>

        {/* Quick progress bars */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ProgressBar label="Attendance" value={sub.attendance} color={sub.attendance < 75 ? '#F43F5E' : '#10B981'} />
          <ProgressBar label="Overall Marks" value={Math.round((sub.quiz + sub.mid + sub.final) / 3)} color={rc} />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1.1rem 1.25rem', background: 'rgba(255,255,255,0.02)', animation: 'fadeIn 0.2s ease' }}>
          {/* All progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <ProgressBar label="Quiz Score" value={sub.quiz} color="#A78BFA" />
            <ProgressBar label="Midterm Score" value={sub.mid} color="#22D3EE" />
            <ProgressBar label="Final Exam" value={sub.final} color="#10B981" />
            <ProgressBar label="Assignments" value={sub.assignment} color="#F59E0B" />
            {sub.lab > 0 && <ProgressBar label="Lab Work" value={sub.lab} color="#F43F5E" />}
            <ProgressBar label="Attendance" value={sub.attendance} color={sub.attendance < 75 ? '#F43F5E' : '#10B981'} />
          </div>

          {/* Assignment completion */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '8px 12px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>📌 Assignment Completion</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F59E0B' }}>{sub.assignmentsDone}/{sub.assignmentsTotal}</span>
              <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${assignPct}%`, background: '#F59E0B', borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B' }}>{assignPct}%</span>
            </div>
          </div>

          {/* Mini bar chart */}
          <div style={{ marginBottom: sub.teacherRemark ? 14 : 0 }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 8 }}>📈 Performance Breakdown</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text)' }} />
                <Bar dataKey="value" fill="#6C63FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Teacher remark */}
          {sub.teacherRemark && (
            <div style={{ padding: '10px 14px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, display: 'flex', gap: 8 }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>💬</span>
              <div>
                <p style={{ fontSize: '0.68rem', color: '#6C63FF', fontWeight: 700, marginBottom: 2 }}>Teacher Remark</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>{sub.teacherRemark}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SubjectCards({ subjects }: Props) {
  const [view, setView] = useState<'grid' | 'chart'>('grid');

  const compareData = subjects.map(s => ({
    name: s.name.split(' ')[0],
    Quiz: s.quiz,
    Mid: s.mid,
    Final: s.final,
    Attendance: s.attendance,
  }));

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Subject-wise Performance</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{subjects.length} subjects this semester — click any card to expand</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['grid', 'chart'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: view === v ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.05)',
              color: view === v ? '#6C63FF' : 'var(--muted)',
              transition: 'all 0.2s',
            }}>
              {v === 'grid' ? '⊞ Cards' : '📊 Chart'}
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {subjects.map(s => <SubjectCard key={s.code} sub={s} />)}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4 }}>Quiz vs Mid vs Final vs Attendance</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 16 }}>Cross-subject performance comparison</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compareData} barGap={3} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text)' }} cursor={{ fill: 'rgba(108,99,255,0.05)' }} />
              <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '0.8rem' }} />
              <Bar dataKey="Quiz" fill="#A78BFA" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Mid" fill="#22D3EE" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Final" fill="#10B981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Attendance" fill="#F59E0B" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
