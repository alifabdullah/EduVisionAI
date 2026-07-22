'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data for HR Dashboard
const attendanceTrend = [
  { day: 'Mon', present: 450, late: 20, absent: 15 },
  { day: 'Tue', present: 460, late: 15, absent: 10 },
  { day: 'Wed', present: 455, late: 18, absent: 12 },
  { day: 'Thu', present: 465, late: 12, absent: 8 },
  { day: 'Fri', present: 470, late: 10, absent: 5 },
];

const departmentManpower = [
  { dept: 'CSE', employees: 120 },
  { dept: 'EEE', employees: 85 },
  { dept: 'BBA', employees: 110 },
  { dept: 'Pharmacy', employees: 95 },
  { dept: 'English', employees: 75 },
];

const leaveData = [
  { name: 'Casual Leave', value: 45, color: '#3B82F6' },
  { name: 'Sick Leave', value: 30, color: '#10B981' },
  { name: 'Earned Leave', value: 15, color: '#F59E0B' },
  { name: 'Duty Leave', value: 10, color: '#8B5CF6' },
];

export default function HRDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <TopNavbar title="HR Enterprise Intelligence Portal 👔" subtitle="Human Resources Management System" accentColor="#3B82F6" />
      
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        
        {/* Global HR Search Bar */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Global Search: Enter Employee ID, Name, Department, or Designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px',
                border: '1px solid var(--border)', background: 'var(--surface)',
                fontSize: '1rem', color: 'var(--text)', outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </div>

        {/* Executive HR Overview */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>HR Dashboard Overview</h2>
        <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <StatCard label="Total Employees" value="842" sub="Across all departments" icon="👥" color="#3B82F6" />
          <StatCard label="Total Faculty" value="485" sub="Academic Staff" icon="👨‍🏫" color="#8B5CF6" />
          <StatCard label="Present Today" value="810" sub="Attendance Rate: 96%" icon="✅" color="#10B981" />
          <StatCard label="Late Today" value="23" sub="Needs monitoring" icon="⏰" color="#F59E0B" />
          <StatCard label="Pending Leaves" value="18" sub="Awaiting HR Approval" icon="📩" color="#06B6D4" />
          <StatCard label="Pending KPIs" value="45" sub="Review required" icon="📊" color="#F43F5E" />
          <StatCard label="New Joinings" value="12" sub="Onboarding this month" icon="🎉" color="#22C55E" />
          <StatCard label="Contracts Expiring" value="8" sub="In next 30 days" icon="⏳" color="#F97316" />
        </div>

        {/* AI HR Assistant Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{
            padding: '1.5rem', marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI HR Assistant & Alerts</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Automated compliance, tracking, and insights</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>⏰ Late Attendance Alert</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>5 employees have been consistently late for 3+ days this week in the Administrative Division.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>🌟 Promotion Eligibility</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>14 faculty members have successfully met all KPI targets for Assistant Professor promotion.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #F43F5E' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F43F5E', textTransform: 'uppercase' }}>⚠️ Manpower Gap Detected</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>CSE Dept student-to-teacher ratio is 37:1 (exceeds 30:1 limit). Suggest initiating recruitment.</p>
            </div>
          </div>
        </motion.div>

        {/* HR Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Department-wise Employee Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🏢 Department Manpower Allocation</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentManpower}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="employees" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Summary (Area Chart) */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📅 Weekly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="present" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Present" />
                <Area type="monotone" dataKey="late" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Late" />
                <Area type="monotone" dataKey="absent" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.2} name="Absent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Leave Type Distribution */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🌴 Leave Request Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={leaveData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </main>
    </div>
  );
}
