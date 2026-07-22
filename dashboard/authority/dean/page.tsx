'use client';
import { useState } from 'react';
import Link from 'next/link';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Mock Data for Dean Dashboard
const performanceData = [
  { semester: 'Spring 25', CSE: 3.42, CIS: 3.35, SWE: 3.50 },
  { semester: 'Summer 25', CSE: 3.45, CIS: 3.38, SWE: 3.55 },
  { semester: 'Fall 25', CSE: 3.50, CIS: 3.42, SWE: 3.60 },
  { semester: 'Spring 26', CSE: 3.48, CIS: 3.45, SWE: 3.62 },
];

const deptRanking = [
  { name: 'CSE', score: 92, students: 4500, research: 120 },
  { name: 'SWE', score: 88, students: 2100, research: 85 },
  { name: 'CIS', score: 85, students: 1800, research: 95 },
];

const riskData = [
  { name: 'Safe', value: 75, color: '#10B981' },
  { name: 'Low Risk', value: 15, color: '#F59E0B' },
  { name: 'High Risk', value: 7, color: '#F43F5E' },
  { name: 'Critical', value: 3, color: '#9F1239' },
];

const researchTrend = [
  { month: 'Jan', publications: 12, grants: 2 },
  { month: 'Feb', publications: 18, grants: 3 },
  { month: 'Mar', publications: 25, grants: 5 },
  { month: 'Apr', publications: 32, grants: 7 },
  { month: 'May', publications: 45, grants: 10 },
];

