'use client';
import { useState, useEffect } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';
import { supabase } from '@/lib/supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReqStatus = 'Pending' | 'Viewed' | 'Accepted' | 'Rejected' | 'Need More Info';
type SessionStatus = 'Upcoming' | 'Completed' | 'Missed' | 'Rescheduled' | 'Pending Approval';
type TaskStatus = 'Assigned' | 'In Progress' | 'Submitted' | 'Approved' | 'Needs Revision';
type SupervisorStatus = 'Pending' | 'Approved' | 'Rejected' | 'More Info Required';
type Availability = 'Available' | 'Busy' | 'Not Accepting';

interface MenteeRequest {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  semester: number;
  cgpa: number;
  weakAreas: string[];
  purpose: string;
  goal: string;
  meetingType: string;
  message: string;
  sentDate: string;
  status: ReqStatus;
  teacherNote?: string;
}

interface ActiveMentee {
  id: string;
  studentId: string;
  studentName: string;
  mentorType: string;
  since: string;
  totalSessions: number;
  totalHours: number;
  lastSession?: string;
  nextSession?: string;
  status: 'Active' | 'Paused' | 'Completed';
  cgpa: number;
  weakAreas: string[];
  skills: Record<string, number>;
  marks: number;
  attendance: number;
}

interface MSession {
  id: string;
  studentName: string;
  studentId: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: SessionStatus;
  topics: string[];
  mentorNotes?: string;
  link?: string;
}

interface MTask {
  id: string;
  studentName: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  subject: string;
  submittedNote?: string;
}

interface SupervisorReq {
  id: string;
  studentName: string;
  studentId: string;
  supervisorType: 'Project' | 'Research';
  projectTitle: string;
  reason: string;
  requestDate: string;
  status: SupervisorStatus;
}

