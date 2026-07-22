'use client';
import { useState, useEffect } from 'react';
import { 
  Bot, CheckCircle, AlertTriangle, Star, GraduationCap, Calendar, 
  Clock, Mail, MessageSquare, Map, RefreshCw, BarChart2, CalendarPlus,
  BookOpen, Video, FileText, Link as LinkIcon, Download, Check, Laptop
} from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import studentData from '@/data/student.json';
import { supabase } from '@/lib/supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

type MentorType = 'Academic' | 'Research' | 'Project' | 'Career' | 'Club';
type RequestStatus = 'Pending' | 'Viewed' | 'Accepted' | 'Rejected' | 'Need More Info';
type StepStatus = 'completed' | 'active' | 'pending' | 'rejected';
type SessionStatus = 'Completed' | 'Upcoming' | 'Missed' | 'Rescheduled';
type TaskStatus = 'Not Started' | 'In Progress' | 'Done' | 'Needs Review';
type ResourceType = 'Book' | 'Video' | 'Paper' | 'Link' | 'Template' | 'Notes';
type SupervisorStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

interface Mentor {
  id: string;
  name: string;
  department: string;
  expertise: string[];
  rating: number;
  availability: string;
  matchScore: number;
  matchReason: string;
  mentorType: MentorType;
  sessions: number;
  students: number;
  initials: string;
  color: string;
  avatar?: string;
}

interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorType: MentorType;
  purpose: string;
  goal: string;
  meetingType: string;
  message: string;
  sentDate: string;
  status: RequestStatus;
  statusDate: string;
  mentorNote?: string;
}

interface TrackingStep {
  step: number;
  title: string;
  description: string;
  status: StepStatus;
  date?: string;
  action?: string;
  detail?: string;
}

interface Session {
  id: string;
  title: string;
  mentorName: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: SessionStatus;
  topics: string[];
  mentorNotes?: string;
  studentNotes?: string;
  followUp?: string;
  link?: string;
}

interface Task {
  id: string;
  title: string;
  assignedBy: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  progress: number;
  proof?: string;
  mentorFeedback?: string;
}

