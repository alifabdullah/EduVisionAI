'use client';
import { use, useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Mock Data for Teacher
const initialTeacherData = {
  id: 'TCH-001',
  name: 'Dr. Md. Sarwar Hossain Mollah',
  photo: '/images/teachers/sarwar.png',
  department: 'Computer Science & Engineering',
  designation: 'Associate Professor',
  email: 'headcis@diu.edu.bd',
  phone: '+8801711000001',
  joiningDate: '2015-08-12',
  status: 'Active',
  teachingScore: 92,
  researchScore: 88,
  mentorshipScore: 95,
  overallKPI: 91,
};

const teachingPerformance = [
  { semester: 'Spring 24', score: 88 },
  { semester: 'Summer 24', score: 90 },
  { semester: 'Fall 24', score: 89 },
  { semester: 'Spring 25', score: 92 },
];

const radarData = [
  { subject: 'Pedagogy', A: 95, fullMark: 100 },
  { subject: 'Research', A: 88, fullMark: 100 },
  { subject: 'Mentorship', A: 96, fullMark: 100 },
  { subject: 'Administration', A: 85, fullMark: 100 },
  { subject: 'Innovation', A: 90, fullMark: 100 },
  { subject: 'Collaboration', A: 92, fullMark: 100 },
];

const initialCourses = [
  { courseCode: 'CSE401', courseName: 'Artificial Intelligence', students: 45, avgGrade: 'A-', attendance: 92, feedback: 4.8 },
  { courseCode: 'CSE301', courseName: 'Operating Systems', students: 50, avgGrade: 'B+', attendance: 88, feedback: 4.5 },
  { courseCode: 'CSE499', courseName: 'Thesis/Project', students: 12, avgGrade: 'A', attendance: 100, feedback: 5.0 },
];

const initialPublications = [
  { title: 'AI-driven Approaches to Healthcare', journal: 'IEEE Access', year: 2025, citations: 12 },
  { title: 'Machine Learning in Edge Computing', journal: 'ACM Computing Surveys', year: 2024, citations: 34 },
];

const initialAchievements = [
  { id: 1, icon: '🏆', color: '#F59E0B', title: 'Best Teacher Award 2024', details: 'Awarded by Vice Chancellor for outstanding pedagogy.' },
  { id: 2, icon: '🔬', color: '#10B981', title: 'National Research Grant', details: 'Secured 5M BDT for AI research from ICT Ministry.' },
];

export default function Teacher360Profile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Personal Information', 'Teaching', 'Courses', 'Attendance', 'Research', 'Publications', 'KPI', 'Mentorship', 'Achievements', 'AI Insights', 'Timeline'];

  // Administrative States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  
  // Functional Data States
  const [teacher, setTeacher] = useState({ ...initialTeacherData, id: resolvedParams.id });
  const [courses, setCourses] = useState(initialCourses);
  const [publications, setPublications] = useState(initialPublications);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [auditLogs, setAuditLogs] = useState<{date: string, action: string, reason: string}[]>([
    { date: '2026-07-06', action: 'Profile Accessed', reason: 'Routine Check' }
  ]);

  // Form States
  const [editForm, setEditForm] = useState(teacher);
  const [newCourse, setNewCourse] = useState({ courseCode: '', courseName: '', students: 40, avgGrade: 'A-', attendance: 90, feedback: 4.5 });
  const [newPublication, setNewPublication] = useState({ title: '', journal: '', year: 2026, citations: 0 });
  const [newAchievement, setNewAchievement] = useState({ icon: '🏆', color: '#F59E0B', title: '', details: '' });

  // Handlers
  const handleSaveProfile = () => {
    setTeacher(editForm);
    addAuditLog('Updated Personal/Academic Information', 'Administrative Correction');
    setActiveModal(null);
  };

  const handleAddCourse = () => {
    if(!newCourse.courseCode) return;
    setCourses([...courses, newCourse]);
    addAuditLog(`Updated Assigned Courses: Added ${newCourse.courseCode}`, 'Academic Override');
    setNewCourse({ courseCode: '', courseName: '', students: 40, avgGrade: 'A-', attendance: 90, feedback: 4.5 });
  };

  const handleAddPublication = () => {
    if(!newPublication.title) return;
    setPublications([newPublication, ...publications]);
    addAuditLog(`Updated Research & Publications: ${newPublication.title}`, 'Research Override');
    setNewPublication({ title: '', journal: '', year: 2026, citations: 0 });
  };

  const handleAddAchievement = () => {
    if(!newAchievement.title) return;
    setAchievements([{ id: Date.now(), ...newAchievement }, ...achievements]);
    addAuditLog(`Added Achievement: ${newAchievement.title}`, 'Profile Enrichment');
    setNewAchievement({ icon: '🏆', color: '#F59E0B', title: '', details: '' });
  };

  const handleDeactivate = () => {
    setTeacher({ ...teacher, status: 'Deactivated / Archived' });
    addAuditLog('Deactivated Teacher Account', 'Policy / Archival');
    setActiveModal(null);
  };

  const generateAiReport = () => {
    setAiReportGenerating(true);
    setTimeout(() => {
      setAiReportGenerating(false);
      addAuditLog('Generated 360° AI Performance Report', 'Dean Request');
    }, 2000);
  };

  const addAuditLog = (action: string, reason: string) => {
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    setAuditLogs([{ date: dateStr, action, reason }, ...auditLogs]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <TopNavbar title={`Teacher 360° Profile — ${resolvedParams.id} 👨‍🏫`} subtitle="Dean's Academic Intelligence" accentColor="#10B981" />
      
      {/* Administrative Override Banner */}
      {isOverrideMode && (
        <div style={{ background: '#DC2626', color: '#fff', padding: '10px 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> ADMINISTRATIVE OVERRIDE MODE ACTIVE
          </div>
          <button onClick={() => setIsOverrideMode(false)} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Exit Mode</button>
        </div>
      )}

      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ width: 400, padding: '2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Enable Administrative Access?</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                You are about to access this teacher's profile with administrative privileges. All activities will be logged for security and auditing.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => setShowConfirmDialog(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button onClick={() => { setShowConfirmDialog(false); setIsOverrideMode(true); addAuditLog('Enabled Override Mode', 'Dean Authorized Access'); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)' }}>Continue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', position: 'relative' }} className="fade-in">

        {/* Admin Action Buttons (Only in Override Mode) */}
        {isOverrideMode && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button onClick={() => { setEditForm(teacher); setActiveModal('editProfile'); }} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Profile</button>
            <button onClick={() => setActiveModal('updateCourses')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📚 Update Courses</button>
            <button onClick={() => setActiveModal('updatePublications')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🔬 Add Publication</button>
            <button onClick={() => setActiveModal('manageAchievements')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🏆 Manage Achievements</button>
            <button onClick={() => { setActiveModal('generateReport'); generateAiReport(); }} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🤖 Generate AI Report</button>
            <button onClick={() => setActiveModal('auditLog')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📋 View Audit Log</button>
            <button onClick={() => setActiveModal('deactivate')} style={{ padding: '0.5rem 1rem', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#DC2626', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>🛑 Deactivate Teacher</button>
          </div>
        )}
        
        {/* Basic Info Header */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {teacher.status.includes('Deactivated') && (
            <div style={{ position: 'absolute', top: 20, right: -40, background: '#DC2626', color: '#fff', padding: '5px 40px', transform: 'rotate(45deg)', fontWeight: 800, fontSize: '0.8rem', zIndex: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>DEACTIVATED</div>
          )}
          <div style={{ width: 100, height: 100, minWidth: 100, minHeight: 100, flexShrink: 0, borderRadius: '50%', border: '4px solid #10B981', boxShadow: '0 10px 25px rgba(16,185,129,0.3)', overflow: 'hidden' }}>
            <img src={teacher.photo} alt="Teacher" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: teacher.status.includes('Deactivated') ? 'grayscale(100%)' : 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.2rem' }}>{teacher.name}</h1>
                <p style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600 }}>{teacher.designation} — {teacher.department}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>ID: {teacher.id}</span>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>Email: {teacher.email}</span>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>Phone: {teacher.phone}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {!isOverrideMode && (
                  <button onClick={() => setShowConfirmDialog(true)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                    <span>🛡️</span> Administrative Access
                  </button>
                )}
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>Joining Date: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{teacher.joiningDate}</span></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Status: <span style={{ color: teacher.status.includes('Active') ? '#10B981' : '#DC2626', fontWeight: 600 }}>{teacher.status}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#10B981' : 'var(--surface-2)',
                color: activeTab === tab ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: '0.2s',
                boxShadow: activeTab === tab ? '0 4px 10px rgba(16,185,129,0.3)' : 'none'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="glass-card" style={{ padding: '1.5rem', minHeight: '300px' }}>
          
          {activeTab === 'Overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <StatCard label="Teaching Score" value={`${teacher.teachingScore}%`} sub="Student Feedback Based" icon="👨‍🏫" color="#3B82F6" />
                <StatCard label="Research Output" value={`${teacher.researchScore}%`} sub="Publications & Grants" icon="🔬" color="#10B981" />
                <StatCard label="Mentorship KPI" value={`${teacher.mentorshipScore}%`} sub="Student Success Rate" icon="🤝" color="#8B5CF6" />
                <StatCard label="Overall Standing" value={`${teacher.overallKPI}/100`} sub="Institutional Rank" icon="🏆" color="#F59E0B" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📈 Teaching Performance Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={teachingPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[80, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🎯 360° Faculty Radar</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Teacher Skill" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Personal Information' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Personal & Academic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Full Name</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.name}</p></div>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Email Address</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.email}</p></div>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Phone Number</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.phone}</p></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Department</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.department}</p></div>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Designation</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.designation}</p></div>
                  <div><p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Joining Date</p><p style={{ fontWeight: 600, margin: 0 }}>{teacher.joiningDate}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Courses' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Current Semester Assigned Courses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {courses.map((course, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>{course.courseCode}: {course.courseName}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Enrolled Students: {course.students} | Student Avg Grade: {course.avgGrade}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981', margin: '0 0 4px' }}>★ {course.feedback}/5.0</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Course Feedback</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Publications' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Research & Publications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {publications.map((pub, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px', color: '#3B82F6' }}>{pub.title}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                      <span>Journal: <strong style={{ color: 'var(--text)' }}>{pub.journal}</strong></span>
                      <span>Year: <strong style={{ color: 'var(--text)' }}>{pub.year}</strong></span>
                      <span>Citations: <strong style={{ color: 'var(--text)' }}>{pub.citations}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Achievements' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Awards & Achievements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {achievements.map((ach) => (
                  <div key={ach.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: ach.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>{ach.icon}</div>
                    <div>
                      <p style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>{ach.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>{ach.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'AI Insights' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Strategic Summary</h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
                <strong style={{ color: '#10B981' }}>Strengths:</strong> {teacher.name} shows exceptional mentorship capabilities and high course feedback scores. Their recent publications in IEEE Access demonstrate strong research alignment with institutional goals.<br/><br/>
                <strong style={{ color: '#3B82F6' }}>Strategic Recommendation:</strong> Highly suitable for leading the upcoming AI Research Lab initiative. Suggest a slight reduction in teaching load (1 course) to maximize research output in the next academic year.
              </p>
            </motion.div>
          )}

          {activeTab === 'Teaching' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Teaching Feedback Analytics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', margin: 0 }}>4.8<span style={{ fontSize: '1rem', color: 'var(--muted)' }}>/5.0</span></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Average Student Rating</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', margin: 0 }}>92%</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Course Completion Rate</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6', margin: 0 }}>15</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Active Office Hours/Week</p>
                </div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Student Qualitative Feedback</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ fontSize: '0.85rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '4px solid #3B82F6', margin: 0 }}>"Excellent methodology. Real-world examples make AI concepts easy to understand."</p>
                  <p style={{ fontSize: '0.85rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '4px solid #10B981', margin: 0 }}>"Very supportive during office hours. Helped me debug my final project."</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Faculty Attendance & Leave Tracking</h3>
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <StatCard label="Total Working Days" value="124" sub="Current Semester" icon="📅" color="#3B82F6" />
                <StatCard label="Days Present" value="118" sub="95% Attendance Rate" icon="✅" color="#10B981" />
                <StatCard label="Leaves Availed" value="6" sub="Casual: 4 | Sick: 2" icon="🏖️" color="#F59E0B" />
              </div>
              <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Leave History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sick Leave</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Mar 12, 2026 - Mar 13, 2026</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Casual Leave</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Jan 05, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Research' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ongoing Research & Grants</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#3B82F6', margin: '0 0 0.25rem 0' }}>AI-Assisted Educational Diagnostics</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>Role: Principal Investigator</p>
                    </div>
                    <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>Developing machine learning models to identify early signs of academic struggle in undergraduate students using LMS interaction data.</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px' }}>Funded by: ICT Division</span>
                    <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px' }}>Grant: ৳ 2,500,000</span>
                    <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px' }}>Timeline: 2025-2027</span>
                  </div>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#8B5CF6', margin: '0 0 0.25rem 0' }}>Edge Computing for IoT Networks</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>Role: Co-Investigator</p>
                    </div>
                    <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>In Review</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>Researching optimized routing protocols for resource-constrained edge devices in smart campus environments.</p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px' }}>Funded by: University Research Cell</span>
                    <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px' }}>Grant: ৳ 500,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'KPI' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Key Performance Indicators (KPI)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.5rem' }}>Annual KPI Breakdown</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { label: 'Teaching Quality', score: 95, color: '#3B82F6' },
                      { label: 'Research & Publications', score: 88, color: '#10B981' },
                      { label: 'Administrative Contribution', score: 85, color: '#F59E0B' },
                      { label: 'Student Mentorship', score: 96, color: '#8B5CF6' }
                    ].map(kpi => (
                      <div key={kpi.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          <span>{kpi.label}</span>
                          <span>{kpi.score}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${kpi.score}%`, background: kpi.color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10B981' }}>91</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Overall Faculty Score</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>Top 5% in the Department of CSE. Eligible for Performance Bonus.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Mentorship' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Student Mentorship Analytics</h3>
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <StatCard label="Active Mentees" value="24" sub="Undergraduate Students" icon="👥" color="#3B82F6" />
                <StatCard label="Alumni Mentees" value="156" sub="Graduated successfully" icon="🎓" color="#8B5CF6" />
                <StatCard label="Mentee Avg CGPA" value="3.65" sub="Above university average" icon="📈" color="#10B981" />
              </div>
              <div style={{ background: 'var(--surface-2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Mentorship Activities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '4px solid #8B5CF6' }}>
                    <div style={{ fontSize: '1.5rem' }}>🎯</div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Career Counseling Session</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Conducted a 1-on-1 session with 8 final year students regarding higher studies abroad.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                    <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Academic Intervention</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Successfully guided 3 at-risk mentees out of probation status through personalized study plans.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Career & Academic Timeline</h3>
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }}></div>
                
                {[
                  { year: '2024', title: 'Best Teacher Award', desc: 'Received the prestigious VC award for outstanding pedagogy.', icon: '🏆', color: '#F59E0B' },
                  { year: '2021', title: 'Promoted to Associate Professor', desc: 'Department of Computer Science & Engineering.', icon: '⭐', color: '#3B82F6' },
                  { year: '2019', title: 'Completed Ph.D.', desc: 'Awarded Doctorate in Artificial Intelligence.', icon: '🎓', color: '#8B5CF6' },
                  { year: '2015', title: 'Joined as Assistant Professor', desc: 'Began academic career at Daffodil International University.', icon: '🏛️', color: '#10B981' }
                ].map((item, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '2rem' }}>
                    <div style={{ position: 'absolute', left: '-2rem', width: '32px', height: '32px', borderRadius: '50%', background: item.color, border: '4px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', zIndex: 1, transform: 'translateX(-50%)' }}>
                      {item.icon}
                    </div>
                    <div style={{ background: 'var(--surface-2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.color, background: `${item.color}15`, padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginBottom: '0.5rem' }}>{item.year}</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Edit Profile Modal */}
            {activeModal === 'editProfile' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>✏️ Edit Teacher Profile</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Designation</label>
                    <input type="text" value={editForm.designation} onChange={e => setEditForm({...editForm, designation: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Teaching Score</label>
                      <input type="number" value={editForm.teachingScore} onChange={e => setEditForm({...editForm, teachingScore: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Research Score</label>
                      <input type="number" value={editForm.researchScore} onChange={e => setEditForm({...editForm, researchScore: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={handleSaveProfile} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                </div>
              </motion.div>
            )}

            {/* Update Courses Modal */}
            {activeModal === 'updateCourses' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>📚 Assign New Course</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Course Code</label>
                      <input type="text" value={newCourse.courseCode} onChange={e => setNewCourse({...newCourse, courseCode: e.target.value})} placeholder="e.g. CSE405" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Course Name</label>
                      <input type="text" value={newCourse.courseName} onChange={e => setNewCourse({...newCourse, courseName: e.target.value})} placeholder="e.g. Machine Learning" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddCourse} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#3B82F6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Assign Course</button>
                </div>
              </motion.div>
            )}

            {/* Update Publications Modal */}
            {activeModal === 'updatePublications' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>🔬 Add Publication</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Paper Title</label>
                    <input type="text" value={newPublication.title} onChange={e => setNewPublication({...newPublication, title: e.target.value})} placeholder="e.g. Deep Learning in NLP" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Journal / Conference</label>
                    <input type="text" value={newPublication.journal} onChange={e => setNewPublication({...newPublication, journal: e.target.value})} placeholder="e.g. IEEE Transactions" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddPublication} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Record</button>
                </div>
              </motion.div>
            )}

            {/* Manage Achievements Modal */}
            {activeModal === 'manageAchievements' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>🏆 Manage Achievements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Achievement Title</label>
                    <input type="text" value={newAchievement.title} onChange={e => setNewAchievement({...newAchievement, title: e.target.value})} placeholder="e.g. Best Faculty Award" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Details / Context</label>
                    <input type="text" value={newAchievement.details} onChange={e => setNewAchievement({...newAchievement, details: e.target.value})} placeholder="e.g. Awarded for excellent guidance." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddAchievement} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#F59E0B', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Achievement</button>
                </div>
              </motion.div>
            )}

            {/* Generate AI Report Modal */}
            {activeModal === 'generateReport' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ width: 450, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>AI Faculty Intelligence Report</h3>
                
                {aiReportGenerating ? (
                  <div style={{ padding: '2rem' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid rgba(16, 185, 129, 0.2)', borderTop: '4px solid #10B981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Analyzing 360° faculty profile...<br/>Synthesizing academic recommendations...</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.5, background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <strong>AI Synthesis Complete.</strong><br/><br/>
                      The faculty demonstrates high proficiency in Mentorship and Pedagogy. Recommendation: Eligible for Promotion to Professor role in the next assessment cycle.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                      <button onClick={generateAiReport} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Regenerate Report</button>
                    </div>
                  </>
                )}
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </motion.div>
            )}

            {/* Audit Log Modal */}
            {activeModal === 'auditLog' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 600, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', maxHeight: '80vh', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>📋 Administrative Audit Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', borderLeft: '4px solid #10B981' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 6px' }}>{log.date}</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>{log.action}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>Reason: {log.reason}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close Log</button>
                </div>
              </motion.div>
            )}

            {/* Deactivate Teacher Modal */}
            {activeModal === 'deactivate' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ width: 400, padding: '2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛑</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Deactivate Teacher Profile?</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Are you sure you want to deactivate {teacher.name}? This action archives their profile and they will lose platform access immediately.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={handleDeactivate} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)' }}>Deactivate & Archive</button>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
