'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const weeklyData = [
  { day: 'Mon', student: 89, faculty: 95 },
  { day: 'Tue', student: 84, faculty: 92 },
  { day: 'Wed', student: 92, faculty: 100 },
  { day: 'Thu', student: 80, faculty: 90 },
  { day: 'Fri', student: 75, faculty: 88 },
  { day: 'Sat', student: 70, faculty: 85 },
];

const subjectWise = [
  { course: 'CSE101', present: 112, total: 120, pct: 93 },
  { course: 'CSE201', present: 72, total: 90, pct: 80 },
  { course: 'CSE301', present: 61, total: 75, pct: 81 },
  { course: 'CSE303', present: 56, total: 80, pct: 70 },
  { course: 'CSE401', present: 48, total: 50, pct: 96 },
];

export default function DeptHeadAttendancePage() {
  const [view, setView] = useState<'student' | 'faculty' | 'course'>('student');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Attendance Management 📅" subtitle="CSE Department — Live Attendance Monitoring" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Today Avg (Students)" value="84%" sub="Summer 2026 Semester" icon="🎓" color="#3B82F6" />
          <StatCard label="Today Avg (Faculty)" value="95%" sub="All sections included" icon="👨‍🏫" color="#10B981" />
          <StatCard label="Below 75% Students" value="52" sub="Requires action" icon="⚠️" color="#F59E0B" />
          <StatCard label="Critical (< 60%)" value="14" sub="Risk of exam ban" icon="🚨" color="#DC2626" />
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['student', 'faculty', 'course'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: view === v ? '#10B981' : 'var(--surface-2)', color: view === v ? '#fff' : 'var(--muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize' }}>
              {v === 'student' ? 'Student View' : v === 'faculty' ? 'Faculty View' : 'Course-wise'}
            </button>
          ))}
        </div>

        {/* Weekly Trend */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📈 This Week's Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Area type="monotone" dataKey="student" name="Student %" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="faculty" name="Faculty %" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Attendance */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📋 Subject-wise Attendance Summary (Today)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {subjectWise.map(s => (
              <div key={s.course} style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: `1px solid ${s.pct < 75 ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{s.course}</span>
                  <span style={{ fontWeight: 800, color: s.pct < 75 ? '#DC2626' : '#10B981' }}>{s.pct}%</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Present: {s.present} / {s.total} students</div>
                <div style={{ height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.pct < 75 ? '#DC2626' : '#10B981', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