interface Resource {
  id: string;
  title: string;
  sharedBy: string;
  type: ResourceType;
  description: string;
  link?: string;
  saved: boolean;
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MENTORS: Mentor[] = [
  {
    id: 'TCH-002', name: 'Mr. Md. Sarwar Hossain Mollah', department: 'CIS',
    expertise: ['Database Systems', 'Algorithms', 'Data Mining'],
    rating: 4.8, availability: 'Sun, Tue, Thu 2–5 PM', matchScore: 94,
    matchReason: 'Directly covers your weak areas in Database Systems (48%) and Data Structures (55%). Has mentored 23 students with similar profiles.',
    mentorType: 'Academic', sessions: 23, students: 41,
    initials: 'SM', color: 'linear-gradient(135deg, #10B981, #22D3EE)', avatar: '/images/teachers/sarwar.png'
  },
  {
    id: 'TCH-004', name: 'Mohammad Azam Khan', department: 'CIS',
    expertise: ['Machine Learning', 'Research Methods', 'Python'],
    rating: 4.6, availability: 'Mon, Wed 10 AM–1 PM', matchScore: 81,
    matchReason: 'Excellent research mentor. Matches your interest in AI/ML based on Skill Radar data and Programming Club involvement.',
    mentorType: 'Research', sessions: 18, students: 29,
    initials: 'AK', color: 'linear-gradient(135deg, #6C63FF, #A78BFA)', avatar: '/images/teachers/azam.png'
  },
  {
    id: 'TCH-003', name: 'Mr. Md. Nasimul Kader', department: 'CIS',
    expertise: ['Software Engineering', 'Project Management', 'Agile'],
    rating: 4.7, availability: 'Sat, Mon 3–6 PM', matchScore: 76,
    matchReason: 'Ideal for project supervision. Your Software Engineering score (82%) shows strength. Can guide capstone project development.',
    mentorType: 'Project', sessions: 31, students: 55,
    initials: 'NK', color: 'linear-gradient(135deg, #F59E0B, #EF4444)', avatar: '/images/teachers/nasimul.png'
  },
  {
    id: 'TCH-006', name: 'Tamanna Akter', department: 'CIS',
    expertise: ['Career Development', 'Industry Networking', 'LinkedIn Branding'],
    rating: 4.4, availability: 'Wed, Fri 11 AM–2 PM', matchScore: 68,
    matchReason: 'Career mentor. Based on your 6th semester status and skill gaps in Leadership (48%), career guidance will accelerate placement readiness.',
    mentorType: 'Career', sessions: 14, students: 38,
    initials: 'TA', color: 'linear-gradient(135deg, #22D3EE, #0891B2)', avatar: '/images/teachers/tamanna.png'
  },
];

const REQUESTS: MentorRequest[] = [
  {
    id: 'REQ-001', mentorId: 'TCH-002', mentorName: 'Mr. Md. Sarwar Hossain Mollah',
    mentorType: 'Academic',
    purpose: 'Academic Improvement', goal: 'Improve Database Systems grade to B+ by next exam',
    meetingType: 'Weekly Mentoring', message: 'I am struggling with Database Systems and need guidance on query optimization and normalization.',
    sentDate: '2026-05-20 10:30 AM', status: 'Accepted', statusDate: '2026-05-21 2:15 PM',
    mentorNote: 'Happy to help! Let\'s start with a diagnostic session this Sunday.',
  },
  {
    id: 'REQ-002', mentorId: 'TCH-004', mentorName: 'Mohammad Azam Khan',
    mentorType: 'Research',
    purpose: 'Research Guidance', goal: 'Start an ML research paper under supervision',
    meetingType: 'Online', message: 'I want to explore NLP research and need a supervisor for my thesis project.',
    sentDate: '2026-05-22 4:00 PM', status: 'Pending', statusDate: '2026-05-22 4:00 PM',
  },
];

const TRACKING_STEPS: TrackingStep[] = [
  { step: 1, title: 'Request Sent', description: 'Mentorship request submitted to Mr. Md. Sarwar Hossain Mollah', status: 'completed', date: 'May 20, 2026 · 10:30 AM', detail: 'Purpose: Academic Improvement · Weekly Mentoring' },
  { step: 2, title: 'Mentor Viewed Request', description: 'Mr. Md. Sarwar Hossain Mollah opened and read your request', status: 'completed', date: 'May 20, 2026 · 3:45 PM', detail: 'Seen within 5 hours of sending' },
  { step: 3, title: 'Mentor Response', description: 'Request accepted by mentor', status: 'completed', date: 'May 21, 2026 · 2:15 PM', detail: '"Happy to help! Let\'s start with a diagnostic session this Sunday."', action: 'View Message' },
  { step: 4, title: 'Session Scheduled', description: 'First counselling session confirmed', status: 'completed', date: 'May 25, 2026 · 3:00 PM', detail: 'Online · Google Meet · 60 minutes · Database Systems focus' },
  { step: 5, title: 'Session Completed', description: 'Introductory counselling session done', status: 'active', date: 'May 25, 2026 · 4:05 PM', detail: '65 minutes completed · Topics: SQL Joins, Normalization · Follow-up tasks assigned', action: 'View Session Notes' },
  { step: 6, title: 'Follow-up Tasks', description: 'Mentor assigned 3 improvement tasks', status: 'active', date: 'May 25, 2026 · 4:10 PM', detail: '2 of 3 tasks in progress · Deadline: May 31', action: 'View Tasks' },
  { step: 7, title: 'Active Mentorship Confirmed', description: 'Mentor officially confirmed ongoing mentorship', status: 'pending', detail: 'Awaiting second session completion' },
  { step: 8, title: 'Supervisor Conversion', description: 'Convert mentor to project/research supervisor', status: 'pending', detail: 'Available after mentor confirmation', action: 'Request Supervisor' },
  { step: 9, title: 'Mentorship Status', description: 'Overall mentorship journey status', status: 'pending', detail: 'Ongoing — Semester 6' },
];

const SESSIONS: Session[] = [
  {
    id: 'SES-001', title: 'Introductory Diagnostic Session', mentorName: 'Mr. Md. Sarwar Hossain Mollah',
    date: 'May 25, 2026', time: '3:00 PM', duration: '65 min', type: 'Academic Counselling',
    status: 'Completed', topics: ['SQL Joins', 'Normalization', 'Query Optimization', 'Study Plan'],
    mentorNotes: 'Student has conceptual gaps in 3NF and BCNF. Strong in basic SELECT queries. Recommend focusing on normalization exercises before next exam.',
    studentNotes: 'Understood 3NF finally! Need to practice more on join types. Mentor suggested W3Schools and GeeksforGeeks practice sets.',
    followUp: 'Complete 20 SQL normalization problems. Watch CMU DB lectures 5–7.',
    link: 'https://meet.google.com/example'
  },
  {
    id: 'SES-002', title: 'Data Structures Follow-up', mentorName: 'Mr. Md. Sarwar Hossain Mollah',
    date: 'Jun 1, 2026', time: '3:00 PM', duration: '60 min', type: 'Academic Counselling',
    status: 'Upcoming', topics: ['Trees', 'Graphs', 'Dynamic Programming'],
    link: 'https://meet.google.com/example2'
  },
];

const TASKS: Task[] = [
  { id: 'TSK-001', title: 'Complete SQL Normalization Practice Set', assignedBy: 'Mr. Md. Sarwar Hossain Mollah', description: 'Solve 20 normalization problems from the provided sheet. Cover 1NF to BCNF with examples.', deadline: 'May 31, 2026', status: 'In Progress', progress: 60 },
  { id: 'TSK-002', title: 'Watch CMU Database Lectures 5–7', assignedBy: 'Mr. Md. Sarwar Hossain Mollah', description: 'Watch CMU 15-445 DB lectures on query optimization and indexing. Take notes and submit summary.', deadline: 'May 31, 2026', status: 'Done', progress: 100, proof: 'summary_notes.pdf', mentorFeedback: 'Good summary! Add more on B-Tree indexing.' },
  { id: 'TSK-003', title: 'Build Mini Student DB Schema', assignedBy: 'Mr. Md. Sarwar Hossain Mollah', description: 'Design a normalized database schema for a university student management system. Include ER diagram.', deadline: 'Jun 5, 2026', status: 'Not Started', progress: 0 },
];

const RESOURCES: Resource[] = [
  { id: 'RES-001', title: 'Database System Concepts – Silberschatz', sharedBy: 'Mr. Md. Sarwar Hossain Mollah', type: 'Book', description: 'Core textbook for DB Systems. Chapters 7–9 are most relevant for normalization.', saved: true, date: 'May 25, 2026' },
  { id: 'RES-002', title: 'CMU 15-445 Database Systems (YouTube)', sharedBy: 'Mr. Md. Sarwar Hossain Mollah', type: 'Video', description: 'Andy Pavlo\'s free database lectures playlist. Among the best available online.', link: 'https://youtube.com/example', saved: false, date: 'May 25, 2026' },
  { id: 'RES-003', title: 'SQL Practice – 200 Problems', sharedBy: 'Mr. Md. Sarwar Hossain Mollah', type: 'Template', description: 'Curated set of 200 SQL problems categorized by difficulty. Start from Basic and move to Advanced.', saved: true, date: 'May 25, 2026' },
  { id: 'RES-004', title: 'Research Paper: Efficient Query Processing', sharedBy: 'Mr. Md. Sarwar Hossain Mollah', type: 'Paper', description: 'IEEE paper on query optimization techniques in distributed databases.', link: 'https://ieee.org/example', saved: false, date: 'May 25, 2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor: Record<string, string> = {
  completed: '#10B981', active: '#6C63FF', pending: '#94A3B8', rejected: '#F43F5E',
  Pending: '#F59E0B', Viewed: '#22D3EE', Accepted: '#10B981', Rejected: '#F43F5E',
  'Need More Info': '#A78BFA', Completed: '#10B981', Upcoming: '#6C63FF',
  Missed: '#F43F5E', Rescheduled: '#F59E0B', Done: '#10B981',
  'In Progress': '#6C63FF', 'Not Started': '#94A3B8', 'Needs Review': '#F59E0B',
};

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle size={14} />, active: <RefreshCw size={14} />, pending: <Clock size={14} />, rejected: <AlertTriangle size={14} />,
  Pending: <Clock size={14} />, Viewed: <MessageSquare size={14} />, Accepted: <CheckCircle size={14} />, Rejected: <AlertTriangle size={14} />,
  'Need More Info': <MessageSquare size={14} />, Completed: <CheckCircle size={14} />, Upcoming: <Calendar size={14} />,
  Missed: <AlertTriangle size={14} />, Rescheduled: <RefreshCw size={14} />, Done: <CheckCircle size={14} />,
  'In Progress': <RefreshCw size={14} />, 'Not Started': <Clock size={14} />, 'Needs Review': <Star size={14} />,
};

const resourceIcon: Record<ResourceType, React.ReactNode> = {
  Book: <BookOpen size={14} />, Video: <Video size={14} />, Paper: <FileText size={14} />, Link: <LinkIcon size={14} />, Template: <FileText size={14} />, Notes: <MessageSquare size={14} />
};

const mentorTypeColor: Record<MentorType, string> = {
  Academic: '#10B981', Research: '#6C63FF', Project: '#F59E0B', Career: '#22D3EE', Club: '#A78BFA'
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ label, icon, active, onClick }: { label: string; icon?: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 10, border: active ? '1px solid rgba(108,99,255,0.5)' : '1px solid transparent',
      background: active ? 'rgba(108,99,255,0.18)' : 'transparent', color: active ? '#fff' : 'var(--muted)',
      fontWeight: active ? 700 : 500, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
      whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
    }}>
      {icon}
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = statusColor[status] ?? '#94A3B8';
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
      background: `${color}22`, color, border: `1px solid ${color}55`, display: 'inline-flex', alignItems: 'center', gap: 4
    }}>
      {statusIcon[status] ?? '•'} {status}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'var(--muted)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--glass-border)', borderRadius: 10, color: 'var(--text)',
  fontSize: '0.875rem', outline: 'none'
};