export default function DeanDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Hierarchy Search States (Student)
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Hierarchy Search States (Teacher)
  const [teacherDept, setTeacherDept] = useState('');
  const [teacherDesignation, setTeacherDesignation] = useState('');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <TopNavbar title="Dean's Academic Intelligence Portal 🎓" subtitle="Faculty of Science & Information Technology" accentColor="#10B981" />
      
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        
        {/* Global Smart Search Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Global Smart Search: Enter Student ID, Teacher Name, Email, or Phone..."
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

        {/* Hierarchical Student Search */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Academic Hierarchy Search</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <select 
              value={selectedDept} onChange={e => { setSelectedDept(e.target.value); setSelectedBatch(''); setSelectedSemester(''); setSelectedSection(''); }}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">1. Choose Department</option>
              <option value="CSE">CSE</option>
              <option value="CIS">CIS</option>
              <option value="SWE">SWE</option>
            </select>

            <select 
              value={selectedBatch} onChange={e => { setSelectedBatch(e.target.value); setSelectedSemester(''); setSelectedSection(''); }} disabled={!selectedDept}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', opacity: selectedDept ? 1 : 0.5, cursor: selectedDept ? 'pointer' : 'not-allowed' }}>
              <option value="">2. Choose Batch</option>
              <option value="63">Batch 63</option>
              <option value="64">Batch 64</option>
              <option value="65">Batch 65</option>
            </select>

            <select 
              value={selectedSemester} onChange={e => { setSelectedSemester(e.target.value); setSelectedSection(''); }} disabled={!selectedBatch}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', opacity: selectedBatch ? 1 : 0.5, cursor: selectedBatch ? 'pointer' : 'not-allowed' }}>
              <option value="">3. Choose Semester</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            <select 
              value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={!selectedSemester}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', opacity: selectedSemester ? 1 : 0.5, cursor: selectedSemester ? 'pointer' : 'not-allowed' }}>
              <option value="">4. Choose Section</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          {selectedDept && selectedBatch && selectedSemester && selectedSection && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>Student Directory ({selectedDept} - Batch {selectedBatch} - Sec {selectedSection})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {
                  [
                    { id: '221-15-5231', name: 'Arafat Islam', cgpa: 3.85, status: 'Excellent', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', email: 'arafat@diu.edu.bd' },
                    { id: '221-15-5232', name: 'Sanjida Akter', cgpa: 3.25, status: 'Good', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', email: 'sanjida@diu.edu.bd' },
                    { id: '221-15-5233', name: 'Mehedi Hasan', cgpa: 2.75, status: 'At Risk', photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', email: 'mehedi@diu.edu.bd' }
                  ].map((student, i) => (
                  <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={student.photo} alt={student.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{student.name} <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: student.cgpa >= 3.5 ? 'rgba(16,185,129,0.1)' : student.cgpa <= 3.0 ? 'rgba(244,63,94,0.1)' : 'rgba(59,130,246,0.1)', color: student.cgpa >= 3.5 ? '#10B981' : student.cgpa <= 3.0 ? '#F43F5E' : '#3B82F6', borderRadius: '4px', marginLeft: 4 }}>{student.status}</span></p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>ID: {student.id} | Email: {student.email} | CGPA: {student.cgpa}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/authority/dean/student/${student.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: '0.2s', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
                        View 360° Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Hierarchical Teacher Search */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>👨‍🏫 Academic Hierarchy Search (Teachers)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <select 
              value={teacherDept} onChange={e => { setTeacherDept(e.target.value); setTeacherDesignation(''); }}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">1. Choose Department</option>
              <option value="CSE">CSE</option>
              <option value="CIS">CIS</option>
              <option value="SWE">SWE</option>
            </select>

            <select 
              value={teacherDesignation} onChange={e => setTeacherDesignation(e.target.value)} disabled={!teacherDept}
              style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', opacity: teacherDept ? 1 : 0.5, cursor: teacherDept ? 'pointer' : 'not-allowed' }}>
              <option value="">2. Choose Designation (Optional)</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>

          {(teacherDept || searchQuery) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                Teacher Directory {teacherDept ? `(${teacherDept}${teacherDesignation ? ` - ${teacherDesignation}` : ''})` : '(Global Search Results)'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { id: 'TCH-001', name: 'Dr. Md. Sarwar Hossain Mollah', email: 'headcis@diu.edu.bd', phone: '+8801711000001', dept: 'CSE', designation: 'Associate Professor', courses: 3, publications: 18, teachingScore: 92, photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', status: 'Active' },
                  { id: 'TCH-005', name: 'Mr. Anisur Rahman', email: 'anisur.swe@diu.edu.bd', phone: '+8801711000005', dept: 'SWE', designation: 'Lecturer', courses: 4, publications: 5, teachingScore: 78, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', status: 'Active' },
                  { id: 'TCH-006', name: 'Dr. Laila Hossain', email: 'laila.cis@diu.edu.bd', phone: '+8801711000006', dept: 'CIS', designation: 'Assistant Professor', courses: 3, publications: 11, teachingScore: 86, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', status: 'Active' },
                ].filter(t => {
                  if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    return t.name.toLowerCase().includes(q) || t.dept.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.phone.includes(q);
                  }
                  if (teacherDept && t.dept !== teacherDept) return false;
                  if (teacherDesignation && t.designation !== teacherDesignation) return false;
                  return true;
                }).map((teacher) => (
                  <div key={teacher.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={teacher.photo} alt={teacher.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
                          {teacher.name}
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: teacher.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(245, 158, 11, 0.1)', color: teacher.status === 'Active' ? '#10B981' : '#F59E0B', borderRadius: '4px', marginLeft: 8 }}>{teacher.status}</span>
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>ID: {teacher.id} • {teacher.designation} • {teacher.dept} | Email: {teacher.email} | Teaching Score: {teacher.teachingScore}%</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/authority/dean/teacher/${teacher.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)', whiteSpace: 'nowrap' }}>
                        View 360° Profile
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Executive Overview</h2>
        <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <StatCard label="Total Students" value="12,850" sub="Across 5 Departments" icon="👨‍🎓" color="#3B82F6" />
          <StatCard label="Total Teachers" value="485" sub="Active Faculty" icon="👨‍🏫" color="#10B981" />
          <StatCard label="Avg Faculty CGPA" value="3.42" sub="Current Semester" icon="📈" color="#8B5CF6" />
          <StatCard label="Overall Attendance" value="84.5%" sub="Institution-wide" icon="📅" color="#F59E0B" />
          <StatCard label="High-Risk Courses" value="12" sub="Require intervention" icon="⚠️" color="#F43F5E" />
          <StatCard label="Active Research" value="45" sub="Ongoing projects" icon="🔬" color="#06B6D4" />
        </div>

        {/* AI Strategic Advisor Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{
            padding: '1.5rem', marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🤖</span>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Dean Assistant & Academic Alerts</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Real-time strategic insights across all departments</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #F43F5E' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F43F5E', textTransform: 'uppercase' }}>🚨 Critical Intervention Needed</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>SWE Dept attendance dropped to 68% for morning batches. Recommend immediate departmental review.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #10B981' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>💡 Faculty Insight</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>CSE Dept research output increased by 45%. 12 students are highly suitable for undergraduate research grants.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #F59E0B' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>⚠️ Course Health Warning</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.5rem' }}>MAT101 (Calculus) shows a 32% predicted failure rate. Suggested action: Initiate weekend peer tutoring sessions.</p>
            </div>
          </div>
        </motion.div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Dept Ranking */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🏆 Department Ranking (Performance Score)</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptRanking} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text)', fontSize: 12, fontWeight: 600 }} width={80} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24}>
                  {deptRanking.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 85 ? '#10B981' : entry.score > 80 ? '#3B82F6' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* GPA Trend */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📈 Faculty CGPA Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.0, 4.0]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="SWE" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="CIS" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Academic Risk Distribution */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>⚠️ Academic Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Research Output Trend */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🔬 Research & Innovation Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={researchTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="publications" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} name="Publications" />
                <Area type="monotone" dataKey="grants" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Active Grants" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </main>
    </div>
  );
}
