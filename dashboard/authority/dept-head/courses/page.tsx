'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COURSES = [
  { code: 'CSE101', name: 'Introduction to Computing', teacher: 'Mr. Imran Hossain', students: 120, passRate: 88, avgGrade: 'B+', attendance: 85, feedback: 4.2, status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE201', name: 'Data Structures', teacher: 'Dr. Anika Rahman', students: 90, passRate: 75, avgGrade: 'B', attendance: 80, feedback: 4.5, status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE301', name: 'Operating Systems', teacher: 'Dr. Md. Sarwar Hossain', students: 75, passRate: 82, avgGrade: 'B+', attendance: 88, feedback: 4.4, status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE401', name: 'Artificial Intelligence', teacher: 'Dr. Sumaiya Khanam', students: 50, passRate: 92, avgGrade: 'A-', attendance: 92, feedback: 4.8, status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE303', name: 'Database Management', teacher: 'Mr. Faisal Hasan', students: 80, passRate: 70, avgGrade: 'C+', attendance: 76, feedback: 3.8, status: '⚠️ At Risk', semester: 'Summer 2026' },
  { code: 'CSE499', name: 'Capstone Project', teacher: 'Dr. Md. Sarwar Hossain', students: 12, passRate: 100, avgGrade: 'A', attendance: 100, feedback: 5.0, status: 'Running', semester: 'Summer 2026' },
];

const healthData = COURSES.map(c => ({ course: c.code, passRate: c.passRate, feedback: c.feedback * 20 }));

export default function DeptHeadCoursesPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course Management 📚" subtitle="CSE Department — Active Semester Courses" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Active Courses" value="78" sub="This semester" icon="📚" color="#3B82F6" />
          <StatCard label="Avg Pass Rate" value="84%" sub="Across all courses" icon="✅" color="#10B981" />
          <StatCard label="At-Risk Courses" value="4" sub="Need intervention" icon="⚠️" color="#F59E0B" />
          <StatCard label="Student Feedback" value="4.4/5" sub="Average rating" icon="⭐" color="#8B5CF6" />
        </div>

        {/* Course Health Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Course Health Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="course" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              <Bar dataKey="passRate" name="Pass Rate %" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="feedback" name="Feedback Score (×20)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📋 Course Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {COURSES.map(course => (
              <div key={course.code} style={{ padding: '1rem 1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: `1px solid ${course.status.includes('⚠️') ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`, display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, color: '#3B82F6', fontSize: '0.95rem' }}>{course.code}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.name}</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: course.status.includes('⚠️') ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: course.status.includes('⚠️') ? '#F59E0B' : '#10B981', borderRadius: '12px', fontWeight: 700 }}>{course.status}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                    Faculty: <strong style={{ color: 'var(--text)' }}>{course.teacher}</strong> | Students: {course.students} | Pass Rate: <strong style={{ color: course.passRate < 75 ? '#DC2626' : '#10B981' }}>{course.passRate}%</strong> | Avg Grade: {course.avgGrade} | Attendance: {course.attendance}% | Feedback: ★{course.feedback}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Manage</button>
                  {course.status.includes('⚠️') && (
                    <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>Intervene</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