interface Resource {
  id: string;
  title: string;
  type: 'Book' | 'Video' | 'Paper' | 'Template' | 'Notes' | 'Link';
  sharedWith: string;
  date: string;
  link?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: MenteeRequest[] = [
  {
    id: 'REQ-001', studentId: '261-16-010', studentName: 'Joy Kumar Yuv',
    course: 'CSE303', semester: 6, cgpa: 3.42,
    weakAreas: ['Database Systems', 'Data Structures'],
    purpose: 'Academic Improvement', goal: 'Improve DB grade to B+ by finals',
    meetingType: 'Weekly Mentoring',
    message: 'I am struggling with Database Systems, especially normalization and query optimization. I need structured guidance to improve before finals.',
    sentDate: 'May 20, 2026 · 10:30 AM', status: 'Accepted',
    teacherNote: 'Happy to help! Let\'s start with a diagnostic session this Sunday.',
  },
  {
    id: 'REQ-002', studentId: 'CS21046', studentName: 'Mia Reynolds',
    course: 'CSE301', semester: 4, cgpa: 2.85,
    weakAreas: ['Data Structures', 'Dynamic Programming'],
    purpose: 'Academic Improvement', goal: 'Pass Data Structures with C+ or above',
    meetingType: 'Quick Consultation',
    message: 'I have been missing many classes and falling behind on assignments. I need help with catching up and building a study plan.',
    sentDate: 'May 22, 2026 · 2:00 PM', status: 'Pending',
  },
  {
    id: 'REQ-003', studentId: 'CS21049', studentName: 'Liam Scott',
    course: 'CSE301', semester: 4, cgpa: 2.20,
    weakAreas: ['Data Structures', 'Algorithms', 'Attendance'],
    purpose: 'Emergency Academic Support', goal: 'Avoid academic probation this semester',
    meetingType: 'Weekly Mentoring',
    message: 'My CGPA has dropped significantly and I am at risk. I need serious mentoring support to get back on track.',
    sentDate: 'May 23, 2026 · 9:15 AM', status: 'Pending',
  },
];

const ACTIVE_MENTEES: ActiveMentee[] = [
  {
    id: 'M-001', studentId: '261-16-010', studentName: 'Joy Kumar Yuv',
    mentorType: 'Academic', since: 'May 21, 2026', totalSessions: 1, totalHours: 65,
    lastSession: 'May 25, 2026', nextSession: 'Jun 1, 2026',
    status: 'Active', cgpa: 3.42, weakAreas: ['Database Systems', 'Data Structures'],
    skills: { Communication: 52, Leadership: 48, Teamwork: 75, 'Problem Solving': 78 },
    marks: 58, attendance: 71,
  },
  {
    id: 'M-002', studentId: 'CS21050', studentName: 'Noah Wilson',
    mentorType: 'Research', since: 'Apr 10, 2026', totalSessions: 4, totalHours: 240,
    lastSession: 'May 18, 2026', nextSession: 'May 28, 2026',
    status: 'Active', cgpa: 3.65, weakAreas: ['Research Writing', 'Query Optimization'],
    skills: { Communication: 70, Leadership: 65, Teamwork: 80, 'Problem Solving': 85 },
    marks: 80, attendance: 88,
  },
];

const SESSIONS: MSession[] = [
  {
    id: 'SES-001', studentName: 'Joy Kumar Yuv', studentId: '261-16-010',
    title: 'Introductory Diagnostic Session', type: 'Academic Counselling',
    date: 'May 25, 2026', time: '3:00 PM', duration: '65 min',
    status: 'Completed', topics: ['SQL Joins', 'Normalization', 'Study Plan'],
    mentorNotes: 'Student has gaps in 3NF/BCNF. Strong in basic SELECT. Assigned practice set.',
    link: 'https://meet.google.com/ex1'
  },
  {
    id: 'SES-002', studentName: 'Joy Kumar Yuv', studentId: '261-16-010',
    title: 'Data Structures Follow-up', type: 'Academic Counselling',
    date: 'Jun 1, 2026', time: '3:00 PM', duration: '60 min',
    status: 'Upcoming', topics: ['Trees', 'Graphs', 'Dynamic Programming'],
    link: 'https://meet.google.com/ex2'
  },
  {
    id: 'SES-003', studentName: 'Noah Wilson', studentId: 'CS21050',
    title: 'Research Methodology Review', type: 'Research Guidance',
    date: 'May 28, 2026', time: '10:00 AM', duration: '60 min',
    status: 'Pending Approval', topics: ['Literature Review', 'Research Questions'],
  },
];

const TASKS: MTask[] = [
  { id: 'TSK-001', studentName: 'Joy Kumar Yuv', title: 'SQL Normalization Practice Set', description: 'Solve 20 normalization problems (1NF–BCNF). Submit by deadline.', deadline: 'May 31, 2026', status: 'In Progress', subject: 'Database Systems' },
  { id: 'TSK-002', studentName: 'Joy Kumar Yuv', title: 'Build Mini Student DB Schema', description: 'Design a normalized DB schema for a university system. Include ER diagram.', deadline: 'Jun 5, 2026', status: 'Assigned', subject: 'Database Systems' },
  { id: 'TSK-003', studentName: 'Noah Wilson', title: 'Literature Review Draft', description: 'Submit first draft of literature review covering at least 10 papers.', deadline: 'May 30, 2026', status: 'Submitted', subject: 'Research', submittedNote: 'Submitted 8 papers reviewed. Added brief synthesis section.' },
];

const SUPERVISOR_REQS: SupervisorReq[] = [
  { id: 'SUP-001', studentName: 'Noah Wilson', studentId: 'CS21050', supervisorType: 'Research', projectTitle: 'Efficient Query Processing in Distributed Databases', reason: 'Ongoing research mentorship — need formal supervision for thesis submission.', requestDate: 'May 22, 2026', status: 'Pending' },
];

const RESOURCES_SHARED: Resource[] = [
  { id: 'R-001', title: 'Database System Concepts – Silberschatz', type: 'Book', sharedWith: 'Joy Kumar Yuv', date: 'May 25, 2026' },
  { id: 'R-002', title: 'CMU DB Systems Lectures', type: 'Video', sharedWith: 'Joy Kumar Yuv', date: 'May 25, 2026', link: 'https://youtube.com/example' },
  { id: 'R-003', title: 'Research Paper Writing Guide', type: 'Notes', sharedWith: 'Noah Wilson', date: 'May 18, 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  Pending: '#F59E0B', Viewed: '#22D3EE', Accepted: '#10B981', Rejected: '#F43F5E',
  'Need More Info': '#A78BFA', Upcoming: '#6C63FF', Completed: '#10B981',
  Missed: '#F43F5E', Rescheduled: '#F59E0B', 'Pending Approval': '#F59E0B',
  Assigned: '#6C63FF', 'In Progress': '#22D3EE', Submitted: '#F59E0B',
  Approved: '#10B981', 'Needs Revision': '#F43F5E', 'More Info Required': '#A78BFA',
  Active: '#10B981', Paused: '#F59E0B',
};

const statusIcon: Record<string, string> = {
  Pending: '⏳', Viewed: '👁️', Accepted: '✅', Rejected: '❌',
  'Need More Info': '💬', Upcoming: '📅', Completed: '✅',
  Missed: '❌', Rescheduled: '🔄', 'Pending Approval': '⏳',
  Assigned: '📋', 'In Progress': '🔄', Submitted: '📨', Approved: '✅',
  'Needs Revision': '✏️', 'More Info Required': '💬', Active: '🟢', Paused: '⏸️',
};

const resIcon: Record<string, string> = { Book: '📗', Video: '▶️', Paper: '📄', Template: '📋', Notes: '📝', Link: '🔗' };

function StatusBadge({ status }: { status: string }) {
  const c = statusColor[status] ?? '#94A3B8';
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${c}22`, color: c, border: `1px solid ${c}55`, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
      {statusIcon[status] ?? '•'} {status}
    </span>
  );
}

function TabButton({ label, active, onClick, badge }: { label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 10,
      border: active ? '1px solid rgba(34,211,238,0.5)' : '1px solid transparent',
      background: active ? 'rgba(34,211,238,0.15)' : 'transparent',
      color: active ? '#fff' : 'var(--muted)', fontWeight: active ? 700 : 500,
      fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
      position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6
    }}>
      {label}
      {badge != null && badge > 0 && (
        <span style={{ background: '#F43F5E', color: '#fff', borderRadius: 999, fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</span>
      )}
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--muted)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.875rem', outline: 'none', marginTop: 4 };
const lbl: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 2, marginTop: 14 };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorshipPage() {
  const teacher = teacherData.profile;
  const TABS = ['📊 Dashboard', '📥 Inbox', '👥 Mentees', '📅 Sessions', '✅ Tasks', '📚 Resources', '🏅 Supervisor', '⚙️ Settings'];

  const [activeTab, setActiveTab] = useState(0);
  const [requests, setRequests] = useState<MenteeRequest[]>(INITIAL_REQUESTS);
  const [sessions, setSessions] = useState<MSession[]>(SESSIONS);
  const [tasks, setTasks] = useState<MTask[]>(TASKS);
  const [supervisorReqs, setSupervisorReqs] = useState<SupervisorReq[]>(SUPERVISOR_REQS);
  const [resources] = useState<Resource[]>(RESOURCES_SHARED);

  // Availability settings
  const [availability, setAvailability] = useState<Availability>('Available');
  const [maxMentees, setMaxMentees] = useState(5);
  const [officeHours, setOfficeHours] = useState('Sun, Tue, Thu · 2:00 PM – 5:00 PM');

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<MenteeRequest | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<ActiveMentee | null>(null);

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MSession | null>(null);
  const [sessionNote, setSessionNote] = useState('');

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskStudent, setTaskStudent] = useState(ACTIVE_MENTEES[0]?.studentName ?? '');
  const [taskSubject, setTaskSubject] = useState('');

  const [showShareResourceModal, setShowShareResourceModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  
  useEffect(() => {
    const teacherId = teacher.id || 'TCH-006'; // Fallback to TCH-006 to match student portal

    async function fetchData() {
      // Fetch Requests
      const { data: reqs } = await supabase.from('mentor_requests').select('*').eq('mentor_id', teacherId).order('created_at', { ascending: false });
      if (reqs && reqs.length > 0) {
        setRequests(reqs.map((r: any) => ({
          id: r.id, studentId: r.student_id, studentName: r.student_name, course: r.course || '', semester: r.semester || 1,
          cgpa: r.cgpa || 3.0, weakAreas: r.weak_areas || [], purpose: r.purpose, goal: r.goal, meetingType: r.meeting_type,
          message: r.message, sentDate: new Date(r.created_at).toLocaleString(), status: r.status, teacherNote: r.teacher_note
        })));
      }

      // Fetch Sessions
      const { data: sess } = await supabase.from('mentor_sessions').select('*').eq('mentor_id', teacherId).order('session_date', { ascending: true });
      if (sess && sess.length > 0) {
        setSessions(sess.map((s: any) => ({
          id: s.id, studentName: s.student_name, studentId: s.student_id, title: s.title, type: s.type, date: s.session_date,
          time: s.session_time, duration: s.duration, status: s.status, topics: s.topics, mentorNotes: s.mentor_notes, link: s.meeting_link
        })));
      }

      // Fetch Tasks
      const { data: tsks } = await supabase.from('mentor_tasks').select('*').eq('mentor_id', teacherId);
      if (tsks && tsks.length > 0) {
        setTasks(tsks.map((t: any) => ({
          id: t.id, studentName: t.student_name, title: t.title, description: t.description, deadline: t.deadline,
          status: t.status, subject: t.subject, submittedNote: t.submitted_note
        })));
      }
    }

    fetchData();

    const channel = supabase.channel('teacher_mentorship_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_requests', filter: `mentor_id=eq.${teacherId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_sessions', filter: `mentor_id=eq.${teacherId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_tasks', filter: `mentor_id=eq.${teacherId}` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const supervisorPendingCount = supervisorReqs.filter(r => r.status === 'Pending').length;
  const submittedTaskCount = tasks.filter(t => t.status === 'Submitted').length;
  const totalHours = ACTIVE_MENTEES.reduce((a, m) => a + Math.floor(m.totalHours / 60), 0);

  async function updateReqStatus(id: string, status: ReqStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, teacherNote: responseNote || r.teacherNote } : r));
    setShowRequestModal(false);
    await supabase.from('mentor_requests').update({ status, teacher_note: responseNote }).eq('id', id);
    setResponseNote('');
  }

