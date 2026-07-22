// ─────────────────────────────────────────────
// EduVision AI — Single Source of Truth
// All portals reference this file.
// ─────────────────────────────────────────────

// ── MASTER STUDENT PROFILES ──────────────────
export const MASTER_STUDENTS = [
  {
    id: '261-16-010', roll: 'CIS-21-010', regNo: 'REG-2021-010',
    name: 'Joy Kumar Yuv', email: 'joy.yuv@edu.ai', phone: '01711-000001',
    photo: '/profile_joy.png',
    department: 'Computing and Information System', departmentId: 'CIS',
    batch: 'Batch-24', batchYear: 2021, semester: 6,
    cgpa: 3.42, attendancePct: 71, creditsCompleted: 98, creditsTotal: 140,
    segment: 'average',
    subjects: [
      { name: 'Data Structures', code: 'CSE301', marks: 55, attendance: 68, grade: 'C+', risk: 'high' },
      { name: 'Algorithms', code: 'CSE302', marks: 72, attendance: 80, grade: 'B+', risk: 'low' },
      { name: 'Database Systems', code: 'CSE303', marks: 48, attendance: 62, grade: 'C', risk: 'high' },
      { name: 'Computer Networks', code: 'CSE304', marks: 78, attendance: 85, grade: 'A-', risk: 'low' },
      { name: 'Software Engineering', code: 'CSE305', marks: 82, attendance: 90, grade: 'A', risk: 'low' },
      { name: 'Operating Systems', code: 'CSE306', marks: 60, attendance: 72, grade: 'B', risk: 'medium' },
    ],
    skills: { Communication: 52, Leadership: 48, Teamwork: 75, CriticalThinking: 70, ProblemSolving: 78 },
    assignedTeacherId: 'TCH-002',
    projects: ['EduVision AI Analytics Platform', 'Smart Library Management System'],
    research: ['Deep Learning-Based Early Detection of Student Academic Risk'],
    clubs: ['Robotics Club', 'Programming Contest Team', 'Photography Club'],
    rank: 14, totalStudents: 45, percentile: 68,
  },
  {
    id: 'CS-21-046', roll: 'CS21046', regNo: 'REG-2021-046',
    name: 'Mesbah Hus Saleh', email: 'mesbah.saleh@edu.ai', phone: '01711-000002',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    department: 'Computer Science & Engineering', departmentId: 'CSE',
    batch: 'Batch-24', batchYear: 2021, semester: 4,
    cgpa: 2.85, attendancePct: 68, creditsCompleted: 60, creditsTotal: 140,
    segment: 'average',
    subjects: [
      { name: 'Data Structures', code: 'CSE301', marks: 62, attendance: 68, grade: 'B-', risk: 'medium' },
      { name: 'Algorithms', code: 'CSE302', marks: 58, attendance: 65, grade: 'C+', risk: 'high' },
    ],
    skills: { Communication: 65, Leadership: 55, Teamwork: 70, CriticalThinking: 60, ProblemSolving: 65 },
    assignedTeacherId: 'TCH-002',
    projects: [], research: [], clubs: ['Programming Contest Team'],
    rank: 32, totalStudents: 45, percentile: 30,
  },
  {
    id: 'CS-21-047', roll: 'CS21047', regNo: 'REG-2021-047',
    name: 'Anindro Saha Raj', email: 'anindro.raj@edu.ai', phone: '01711-000003',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    department: 'Software Engineering', departmentId: 'SWE',
    batch: 'Batch-24', batchYear: 2021, semester: 6,
    cgpa: 3.15, attendancePct: 82, creditsCompleted: 90, creditsTotal: 140,
    segment: 'average',
    subjects: [
      { name: 'Software Architecture', code: 'SWE401', marks: 78, attendance: 82, grade: 'A-', risk: 'low' },
      { name: 'Project Management', code: 'SWE301', marks: 70, attendance: 80, grade: 'B+', risk: 'low' },
    ],
    skills: { Communication: 72, Leadership: 65, Teamwork: 78, CriticalThinking: 80, ProblemSolving: 76 },
    assignedTeacherId: 'TCH-002',
    projects: ['Smart Campus App'], research: [], clubs: ['Robotics Club'],
    rank: 20, totalStudents: 45, percentile: 56,
  },
  {
    id: 'CS-21-048', roll: 'CS21048', regNo: 'REG-2021-048',
    name: 'Shohan Sarkar', email: 'shohan.sarkar@edu.ai', phone: '01711-000004',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    department: 'Computer Science & Engineering', departmentId: 'CSE',
    batch: 'Batch-24', batchYear: 2021, semester: 4,
    cgpa: 3.68, attendancePct: 90, creditsCompleted: 72, creditsTotal: 140,
    segment: 'high',
    subjects: [
      { name: 'Operating Systems', code: 'CSE306', marks: 88, attendance: 92, grade: 'A', risk: 'low' },
      { name: 'Computer Networks', code: 'CSE304', marks: 85, attendance: 90, grade: 'A', risk: 'low' },
    ],
    skills: { Communication: 80, Leadership: 82, Teamwork: 88, CriticalThinking: 85, ProblemSolving: 90 },
    assignedTeacherId: 'TCH-001',
    projects: ['Distributed Systems Monitor'], research: [], clubs: ['Debate Club'],
    rank: 5, totalStudents: 45, percentile: 90,
  },
  {
    id: 'CS-21-049', roll: 'CS21049', regNo: 'REG-2021-049',
    name: 'Rahat Sarkar', email: 'rahat.sarkar@edu.ai', phone: '01711-000005',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    department: 'Computing and Information System', departmentId: 'CIS',
    batch: 'Batch-24', batchYear: 2021, semester: 4,
    cgpa: 2.10, attendancePct: 55, creditsCompleted: 48, creditsTotal: 140,
    segment: 'at-risk',
    subjects: [
      { name: 'System Analysis & Design', code: 'CIS301', marks: 48, attendance: 55, grade: 'C', risk: 'high' },
      { name: 'Database Fundamentals', code: 'CIS201', marks: 42, attendance: 50, grade: 'D+', risk: 'high' },
    ],
    skills: { Communication: 52, Leadership: 42, Teamwork: 60, CriticalThinking: 48, ProblemSolving: 55 },
    assignedTeacherId: 'TCH-002',
    projects: [], research: [], clubs: [],
    rank: 44, totalStudents: 45, percentile: 8,
  },
  {
    id: 'CS-21-051', roll: 'CS21051', regNo: 'REG-2021-051',
    name: 'Emma Davis', email: 'emma.davis@edu.ai', phone: '01711-000006',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    department: 'Computing and Information System', departmentId: 'CIS',
    batch: 'Batch-23', batchYear: 2020, semester: 8,
    cgpa: 3.55, attendancePct: 88, creditsCompleted: 130, creditsTotal: 140,
    segment: 'high',
    subjects: [
      { name: 'Machine Learning', code: 'CSE451', marks: 84, attendance: 88, grade: 'A-', risk: 'low' },
    ],
    skills: { Communication: 75, Leadership: 72, Teamwork: 85, CriticalThinking: 80, ProblemSolving: 82 },
    assignedTeacherId: 'TCH-002',
    projects: ['ERP System Design'], research: ['Blockchain Credential Verification'],
    clubs: ['Programming Contest Team'],
    rank: 5, totalStudents: 45, percentile: 88,
  },
];

