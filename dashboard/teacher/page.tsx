'use client';
import { useState, useMemo } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import AlertBadge from '@/components/ui/AlertBadge';
import teacherData from '@/data/teacher.json';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import {
  INITIAL_PROJECTS, INITIAL_RESEARCH, LIBRARY_VISITS, ISSUED_BOOKS, SEMESTER_DATA, Project, Research
} from '@/data/academicData';
import StudentLookup from '@/components/academic/StudentLookup';
import { useGlobalRequests, updateGlobalRequestStatus } from '@/utils/globalState';

// Temporary default demo link — replaced when students submit real project URLs
const DEFAULT_DEMO_LINK = 'https://joysarkar.netlify.app/';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'requests' | 'projects' | 'research' | 'library' | 'lookup'>('overview');

  // Custom mock integrated states
  const globalReqs = useGlobalRequests();
  const [localRequests, setLocalRequests] = useState([
    { id: 'req-1', studentName: 'Joy kumar Yuv', studentId: '261-16-010', dept: 'Computer Science & Engineering', type: 'Project', title: 'EduVision AI Analytics Platform', topic: 'AI-Powered Student Analytics', date: '2026-05-20', status: 'Pending', comment: '' },
    { id: 'req-2', studentName: 'Tasneem Karim', studentId: '261-16-002', dept: 'Computer Science & Engineering', type: 'Research', title: 'Blockchain-Based Credential Verification', topic: 'Ethereum Smart Contracts', date: '2026-05-22', status: 'Pending', comment: '' },
    { id: 'req-3', studentName: 'Mia Reynolds', studentId: '261-16-003', dept: 'Computer Science', type: 'Project', title: 'Campus Seat Reserve Tracker', topic: 'IoT-Based Reservation Maps', date: '2026-05-18', status: 'Approved', comment: 'Approved for development phase.' }
  ]);

  const requests = [...globalReqs, ...localRequests];

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [researchList, setResearchList] = useState<Research[]>(INITIAL_RESEARCH);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '', topic: '', sector: 'EdTech', description: '', techStack: '',
    teamMembers: '', supervisor: 'Tamanna Akter', startDate: '2026-05-23', status: 'Ongoing' as 'Ongoing' | 'Completed',
    liveLink: '', githubLink: ''
  });

  // Student academic tracking state
  const [selectedStudent, setSelectedStudent] = useState<string>('Joy kumar Yuv');
  const [selectedSem, setSelectedSem] = useState<string>('263');
  const [studentSearch, setStudentSearch] = useState<string>('');

  // ── Supervisor Request Handlers ──────────────────
  const handleRequestAction = (id: string, action: 'Approved' | 'Rejected', comment: string) => {
    if (id.startsWith('glb-')) {
      updateGlobalRequestStatus(id, action, comment);
    } else {
      setLocalRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: action, comment };
        }
        return req;
      }));
    }

    const req = requests.find(r => r.id === id);
    if (req && action === 'Approved') {
      if (req.type === 'Project' || req.type === 'AI Session') {
        const newProj: Project = {
          id: `proj-${Date.now()}`,
          title: req.title,
          topic: req.topic,
          sector: 'EdTech',
          description: req.type === 'AI Session' ? 'AI scheduled counselling session' : 'AI student analytics portal.',
          techStack: req.type === 'AI Session' ? ['Mentorship'] : ['Next.js', 'PostgreSQL', 'Redis'],
          teamMembers: [req.studentName],
          supervisor: 'Tamanna Akter',
          supervisorVerified: true,
          startDate: '2026-01-10',
          status: 'Ongoing',
          color: '#6C63FF'
        };
        setProjects(prevProj => [newProj, ...prevProj]);
      } else {
        const newRes: Research = {
          id: `res-${Date.now()}`,
          title: req.title,
          abstract: 'LSTM neural networks tracking early student risk.',
          researchArea: req.topic,
          keywords: ['Analytics', 'Security'],
          supervisor: 'Tamanna Akter',
          supervisorVerified: true,
          coAuthors: [req.studentName],
          startDate: '2026-01-10',
          expectedEndDate: '2026-12-30',
          status: 'Accepted',
          workflowStage: 2
        };
        setResearchList(prevRes => [newRes, ...prevRes]);
      }
    }
  };

  // ── Add direct project to student ─────────────────
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['#6C63FF', '#22D3EE', '#10B981', '#F59E0B', '#A78BFA', '#F43F5E'];
    const p: Project = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      topic: newProject.topic,
      sector: newProject.sector,
      description: newProject.description,
      techStack: newProject.techStack.split(',').map(t => t.trim()).filter(Boolean),
      teamMembers: newProject.teamMembers.split(',').map(m => m.trim()).filter(Boolean),
      supervisor: newProject.supervisor,
      supervisorVerified: true,
      startDate: newProject.startDate,
      status: newProject.status,
      liveLink: newProject.liveLink || undefined,
      githubLink: newProject.githubLink || undefined,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setProjects([p, ...projects]);
    setShowAddProjectModal(false);
    setNewProject({
      title: '', topic: '', sector: 'EdTech', description: '', techStack: '',
      teamMembers: '', supervisor: 'Tamanna Akter', startDate: '2026-05-23', status: 'Ongoing',
      liveLink: '', githubLink: ''
    });
  };

  // ── Research Workflow Stage Update ────────────────
  const handleUpdateResearchStage = (id: string, stage: number) => {
    setResearchList(prev => prev.map(res => {
      if (res.id === id) {
        const statuses: Research['status'][] = ['Draft', 'Supervisor Connected', 'Under Review', 'Revision Required', 'Accepted', 'Published'];
        return { ...res, workflowStage: stage, status: statuses[stage] || res.status };
      }
      return res;
    }));
  };

  // ── Project Status Update ──────────────────────────
  const handleUpdateProjectStatus = (id: string, status: Project['status']) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === id) return { ...proj, status };
      return proj;
    }));
  };

  const handleVerifyProjectToggle = (id: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === id) return { ...proj, supervisorVerified: !proj.supervisorVerified };
      return proj;
    }));
  };

  // Student academic summary fetcher
  const currentSemesterData = SEMESTER_DATA[selectedSem] || SEMESTER_DATA['263'];
  const activeStudentProfile = useMemo(() => {
    return {
      name: selectedStudent,
      roll: selectedStudent === 'Joy kumar Yuv' ? 'CIS16010' : 'CS21045',
      dept: 'Computer Science & Engineering',
      cgpa: selectedStudent === 'Joy kumar Yuv' ? 3.42 : 3.68,
      gpa: currentSemesterData.gpa,
      attendance: currentSemesterData.attendancePct,
      weakSubjects: currentSemesterData.subjects.filter(s => s.riskLevel === 'high' || s.attendance < 75)
    };
  }, [selectedStudent, selectedSem, currentSemesterData]);

  // Overall counts for Overview stats
  const totalPending = requests.filter(r => r.status === 'Pending').length;
  const totalSupervisedStudents = projects.length + researchList.length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavbar
        title="Faculty Academic Workspace 👋"
        subtitle="Supervision verification portal, academic analytics hub, library activity tracker"
        accentColor="#22D3EE"
      />

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: 10,
          padding: '4px 6px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          maxWidth: 'fit-content'
        }}>
          {[
            { id: 'overview', label: 'Faculty Overview', icon: '⊞' },
            { id: 'lookup', label: 'Student Lookup', icon: '🔍' },
            { id: 'students', label: 'Student Performance Hub', icon: '👥' },
            { id: 'requests', label: `Verification Requests (${totalPending})`, icon: '🔔' },
            { id: 'projects', label: 'Project Supervision', icon: '🗂️' },
            { id: 'research', label: 'Research Supervisor', icon: '🔬' },
            { id: 'library', label: 'Library Engagement', icon: '📖' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.6rem 1.1rem',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(108,99,255,0.1) 100%)'
                  : 'transparent',
                color: activeTab === tab.id ? '#22D3EE' : 'var(--muted)',
                border: activeTab === tab.id ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
                borderRadius: 10,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── 1. FACULTY OVERVIEW TAB ────────────────── */}
        {activeTab === 'overview' && (
          <div className="fade-in">
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <StatCard label="Supervised Students" value={totalSupervisedStudents} sub="Projects & Research papers" icon="👥" color="#22D3EE" />
              <StatCard label="Verified Projects" value={projects.filter(p => p.supervisorVerified).length} sub="Completed credentials check" icon="✅" color="#10B981" />
              <StatCard label="Supervised Research" value={researchList.length} sub="Under review & drafts" icon="🔬" color="#A78BFA" />
              <StatCard label="Pending Requests" value={totalPending} sub="Require supervisor sign-off" icon="🔔" color="#F59E0B" />
              <StatCard label="Students at Risk" value={teacherData.summary.atRiskCount} sub="Low grades / attendance alerts" icon="⚠️" color="#F43F5E" />
              <StatCard label="Research Publications" value={researchList.filter(r => r.workflowStage === 5).length + 4} sub="Accepted & Published papers" icon="🏆" color="#10B981" />
            </div>

            {/* Smart Alerts & DEADLINES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Risks & Active alerts */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>⚠️ Academic Risks & anomalies</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Identified automatically via ID scans & grade books</p>
                  </div>
                  <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>AI Insights</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: '10px 12px', background: 'rgba(244,63,94,0.06)', borderLeft: '3px solid #F43F5E', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F43F5E' }}>Mia Reynolds — Attendance Dropping (60%)</p>
                      <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>Attendance Risk</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Data Structures attendance is critically low. Recommended: schedule dynamic mentor chat.</p>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.06)', borderLeft: '3px solid #F59E0B', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B' }}>Liam Scott — Inconsistent Quiz Performance (CSE301)</p>
                      <span className="badge badge-medium" style={{ fontSize: '0.65rem' }}>Performance Alert</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Quiz average fell to 45% over three iterations. Missing assignment 4 detected.</p>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(34,211,238,0.06)', borderLeft: '3px solid #22D3EE', borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE' }}>Research Library activity increased</p>
                      <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>Study habits</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Joy kumar Yuv RFID library study logged at 15+ hours this week before algorithms finals.</p>
                  </div>
                </div>
              </div>

              {/* Deadlines & Workload */}
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12 }}>📅 Timeline Deadlines</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                      <span style={{ color: 'var(--muted)' }}>IEEE Conference Draft</span>
                      <span style={{ fontWeight: 600, color: '#A78BFA' }}>28 May 2026</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                      <span style={{ color: 'var(--muted)' }}>Midterm Grade Submit</span>
                      <span style={{ fontWeight: 600, color: '#22D3EE' }}>02 June 2026</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                      <span style={{ color: 'var(--muted)' }}>Project Milestones Rev.</span>
                      <span style={{ fontWeight: 600, color: '#10B981' }}>05 June 2026</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', background: 'rgba(108,99,255,0.08)', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(108,99,255,0.2)' }}>
                  <p style={{ fontSize: '0.72rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Faculty Workload Status</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Supervising {totalSupervisedStudents} students. Status: <span style={{ color: '#10B981' }}>Acceptable (Cap: 15)</span></p>
                </div>
              </div>
            </div>

            {/* Performance charts */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12 }}>📈 Supervision Performance Indicators</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { name: 'Jan', Research: 1, Projects: 2, Publications: 1 },
                  { name: 'Feb', Research: 2, Projects: 3, Publications: 2 },
                  { name: 'Mar', Research: 3, Projects: 4, Publications: 2 },
                  { name: 'Apr', Research: 5, Projects: 6, Publications: 3 },
                  { name: 'May', Research: 6, Projects: 7, Publications: 4 }
                ]}>
                  <defs>
                    <linearGradient id="researchG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="projectG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="Research" stroke="#A78BFA" fill="url(#researchG)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Projects" stroke="#22D3EE" fill="url(#projectG)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── 2. STUDENT PERFORMANCE HUB TAB ─────────── */}
        {activeTab === 'students' && (
          <div className="fade-in">
            {/* Filter Bar */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(108,99,255,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: 4, fontWeight: 700 }}>Select Student</span>
                <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} style={{ padding: '0.45rem 0.85rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.82rem', outline: 'none' }}>
                  <option value="Joy kumar Yuv">Joy kumar Yuv (CIS16010)</option>
                  <option value="Mia Reynolds">Mia Reynolds (CS21045)</option>
                  <option value="Alex Carter">Alex Carter (CS21046)</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'block', marginBottom: 4, fontWeight: 700 }}>Academic Term</span>
                <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)} style={{ padding: '0.45rem 0.85rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.82rem', outline: 'none' }}>
                  <option value="263">Fall 2026</option>
                  <option value="262">Summer 2026</option>
                  <option value="261">Spring 2026</option>
                </select>
              </div>
            </div>

            {/* Performance profiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.25rem' }}>
              {/* Profile Card & Alerts */}
              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: `4px solid ${activeStudentProfile.attendance < 75 ? 'var(--danger)' : '#22D3EE'}` }}>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>Student Profile Details</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Name:</span>
                    <p style={{ fontWeight: 700, color: 'var(--text)' }}>{activeStudentProfile.name}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>ID / Roll:</span>
                    <p style={{ fontWeight: 600, fontFamily: 'monospace' }}>{activeStudentProfile.roll}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Semester GPA / CGPA:</span>
                    <p style={{ fontWeight: 700 }}>{activeStudentProfile.gpa.toFixed(2)} / {activeStudentProfile.cgpa.toFixed(2)}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Term Attendance:</span>
                    <p style={{ fontWeight: 700, color: activeStudentProfile.attendance < 75 ? 'var(--danger)' : 'var(--success)' }}>
                      {activeStudentProfile.attendance}%
                    </p>
                  </div>
                </div>

                {/* Weak Courses warning logs */}
                <div style={{ marginTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>⚠️ Weak Subject Indicators</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activeStudentProfile.weakSubjects.length === 0 ? (
                      <p style={{ fontSize: '0.72rem', color: '#10B981' }}>On Track! No weak subjects detected.</p>
                    ) : activeStudentProfile.weakSubjects.map(sub => (
                      <div key={sub.code} style={{ padding: '6px 10px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, fontSize: '0.74rem', color: 'var(--danger)' }}>
                        <strong>{sub.name} ({sub.code})</strong>: attendance is {sub.attendance}%, quiz avg {sub.quiz}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject Breakdown & Dynamic Charts */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 12 }}>Subject Performance breakdown</h4>
                <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Course</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Quiz</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Mid</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Final</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Attendance</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--muted)' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSemesterData.subjects.map(s => (
                        <tr key={s.code} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px 8px', fontWeight: 600 }}>{s.name}</td>
                          <td style={{ padding: '8px 8px' }}>{s.quiz}%</td>
                          <td style={{ padding: '8px 8px' }}>{s.mid}%</td>
                          <td style={{ padding: '8px 8px' }}>{s.final}%</td>
                          <td style={{ padding: '8px 8px', color: s.attendance < 75 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>{s.attendance}%</td>
                          <td style={{ padding: '8px 8px' }}><span className="badge badge-info">{s.grade}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recharts Comparison Chart */}
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={currentSemesterData.subjects.map(s => ({ name: s.code, Quiz: s.quiz, Mid: s.mid, Final: s.final }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 9 }} />
                    <Bar dataKey="Quiz" fill="#A78BFA" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Mid" fill="#22D3EE" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Final" fill="#10B981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. SUPERVISOR REQUESTS TAB ──────────────── */}
        {activeTab === 'requests' && (
          <div className="fade-in">
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>🔔 Academic Supervision Verification Panel</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Accept or reject final year thesis proposals or supervisor endorsements</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {requests.map(req => (
                <div
                  key={req.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : req.status === 'Rejected' ? 'var(--danger)' : '#F59E0B'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span className="badge badge-primary" style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF', marginBottom: 6 }}>{req.type}</span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{req.title}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>Focus: <span style={{ color: 'var(--text)' }}>{req.topic}</span></p>
                    </div>
                    <span className={`badge badge-${req.status === 'Approved' ? 'low' : req.status === 'Rejected' ? 'high' : 'medium'}`}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 10,
                    padding: '10px 12px',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: 10,
                    fontSize: '0.78rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--muted)' }}>Student Name:</span>
                      <p style={{ fontWeight: 600 }}>{req.studentName} ({req.studentId})</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)' }}>Department:</span>
                      <p style={{ fontWeight: 600 }}>{req.dept}</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted)' }}>Submitted Date:</span>
                      <p style={{ fontWeight: 600 }}>{req.date}</p>
                    </div>
                  </div>

                  {/* Feedback / Action Forms */}
                  {req.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        id={`comment-${req.id}`}
                        placeholder="Add revision corrections or verification feedback here…"
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          color: 'var(--text)',
                          fontSize: '0.78rem',
                          outline: 'none',
                          minWidth: 200
                        }}
                      />
                      <button
                        onClick={() => {
                          const c = (document.getElementById(`comment-${req.id}`) as HTMLInputElement)?.value || '';
                          handleRequestAction(req.id, 'Approved', c);
                        }}
                        style={{ padding: '0.5rem 1.1rem', background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Approve Endorsement
                      </button>
                      <button
                        onClick={() => {
                          const c = (document.getElementById(`comment-${req.id}`) as HTMLInputElement)?.value || '';
                          handleRequestAction(req.id, 'Rejected', c);
                        }}
                        style={{ padding: '0.5rem 1.1rem', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontStyle: 'italic' }}>
                      💬 Feedback logged: {req.comment || 'None'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. PROJECT SUPERVISION TAB ─────────────── */}
        {activeTab === 'projects' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>🗂️ Faculty Project Milestones Manager</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Verify and modify project status on active student profiles</p>
              </div>
              <button
                onClick={() => setShowAddProjectModal(true)}
                style={{ padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg, #22D3EE, #6C63FF)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                + Supervise New Project
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className="glass-card"
                  style={{
                    padding: '1rem',
                    borderLeft: `4px solid ${proj.supervisorVerified ? 'var(--success)' : '#22D3EE'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{proj.sector}</span>
                      <button
                        onClick={() => handleVerifyProjectToggle(proj.id)}
                        style={{
                          background: proj.supervisorVerified ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.06)',
                          color: proj.supervisorVerified ? '#10B981' : 'var(--muted)',
                          border: 'none',
                          borderRadius: 8,
                          padding: '3px 8px',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {proj.supervisorVerified ? '✓ Verified' : 'Verify Project'}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>{proj.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>Topic: {proj.topic}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6, lineHeight: 1.4 }}>{proj.description}</p>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Tech Stack:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {proj.techStack.map(t => (
                        <span key={t} style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.62rem', color: 'var(--muted)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Members List */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Team:</span>
                    {proj.teamMembers.map((m, i) => (
                      <span key={i} title={m} style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(108,99,255,0.2)', color: '#6C63FF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
                        {m.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    ))}
                  </div>

                  {/* Status Dropdown selector */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted)', display: 'block' }}>Supervision Stage:</span>
                      <select
                        value={proj.status}
                        onChange={e => handleUpdateProjectStatus(proj.id, e.target.value as any)}
                        style={{ padding: '4px 6px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: '0.72rem', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="Ongoing">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {proj.githubLink && (
                        <a
                          href={proj.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.7rem', color: '#E2E8F0', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                          title="Source Code"
                        >
                          💻 Source Code
                        </a>
                      )}
                      {/* Live Demo — always shown, fallback to portfolio link */}
                      <a
                        href={proj.liveLink || DEFAULT_DEMO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '4px 12px',
                          background: 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.06) 100%)',
                          border: '1px solid rgba(34,211,238,0.4)',
                          borderRadius: 6, fontSize: '0.7rem', color: '#22D3EE',
                          fontWeight: 700, textDecoration: 'none',
                          display: 'flex', alignItems: 'center', gap: 4,
                          boxShadow: '0 0 6px rgba(34,211,238,0.1)',
                          transition: 'all 0.2s',
                        }}
                      >
                        🌐 Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Project allocation modal */}
            {showAddProjectModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <form onSubmit={handleAddProjectSubmit} className="glass-card" style={{ width: '100%', maxWidth: 520, padding: '1.5rem', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8 }}>Add Direct Supervision Project</h3>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Project Title *</label>
                    <input required type="text" placeholder="e.g. Smart library indexer" value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Topic Focal point</label>
                    <input type="text" placeholder="e.g. IoT analytics" value={newProject.topic} onChange={e => setNewProject(p => ({ ...p, topic: e.target.value }))} style={{ width: '100%', padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Team Members (comma-separated)</label>
                    <input type="text" placeholder="Joy kumar Yuv, Alex Carter" value={newProject.teamMembers} onChange={e => setNewProject(p => ({ ...p, teamMembers: e.target.value }))} style={{ width: '100%', padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Technologies (comma-separated)</label>
                    <input type="text" placeholder="React, Node.js, MQTT" value={newProject.techStack} onChange={e => setNewProject(p => ({ ...p, techStack: e.target.value }))} style={{ width: '100%', padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Detailed Description</label>
                    <textarea rows={3} placeholder="Brief summary..." value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} style={{ width: '100%', padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem', resize: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button type="button" onClick={() => setShowAddProjectModal(false)} style={{ padding: '0.45rem 1rem', background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '0.45rem 1rem', background: '#22D3EE', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Allocate Project</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ── 5. RESEARCH SUPERVISION TAB ────────────── */}
        {activeTab === 'research' && (
          <div className="fade-in">
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>🔬 Research Supervisor Verification Portal</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Monitor research abstracts, adjust manuscript stages, and suggest revision corrections</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {researchList.map(res => {
                const stages = ['Proposal', 'Supervisor Connected', 'In Progress', 'Under Review', 'Revision Required', 'Accepted', 'Published'];
                return (
                  <div
                    key={res.id}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      borderLeft: `4px solid ${res.workflowStage === 5 ? 'var(--success)' : '#A78BFA'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <span className="badge badge-primary" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', marginBottom: 4 }}>{res.researchArea}</span>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{res.title}</h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>Supervisor: <span style={{ color: 'var(--text)' }}>{res.supervisor || 'Tamanna Akter'}</span></p>
                      </div>
                      <span className={`badge badge-${res.workflowStage === 5 ? 'low' : res.workflowStage === 4 ? 'info' : 'medium'}`}>
                        {res.status}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', marginBottom: 2 }}>Abstract:</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.45, fontStyle: 'italic' }}>"{res.abstract}"</p>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--muted)' }}>
                      <div>
                        Co-Authors: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{res.coAuthors.join(', ')}</span>
                      </div>
                      <div>
                        Keywords: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{res.keywords.join(', ')}</span>
                      </div>
                      {res.journalConference && (
                        <div>
                          Venue: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{res.journalConference}</span>
                        </div>
                      )}
                    </div>

                    {/* Research Workflow Timeline Stages (0-5) */}
                    <div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Workflow Timeline:</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 14px', flexWrap: 'wrap', gap: 10 }}>
                        {stages.map((st, i) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateResearchStage(res.id, i)}
                            style={{
                              background: res.workflowStage === i ? '#A78BFA' : 'rgba(255,255,255,0.04)',
                              color: res.workflowStage === i ? '#fff' : 'var(--muted)',
                              border: 'none',
                              borderRadius: 6,
                              padding: '4px 10px',
                              fontSize: '0.68rem',
                              cursor: 'pointer',
                              fontWeight: 700,
                              transition: 'all 0.15s'
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Corrections Feedback */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        placeholder="Add manuscript correction comments or supervisor corrections..."
                        style={{ flex: 1, padding: '0.45rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem', outline: 'none' }}
                      />
                      <button style={{ padding: '0.45rem 1rem', background: 'rgba(167,139,250,0.18)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                        Suggest revision
                      </button>
                      <button onClick={() => handleUpdateResearchStage(res.id, 5)} style={{ padding: '0.45rem 1rem', background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                        Recommend Publication
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 6. LIBRARY ENGAGEMENT TAB ───────────────── */}
        {activeTab === 'library' && (
          <div className="fade-in">
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800 }}>📖 Library RFID Engagement Monitoring</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Track student RFID entry frequencies, borrowing patterns, and study habits</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {/* Daily study durations / frequency */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 12 }}>Study Duration Log (Joy kumar Yuv)</p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={LIBRARY_VISITS.slice(0, 10).reverse().map(v => ({ date: v.date.split('-')[2], min: v.duration }))}>
                    <defs>
                      <linearGradient id="libG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="min" stroke="#10B981" fill="url(#libG)" strokeWidth={2} name="Time Spent (Mins)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Book borrows lists & Reading consistency */}
              <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 10 }}>Active Book Borrows</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {ISSUED_BOOKS.slice(0, 3).map(book => (
                      <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: '0.74rem' }}>
                        <div>
                          <p style={{ fontWeight: 600 }}>📘 {book.title}</p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Due: {book.dueDate}</span>
                        </div>
                        <span className={`badge badge-${book.status === 'Overdue' ? 'high' : 'info'}`} style={{ fontSize: '0.65rem' }}>{book.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(34,211,238,0.06)', padding: '10px 12px', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10, marginTop: 12 }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', marginBottom: 2 }}>Weekly Reading Engagement Score</p>
                  <p style={{ fontSize: '0.78rem' }}><strong>High Engagement (82%)</strong>. Student frequently visits library study halls before algorithms exams.</p>
                </div>
              </div>
            </div>

            {/* Most active student check-in lists */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 10 }}>Most Active Student Library visitors (RFID Checked)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { name: 'Alex Carter', visits: 24, hours: '64.5', segment: 'High Engagement' },
                  { name: 'Joy kumar Yuv', visits: 20, hours: '52.0', segment: 'Consistent' },
                  { name: 'Mia Reynolds', visits: 8, hours: '12.4', segment: 'Needs Improvement' }
                ].map(stud => (
                  <div key={stud.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 10, fontSize: '0.78rem' }}>
                    <span style={{ fontWeight: 600 }}>👤 {stud.name}</span>
                    <span style={{ color: 'var(--muted)' }}>⏳ {stud.visits} Visits · {stud.hours} Total Hours</span>
                    <span className={`badge badge-${stud.segment === 'Needs Improvement' ? 'high' : 'low'}`} style={{ fontSize: '0.68rem' }}>{stud.segment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. STUDENT PROFILE SEARCH (LOOKUP) ──────── */}
        {activeTab === 'lookup' && (
          <div className="fade-in">
            <StudentLookup />
          </div>
        )}
      </main>
    </div>
  );
}
