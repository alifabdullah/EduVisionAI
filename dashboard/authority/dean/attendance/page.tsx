'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const weeklyTrend = [
  { day: 'Mon', CSE: 88, EEE: 84, BBA: 78, Pharmacy: 90, English: 75 },
  { day: 'Tue', CSE: 85, EEE: 82, BBA: 76, Pharmacy: 88, English: 72 },
  { day: 'Wed', CSE: 91, EEE: 86, BBA: 80, Pharmacy: 92, English: 76 },
  { day: 'Thu', CSE: 83, EEE: 80, BBA: 74, Pharmacy: 86, English: 70 },
  { day: 'Fri', CSE: 78, EEE: 75, BBA: 68, Pharmacy: 82, English: 65 },
  { day: 'Sat', CSE: 72, EEE: 70, BBA: 62, Pharmacy: 78, English: 60 },
];

const deptAttendance = [
  { dept: 'Pharmacy', avg: 88, target: 85 },
  { dept: 'CSE', avg: 86, target: 85 },
  { dept: 'EEE', avg: 82, target: 85 },
  { dept: 'BBA', avg: 80, target: 85 },
  { dept: 'English', avg: 75, target: 85 },
];

const atRiskByDept = [
  { dept: 'CSE', critical: 14, warning: 38 },
  { dept: 'EEE', critical: 8, warning: 22 },
  { dept: 'BBA', critical: 18, warning: 42 },
  { dept: 'Pharmacy', critical: 4, warning: 12 },
  { dept: 'English', critical: 22, warning: 50 },
];

export default function DeanAttendancePage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Attendance Management 📅" subtitle="University-wide Attendance Monitoring & Analytics" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="University Avg (Today)" value="82.4%" sub="All departments" icon="📅" color="#3B82F6" />
          <StatCard label="Above 85% Depts" value="2/5" sub="Pharmacy, CSE" icon="✅" color="#10B981" />
          <StatCard label="Below 75% Students" value="388" sub="Across all depts" icon="⚠️" color="#F59E0B" />
          <StatCard label="Critical (< 60%)" value="66" sub="Risk of exam ban" icon="🚨" color="#DC2626" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Weekly Trend */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📈 This Week — Dept Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="CSE" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} />
                <Area type="monotone" dataKey="EEE" stroke="#10B981" fill="#10B981" fillOpacity={0.12} />
                <Area type="monotone" dataKey="BBA" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.12} />
                <Area type="monotone" dataKey="English" stroke="#EF4444" fill="#EF4444" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* At Risk by Dept */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🚨 At-Risk Students by Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={atRiskByDept}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="warning" name="Warning (60-75%)" fill="#F59E0B" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="critical" name="Critical (< 60%)" fill="#DC2626" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Attendance Summary */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📋 Department Attendance vs Target (85%)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {deptAttendance.map(dept => (
              <div key={dept.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{dept.dept}</span>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: dept.avg >= dept.target ? '#10B981' : '#EF4444' }}>{dept.avg}% {dept.avg >= dept.target ? '✅' : '⚠️'}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', width: `${dept.avg}%`, background: dept.avg >= dept.target ? '#10B981' : '#EF4444', borderRadius: '4px', transition: 'width 0.8s ease' }} />
                  {/* Target marker */}
                  <div style={{ position: 'absolute', top: 0, left: `${dept.target}%`, width: '2px', height: '100%', background: '#F59E0B' }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '3px' }}>Target: {dept.target}% | Gap: {Math.abs(dept.avg - dept.target)}%</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