// ── MASTER TEACHER PROFILES ───────────────────
export const MASTER_TEACHERS = [
  {
    id: 'TCH-001', name: 'Mr. Md. Mehedi Hassan',
    email: 'mehedi@daffodilvarsity.edu.bd', phone: '01712-100001',
    department: 'Computing and Information System', departmentId: 'CIS',
    designation: 'Senior Lecturer', joinYear: 2015,
    courses: ['CIS201', 'CIS101'], totalStudents: 85,
    avgImprovement: 18, courseOutcome: 82, mentorship: 90, effectivenessScore: 85,
    kpiScore: 85, researchPublications: 3, attendanceRate: 96,
    expertise: ['Information Systems', 'Web Development'],
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
  },
  {
    id: 'TCH-002', name: 'Mr. Md. Sarwar Hossain Mollah',
    email: 'headcis@daffodilvarsity.edu.bd', phone: '01712-100002',
    department: 'Computing and Information System', departmentId: 'CIS',
    designation: 'Associate Professor and Head', joinYear: 2012,
    courses: ['CIS303', 'CIS301', 'CIS201'], totalStudents: 145,
    avgImprovement: 15, courseOutcome: 78, mentorship: 88, effectivenessScore: 80,
    kpiScore: 80, researchPublications: 7, attendanceRate: 98,
    expertise: ['Database Management Systems', 'System Analysis & Design', 'Software Quality Assurance'],
    avatar: '/images/teachers/sarwar.png',
  },
  {
    id: 'TCH-003', name: 'Mr. Md. Nasimul Kader',
    email: 'nasim@daffodilvarsity.edu.bd', phone: '01712-100003',
    department: 'Computing and Information System', departmentId: 'CIS',
    designation: 'Lecturer', joinYear: 2018,
    courses: ['CIS101', 'CIS102'], totalStudents: 70,
    avgImprovement: 12, courseOutcome: 74, mentorship: 70, effectivenessScore: 72,
    kpiScore: 72, researchPublications: 1, attendanceRate: 94,
    expertise: ['Programming Fundamentals', 'Computer Networks'],
    avatar: '/images/teachers/nasimul.png',
  },
  {
    id: 'TCH-004', name: 'Mohammad Azam Khan',
    email: 'azam@daffodilvarsity.edu.bd', phone: '01712-100004',
    department: 'Computing and Information System', departmentId: 'CIS',
    designation: 'Assistant Professor', joinYear: 2016,
    courses: ['CIS401', 'CIS402', 'CIS403', 'CIS404'], totalStudents: 160,
    avgImprovement: 20, courseOutcome: 88, mentorship: 92, effectivenessScore: 90,
    kpiScore: 90, researchPublications: 5, attendanceRate: 97,
    expertise: ['Machine Learning', 'AI', 'Data Science'],
    avatar: '/images/teachers/azam.png',
  },
  {
    id: 'TCH-005', name: 'Tamanna Akter',
    email: 'tamanna@daffodilvarsity.edu.bd', phone: '01712-100005',
    department: 'Computing and Information System', departmentId: 'CIS',
    designation: 'Lecturer', joinYear: 2020,
    courses: ['CIS102', 'CIS201'], totalStudents: 60,
    avgImprovement: 8, courseOutcome: 62, mentorship: 55, effectivenessScore: 60,
    kpiScore: 60, researchPublications: 0, attendanceRate: 91,
    expertise: ['Software Testing', 'Project Management'],
    avatar: '/images/teachers/tamanna.png',
  },
];

