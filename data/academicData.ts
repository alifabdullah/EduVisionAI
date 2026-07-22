// ─────────────────────────────────────────────
// EduVision AI — Academic Module Mock Data
// ─────────────────────────────────────────────

export const SEMESTERS = [
  { label: 'Fall 2026', code: '263' },
  { label: 'Summer 2026', code: '262' },
  { label: 'Spring 2026', code: '261' },
  { label: 'Short 2025', code: '254' },
  { label: 'Fall 2025', code: '253' },
  { label: 'Summer 2025', code: '252' },
  { label: 'Spring 2025', code: '251' },
] as const;

export type SemesterCode = (typeof SEMESTERS)[number]['code'];

export interface SubjectData {
  name: string;
  code: string;
  quiz: number;
  mid: number;
  final: number;
  assignment: number;
  lab: number;
  attendance: number;
  grade: string;
  riskLevel: 'low' | 'medium' | 'high';
  assignmentsDone: number;
  assignmentsTotal: number;
  teacherRemark?: string;
}

export interface SemesterData {
  code: string;
  overallMarks: number;
  quizAvg: number;
  midAvg: number;
  finalAvg: number;
  assignmentMarks: number;
  labMarks: number;
  attendancePct: number;
  gpa: number;
  cgpa: number;
  subjects: SubjectData[];
}