const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'none' };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorPage() {
  const { mentorRecommendation, subjects, profile } = studentData;
  const weakSubjects = subjects.filter(s => s.marks < 60).map(s => s.name);

  const TABS = [
    { label: 'Recommended', icon: <Bot size={16} /> },
    { label: 'My Requests', icon: <FileText size={16} /> },
    { label: 'Tracker', icon: <Map size={16} /> },
    { label: 'Sessions', icon: <Calendar size={16} /> },
    { label: 'Tasks', icon: <CheckCircle size={16} /> },
    { label: 'Resources', icon: <BookOpen size={16} /> },
    { label: 'Supervisor', icon: <Star size={16} /> }
  ];
  const [activeTab, setActiveTab] = useState(0);

  // Supabase states
  const [requests, setRequests] = useState<MentorRequest[]>(REQUESTS);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>(TRACKING_STEPS);

  useEffect(() => {
    const studentId = profile.id;

    async function fetchData() {
      // Fetch Requests
      const { data: reqs } = await supabase.from('mentor_requests').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
      if (reqs && reqs.length > 0) {
        setRequests(reqs.map((r: any) => ({
          id: r.id, mentorId: r.mentor_id, mentorName: r.mentor_name, mentorType: r.mentor_type as any,
          purpose: r.purpose, goal: r.goal, meetingType: r.meeting_type, message: r.message,
          sentDate: new Date(r.created_at).toLocaleString(), status: r.status, statusDate: new Date(r.updated_at).toLocaleString(),
          mentorNote: r.teacher_note
        })));
      }

      // Fetch Sessions
      const { data: sess } = await supabase.from('mentor_sessions').select('*').eq('student_id', studentId).order('session_date', { ascending: true });
      if (sess && sess.length > 0) {
        setSessions(sess.map((s: any) => ({
          id: s.id, title: s.title, mentorName: s.mentor_name, date: s.session_date, time: s.session_time,
          duration: s.duration, type: s.type, status: s.status, topics: s.topics,
          mentorNotes: s.mentor_notes, studentNotes: s.student_notes, followUp: s.follow_up, link: s.meeting_link
        })));
      }

      // Fetch Tasks
      const { data: tsks } = await supabase.from('mentor_tasks').select('*').eq('student_id', studentId);
      if (tsks && tsks.length > 0) {
        setTasks(tsks.map((t: any) => ({
          id: t.id, title: t.title, assignedBy: t.mentor_id, description: t.description,
          deadline: t.deadline, status: t.status, progress: t.progress, mentorFeedback: t.mentor_feedback
        })));
      }

      // Fetch Resources
      const { data: res } = await supabase.from('mentor_resources').select('*').eq('student_id', studentId);
      if (res && res.length > 0) {
        setResources(res.map((r: any) => ({
          id: r.id, title: r.title, sharedBy: r.mentor_id, type: r.resource_type as any,
          description: r.description, link: r.link, saved: r.is_saved, date: new Date(r.created_at).toLocaleDateString()
        })));
      }
    }

    fetchData();

    // Supabase Realtime Subscription
    const channel = supabase.channel('student_mentorship_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_requests', filter: `student_id=eq.${studentId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_sessions', filter: `student_id=eq.${studentId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_tasks', filter: `student_id=eq.${studentId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_resources', filter: `student_id=eq.${studentId}` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile.id]);


  // Request Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestingMentor, setRequestingMentor] = useState<Mentor | null>(null);
  const [reqPurpose, setReqPurpose] = useState('Academic Improvement');
  const [reqGoal, setReqGoal] = useState('');
  const [reqMeetType, setReqMeetType] = useState('Weekly Mentoring');
  const [reqMsg, setReqMsg] = useState('');
  const [reqSent, setReqSent] = useState(false);

  // Session Notes modal
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Session Request modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Supervisor request
  const [supervisorStatus, setSupervisorStatus] = useState<SupervisorStatus>('None');
  const [supervisorType, setSupervisorType] = useState<'Project' | 'Research'>('Project');
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);

  // Task progress
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [resources, setResources] = useState<Resource[]>(RESOURCES);

  // AI Insights
  const insights = [
    'Your DBMS request was accepted 5 hours after sending',
    'Counselling session completed: 65 min logged this week',
    'Follow-up task deadline is May 31 — 2 tasks remaining',
    'Research mentor request (Mohammad Azam Khan) pending for 2 days',
  ];

  function openRequest(mentor: Mentor) {
    setRequestingMentor(mentor);
    setReqSent(false);
    setReqGoal('');
    setReqMsg('');
    setShowRequestModal(true);
  }

  
  async function sendRequest() {
    if (!requestingMentor) return;
    setReqSent(true);
    await supabase.from('mentor_requests').insert({
      student_id: profile.id,
      student_name: profile.name,
      mentor_id: requestingMentor.id,
      mentor_name: requestingMentor.name,
      mentor_type: requestingMentor.mentorType,
      purpose: reqPurpose,
      goal: reqGoal,
      meeting_type: reqMeetType,
      message: reqMsg,
      status: 'Pending'
    });
  }


  
  async function updateTaskStatus(id: string, status: TaskStatus, progress: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, progress } : t));
    await supabase.from('mentor_tasks').update({ status, progress }).eq('id', id);
  }

  function toggleResourceSave(id: string) {
    setResources(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  }

  const totalHours = sessions.filter(s => s.status === 'Completed').reduce((acc, s) => acc + parseInt(s.duration), 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar
        title="Mentorship Journey"
        subtitle="AI-powered mentor matching, live tracking & counselling management"
        accentColor="#6C63FF"
      />

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* AI Insights Banner */}
        <div style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(34,211,238,0.06))', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 14, display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <span style={{ marginTop: 1, color: 'var(--primary)' }}><Bot size={20} /></span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>AI Mentorship Insights</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {insights.map((ins, i) => (
                <span key={i} style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 999, border: '1px solid var(--border)' }}>{ins}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', overflowX: 'auto', padding: '4px 0' }}>
          {TABS.map((t, i) => <TabButton key={i} label={t.label} icon={t.icon} active={activeTab === i} onClick={() => setActiveTab(i)} />)}
        </div>

        {/* ═══════════════════════════ TAB 1: RECOMMENDED MENTORS ═══════════════════════════ */}
        {activeTab === 0 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>AI-Matched Mentors</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Matched based on your weak subjects ({weakSubjects.join(', ')}), skill radar, academic performance and interests.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {MENTORS.map(mentor => (
                <div key={mentor.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative', transition: 'transform 0.2s', cursor: 'default' }}>
                  {/* Match Score */}
                  <div style={{ position: 'absolute', top: 16, right: 16, background: mentor.matchScore >= 85 ? 'rgba(16,185,129,0.2)' : 'rgba(108,99,255,0.2)', border: `1px solid ${mentor.matchScore >= 85 ? 'rgba(16,185,129,0.4)' : 'rgba(108,99,255,0.4)'}`, borderRadius: 999, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 800, color: mentor.matchScore >= 85 ? '#10B981' : '#6C63FF' }}>
                    {mentor.matchScore}% Match
                  </div>

                  {/* Header */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: mentor.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
                      {mentor.avatar ? <img src={mentor.avatar} alt={mentor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : mentor.initials}
                    </div>
                    <div style={{ flex: 1, paddingRight: 70 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 2 }}>{mentor.name}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>Dept. of {mentor.department}</p>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${mentorTypeColor[mentor.mentorType]}22`, color: mentorTypeColor[mentor.mentorType], border: `1px solid ${mentorTypeColor[mentor.mentorType]}44` }}>
                        {mentor.mentorType} Mentor
                      </span>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.875rem' }}>
                    {mentor.expertise.map(e => (
                      <span key={e} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)' }}>{e}</span>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: '0.875rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} /> {mentor.rating}/5.0</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><GraduationCap size={14} /> {mentor.students} students</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {mentor.sessions} sessions</span>
                  </div>

                  {/* Availability */}
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: '0.875rem', fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} /> <strong style={{ color: 'var(--text)' }}>Available:</strong> {mentor.availability}
                  </div>

                  {/* Why this match */}
                  <div style={{ padding: '10px 12px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Why This Match?</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{mentor.matchReason}</p>
                  </div>

                  {/* Action */}
                  <button onClick={() => openRequest(mentor)} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Mail size={16} /> Send Mentorship Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 2: MY requests ═══════════════════════════ */}
        {activeTab === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>My Mentorship Requests</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{requests.length} request(s) sent · {requests.filter(r => r.status === 'Accepted').length} accepted</p>
              </div>
              <button onClick={() => { setActiveTab(0); }} style={{ padding: '8px 16px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                + New Request
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map(req => (
                <div key={req.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{req.mentorName}</h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${mentorTypeColor[req.mentorType]}22`, color: mentorTypeColor[req.mentorType], border: `1px solid ${mentorTypeColor[req.mentorType]}44` }}>{req.mentorType}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Sent: {req.sentDate} · ID: {req.id}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '0.875rem' }}>
                    {[
                      { label: 'Purpose', value: req.purpose },
                      { label: 'Meeting Type', value: req.meetingType },
                    ].map(f => (
                      <div key={f.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{f.label}</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{f.value}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Goal</p>
                    <p style={{ fontSize: '0.82rem' }}>{req.goal}</p>
                  </div>

                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: req.mentorNote ? '0.875rem' : 0 }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Your Message</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>"{req.message}"</p>
                  </div>

                  {req.mentorNote && (
                    <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
                      <p style={{ fontSize: '0.68rem', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={12} /> Mentor Response</p>
                      <p style={{ fontSize: '0.82rem' }}>"{req.mentorNote}"</p>
                    </div>
                  )}

                  {req.status === 'Pending' && (
                    <div style={{ marginTop: '0.875rem', display: 'flex', gap: 8 }}>
                      <button style={{ padding: '7px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, color: '#F43F5E', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Cancel Request</button>
                    </div>
                  )}

                  {req.status === 'Accepted' && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <button onClick={() => setActiveTab(2)} style={{ padding: '7px 14px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Map size={14} /> View Tracker</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 3: MENTORSHIP TRACKER ═══════════════════════════ */}
        {activeTab === 2 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Mentorship Journey Tracker</h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Live step-by-step tracking — Mr. Md. Sarwar Hossain Mollah · Academic Mentor</p>
                </div>
                <StatusBadge status="In Progress" />
              </div>
            </div>

            {/* Status Card */}
            <div style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(16,185,129,0.08))', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 16 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Current Status</p>
              <p style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}><RefreshCw size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Session Completed — Follow-up Tasks In Progress</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Next session scheduled for Jun 1, 2026 at 3:00 PM · 2 follow-up tasks remaining</p>
            </div>

            {/* Vertical Timeline */}
            <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #10B981, #6C63FF, rgba(148,163,184,0.2))' }} />

              {TRACKING_STEPS.map((step, idx) => {
                const col = statusColor[step.status] ?? '#94A3B8';
                const isDone = step.status === 'completed';
                const isActive = step.status === 'active';
                return (
                  <div key={step.step} style={{ position: 'relative', marginBottom: idx < TRACKING_STEPS.length - 1 ? '1.5rem' : 0 }}>
                    {/* Circle node */}
                    <div style={{
                      position: 'absolute', left: '-2.5rem', top: 2,
                      width: 32, height: 32, borderRadius: '50%',
                      background: isDone ? '#10B981' : isActive ? 'rgba(108,99,255,0.3)' : 'rgba(148,163,184,0.12)',
                      border: `2px solid ${col}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 800, color: col,
                      boxShadow: isActive ? `0 0 16px ${col}55` : 'none',
                    }}>
                      {isDone ? '✓' : isActive ? '●' : step.step}
                    </div>

                    {/* Content card */}
                    <div className="glass-card" style={{ padding: '1rem 1.25rem', borderLeft: `3px solid ${col}`, background: isActive ? `rgba(108,99,255,0.06)` : undefined }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)' }}>Step {step.step}</span>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{step.title}</h4>
                        </div>
                        <StatusBadge status={step.status === 'completed' ? 'Accepted' : step.status === 'active' ? 'In Progress' : step.status === 'rejected' ? 'Rejected' : 'Pending'} />
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: step.date || step.detail ? 8 : 0 }}>{step.description}</p>
                      {step.date && <p style={{ fontSize: '0.75rem', color: col, marginBottom: step.detail ? 4 : 0 }}><Calendar size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {step.date}</p>}
                      {step.detail && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, marginBottom: step.action ? 8 : 0 }}>"{step.detail}"</p>}
                      {step.action && (
                        <button onClick={() => { if (step.step === 4 || step.step === 5) { setActiveTab(3); } else if (step.step === 6) { setActiveTab(4); } else if (step.step === 8) { setActiveTab(6); } }} style={{ padding: '5px 12px', background: `${col}22`, border: `1px solid ${col}55`, borderRadius: 8, color: col, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: 2 }}>
                          {step.action} →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 4: sessions ═══════════════════════════ */}
        {activeTab === 3 && (
          <div>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Sessions', value: sessions.filter(s => s.status === 'Completed').length, icon: <Calendar size={24} />, color: '#10B981' },
                { label: 'Total Hours', value: `${totalHours} min`, icon: <Clock size={24} />, color: '#6C63FF' },
                { label: 'Avg Duration', value: `${totalHours} min`, icon: <BarChart2 size={24} />, color: '#22D3EE' },
                { label: 'Upcoming', value: sessions.filter(s => s.status === 'Upcoming').length, icon: <CalendarPlus size={24} />, color: '#F59E0B' },
              ].map(stat => (
                <div key={stat.label} className="glass-card" style={{ padding: '1.125rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: 4 }}>{stat.icon}</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color, marginBottom: 2 }}>{stat.value}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>All Sessions</h2>
              <button onClick={() => setShowScheduleModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                + Request Session
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map(session => (
                <div key={session.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 2 }}>{session.title}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{session.mentorName} · {session.date} · {session.time}</p>
                    </div>
                    <StatusBadge status={session.status} />
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '0.875rem' }}>
                    {[
                      { id: 'duration', label: <><Clock size={12} style={{ display: 'inline' }} /> Duration</>, value: session.duration },
                      { id: 'type', label: <><FileText size={12} style={{ display: 'inline' }} /> Type</>, value: session.type },
                      session.link ? { id: 'link', label: <><LinkIcon size={12} style={{ display: 'inline' }} /> Link</>, value: 'Join Meeting' } : null,
                    ].filter(Boolean).map((f: any) => (
                      <div key={f.id} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--muted)' }}>{f.label}: </span>
                        <strong>{f.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Topics */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.875rem' }}>
                    {session.topics.map(t => <span key={t} style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 6, color: 'var(--primary)' }}>{t}</span>)}
                  </div>

                  {session.status === 'Completed' && (
                    <button onClick={() => { setSelectedSession(session); setShowSessionModal(true); }} style={{ padding: '7px 14px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                      <FileText size={14} style={{ display: 'inline' }} /> View Session Notes
                    </button>
                  )}

                  {session.status === 'Upcoming' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ padding: '7px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><LinkIcon size={14} /> Join Meeting</button>
                      <button style={{ padding: '7px 14px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#F59E0B', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> Reschedule</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 5: TASKS ═══════════════════════════ */}
        {activeTab === 4 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Follow-up Tasks</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Assigned by mentor · {tasks.filter(t => t.status === 'Done').length}/{tasks.length} completed</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                    <div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 2 }}>{task.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>By {task.assignedBy} · Due: {task.deadline}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>{task.description}</p>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Progress</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: task.progress === 100 ? '#10B981' : 'var(--primary)' }}>{task.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${task.progress}%`, background: task.progress === 100 ? 'linear-gradient(90deg,#10B981,#22D3EE)' : 'linear-gradient(90deg,#6C63FF,#A78BFA)', borderRadius: 99, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>

                  {task.mentorFeedback && (
                    <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: '0.875rem' }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Mentor Feedback</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{task.mentorFeedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {task.status !== 'Done' && (
                      <>
                        {task.status === 'Not Started' && (
                          <button onClick={() => updateTaskStatus(task.id, 'In Progress', 30)} style={{ padding: '6px 14px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8, color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>▶ Start Task</button>
                        )}
                        {task.status === 'In Progress' && (
                          <button onClick={() => updateTaskStatus(task.id, 'Done', 100)} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}><Check size={14} style={{ display: 'inline' }} /> Mark as Done</button>
                        )}
                        <button style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}><LinkIcon size={14} style={{ display: 'inline' }} /> Upload Proof</button>
                      </>
                    )}
                    {task.status === 'Done' && (
                      <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600 }}><CheckCircle size={14} style={{ display: 'inline' }} /> Task completed!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 6: RESOURCES ═══════════════════════════ */}
        {activeTab === 5 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Shared Resources</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Books, videos, papers and templates shared by your mentor</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {resources.map(res => (
                <div key={res.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{resourceIcon[res.type]}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 6, color: 'var(--primary)' }}>{res.type}</span>
                      <button onClick={() => toggleResourceSave(res.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 2 }} title={res.saved ? 'Saved' : 'Save'}>
                        {res.saved ? <CheckCircle size={14} color='#10B981' /> : <BookOpen size={14} />}
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: 4 }}>{res.title}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--primary)', marginBottom: 8 }}>By {res.sharedBy}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{res.description}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.875rem' }}>Shared: {res.date}</p>

                  {res.link && (
                    <a href={res.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 8, color: '#22D3EE', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
                      <LinkIcon size={14} style={{ display: 'inline' }} /> Open Resource
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════ TAB 7: SUPERVISOR STATUS ═══════════════════════════ */}
        {activeTab === 6 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>Supervisor Status</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Convert your academic mentor into a verified project or research supervisor</p>
            </div>

            {/* Info Card */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(34,211,238,0.06))', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 16, marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 8 }}><Star size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> What is Supervisor Conversion?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                If your mentorship is related to a specific project or research, your academic mentor can officially become your verified supervisor. This unlocks formal supervision benefits — project documentation, research co-authorship, and institutional recognition.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: <Bot size={24} />, label: 'Research Supervisor', desc: 'For thesis, papers & lab work' },
                  { icon: <Laptop size={24} />, label: 'Project Supervisor', desc: 'For capstone & dev projects' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', marginBottom: 4 }}>{item.icon}</p>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Mentors that can become supervisors */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Active Mentors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.filter(r => r.status === 'Accepted').map(req => (
                <div key={req.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: 2 }}>{req.mentorName}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{req.mentorType} Mentor · Active since {req.statusDate}</p>
                    </div>
                    {supervisorStatus === 'None' && (
                      <button onClick={() => setShowSupervisorModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #6C63FF, #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <Star size={14} style={{ display: 'inline' }} /> Request as Supervisor
                      </button>
                    )}
                    {supervisorStatus === 'Pending' && <StatusBadge status="Pending" />}
                    {supervisorStatus === 'Approved' && (
                      <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Star size={14} color="#10B981" />
                        <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.85rem' }}>Verified Supervisor</span>
                      </div>
                    )}
                  </div>

                  {supervisorStatus === 'Pending' && (
                    <div style={{ padding: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.8rem', color: '#F59E0B' }}>⏳ Supervisor approval request sent. Waiting for department head review.</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>Type: {supervisorType} Supervisor · Submitted today</p>
                    </div>
                  )}

                  {supervisorStatus === 'Approved' && (
                    <div style={{ padding: '14px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span><Star size={24} /></span>
                        <div>
                          <p style={{ fontWeight: 800, color: '#10B981', fontSize: '0.9rem' }}>{req.mentorName} is your Verified {supervisorType} Supervisor</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Officially recognized · Semester 6</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Your project/research will now show the Verified Supervisor badge in all academic records.</p>
                    </div>
                  )}
                </div>
              ))}

              {requests.filter(r => r.status === 'Accepted').length === 0 && (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '2rem', marginBottom: 8 }}><AlertTriangle size={32} /></p>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>No active mentors yet</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Send a mentorship request and get it accepted first</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ═══════════════════════════ MODALS ═══════════════════════════ */}

      {/* Request Modal */}
      {showRequestModal && requestingMentor && (
        <Modal title={reqSent ? 'Request Sent!' : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={16} /> Send Request — {requestingMentor.name}</span>} onClose={() => setShowRequestModal(false)}>
          {reqSent ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><CheckCircle size={48} color='#10B981' /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>Request Sent Successfully!</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Your mentorship request has been sent to <strong style={{ color: 'var(--text)' }}>{requestingMentor.name}</strong>. You'll be notified when they respond. Track progress in the <strong style={{ color: 'var(--primary)' }}>Tracker</strong> tab.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => { setShowRequestModal(false); setActiveTab(1); }} style={{ padding: '9px 18px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 10, color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>View My Requests</button>
                <button onClick={() => setShowRequestModal(false)} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--muted)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Close</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ padding: '10px 14px', background: `${requestingMentor.color.includes('10B981') ? 'rgba(16,185,129,0.1)' : 'rgba(108,99,255,0.1)'}`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 2 }}>{requestingMentor.name} · {requestingMentor.department}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{requestingMentor.expertise.join(', ')} · ⭐ {requestingMentor.rating}</p>
              </div>

              <FormField label="Mentorship Purpose">
                <select value={reqPurpose} onChange={e => setReqPurpose(e.target.value)} style={selectStyle}>
                  {['Academic Improvement', 'Research Guidance', 'Project Supervision', 'Career Development', 'Skill Development', 'Thesis Supervision'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Your Goal">
                <input value={reqGoal} onChange={e => setReqGoal(e.target.value)} placeholder="e.g. Improve Database grade to B+ before finals" style={inputStyle} />
              </FormField>

              <FormField label="Preferred Meeting Type">
                <select value={reqMeetType} onChange={e => setReqMeetType(e.target.value)} style={selectStyle}>
                  {['Online', 'Offline', 'Quick Consultation', 'Weekly Mentoring', 'Monthly Check-in'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </FormField>

              <FormField label="Message to Mentor">
                <textarea value={reqMsg} onChange={e => setReqMsg(e.target.value)} placeholder="Introduce yourself and explain what you need help with..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </FormField>

              <FormField label="Attach File (Optional)">
                <div style={{ ...inputStyle, color: 'var(--muted)', cursor: 'pointer', textAlign: 'center' }}><Download size={14} style={{ display: 'inline' }} /> Click to attach transcript / CV / project file</div>
              </FormField>

              <div style={{ display: 'flex', gap: 8, marginTop: '0.5rem' }}>
                <button onClick={sendRequest} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                  <Mail size={16} /> Send Request
                </button>
                <button onClick={() => setShowRequestModal(false)} style={{ padding: '11px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--muted)', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Session Notes Modal */}
      {showSessionModal && selectedSession && (
        <Modal title={`${selectedSession.title}`} onClose={() => setShowSessionModal(false)}>
          <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <StatusBadge status={selectedSession.status} />
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '3px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 999 }}>{selectedSession.date} · {selectedSession.time}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '3px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 999 }}>⏱ {selectedSession.duration}</span>
          </div>

          {selectedSession.mentorNotes && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Mentor Notes</p>
              <div style={{ padding: '12px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.6 }}>{selectedSession.mentorNotes}</p>
              </div>
            </div>
          )}

          {selectedSession.studentNotes && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your Notes</p>
              <div style={{ padding: '12px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.6 }}>{selectedSession.studentNotes}</p>
              </div>
            </div>
          )}

          {selectedSession.followUp && (
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Follow-up Tasks</p>
              <div style={{ padding: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.6 }}>{selectedSession.followUp}</p>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <Modal title="Request New Session" onClose={() => setShowScheduleModal(false)}>
          <FormField label="Session Type">
            <select style={selectStyle}>
              {['Academic Counselling', 'Project Guidance', 'Research Guidance', 'Career Guidance', 'Skill Improvement', 'Emergency Academic Support'].map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Preferred Date">
            <input type="date" style={inputStyle} />
          </FormField>
          <FormField label="Preferred Time">
            <input type="time" style={inputStyle} />
          </FormField>
          <FormField label="Meeting Type">
            <select style={selectStyle}>
              {['Online', 'Offline'].map(o => <option key={o}>{o}</option>)}
            </select>
          </FormField>
          <FormField label="Topics to Cover">
            <textarea placeholder="List the topics you want to discuss..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </FormField>
          <button onClick={() => setShowScheduleModal(false)} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginTop: 4 }}>
            <Calendar size={14} style={{ display: 'inline' }} /> Submit Session Request
          </button>
        </Modal>
      )}

      {/* Supervisor Request Modal */}
      {showSupervisorModal && (
        <Modal title="Request Supervisor Conversion" onClose={() => setShowSupervisorModal(false)}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Request <strong style={{ color: 'var(--text)' }}>Tamanna Akter</strong> to officially become your verified supervisor. This will be sent to the department for approval.
          </p>
          <FormField label="Supervisor Type">
            <select value={supervisorType} onChange={e => setSupervisorType(e.target.value as 'Project' | 'Research')} style={selectStyle}>
              <option value="Project">Project Supervisor</option>
              <option value="Research">Research Supervisor</option>
            </select>
          </FormField>
          <FormField label="Project / Research Title">
            <input placeholder="e.g. Student Attendance Optimization using ML" style={inputStyle} />
          </FormField>
          <FormField label="Reason for Request">
            <textarea placeholder="Explain why you need this mentor as your official supervisor..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </FormField>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            
            <button onClick={async () => { 
              setSupervisorStatus('Pending'); 
              setShowSupervisorModal(false); 
              await supabase.from('mentor_requests').insert({
                student_id: profile.id,
                student_name: profile.name,
                mentor_id: 'SUPERVISOR', // Typically you'd pick the specific mentor
                mentor_name: 'Tamanna Akter',
                mentor_type: 'Academic',
                purpose: 'Supervisor Request',
                goal: 'N/A',
                meeting_type: 'N/A',
                message: 'Requesting supervisor conversion',
                status: 'Pending',
                supervisor_type: supervisorType,
                project_title: 'Student Attendance Optimization using ML'
              });
            }} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>

              Submit Request
            </button>
            <button onClick={() => setShowSupervisorModal(false)} style={{ padding: '11px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--muted)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