// ── HR EMPLOYEES (includes teachers + admin) ──
export const HR_EMPLOYEES = [
  ...MASTER_TEACHERS.map(t => ({
    id: t.id, name: t.name, email: t.email, phone: t.phone,
    department: t.department, departmentId: t.departmentId,
    designation: t.designation, employeeType: 'Faculty' as const,
    joinYear: t.joinYear, attendanceRate: t.attendanceRate,
    kpiScore: t.kpiScore, leaveBalance: 18, contractType: 'Permanent' as const,
    salary: t.designation.includes('Professor') ? 85000 : 55000,
    status: 'Active' as const,
  })),
  {
    id: 'ADM-001', name: 'Farida Begum', email: 'farida@daffodilvarsity.edu.bd', phone: '01712-200001',
    department: 'Administration', departmentId: 'ADM',
    designation: 'Administrative Officer', employeeType: 'Admin' as const,
    joinYear: 2014, attendanceRate: 95, kpiScore: 78,
    leaveBalance: 12, contractType: 'Permanent' as const, salary: 45000, status: 'Active' as const,
  },
  {
    id: 'ADM-002', name: 'Rahim Uddin', email: 'rahim@daffodilvarsity.edu.bd', phone: '01712-200002',
    department: 'IT Support', departmentId: 'IT',
    designation: 'IT Support Officer', employeeType: 'Staff' as const,
    joinYear: 2019, attendanceRate: 78, kpiScore: 65,
    leaveBalance: 8, contractType: 'Contractual' as const, salary: 38000, status: 'Active' as const,
  },
  {
    id: 'ADM-003', name: 'Sumaiya Khanam', email: 'sumaiya@daffodilvarsity.edu.bd', phone: '01712-200003',
    department: 'Library', departmentId: 'LIB',
    designation: 'Librarian', employeeType: 'Staff' as const,
    joinYear: 2017, attendanceRate: 97, kpiScore: 82,
    leaveBalance: 15, contractType: 'Permanent' as const, salary: 42000, status: 'Active' as const,
  },
];