export const SEMESTER_DATA: Record<string, SemesterData> = {
  '263': {
    code: '263',
    overallMarks: 72,
    quizAvg: 10,
    midAvg: 71,
    finalAvg: 74,
    assignmentMarks: 80,
    labMarks: 75,
    attendancePct: 78,
    gpa: 3.42,
    cgpa: 3.42,
    subjects: [
      { name: 'Data Structures', code: 'CSE301', quiz: 8, mid: 58, final: 52, assignment: 80, lab: 70, attendance: 68, grade: 'C+', riskLevel: 'high', assignmentsDone: 4, assignmentsTotal: 5, teacherRemark: 'Needs more practice on tree algorithms.' },
      { name: 'Algorithms', code: 'CSE302', quiz: 11, mid: 75, final: 70, assignment: 90, lab: 80, attendance: 80, grade: 'B+', riskLevel: 'low', assignmentsDone: 5, assignmentsTotal: 5 },
      { name: 'Database Systems', code: 'CSE303', quiz: 7, mid: 50, final: 48, assignment: 60, lab: 55, attendance: 62, grade: 'C', riskLevel: 'high', assignmentsDone: 3, assignmentsTotal: 5, teacherRemark: 'Attendance is critical. Must improve before finals.' },
      { name: 'Computer Networks', code: 'CSE304', quiz: 12, mid: 80, final: 76, assignment: 85, lab: 82, attendance: 85, grade: 'A-', riskLevel: 'low', assignmentsDone: 5, assignmentsTotal: 5 },
      { name: 'Software Engineering', code: 'CSE305', quiz: 12, mid: 85, final: 80, assignment: 95, lab: 88, attendance: 90, grade: 'A', riskLevel: 'low', assignmentsDone: 6, assignmentsTotal: 6 },
      { name: 'Operating Systems', code: 'CSE306', quiz: 9, mid: 62, final: 58, assignment: 70, lab: 65, attendance: 72, grade: 'B', riskLevel: 'medium', assignmentsDone: 3, assignmentsTotal: 4 },
    ],
  },
  '262': {
    code: '262',
    overallMarks: 68,
    quizAvg: 10,
    midAvg: 68,
    finalAvg: 70,
    assignmentMarks: 75,
    labMarks: 72,
    attendancePct: 74,
    gpa: 3.21,
    cgpa: 3.35,
    subjects: [
      { name: 'Computer Architecture', code: 'CSE201', quiz: 9, mid: 65, final: 60, assignment: 75, lab: 68, attendance: 70, grade: 'B', riskLevel: 'medium', assignmentsDone: 3, assignmentsTotal: 4 },
      { name: 'Discrete Mathematics', code: 'CSE202', quiz: 11, mid: 72, final: 75, assignment: 80, lab: 0, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 5 },
      { name: 'Digital Logic Design', code: 'CSE203', quiz: 9, mid: 55, final: 52, assignment: 65, lab: 60, attendance: 68, grade: 'C+', riskLevel: 'high', assignmentsDone: 2, assignmentsTotal: 4 },
      { name: 'Linear Algebra', code: 'MATH201', quiz: 11, mid: 78, final: 80, assignment: 85, lab: 0, attendance: 82, grade: 'A-', riskLevel: 'low', assignmentsDone: 5, assignmentsTotal: 5 },
    ],
  },
  '261': {
    code: '261',
    overallMarks: 75,
    quizAvg: 11,
    midAvg: 76,
    finalAvg: 78,
    assignmentMarks: 82,
    labMarks: 78,
    attendancePct: 82,
    gpa: 3.60,
    cgpa: 3.50,
    subjects: [
      { name: 'Object-Oriented Programming', code: 'CSE101', quiz: 12, mid: 82, final: 78, assignment: 90, lab: 85, attendance: 88, grade: 'A', riskLevel: 'low', assignmentsDone: 5, assignmentsTotal: 5 },
      { name: 'Web Technologies', code: 'CSE102', quiz: 11, mid: 78, final: 80, assignment: 88, lab: 82, attendance: 85, grade: 'A-', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 4 },
      { name: 'Statistics & Probability', code: 'MATH102', quiz: 10, mid: 68, final: 70, assignment: 72, lab: 0, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 3, assignmentsTotal: 4 },
    ],
  },
  '254': {
    code: '254',
    overallMarks: 74,
    quizAvg: 11,
    midAvg: 74,
    finalAvg: 76,
    assignmentMarks: 79,
    labMarks: 76,
    attendancePct: 80,
    gpa: 3.52,
    cgpa: 3.47,
    subjects: [
      { name: 'Advanced Programming', code: 'CSE251', quiz: 11, mid: 76, final: 72, assignment: 82, lab: 78, attendance: 82, grade: 'A-', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 5 },
      { name: 'Numerical Methods', code: 'MATH251', quiz: 10, mid: 70, final: 72, assignment: 75, lab: 70, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 3, assignmentsTotal: 4 },
    ],
  },
  '253': {
    code: '253',
    overallMarks: 70,
    quizAvg: 10,
    midAvg: 71,
    finalAvg: 73,
    assignmentMarks: 77,
    labMarks: 74,
    attendancePct: 76,
    gpa: 3.35,
    cgpa: 3.44,
    subjects: [
      { name: 'Theory of Computation', code: 'CSE253', quiz: 10, mid: 68, final: 70, assignment: 75, lab: 0, attendance: 74, grade: 'B+', riskLevel: 'low', assignmentsDone: 3, assignmentsTotal: 4 },
      { name: 'Compiler Design', code: 'CSE254', quiz: 11, mid: 72, final: 68, assignment: 78, lab: 72, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 5 },
    ],
  },
  '252': {
    code: '252',
    overallMarks: 71,
    quizAvg: 10,
    midAvg: 72,
    finalAvg: 74,
    assignmentMarks: 78,
    labMarks: 75,
    attendancePct: 77,
    gpa: 3.38,
    cgpa: 3.42,
    subjects: [
      { name: 'Artificial Intelligence', code: 'CSE401', quiz: 11, mid: 74, final: 70, assignment: 80, lab: 76, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 5 },
      { name: 'Computer Graphics', code: 'CSE402', quiz: 10, mid: 70, final: 72, assignment: 76, lab: 74, attendance: 76, grade: 'B+', riskLevel: 'low', assignmentsDone: 3, assignmentsTotal: 4 },
    ],
  },
  '251': {
    code: '251',
    overallMarks: 73,
    quizAvg: 11,
    midAvg: 74,
    finalAvg: 76,
    assignmentMarks: 80,
    labMarks: 77,
    attendancePct: 79,
    gpa: 3.45,
    cgpa: 3.40,
    subjects: [
      { name: 'Machine Learning', code: 'CSE451', quiz: 11, mid: 75, final: 74, assignment: 82, lab: 78, attendance: 80, grade: 'A-', riskLevel: 'low', assignmentsDone: 5, assignmentsTotal: 5 },
      { name: 'Mobile App Development', code: 'CSE452', quiz: 11, mid: 72, final: 76, assignment: 78, lab: 76, attendance: 78, grade: 'B+', riskLevel: 'low', assignmentsDone: 4, assignmentsTotal: 4 },
    ],
  },
};

