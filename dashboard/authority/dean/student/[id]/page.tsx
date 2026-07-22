'use client';
import { use, useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Initial Mock Data
const initialStudentData = {
  id: '221-15-5231',
  name: 'Arafat Islam',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  department: 'CSE',
  program: 'B.Sc in Computer Science & Engineering',
  batch: '64',
  semester: '7',
  section: 'A',
  email: 'arafat@diu.edu.bd',
  advisor: 'Dr. Md. Ali',
  mentor: 'Prof. Hasan Mahmud',
  cgpa: 3.85,
  creditCompleted: 110,
  creditRemaining: 34,
  attendance: 92,
  riskStatus: 'Safe',
};

const gpaTrend = [
  { semester: 'Sem 1', gpa: 3.50 },
  { semester: 'Sem 2', gpa: 3.65 },
  { semester: 'Sem 3', gpa: 3.62 },
  { semester: 'Sem 4', gpa: 3.75 },
  { semester: 'Sem 5', gpa: 3.85 },
  { semester: 'Sem 6', gpa: 3.90 },
  { semester: 'Sem 7', gpa: 3.88 },
];

const skillRadarData = [
  { subject: 'Programming', A: 90, fullMark: 100 },
  { subject: 'AI & ML', A: 85, fullMark: 100 },
  { subject: 'Problem Solving', A: 95, fullMark: 100 },
  { subject: 'Communication', A: 75, fullMark: 100 },
  { subject: 'Leadership', A: 80, fullMark: 100 },
  { subject: 'Research', A: 88, fullMark: 100 },
];

const initialCourseGrades = [
  { course: 'Data Structures (CSE203)', grade: 'A', gpa: 4.00, attendance: 95 },
  { course: 'Database Systems (CSE204)', grade: 'A-', gpa: 3.75, attendance: 88 },
  { course: 'Operating Systems (CSE301)', grade: 'B+', gpa: 3.25, attendance: 75 },
  { course: 'Computer Networks (CSE303)', grade: 'A', gpa: 4.00, attendance: 92 },
  { course: 'Machine Learning (CSE405)', grade: 'A-', gpa: 3.75, attendance: 85 },
];

const initialDetailedSkills = [
  { category: 'Programming & Web', skills: ['React / Next.js (90%)', 'Python & Django (80%)', 'TypeScript (85%)', 'PostgreSQL (75%)'] },
  { category: 'Research & AI', skills: ['Academic Writing (80%)', 'Data Analysis (75%)', 'Machine Learning Models (85%)'] },
  { category: 'Leadership & Soft Skills', skills: ['Team Coordination (85%)', 'Public Speaking (65%)', 'Event Management (82%)'] },
];

const clubs = [
  { name: 'AIRIS (AI & Robotics)', role: 'Lead Developer', status: 'Verified Active' },
  { name: 'Programming Contest Team', role: 'Competitive Programmer', status: 'Verified Active' },
  { name: 'Photography Club', role: 'Secretary', status: 'Verified Active' },
];

const initialAchievements = [
  { id: 1, icon: '🥇', color: '#3B82F6', title: 'Champion - National Hackathon 2025', details: 'Semester 6 • Demonstrated exceptional AI and Problem Solving skills.' },
  { id: 2, icon: '📝', color: '#10B981', title: 'Research Paper Published (IEEE)', details: 'Semester 7 • Under the supervision of Prof. Hasan Mahmud.' },
  { id: 3, icon: '🤝', color: '#8B5CF6', title: 'Active Mentorship Completion', details: 'Semester 5 • Advanced Mentoring Track cleared successfully.' }
];


import { getStudentById } from '@/data/sharedMockData';
import { useEffect } from 'react';

export default function Student360Profile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Administrative States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  
  // Functional Data States
  const [student, setStudent] = useState(initialStudentData);
  const [courses, setCourses] = useState(initialCourseGrades);
  const [detailedSkills, setDetailedSkills] = useState(initialDetailedSkills);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [auditLogs, setAuditLogs] = useState<{date: string, action: string, reason: string}[]>([
    { date: '2026-07-06', action: 'Profile Accessed', reason: 'Routine Check' }
  ]);

  // Form States
  const [editForm, setEditForm] = useState(student);
  const [newSkill, setNewSkill] = useState({ category: 'Programming & Web', name: '' });
  const [newCourse, setNewCourse] = useState({ course: '', grade: 'A', gpa: 4.0, attendance: 100 });
  const [newAchievement, setNewAchievement] = useState({ icon: '🏆', color: '#F59E0B', title: '', details: '' });

  useEffect(() => {
    const s = getStudentById(resolvedParams.id);
    if (s) {
      const data = {
        id: s.id,
        name: s.name,
        photo: s.id === '261-16-010' ? '/profile_joy.png' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        department: s.departmentId,
        program: `B.Sc in ${s.department}`,
        batch: s.batchYear.toString(),
        semester: s.semester.toString(),
        section: 'A',
        email: s.email,
        advisor: s.assignedTeacherId === 'TCH-002' ? 'Mr. Md. Sarwar Hossain Mollah' : 'Mr. Md. Mehedi Hassan',
        mentor: s.assignedTeacherId === 'TCH-002' ? 'Mr. Md. Sarwar Hossain Mollah' : 'Tamanna Akter',
        cgpa: s.cgpa,
        creditCompleted: s.creditsCompleted,
        creditRemaining: s.creditsTotal - s.creditsCompleted,
        attendance: s.attendancePct,
        riskStatus: s.segment === 'at-risk' ? 'At Risk' : s.segment === 'average' ? 'Safe' : 'Excellent',
      };
      setStudent(data);
      setEditForm(data);
      
      if (s.subjects && s.subjects.length > 0) {
        setCourses(s.subjects.map(sub => ({
          course: `${sub.name} (${sub.code})`,
          grade: sub.grade,
          gpa: sub.marks >= 80 ? 4.0 : sub.marks >= 70 ? 3.5 : sub.marks >= 60 ? 3.0 : 2.5,
          attendance: sub.attendance
        })));
      }
    }
  }, [resolvedParams.id]);

  // Handlers
  const handleSaveProfile = () => {
    setStudent(editForm);
    addAuditLog('Updated Profile Information', 'Administrative Correction');
    setActiveModal(null);
  };

  const handleAddSkill = () => {
    if(!newSkill.name) return;
    const updated = detailedSkills.map(cat => {
      if(cat.category === newSkill.category) {
        return { ...cat, skills: [...cat.skills, newSkill.name] };
      }
      return cat;
    });
    setDetailedSkills(updated);
    addAuditLog(`Added Skill: ${newSkill.name}`, 'Skill Record Override');
    setNewSkill({ category: 'Programming & Web', name: '' });
  };

  const handleAddCourse = () => {
    if(!newCourse.course) return;
    setCourses([...courses, newCourse]);
    addAuditLog(`Updated Academic Record: Added ${newCourse.course}`, 'Academic Override');
    setNewCourse({ course: '', grade: 'A', gpa: 4.0, attendance: 100 });
  };

  const handleAddAchievement = () => {
    if(!newAchievement.title) return;
    setAchievements([{ id: Date.now(), ...newAchievement }, ...achievements]);
    addAuditLog(`Added Achievement: ${newAchievement.title}`, 'Profile Enrichment');
    setNewAchievement({ icon: '🏆', color: '#F59E0B', title: '', details: '' });
  };

  const handleDeactivate = () => {
    setStudent({ ...student, riskStatus: 'Deactivated / Archived' });
    addAuditLog('Deactivated Student Account', 'Policy / Archival');
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
      <TopNavbar title={`Student 360° Profile — ${resolvedParams.id} 👨‍🎓`} subtitle="Dean's Academic Intelligence" accentColor="#3B82F6" />
      
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Enable Administrative Override?</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                You are about to access this student's profile with administrative privileges. All activities will be logged for security and auditing.
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
            <button onClick={() => { setEditForm(student); setActiveModal('editProfile'); }} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>✏️ Edit Profile</button>
            <button onClick={() => setActiveModal('updateAcademic')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📊 Update Academic Record</button>
            <button onClick={() => setActiveModal('manageSkills')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🎯 Manage Skills</button>
            <button onClick={() => setActiveModal('manageAchievements')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🏆 Manage Achievements</button>
            <button onClick={() => { setActiveModal('generateReport'); generateAiReport(); }} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>🤖 Generate AI Report</button>
            <button onClick={() => setActiveModal('auditLog')} style={{ padding: '0.5rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>📋 View Audit Log</button>
            <button onClick={() => setActiveModal('deactivate')} style={{ padding: '0.5rem 1rem', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#DC2626', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}>🛑 Deactivate Student</button>
          </div>
        )}
        
        {/* Basic Info Header */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {student.riskStatus.includes('Deactivated') && (
            <div style={{ position: 'absolute', top: 20, right: -40, background: '#DC2626', color: '#fff', padding: '5px 40px', transform: 'rotate(45deg)', fontWeight: 800, fontSize: '0.8rem', zIndex: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>DEACTIVATED</div>
          )}
          <img src={student.photo} alt="Student" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #3B82F6', boxShadow: '0 10px 25px rgba(59,130,246,0.3)', filter: student.riskStatus.includes('Deactivated') ? 'grayscale(100%)' : 'none' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.2rem' }}>{student.name}</h1>
                <p style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 600 }}>{student.program} — {student.department}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>ID: {student.id}</span>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>Batch: {student.batch}</span>
                  <span style={{ fontSize: '0.85rem', background: 'var(--surface-2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border)' }}>Section: {student.section}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {!isOverrideMode && (
                  <button onClick={() => setShowConfirmDialog(true)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                    <span>🛡️</span> Academic Override
                  </button>
                )}
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>Advisor: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{student.advisor}</span></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Mentor: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{student.mentor}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <StatCard label="Current CGPA" value={student.cgpa.toString()} sub="Excellent Standing" icon="🏆" color="#3B82F6" />
          <StatCard label="Overall Attendance" value={`${student.attendance}%`} sub="Consistently High" icon="📅" color="#10B981" />
          <StatCard label="Credits Completed" value={student.creditCompleted.toString()} sub={`${student.creditRemaining} credits remaining`} icon="📚" color="#8B5CF6" />
          <StatCard label="Academic Risk" value={student.riskStatus} sub="Predictive AI Analysis" icon="🛡️" color={student.riskStatus.includes('Deactivated') ? '#DC2626' : '#10B981'} />
        </div>

        {/* AI Insight Overlay */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AI Dean Summary & Insights</h3>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>
            <strong style={{ color: '#3B82F6' }}>Performance Analytics:</strong> {student.name} is showing a consistent upward trend in CGPA. Programming and problem-solving are exceptionally strong. <br/><br/>
            <strong style={{ color: '#10B981' }}>Recommendation:</strong> Highly eligible for the prestigious Vice Chancellor Scholarship. Suitable for Undergraduate Research Grants in AI/ML domains.
          </p>
        </motion.div>

        {/* Charts & Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* GPA Timeline */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📈 Academic Progress Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={gpaTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.0, 4.0]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="gpa" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Radar */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>🎯 360° Skills Profile</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Student Skill" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Achievements & Timeline */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>🏆 Achievements & Mentorship Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'var(--border)' }}></div>
            
            {achievements.map((ach) => (
              <div key={ach.id} style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: ach.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', border: '4px solid var(--bg)' }}>{ach.icon}</div>
                <div style={{ background: 'var(--surface-2)', padding: '1rem', borderRadius: '12px', flex: 1, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{ach.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{ach.details}</p>
                </div>
              </div>
            ))}
            
          </div>
        </div>

        {/* Detailed Extracted Data Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Detailed Course & Attendance Analytics */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📚 Current Semester Academic Analytics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {courses.map((course, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{course.course}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>Grade: {course.grade} ({course.gpa.toFixed(2)})</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: course.attendance >= 80 ? '#10B981' : course.attendance >= 60 ? '#F59E0B' : '#F43F5E', margin: 0 }}>{course.attendance}%</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', margin: 0 }}>Attendance</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Skills & Club Verifications */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🎯 Verified Skill Competencies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {detailedSkills.map((cat, idx) => (
                  <div key={idx} style={{ padding: '0.875rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6', marginBottom: '0.5rem' }}>{cat.category}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {cat.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '6px' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🛡️ Extracurricular & Leadership</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {clubs.map((club, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{club.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>{club.role}</p>
                    </div>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{club.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Edit Profile Modal */}
            {activeModal === 'editProfile' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>✏️ Edit Student Profile</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>CGPA</label>
                    <input type="number" step="0.01" value={editForm.cgpa} onChange={e => setEditForm({...editForm, cgpa: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Credits Completed</label>
                      <input type="number" value={editForm.creditCompleted} onChange={e => setEditForm({...editForm, creditCompleted: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance %</label>
                      <input type="number" value={editForm.attendance} onChange={e => setEditForm({...editForm, attendance: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={handleSaveProfile} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#3B82F6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                </div>
              </motion.div>
            )}

            {/* Update Academic Record Modal */}
            {activeModal === 'updateAcademic' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>📊 Update Academic Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Course Code & Name</label>
                    <input type="text" value={newCourse.course} onChange={e => setNewCourse({...newCourse, course: e.target.value})} placeholder="e.g. Artificial Intelligence (CSE401)" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Grade</label>
                      <input type="text" value={newCourse.grade} onChange={e => setNewCourse({...newCourse, grade: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>GPA</label>
                      <input type="number" step="0.01" value={newCourse.gpa} onChange={e => setNewCourse({...newCourse, gpa: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Attendance %</label>
                      <input type="number" value={newCourse.attendance} onChange={e => setNewCourse({...newCourse, attendance: parseInt(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddCourse} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#3B82F6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Course</button>
                </div>
              </motion.div>
            )}

            {/* Manage Skills Modal */}
            {activeModal === 'manageSkills' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 500, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>🎯 Manage Skills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Category</label>
                    <select value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                      <option value="Programming & Web">Programming & Web</option>
                      <option value="Research & AI">Research & AI</option>
                      <option value="Leadership & Soft Skills">Leadership & Soft Skills</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Skill Name & Proficiency (e.g., Next.js 95%)</label>
                    <input type="text" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddSkill} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Skill</button>
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
                    <input type="text" value={newAchievement.title} onChange={e => setNewAchievement({...newAchievement, title: e.target.value})} placeholder="e.g. Best Developer Award" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Details / Context</label>
                    <input type="text" value={newAchievement.details} onChange={e => setNewAchievement({...newAchievement, details: e.target.value})} placeholder="e.g. Semester 8 • Awarded for AI thesis." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                  <button onClick={handleAddAchievement} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Achievement</button>
                </div>
              </motion.div>
            )}

            {/* Generate AI Report Modal */}
            {activeModal === 'generateReport' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ width: 450, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>AI Academic Intelligence Report</h3>
                
                {aiReportGenerating ? (
                  <div style={{ padding: '2rem' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid rgba(59, 130, 246, 0.2)', borderTop: '4px solid #3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Analyzing 360° academic profile...<br/>Synthesizing career recommendations...</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.5, background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <strong>AI Synthesis Complete.</strong><br/><br/>
                      The student demonstrates high proficiency in AI & ML. The system predicts a 92% chance of graduating with distinction. Recommended for Research Assistantship next semester.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => setActiveModal(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                      <button onClick={generateAiReport} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Regenerate Report</button>
                    </div>
                  </>
                )}
                
                <style>{`
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
              </motion.div>
            )}

            {/* Audit Log Modal */}
            {activeModal === 'auditLog' && (
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="glass-card" style={{ width: 600, padding: '2rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', maxHeight: '80vh', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>📋 Administrative Audit Log</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)', borderLeft: '4px solid #3B82F6' }}>
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

            {/* Deactivate Student Modal */}
            {activeModal === 'deactivate' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ width: 400, padding: '2rem', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛑</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Deactivate Student Account?</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Are you sure you want to deactivate {student.name}? This action archives their profile according to ERP best practices. They will lose platform access immediately.
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
