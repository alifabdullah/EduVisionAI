'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ATTENDANCE_TREND = [
  { day: 'Mon', present: 810, late: 20, absent: 12 },
  { day: 'Tue', present: 815, late: 15, absent: 12 },
  { day: 'Wed', present: 805, late: 25, absent: 12 },
  { day: 'Thu', present: 820, late: 10, absent: 12 },
  { day: 'Fri', present: 800, late: 30, absent: 12 },
];

const LATE_EMPLOYEES = [
  { id: 'EMP-1045', name: 'Rony Miah', dept: 'IT Support', time: '09:45 AM', status: 'Late', lateCount: 4 },
  { id: 'EMP-2099', name: 'Arif Hossain', dept: 'Finance', time: '09:32 AM', status: 'Late', lateCount: 2 },
  { id: 'EMP-3012', name: 'Tanvir Ahmed', dept: 'EEE', time: '09:15 AM', status: 'Late', lateCount: 1 },
];

export default function HRAttendancePage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Employee Attendance 📅" subtitle="Workforce Attendance Monitoring & Analytics" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Present Today" value="810" sub="96.2% of active staff" icon="✅" color="#10B981" />
          <StatCard label="Late Arrivals" value="20" sub="Arrived after 09:15 AM" icon="⏰" color="#F59E0B" />
          <StatCard label="Absent Today" value="12" sub="Unapproved absences" icon="❌" color="#EF4444" />
          <StatCard label="On Leave" value="18" sub="Approved leave" icon="🏖️" color="#3B82F6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Trend Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📈 Weekly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={ATTENDANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Area type="monotone" dataKey="present" name="Present" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                <Area type="monotone" dataKey="late" name="Late" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Late Log */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>⏰ Late Arrivals Today</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {LATE_EMPLOYEES.map(emp => (
                <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#F59E0B' }}>{emp.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '3px 0 0' }}>{emp.dept} | ID: {emp.id}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: 'var(--text)' }}>{emp.time}</p>
                    <p style={{ fontSize: '0.7rem', color: '#EF4444', margin: '3px 0 0', fontWeight: 700 }}>Late {emp.lateCount} times this week</p>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', padding: '10px', marginTop: '1rem', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>View Full Late Report</button>
          </div>
        </div>

      </main>
    </div>
  );
}