// ── Projects ────────────────────────────────
export interface Project {
  id: string;
  title: string;
  topic: string;
  sector: string;
  description: string;
  techStack: string[];
  teamMembers: string[];
  supervisor: string;
  supervisorVerified: boolean;
  startDate: string;
  endDate?: string;
  status: 'Ongoing' | 'Completed';
  liveLink?: string;
  githubLink?: string;
  documentationLink?: string;
  color: string; // gradient accent
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'EduVision AI Analytics Platform',
    topic: 'AI-Powered Student Performance Analysis',
    sector: 'EdTech',
    description: 'A comprehensive academic analytics platform using machine learning to predict student performance and generate personalized recommendations.',
    techStack: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Redis'],
    teamMembers: ['Joy kumar Yuv', 'Nadia Islam', 'Rafiq Ahmed'],
    supervisor: 'Mr. Md. Sarwar Hossain Mollah',
    supervisorVerified: true,
    startDate: '2026-01-15',
    status: 'Ongoing',
    liveLink: 'https://joysarkar.netlify.app/',
    githubLink: 'https://github.com/joy/eduvision',
    documentationLink: 'https://eduvision.demo.app/docs/report.pdf',
    color: '#6C63FF',
  },
  {
    id: 'proj-2',
    title: 'Smart Library Management System',
    topic: 'IoT-Based Library Access Control',
    sector: 'IoT / Smart Systems',
    description: 'An IoT-driven library management system with real-time seat tracking, book availability, and automated entry using NFC cards.',
    techStack: ['React', 'Node.js', 'MQTT', 'MongoDB', 'Arduino'],
    teamMembers: ['Joy kumar Yuv', 'Tasneem Karim'],
    supervisor: 'Prof. Rashid Khan',
    supervisorVerified: false,
    startDate: '2025-09-01',
    endDate: '2026-02-28',
    status: 'Completed',
    githubLink: 'https://github.com/joy/smart-library',
    color: '#22D3EE',
  },
  {
    id: 'proj-3',
    title: 'CampusConnect — Student Social Network',
    topic: 'University Social Networking App',
    sector: 'Social / Networking',
    description: 'A dedicated social platform for university students to share resources, form study groups, and collaborate on projects.',
    techStack: ['React Native', 'Firebase', 'Node.js', 'Socket.io'],
    teamMembers: ['Joy kumar Yuv'],
    supervisor: '',
    supervisorVerified: false,
    startDate: '2025-06-10',
    endDate: '2025-12-30',
    status: 'Completed',
    liveLink: 'https://joysarkar.netlify.app/',
    githubLink: 'https://github.com/joy/campusconnect',
    color: '#10B981',
  },
];

// ── Research ─────────────────────────────────
export interface Research {
  id: string;
  title: string;
  abstract: string;
  researchArea: string;
  keywords: string[];
  supervisor: string;
  supervisorVerified: boolean;
  coAuthors: string[];
  startDate: string;
  expectedEndDate: string;
  status: 'Draft' | 'Supervisor Connected' | 'In Progress' | 'Under Review' | 'Revision Required' | 'Accepted' | 'Published';
  journalConference?: string;
  doi?: string;
  workflowStage: number; // 0–5
}

export const WORKFLOW_STAGES = ['Proposal', 'Supervisor Connected', 'In Progress', 'Under Review', 'Accepted', 'Published'];

export const INITIAL_RESEARCH: Research[] = [
  {
    id: 'res-1',
    title: 'Deep Learning-Based Early Detection of Student Academic Risk',
    abstract: 'This paper proposes a novel LSTM-based model for early academic risk detection in higher education institutions using multi-modal behavioral and academic data streams.',
    researchArea: 'Machine Learning / Education Technology',
    keywords: ['Deep Learning', 'LSTM', 'Academic Analytics', 'Risk Detection', 'Student Performance'],
    supervisor: 'Mr. Md. Sarwar Hossain Mollah',
    supervisorVerified: true,
    coAuthors: ['Nadia Islam', 'Tasneem Karim'],
    startDate: '2026-01-10',
    expectedEndDate: '2026-08-30',
    status: 'Under Review',
    journalConference: 'IEEE Transactions on Learning Technologies',
    workflowStage: 3,
  },
  {
    id: 'res-2',
    title: 'Blockchain-Based Academic Credential Verification System',
    abstract: 'A decentralized approach to academic credential management using Ethereum smart contracts to prevent certificate fraud in educational institutions.',
    researchArea: 'Blockchain / Information Security',
    keywords: ['Blockchain', 'Smart Contracts', 'Credential Verification', 'Ethereum'],
    supervisor: '',
    supervisorVerified: false,
    coAuthors: ['Rafiq Ahmed'],
    startDate: '2025-10-15',
    expectedEndDate: '2026-05-30',
    status: 'Draft',
    workflowStage: 1,
  },
];