// ── DEPARTMENT DATA ───────────────────────────
export const MASTER_DEPARTMENTS = [
  {
    id: 'CIS', name: 'Computing and Information System',
    shortName: 'CIS', head: 'Mr. Md. Sarwar Hossain Mollah',
    students: 45, teachers: 5, avgGPA: 3.18, avgAttendance: 74,
    atRiskCount: 12, atRiskPct: 27, skillScore: 68, riskLevel: 'medium' as const,
    coursesOffered: 18, researchCount: 3, performance: 74,
  },
  {
    id: 'CSE', name: 'Computer Science & Engineering',
    shortName: 'CSE', head: 'Prof. Dr. Karim Uddin',
    students: 850, teachers: 38, avgGPA: 3.2, avgAttendance: 74,
    atRiskCount: 112, atRiskPct: 13, skillScore: 68, riskLevel: 'medium' as const,
    coursesOffered: 42, researchCount: 15, performance: 74,
  },
  {
    id: 'EEE', name: 'Electrical & Electronic Engineering',
    shortName: 'EEE', head: 'Prof. Rahman',
    students: 720, teachers: 32, avgGPA: 3.0, avgAttendance: 78,
    atRiskCount: 95, atRiskPct: 13, skillScore: 62, riskLevel: 'medium' as const,
    coursesOffered: 38, researchCount: 10, performance: 70,
  },
  {
    id: 'BBA', name: 'Business Administration',
    shortName: 'BBA', head: 'Prof. Hasan',
    students: 980, teachers: 42, avgGPA: 3.4, avgAttendance: 82,
    atRiskCount: 88, atRiskPct: 9, skillScore: 74, riskLevel: 'low' as const,
    coursesOffered: 48, researchCount: 8, performance: 79,
  },
  {
    id: 'PHARM', name: 'Pharmacy',
    shortName: 'Pharm', head: 'Dr. Sultana',
    students: 420, teachers: 22, avgGPA: 2.9, avgAttendance: 70,
    atRiskCount: 118, atRiskPct: 28, skillScore: 58, riskLevel: 'high' as const,
    coursesOffered: 32, researchCount: 6, performance: 65,
  },
  {
    id: 'MATH', name: 'Mathematics',
    shortName: 'Math', head: 'Dr. Islam',
    students: 600, teachers: 8, avgGPA: 2.8, avgAttendance: 65,
    atRiskCount: 156, atRiskPct: 26, skillScore: 55, riskLevel: 'high' as const,
    coursesOffered: 20, researchCount: 4, performance: 63,
  },
];

// ── UNIVERSITY-WIDE STATS ─────────────────────
export const UNIVERSITY_STATS = {
  name: 'Daffodil International University',
  totalStudents: 4820,
  totalTeachers: 186,
  totalDepartments: 8,
  atRiskPercentage: 22,
  avgGPA: 3.1,
  avgAttendance: 76,
  coursesOffered: 94,
  activeAlerts: 6,
  totalEmployees: 520,
  researchPublications: 47,
  semester: 'Fall 2026',
};