  async function updateSessionStatus(id: string, status: SessionStatus, notes?: string) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status, mentorNotes: notes || s.mentorNotes } : s));
    setShowSessionModal(false);
    await supabase.from('mentor_sessions').update({ status, mentor_notes: notes }).eq('id', id);
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await supabase.from('mentor_tasks').update({ status }).eq('id', id);
  }

  function updateSupervisorStatus(id: string, status: SupervisorStatus) {
    setSupervisorReqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function addTask() {
    if (!taskTitle) return;
    const newTask = { id: `TSK-${Date.now()}`, studentName: taskStudent, title: taskTitle, description: taskDesc, deadline: taskDeadline, status: 'Assigned' as TaskStatus, subject: taskSubject };
    setTasks(prev => [...prev, newTask]);
    setTaskTitle(''); setTaskDesc(''); setTaskDeadline(''); setTaskSubject('');
    setShowAddTaskModal(false);
    await supabase.from('mentor_tasks').insert({
      mentor_id: teacher.id || 'TCH-002', student_id: taskStudent, student_name: taskStudent,
      title: taskTitle, description: taskDesc, subject: taskSubject, deadline: taskDeadline, status: 'Assigned'
    });
  }

  const availColor = availability === 'Available' ? '#10B981' : availability === 'Busy' ? '#F59E0B' : '#F43F5E';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Mentorship Management" subtitle="Full mentorship journey control — requests, sessions, tasks & supervision" accentColor="#22D3EE" />

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', overflowX: 'auto', padding: '4px 0', flexWrap: 'nowrap' }}>
          <TabButton label="📊 Dashboard" active={activeTab === 0} onClick={() => setActiveTab(0)} />
          <TabButton label="📥 Inbox" active={activeTab === 1} onClick={() => setActiveTab(1)} badge={pendingCount} />
          <TabButton label="👥 Mentees" active={activeTab === 2} onClick={() => setActiveTab(2)} />
          <TabButton label="📅 Sessions" active={activeTab === 3} onClick={() => setActiveTab(3)} />
          <TabButton label="✅ Tasks" active={activeTab === 4} onClick={() => setActiveTab(4)} badge={submittedTaskCount} />
          <TabButton label="📚 Resources" active={activeTab === 5} onClick={() => setActiveTab(5)} />
          <TabButton label="🏅 Supervisor" active={activeTab === 6} onClick={() => setActiveTab(6)} badge={supervisorPendingCount} />
          <TabButton label="⚙️ Settings" active={activeTab === 7} onClick={() => setActiveTab(7)} />
        </div>

        {/* ═══ TAB 0: DASHBOARD ═══ */}
        {activeTab === 0 && (
          <div>
            {/* Teacher Info Banner */}
            <div style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(108,99,255,0.08))', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #22D3EE, #6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                {teacher.avatar ? <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : teacher.name.split(' ').filter((_: string, i: number) => i > 0).map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 2 }}>{teacher.name}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{teacher.designation} · {teacher.department}</p>
              </div>
              <div style={{ padding: '6px 14px', background: `${availColor}22`, border: `1px solid ${availColor}55`, borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: availColor, display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: availColor }}>{availability}</span>
              </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Pending Requests', value: pendingCount, icon: '📥', color: '#F59E0B', tab: 1 },
                { label: 'Active Mentees', value: ACTIVE_MENTEES.length, icon: '👥', color: '#10B981', tab: 2 },
                { label: 'Upcoming Sessions', value: sessions.filter(s => s.status === 'Upcoming' || s.status === 'Pending Approval').length, icon: '📅', color: '#6C63FF', tab: 3 },
                { label: 'Counselling Hours', value: `${totalHours}h`, icon: '⏱️', color: '#22D3EE', tab: 3 },
                { label: 'Tasks Pending Review', value: submittedTaskCount, icon: '✅', color: '#F59E0B', tab: 4 },
                { label: 'Supervisor Requests', value: supervisorPendingCount, icon: '🏅', color: '#A78BFA', tab: 6 },
              ].map(s => (
                <button key={s.label} onClick={() => setActiveTab(s.tab)} className="glass-card" style={{ padding: '1.125rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'var(--glass)', borderRadius: 16, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${s.color}22`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                  <p style={{ fontSize: '1.4rem', marginBottom: 4 }}>{s.icon}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{s.label}</p>
                </button>
              ))}
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Recent Requests */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>📥 Recent Requests</h3>
                {requests.slice(0, 3).map(r => (
                  <div key={r.id} onClick={() => { setSelectedReq(r); setShowRequestModal(true); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 1 }}>{r.studentName}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{r.purpose}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>

              {/* Upcoming Sessions */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>📅 Upcoming Sessions</h3>
                {sessions.filter(s => s.status === 'Upcoming' || s.status === 'Pending Approval').map(s => (
                  <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.studentName}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.date} · {s.time} · {s.type}</p>
                  </div>
                ))}
                {sessions.filter(s => s.status === 'Upcoming' || s.status === 'Pending Approval').length === 0 && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', textAlign: 'center', padding: '1rem 0' }}>No upcoming sessions</p>
                )}
              </div>
            </div>

            {/* AI Notifications */}
            <div style={{ marginTop: '1.25rem', padding: '1.125rem 1.25rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 14 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>🔔 Notifications</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { msg: `${pendingCount} new mentorship request(s) awaiting your response`, color: '#F59E0B' },
                  { msg: 'Joy Kumar Yuv: Follow-up task deadline is May 31', color: '#22D3EE' },
                  { msg: 'Noah Wilson submitted Literature Review — awaiting your review', color: '#F59E0B' },
                  { msg: `${supervisorPendingCount} supervisor conversion request pending approval`, color: '#A78BFA' },
                ].map((n, i) => (
                  <p key={i} style={{ fontSize: '0.82rem', color: n.color, padding: '6px 10px', background: `${n.color}11`, borderRadius: 8, borderLeft: `3px solid ${n.color}` }}>{n.msg}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 1: INBOX ═══ */}
        {activeTab === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Mentorship Request Inbox</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{requests.length} total · {pendingCount} pending action</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map(req => (
                <div key={req.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${statusColor[req.status] ?? '#6C63FF'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>
                          {req.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{req.studentName}</h3>
                          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{req.studentId} · Semester {req.semester} · CGPA {req.cgpa}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '0.875rem' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Purpose</p>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{req.purpose}</p>
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Meeting Type</p>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{req.meetingType}</p>
                    </div>
                  </div>

                  <div style={{ padding: '8px 12px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 8, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 2 }}>Weak Areas</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {req.weakAreas.map(w => <span key={w} style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(244,63,94,0.12)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6 }}>{w}</span>)}
                    </div>
                  </div>

                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Student Message</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>"{req.message}"</p>
                  </div>

                  {req.teacherNote && (
                    <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: '0.875rem' }}>
                      <p style={{ fontSize: '0.65rem', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 2 }}>Your Response</p>
                      <p style={{ fontSize: '0.82rem' }}>"{req.teacherNote}"</p>
                    </div>
                  )}

                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.875rem' }}>📅 Sent: {req.sentDate} · ID: {req.id}</p>

                  {req.status === 'Pending' || req.status === 'Viewed' ? (
                    <button onClick={() => { setSelectedReq(req); setResponseNote(''); setShowRequestModal(true); }} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #22D3EE, #6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                      📋 Review & Respond
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Responded on {req.sentDate}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 2: MENTEES ═══ */}
        {activeTab === 2 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Active Mentees</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{ACTIVE_MENTEES.length} active mentee(s) under your mentorship</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {ACTIVE_MENTEES.map(m => (
                <div key={m.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>
                      {m.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 1 }}>{m.studentName}</h3>
                          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{m.studentId}</p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '0.875rem' }}>
                    {[
                      { label: 'Mentor Type', value: m.mentorType },
                      { label: 'Since', value: m.since },
                      { label: 'Sessions', value: `${m.totalSessions} done` },
                      { label: 'Hours', value: `${m.totalHours} min` },
                      { label: 'CGPA', value: m.cgpa },
                      { label: 'Marks', value: `${m.marks}%` },
                    ].map(f => (
                      <div key={f.label} style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 1 }}>{f.label}</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 4 }}>Weak Areas</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.weakAreas.map(w => <span key={w} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(244,63,94,0.1)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 6 }}>{w}</span>)}
                    </div>
                  </div>

                  {/* Skill bars */}
                  <div style={{ marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 6 }}>Skill Radar</p>
                    {Object.entries(m.skills).map(([skill, val]) => (
                      <div key={skill} style={{ marginBottom: 5 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{skill}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: val < 55 ? '#F43F5E' : val < 70 ? '#F59E0B' : '#10B981' }}>{val}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                          <div style={{ height: '100%', width: `${val}%`, background: val < 55 ? '#F43F5E' : val < 70 ? '#F59E0B' : '#10B981', borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setSelectedMentee(m); setShowStudentProfile(true); }} style={{ flex: 1, padding: '8px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 10, color: '#22D3EE', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                      👤 View Profile
                    </button>
                    <button onClick={() => { setShowAddTaskModal(true); setTaskStudent(m.studentName); }} style={{ flex: 1, padding: '8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                      + Assign Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 3: SESSIONS ═══ */}
        {activeTab === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Counselling Sessions</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{sessions.filter(s => s.status === 'Completed').length} completed · {sessions.filter(s => s.status === 'Upcoming' || s.status === 'Pending Approval').length} upcoming</p>
              </div>
              <button onClick={() => setShowScheduleModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                + Schedule Session
              </button>
            </div>

            {/* Hour tracking */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Sessions', value: sessions.filter(s => s.status === 'Completed').length, color: '#10B981' },
                { label: 'Total Min', value: `${ACTIVE_MENTEES.reduce((a, m) => a + m.totalHours, 0)}`, color: '#6C63FF' },
                { label: 'Pending Review', value: sessions.filter(s => s.status === 'Pending Approval').length, color: '#F59E0B' },
                { label: 'Missed', value: sessions.filter(s => s.status === 'Missed').length, color: '#F43F5E' },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map(s => (
                <div key={s.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${statusColor[s.status] ?? '#6C63FF'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 2 }}>{s.title}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.studentName} · {s.date} · {s.time} · {s.duration}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.875rem' }}>
                    {s.topics.map(t => <span key={t} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 6, color: 'var(--primary)' }}>{t}</span>)}
                  </div>

                  {s.mentorNotes && (
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: '0.875rem' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Your Notes</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>{s.mentorNotes}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {s.status === 'Pending Approval' && (
                      <>
                        <button onClick={() => updateSessionStatus(s.id, 'Upcoming')} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✅ Accept</button>
                        <button onClick={() => updateSessionStatus(s.id, 'Rescheduled')} style={{ padding: '6px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>🔄 Reschedule</button>
                      </>
                    )}
                    {s.status === 'Upcoming' && (
                      <>
                        <button onClick={() => { setSelectedSession(s); setSessionNote(''); setShowSessionModal(true); }} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✅ Mark Completed</button>
                        <button onClick={() => updateSessionStatus(s.id, 'Missed')} style={{ padding: '6px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: '#F43F5E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>❌ Mark Missed</button>
                        {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, color: '#22D3EE', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>🔗 Meeting Link</a>}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 4: TASKS ═══ */}
        {activeTab === 4 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Follow-up Tasks</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{tasks.length} tasks assigned · {submittedTaskCount} awaiting review</p>
              </div>
              <button onClick={() => setShowAddTaskModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>+ Assign Task</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${statusColor[task.status] ?? '#6C63FF'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 2 }}>{task.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>To: {task.studentName} · {task.subject} · Due: {task.deadline}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{task.description}</p>

                  {task.submittedNote && (
                    <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, marginBottom: '0.875rem' }}>
                      <p style={{ fontSize: '0.65rem', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 2 }}>📨 Student Submission</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>{task.submittedNote}</p>
                    </div>
                  )}

                  {task.status === 'Submitted' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => updateTaskStatus(task.id, 'Approved')} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✅ Approve</button>
                      <button onClick={() => updateTaskStatus(task.id, 'Needs Revision')} style={{ padding: '6px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: '#F43F5E', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✏️ Request Revision</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 5: RESOURCES ═══ */}
        {activeTab === 5 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Shared Resources</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{resources.length} resources shared with mentees</p>
              </div>
              <button onClick={() => setShowShareResourceModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>+ Share Resource</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {resources.map(r => (
                <div key={r.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{resIcon[r.type] ?? '📄'}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 6, color: '#22D3EE' }}>{r.type}</span>
                  </div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 4 }}>{r.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4 }}>Shared with: <strong style={{ color: 'var(--text)' }}>{r.sharedWith}</strong></p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: r.link ? '0.875rem' : 0 }}>📅 {r.date}</p>
                  {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '5px 12px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, color: '#22D3EE', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}>🔗 Open</a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB 6: SUPERVISOR ═══ */}
        {activeTab === 6 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Supervisor Conversion Requests</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Students requesting you as their official project or research supervisor</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {supervisorReqs.map(req => (
                <div key={req.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `3px solid ${statusColor[req.status] ?? '#A78BFA'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{req.studentName}</h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: req.supervisorType === 'Research' ? 'rgba(108,99,255,0.2)' : 'rgba(245,158,11,0.2)', color: req.supervisorType === 'Research' ? '#A78BFA' : '#F59E0B', border: `1px solid ${req.supervisorType === 'Research' ? 'rgba(108,99,255,0.4)' : 'rgba(245,158,11,0.4)'}` }}>
                          {req.supervisorType === 'Research' ? '🔬' : '💻'} {req.supervisorType} Supervisor
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{req.studentId} · Requested {req.requestDate}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Project / Research Title</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{req.projectTitle}</p>
                  </div>

                  <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Reason</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{req.reason}</p>
                  </div>

                  {req.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => updateSupervisorStatus(req.id, 'Approved')} style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#10B981,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>🏅 Approve as {req.supervisorType} Supervisor</button>
                      <button onClick={() => updateSupervisorStatus(req.id, 'More Info Required')} style={{ padding: '8px 14px', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 10, color: '#A78BFA', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>💬 Ask for More Info</button>
                      <button onClick={() => updateSupervisorStatus(req.id, 'Rejected')} style={{ padding: '8px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 10, color: '#F43F5E', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>❌ Reject</button>
                    </div>
                  )}

                  {req.status === 'Approved' && (
                    <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.5rem' }}>🏅</span>
                      <div>
                        <p style={{ fontWeight: 800, color: '#10B981', fontSize: '0.88rem' }}>Approved! You are now {req.studentName}'s verified {req.supervisorType} Supervisor</p>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Student's project/research now shows your Verified Supervisor badge</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {supervisorReqs.length === 0 && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', marginBottom: 8 }}>🏅</p>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>No supervisor requests yet</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Students can request supervisor conversion from their mentorship portal</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB 7: SETTINGS ═══ */}
        {activeTab === 7 && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Mentor Availability Settings</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Control your availability, capacity and expertise areas</p>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>🟢 Availability Status</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['Available', 'Busy', 'Not Accepting'] as Availability[]).map(opt => (
                  <button key={opt} onClick={() => setAvailability(opt)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: availability === opt ? `2px solid ${opt === 'Available' ? '#10B981' : opt === 'Busy' ? '#F59E0B' : '#F43F5E'}` : '1px solid var(--border)', background: availability === opt ? (opt === 'Available' ? 'rgba(16,185,129,0.15)' : opt === 'Busy' ? 'rgba(245,158,11,0.15)' : 'rgba(244,63,94,0.15)') : 'rgba(255,255,255,0.04)', color: availability === opt ? (opt === 'Available' ? '#10B981' : opt === 'Busy' ? '#F59E0B' : '#F43F5E') : 'var(--muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>⚙️ Capacity & Schedule</h3>
              <label style={lbl}>Max Mentee Limit</label>
              <input type="number" value={maxMentees} onChange={e => setMaxMentees(parseInt(e.target.value) || 5)} style={inp} />
              <label style={lbl}>Office Hours</label>
              <input value={officeHours} onChange={e => setOfficeHours(e.target.value)} style={inp} />
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>🎯 Expertise Areas</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {teacher.expertise.map((e: string) => <span key={e} style={{ padding: '4px 12px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 999, fontSize: '0.78rem', color: '#22D3EE', fontWeight: 600 }}>{e}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {teacher.mentorshipAreas.map((a: string) => <span key={a} style={{ padding: '4px 12px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 999, fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>{a}</span>)}
              </div>
            </div>

            <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              💾 Save Settings
            </button>
          </div>
        )}

      </main>

      {/* ═══════ MODALS ═══════ */}

      {/* Request Review Modal */}
      {showRequestModal && selectedReq && (
        <Modal title={`📋 Review Request — ${selectedReq.studentName}`} onClose={() => setShowRequestModal(false)}>
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 2 }}>Student Goal</p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{selectedReq.goal}</p>
          </div>
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4 }}>Weak Areas</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedReq.weakAreas.map(w => <span key={w} style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(244,63,94,0.12)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 6 }}>{w}</span>)}
            </div>
          </div>
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 2 }}>Message</p>
            <p style={{ fontSize: '0.83rem', color: 'var(--muted)', fontStyle: 'italic' }}>"{selectedReq.message}"</p>
          </div>
          <label style={lbl}>Your Response Note (visible to student)</label>
          <textarea value={responseNote} onChange={e => setResponseNote(e.target.value)} placeholder="Write a brief note to the student..." rows={3} style={{ ...inp, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => updateReqStatus(selectedReq.id, 'Accepted')} style={{ flex: 1, padding: '10px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, color: '#10B981', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>✅ Accept</button>
            <button onClick={() => updateReqStatus(selectedReq.id, 'Need More Info')} style={{ flex: 1, padding: '10px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.35)', borderRadius: 10, color: '#A78BFA', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>💬 Ask More</button>
            <button onClick={() => updateReqStatus(selectedReq.id, 'Rejected')} style={{ flex: 1, padding: '10px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.35)', borderRadius: 10, color: '#F43F5E', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>❌ Reject</button>
          </div>
        </Modal>
      )}

      {/* Student Profile Modal */}
      {showStudentProfile && selectedMentee && (
        <Modal title={`👤 ${selectedMentee.studentName} — Mentee Profile`} onClose={() => setShowStudentProfile(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
            {[
              { label: 'Student ID', value: selectedMentee.studentId },
              { label: 'CGPA', value: selectedMentee.cgpa },
              { label: 'Marks', value: `${selectedMentee.marks}%` },
              { label: 'Attendance', value: `${selectedMentee.attendance}%` },
            ].map(f => (
              <div key={f.label} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2 }}>{f.label}</p>
                <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>{f.value}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 6 }}>Weak Areas</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedMentee.weakAreas.map(w => <span key={w} style={{ fontSize: '0.75rem', padding: '3px 10px', background: 'rgba(244,63,94,0.1)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 999 }}>{w}</span>)}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 8 }}>Skill Radar</p>
            {Object.entries(selectedMentee.skills).map(([skill, val]) => (
              <div key={skill} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: '0.78rem' }}>{skill}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: val < 55 ? '#F43F5E' : val < 70 ? '#F59E0B' : '#10B981' }}>{val}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${val}%`, background: val < 55 ? '#F43F5E' : val < 70 ? '#F59E0B' : '#10B981', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Mark Session Completed Modal */}
      {showSessionModal && selectedSession && (
        <Modal title={`✅ Complete Session — ${selectedSession.studentName}`} onClose={() => setShowSessionModal(false)}>
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700 }}>{selectedSession.title}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{selectedSession.date} · {selectedSession.time} · {selectedSession.duration}</p>
          </div>
          <label style={lbl}>Session Notes (visible to student)</label>
          <textarea value={sessionNote} onChange={e => setSessionNote(e.target.value)} placeholder="Add notes about this session, topics covered, and observations..." rows={4} style={{ ...inp, resize: 'vertical' }} />
          <button onClick={() => updateSessionStatus(selectedSession.id, 'Completed', sessionNote)} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#10B981,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '1rem' }}>
            ✅ Mark as Completed
          </button>
        </Modal>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <Modal title="📋 Assign Follow-up Task" onClose={() => setShowAddTaskModal(false)}>
          <label style={lbl}>Assign To</label>
          <select value={taskStudent} onChange={e => setTaskStudent(e.target.value)} style={{ ...inp, appearance: 'none' }}>
            {ACTIVE_MENTEES.map(m => <option key={m.id} value={m.studentName}>{m.studentName}</option>)}
          </select>
          <label style={lbl}>Task Title</label>
          <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Complete SQL Practice Set" style={inp} />
          <label style={lbl}>Subject / Skill Area</label>
          <input value={taskSubject} onChange={e => setTaskSubject(e.target.value)} placeholder="e.g. Database Systems" style={inp} />
          <label style={lbl}>Description</label>
          <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Describe what the student should do..." rows={3} style={{ ...inp, resize: 'vertical' }} />
          <label style={lbl}>Deadline</label>
          <input type="date" value={taskDeadline} onChange={e => setTaskDeadline(e.target.value)} style={inp} />
          <button onClick={addTask} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '1rem' }}>
            📋 Assign Task
          </button>
        </Modal>
      )}

      {/* Share Resource Modal */}
      {showShareResourceModal && (
        <Modal title="📚 Share Resource" onClose={() => setShowShareResourceModal(false)}>
          <label style={lbl}>Share With</label>
          <select style={{ ...inp, appearance: 'none' }}>
            {ACTIVE_MENTEES.map(m => <option key={m.id}>{m.studentName}</option>)}
          </select>
          <label style={lbl}>Resource Type</label>
          <select style={{ ...inp, appearance: 'none' }}>
            {['Book', 'Video', 'Paper', 'Template', 'Notes', 'Link'].map(t => <option key={t}>{t}</option>)}
          </select>
          <label style={lbl}>Title</label>
          <input placeholder="Resource title..." style={inp} />
          <label style={lbl}>Description</label>
          <textarea placeholder="Brief description of the resource..." rows={2} style={{ ...inp, resize: 'vertical' }} />
          <label style={lbl}>Link (optional)</label>
          <input placeholder="https://..." style={inp} />
          <button onClick={() => setShowShareResourceModal(false)} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '1rem' }}>
            📤 Share Resource
          </button>
        </Modal>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <Modal title="📅 Schedule Session" onClose={() => setShowScheduleModal(false)}>
          <label style={lbl}>Mentee</label>
          <select style={{ ...inp, appearance: 'none' }}>
            {ACTIVE_MENTEES.map(m => <option key={m.id}>{m.studentName}</option>)}
          </select>
          <label style={lbl}>Session Type</label>
          <select style={{ ...inp, appearance: 'none' }}>
            {['Academic Counselling', 'Project Guidance', 'Research Guidance', 'Career Guidance', 'Skill Improvement', 'Emergency Support'].map(t => <option key={t}>{t}</option>)}
          </select>
          <label style={lbl}>Date</label>
          <input type="date" style={inp} />
          <label style={lbl}>Time</label>
          <input type="time" style={inp} />
          <label style={lbl}>Duration (minutes)</label>
          <input type="number" placeholder="60" style={inp} />
          <label style={lbl}>Meeting Link / Location</label>
          <input placeholder="https://meet.google.com/... or Room 302" style={inp} />
          <button onClick={() => setShowScheduleModal(false)} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#22D3EE,#6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: '1rem' }}>
            📅 Schedule Session
          </button>
        </Modal>
      )}

    </div>
  );
}