// ── Library ──────────────────────────────────
export interface LibraryVisit {
  date: string;
  entryTime: string;
  exitTime: string;
  duration: number; // minutes
}

export interface IssuedBook {
  id: string;
  title: string;
  author: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Reading' | 'Returned' | 'Overdue';
  category: string;
  progress?: number;
}

export const LIBRARY_VISITS: LibraryVisit[] = [
  { date: '2026-05-23', entryTime: '10:12', exitTime: '13:45', duration: 213 },
  { date: '2026-05-22', entryTime: '14:00', exitTime: '17:30', duration: 210 },
  { date: '2026-05-21', entryTime: '09:30', exitTime: '12:00', duration: 150 },
  { date: '2026-05-20', entryTime: '15:00', exitTime: '18:00', duration: 180 },
  { date: '2026-05-19', entryTime: '11:00', exitTime: '13:00', duration: 120 },
  { date: '2026-05-17', entryTime: '10:00', exitTime: '14:30', duration: 270 },
  { date: '2026-05-16', entryTime: '14:30', exitTime: '16:30', duration: 120 },
  { date: '2026-05-15', entryTime: '09:00', exitTime: '12:30', duration: 210 },
  { date: '2026-05-14', entryTime: '13:00', exitTime: '17:00', duration: 240 },
  { date: '2026-05-13', entryTime: '10:30', exitTime: '13:00', duration: 150 },
  { date: '2026-05-12', entryTime: '15:00', exitTime: '17:30', duration: 150 },
  { date: '2026-05-10', entryTime: '09:30', exitTime: '14:00', duration: 270 },
  { date: '2026-05-09', entryTime: '13:30', exitTime: '16:30', duration: 180 },
  { date: '2026-05-08', entryTime: '10:00', exitTime: '12:30', duration: 150 },
  { date: '2026-05-07', entryTime: '14:00', exitTime: '18:00', duration: 240 },
  { date: '2026-05-06', entryTime: '11:00', exitTime: '14:00', duration: 180 },
  { date: '2026-05-05', entryTime: '09:00', exitTime: '13:30', duration: 270 },
  { date: '2026-05-03', entryTime: '14:30', exitTime: '17:00', duration: 150 },
  { date: '2026-05-02', entryTime: '10:00', exitTime: '13:30', duration: 210 },
  { date: '2026-05-01', entryTime: '09:30', exitTime: '12:00', duration: 150 },
  { date: '2026-04-30', entryTime: '13:00', exitTime: '16:30', duration: 210 },
  { date: '2026-04-28', entryTime: '10:00', exitTime: '13:00', duration: 180 },
  { date: '2026-04-27', entryTime: '14:00', exitTime: '17:00', duration: 180 },
  { date: '2026-04-25', entryTime: '09:30', exitTime: '12:30', duration: 180 },
  { date: '2026-04-24', entryTime: '15:00', exitTime: '18:00', duration: 180 },
];

export const ISSUED_BOOKS: IssuedBook[] = [
  { id: 'bk-1', title: 'Introduction to Algorithms', author: 'Cormen et al.', issueDate: '2026-05-10', dueDate: '2026-05-31', status: 'Reading', category: 'Programming', progress: 65 },
  { id: 'bk-2', title: 'Deep Learning', author: 'Ian Goodfellow', issueDate: '2026-05-05', dueDate: '2026-05-26', status: 'Overdue', category: 'AI / ML', progress: 40 },
  { id: 'bk-3', title: 'Clean Code', author: 'Robert C. Martin', issueDate: '2026-04-20', dueDate: '2026-05-11', returnDate: '2026-05-10', status: 'Returned', category: 'Programming', progress: 100 },
  { id: 'bk-4', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', issueDate: '2026-04-10', dueDate: '2026-05-01', returnDate: '2026-04-30', status: 'Returned', category: 'Programming', progress: 100 },
  { id: 'bk-5', title: 'Computer Networks', author: 'Andrew Tanenbaum', issueDate: '2026-05-18', dueDate: '2026-06-08', status: 'Reading', category: 'Networking', progress: 20 },
  { id: 'bk-6', title: 'Research Methods in CS', author: 'Dawson', issueDate: '2026-05-12', dueDate: '2026-06-02', status: 'Reading', category: 'Research', progress: 55 },
];