// ── LEAVE REQUESTS ────────────────────────────
export const LEAVE_REQUESTS = [
  { id: 'LV-001', employeeId: 'TCH-003', employeeName: 'Mr. Md. Nasimul Kader', type: 'Medical', days: 5, from: '2026-07-10', to: '2026-07-14', status: 'Pending', reason: 'Medical treatment' },
  { id: 'LV-002', employeeId: 'ADM-002', employeeName: 'Rahim Uddin', type: 'Annual', days: 3, from: '2026-07-15', to: '2026-07-17', status: 'Pending', reason: 'Family event' },
  { id: 'LV-003', employeeId: 'TCH-005', employeeName: 'Tamanna Akter', type: 'Annual', days: 7, from: '2026-07-20', to: '2026-07-26', status: 'Approved', reason: 'Vacation' },
  { id: 'LV-004', employeeId: 'ADM-001', employeeName: 'Farida Begum', type: 'Emergency', days: 2, from: '2026-07-08', to: '2026-07-09', status: 'Approved', reason: 'Family emergency' },
];

// ── PAYROLL SUMMARY ───────────────────────────
export const PAYROLL_SUMMARY = {
  month: 'June 2026',
  totalDisbursed: 4250000,
  totalEmployeesPaid: HR_EMPLOYEES.length,
  avgSalary: 58000,
  taxDeductedYTD: 1200000,
  pendingClearances: 2,
  status: 'Disbursed',
};

// ── COUNSELING SESSIONS ───────────────────────
export const COUNSELING_SESSIONS = [
  { id: 'CS-001', teacherId: 'TCH-002', teacherName: 'Mr. Md. Sarwar Hossain Mollah', studentId: '261-16-010', studentName: 'Joy Kumar Yuv', topic: 'Database Systems improvement', date: '2026-07-05', status: 'Completed', outcome: 'Study plan created' },
  { id: 'CS-002', teacherId: 'TCH-002', teacherName: 'Mr. Md. Sarwar Hossain Mollah', studentId: 'CS-21-046', studentName: 'Mia Reynolds', topic: 'Attendance & academic risk', date: '2026-07-08', status: 'Scheduled', outcome: null },
  { id: 'CS-003', teacherId: 'TCH-001', teacherName: 'Mr. Md. Mehedi Hassan', studentId: 'CS-21-048', studentName: 'Sophia Lee', topic: 'Research guidance', date: '2026-07-03', status: 'Completed', outcome: 'Research proposal reviewed' },
];

// ── SEARCH UTILITY ────────────────────────────
export function searchStudents(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MASTER_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    s.roll.toLowerCase().includes(q) ||
    s.regNo.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q) ||
    s.phone.includes(q)
  );
}

export function searchTeachers(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MASTER_TEACHERS.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q) ||
    t.email.toLowerCase().includes(q) ||
    t.phone.includes(q)
  );
}

export function getStudentById(id: string) {
  return MASTER_STUDENTS.find(s =>
    s.id === id || s.roll === id || s.regNo === id || s.email === id
  ) ?? null;
}

export function getStudentsByDept(deptId: string) {
  return MASTER_STUDENTS.filter(s => s.departmentId === deptId);
}

export function getTeachersByDept(deptId: string) {
  return MASTER_TEACHERS.filter(t => t.departmentId === deptId);
}

export function getAtRiskStudents(deptId?: string) {
  const students = deptId ? getStudentsByDept(deptId) : MASTER_STUDENTS;
  return students.filter(s => s.segment === 'at-risk' || s.cgpa < 2.5);
}

export function getDeptStats(deptId: string) {
  const students = getStudentsByDept(deptId);
  const teachers = getTeachersByDept(deptId);
  const atRisk = getAtRiskStudents(deptId);
  const avgCgpa = students.length ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : '0';
  const avgAttendance = students.length ? Math.round(students.reduce((a, s) => a + s.attendancePct, 0) / students.length) : 0;
  return { students, teachers, atRisk, avgCgpa, avgAttendance, totalStudents: students.length, totalTeachers: teachers.length };
}

export function getEmployeesByDept(deptId: string) {
  return HR_EMPLOYEES.filter(e => e.departmentId === deptId);
}

export function getLowAttendanceEmployees(threshold = 80) {
  return HR_EMPLOYEES.filter(e => e.attendanceRate < threshold);
}

export function getPendingLeaves() {
  return LEAVE_REQUESTS.filter(l => l.status === 'Pending');
}
