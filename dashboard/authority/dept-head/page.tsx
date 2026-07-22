'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

// Mock Data for Department Analytics
const deptPerformance = [
  { semester: 'Spring 24', cgpa: 3.2, attendance: 82 },
  { semester: 'Summer 24', cgpa: 3.3, attendance: 85 },
  { semester: 'Fall 24', cgpa: 3.25, attendance: 80 },
  { semester: 'Spring 25', cgpa: 3.4, attendance: 88 },
  { semester: 'Summer 25', cgpa: 3.5, attendance: 90 },
];

const courseHealth = [
  { course: 'CSE101', passRate: 85, feedback: 4.2 },
  { course: 'CSE205', passRate: 70, feedback: 3.8 },
  { course: 'CSE301', passRate: 92, feedback: 4.6 },
  { course: 'CSE499', passRate: 98, feedback: 4.9 },
];

export default function DepartmentHeadDashboard() {
  const { user } = useApp();
  const router = useRouter();
  const deptName = "Computer Science & Engineering";

  // Search States
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');

  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(studentSearch) {
      import('@/data/sharedMockData').then(({ MASTER_STUDENTS }) => {
        const query = studentSearch.toLowerCase();
        const found = MASTER_STUDENTS.find(s => 
          s.id.toLowerCase().includes(query) || 
          s.name.toLowerCase().includes(query) || 
          s.regNo.toLowerCase().includes(query) ||
          s.roll?.toLowerCase().includes(query)
        );
        if (found) {
          router.push(`/dashboard/authority/dept-head/student/${found.id}`);
        } else {
          alert('Student not found!');
        }
      });
    }
  };

  const handleTeacherSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(teacherSearch) {
      import('@/data/sharedMockData').then(({ MASTER_TEACHERS }) => {
        const query = teacherSearch.toLowerCase();
        const found = MASTER_TEACHERS.find(t => 
          t.id.toLowerCase().includes(query) || 
          t.name.toLowerCase().includes(query)
        );
        if (found) {
          router.push(`/dashboard/authority/dept-head/teacher/${found.id}`);
        } else {
          alert('Teacher not found!');
        }
      });
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title={`Department Head Portal 🏢`} subtitle={deptName} accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Welcome Section */}
        <div style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>Welcome back, {user?.name || 'Dr. Emily Carter'}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>Department of {deptName} Academic Operations Center.</p>
          </div>
          <div style={{ padding: '8px 16px', background: '#10B981', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>
            Current Semester: Summer 2026
          </div>
        </div>

        {/* KPI Cards */}
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Students" value="1,240" sub="Active enrollments" icon="🎓" color="#3B82F6" />
          <StatCard label="Total Teachers" value="45" sub="Full-time faculty" icon="👨‍🏫" color="#10B981" />
          <StatCard label="Active Courses" value="78" sub="Running this semester" icon="📚" color="#8B5CF6" />
          <StatCard label="Average CGPA" value="3.42" sub="Department-wide" icon="📈" color="#F59E0B" />
          <StatCard label="At-Risk Students" value="52" sub="Require mentorship intervention" icon="⚠️" color="#DC2626" />
          <StatCard label="Avg Attendance" value="86%" sub="Across all sections" icon="✅" color="#14B8A6" />
        </div>

        {/* Search Directories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          {/* Student Directory Search */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>🎓</span> Student Directory
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>Search by ID, Name, Registration No., or Email to access full 360° student profile and administrative override.</p>
            
            <form onSubmit={handleStudentSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="Enter Student ID or Name..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0 1.25rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Search</button>
            </form>
            
            <div style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '8px', border: '1px dashed var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 8px 0' }}>Or browse via Academic Hierarchy</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <select style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.75rem' }}>
                  <option>Select Batch</option>
                  <option>Batch 64</option>
                  <option>Batch 65</option>
                </select>
                <select style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.75rem' }}>
                  <option>Select Section</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teacher Directory Search */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>👨‍🏫</span> Faculty Directory
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>Search by Employee ID, Name, or Designation to access faculty profiles, teaching records, and performance metrics.</p>
            
            <form onSubmit={handleTeacherSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="Enter Faculty ID or Name..."
                value={teacherSearch}
                onChange={e => setTeacherSearch(e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0 1.25rem', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>Search</button>
            </form>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid #3B82F6' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase' }}>Professors</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0' }}>4</p>
              </div>
              <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Assoc. Prof</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0' }}>12</p>
              </div>
              <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '3px solid #F59E0B' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>Lecturers</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0' }}>29</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          
          {/* Department Performance Trend */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📈 Academic Performance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={deptPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[3.0, 4.0]} tick={{ fill: '#3B82F6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} tick={{ fill: '#10B981', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', marginTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="cgpa" name="Avg CGPA" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="attendance" name="Attendance %" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Course Health Overview */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 High Impact Course Health</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={courseHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="course" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[0, 100]} tick={{ fill: '#8B5CF6', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fill: '#F59E0B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', marginTop: '10px' }} />
                <Bar yAxisId="left" dataKey="passRate" name="Pass Rate %" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="feedback" name="Student Feedback (/5)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
