'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COURSES = [
  { code: 'CSE101', name: 'Introduction to Computing', dept: 'CSE', teacher: 'Mr. Anisur Rahman', students: 120, passRate: 88, avgGrade: 'B+', attendance: 85, feedback: 4.2, coordinator: 'Dr. Anika Rahman', status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE201', name: 'Data Structures', dept: 'CSE', teacher: 'Dr. Anika Rahman', students: 90, passRate: 75, avgGrade: 'B', attendance: 80, feedback: 4.5, coordinator: 'Dr. Anika Rahman', status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE301', name: 'Operating Systems', dept: 'CSE', teacher: 'Dr. Md. Sarwar Hossain', students: 75, passRate: 82, avgGrade: 'B+', attendance: 88, feedback: 4.4, coordinator: 'Dr. Md. Sarwar Hossain', status: 'Running', semester: 'Summer 2026' },
  { code: 'CSE303', name: 'Database Management', dept: 'CSE', teacher: 'Dr. Laila Hossain', students: 80, passRate: 70, avgGrade: 'C+', attendance: 76, feedback: 3.8, coordinator: 'Dr. Laila Hossain', status: '⚠️ At Risk', semester: 'Summer 2026' },
  { code: 'EEE201', name: 'Circuit Analysis', dept: 'EEE', teacher: 'Prof. Rashid Khan', students: 85, passRate: 80, avgGrade: 'B', attendance: 82, feedback: 4.1, coordinator: 'Prof. Rashid Khan', status: 'Running', semester: 'Summer 2026' },
  { code: 'BBA301', name: 'Business Strategy', dept: 'BBA', teacher: 'Dr. Fatema Akter', students: 110, passRate: 77, avgGrade: 'B-', attendance: 79, feedback: 3.9, coordinator: 'Dr. Fatema Akter', status: 'Running', semester: 'Summer 2026' },
  { code: 'ENG101', name: 'Academic English', dept: 'English', teacher: 'Prof. Karim Uddin', students: 140, passRate: 72, avgGrade: 'C+', attendance: 75, feedback: 3.7, coordinator: 'Prof. Karim Uddin', status: '⚠️ At Risk', semester: 'Summer 2026' },
];

const healthData = COURSES.map(c => ({ course: c.code, passRate: c.passRate, feedback: c.feedback * 20, attendance: c.attendance }));

export default function DeanCoursesPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course Management 📚" subtitle="University-wide Course Monitoring & Administration" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Courses" value="342" sub="All departments" icon="📚" color="#3B82F6" />
          <StatCard label="Running This Sem" value="218" sub="Active courses" icon="▶️" color="#10B981" />
          <StatCard label="At-Risk Courses" value="14" sub="Need intervention" icon="⚠️" color="#F59E0B" />
          <StatCard label="Avg Pass Rate" value="82%" sub="University-wide" icon="✅" color="#8B5CF6" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>📊 Course Health Overview</h3>
            <button style={{ padding: '7px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>+ Create Course</button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="course" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
              <Bar dataKey="passRate" name="Pass Rate %" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance %" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="feedback" name="Feedback ×20" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📋 Course Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {COURSES.map(course => (
              <div key={course.code} style={{ padding: '1rem 1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: `1px solid ${course.status.includes('⚠️') ? 'rgba(245,158,11,0.3)' : 'var(--border)'}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#3B82F6', fontSize: '0.95rem' }}>{course.code}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{course.name}</span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', borderRadius: '8px', fontWeight: 700 }}>{course.dept}</span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', background: course.status.includes('⚠️') ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: course.status.includes('⚠️') ? '#F59E0B' : '#10B981', borderRadius: '8px', fontWeight: 700 }}>{course.status}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                      Faculty: <strong style={{ color: 'var(--text)' }}>{course.teacher}</strong> | Coordinator: {course.coordinator} | Students: {course.students} | Pass Rate: <strong style={{ color: course.passRate < 75 ? '#DC2626' : '#10B981' }}>{course.passRate}%</strong> | Avg: {course.avgGrade} | Attendance: {course.attendance}% | ★ {course.feedback}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Manage</button>
                    <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Assign Teacher</button>
                    {course.status.includes('⚠️') && (
                      <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Intervene</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
