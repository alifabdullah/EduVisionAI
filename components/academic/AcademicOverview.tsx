'use client';
import { SemesterData } from '@/data/academicData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

interface Props { data: SemesterData; }

function CircularProgress({ value, color, size = 80, stroke = 8, label }: { value: number; color: string; size?: number; stroke?: number; label: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px`, fill: 'var(--text)', fontSize: size * 0.2, fontWeight: 700 }}>
          {value}%
        </text>
      </svg>
      <span style={{ fontSize: '0.68rem', color: 'var(--muted)', textAlign: 'center', maxWidth: 70 }}>{label}</span>
    </div>
  );
}

function MiniStatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="glass-card stat-card" style={{ padding: '1rem 1.1rem', borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <p style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>{value}</p>
      {sub && <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function BarProgress({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 99, transition: 'width 1s ease', boxShadow: `0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

function getStatus(gpa: number) {
  if (gpa >= 3.7) return { label: 'Excellent', color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
  if (gpa >= 3.3) return { label: 'Good', color: '#22D3EE', bg: 'rgba(34,211,238,0.12)' };
  if (gpa >= 2.8) return { label: 'Average', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
  return { label: 'At Risk', color: '#F43F5E', bg: 'rgba(244,63,94,0.12)' };
}

export default function AcademicOverview({ data }: Props) {
  const status = getStatus(data.gpa);

  const radarData = [
    { subject: 'Quiz', value: data.quizAvg },
    { subject: 'Mid', value: data.midAvg },
    { subject: 'Final', value: data.finalAvg },
    { subject: 'Assignment', value: data.assignmentMarks },
    { subject: 'Lab', value: data.labMarks },
    { subject: 'Attendance', value: data.attendancePct },
  ];

  const barData = [
    { name: 'Quiz', value: data.quizAvg, fill: '#6C63FF' },
    { name: 'Midterm', value: data.midAvg, fill: '#22D3EE' },
    { name: 'Final', value: data.finalAvg, fill: '#10B981' },
    { name: 'Assignment', value: data.assignmentMarks, fill: '#F59E0B' },
    { name: 'Lab', value: data.labMarks, fill: '#A78BFA' },
  ];

  return (
    <div className="fade-in">
      {/* Status Banner */}
      <div style={{
        background: status.bg,
        border: `1px solid ${status.color}30`,
        borderRadius: 14,
        padding: '0.9rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>{status.label === 'Excellent' ? '🏆' : status.label === 'Good' ? '✅' : status.label === 'Average' ? '⚡' : '⚠️'}</span>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>Semester Performance Status</p>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: status.color }}>{status.label}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{data.gpa.toFixed(2)}</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Semester GPA</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>{data.cgpa.toFixed(2)}</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>CGPA</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: data.attendancePct < 75 ? '#F43F5E' : '#10B981' }}>{data.attendancePct}%</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Attendance</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <MiniStatCard icon="📊" label="Overall Marks" value={`${data.overallMarks}%`} color="#6C63FF" />
        <MiniStatCard icon="✏️" label="Quiz Average" value={`${data.quizAvg}/15`} sub="Across all subjects" color="#A78BFA" />
        <MiniStatCard icon="📋" label="Midterm Avg" value={`${data.midAvg}%`} sub="Semester midterm" color="#22D3EE" />
        <MiniStatCard icon="📝" label="Final Exam Avg" value={`${data.finalAvg}%`} sub="Final exams" color="#10B981" />
        <MiniStatCard icon="📌" label="Assignment" value={`${data.assignmentMarks}%`} sub="Submission score" color="#F59E0B" />
        <MiniStatCard icon="🔬" label="Lab Marks" value={`${data.labMarks}%`} sub="Practical sessions" color="#F43F5E" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Radar */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4 }}>Performance Radar</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 12 }}>Multi-dimensional academic view</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <Radar dataKey="value" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4 }}>Score Breakdown</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 12 }}>Component-wise performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text)' }}
                cursor={{ fill: 'rgba(108,99,255,0.07)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress breakdown */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>Detailed Progress</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>All academic components this semester</p>
          </div>
          {/* Circular progress row */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <CircularProgress value={data.gpa >= 4 ? 100 : Math.round(data.gpa * 25)} color="#6C63FF" label="GPA" size={72} stroke={7} />
            <CircularProgress value={data.attendancePct} color={data.attendancePct < 75 ? '#F43F5E' : '#10B981'} label="Attendance" size={72} stroke={7} />
          </div>
        </div>
        <BarProgress label="Quiz Average" value={data.quizAvg} color="#A78BFA" />
        <BarProgress label="Midterm Average" value={data.midAvg} color="#22D3EE" />
        <BarProgress label="Final Exam Average" value={data.finalAvg} color="#10B981" />
        <BarProgress label="Assignment Marks" value={data.assignmentMarks} color="#F59E0B" />
        <BarProgress label="Lab Marks" value={data.labMarks} color="#F43F5E" />
        <BarProgress label="Attendance" value={data.attendancePct} color={data.attendancePct < 75 ? '#F43F5E' : '#6C63FF'} />
      </div>
    </div>
  );
}
