// ─────────────────────────────────────────────────────────────────────────────
// Supabase Counselling Module — Database Types
// Mirrors the PostgreSQL table schema exactly.
// ─────────────────────────────────────────────────────────────────────────────

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Rescheduled' | 'Completed' | 'Cancelled';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ResourceType = 'PDF' | 'Video' | 'Document' | 'Link' | 'Book' | 'GitHub' | 'Notes' | 'Slides' | 'Assignment';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Missed';

// ── DB Row Types (snake_case — matches Supabase response) ─────────────────────

export interface DbCounsellingRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_dept: string | null;
  student_cgpa: number | null;
  student_attendance: number | null;
  student_avatar: string | null;
  teacher_id: string;
  teacher_name: string;
  teacher_designation: string | null;
  teacher_dept: string | null;
  subject: string;
  category: string;
  description: string;
  priority: PriorityLevel;
  preferred_date: string;
  preferred_time: string;
  attachments: string[];
  status: RequestStatus;
  teacher_notes: string | null;
  meeting_link: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  rejection_reason: string | null;
  student_weakness: string | null;
  study_plan: string | null;
  assignments: string[];
  created_at: string;
  updated_at: string;
}

export interface DbSessionResource {
  id: string;
  request_id: string;
  type: ResourceType;
  title: string;
  url: string | null;
  description: string | null;
  created_at: string;
}

export interface DbStudentTask {
  id: string;
  request_id: string;
  week: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: TaskStatus;
  student_note: string | null;
  created_at: string;
}

export interface DbSessionHistory {
  id: string;
  request_id: string;
  date: string;
  duration: string;
  topic: string;
  teacher_notes: string | null;
  student_notes: string | null;
  resources_shared: string[];
  summary: string | null;
  assignments_given: string[];
  created_at: string;
}

// ── Application Types (camelCase — used inside React) ─────────────────────────

export interface CounsellingRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentDept: string;
  studentCgpa: number;
  studentAttendance: number;
  studentAvatar?: string;
  teacherId: string;
  teacherName: string;
  teacherDesignation: string;
  teacherDept: string;
  subject: string;
  category: string;
  description: string;
  priority: PriorityLevel;
  preferredDate: string;
  preferredTime: string;
  attachments: string[];
  status: RequestStatus;
  teacherNotes?: string;
  meetingLink?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  rejectionReason?: string;
  studentWeakness?: string;
  studyPlan?: string;
  assignments: string[];
  resources: SessionResource[];
  tasks: StudentTask[];
  sessionHistory: SessionHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionResource {
  id: string;
  requestId: string;
  type: ResourceType;
  title: string;
  url?: string;
  description?: string;
  createdAt: string;
}

export interface StudentTask {
  id: string;
  requestId: string;
  week: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: TaskStatus;
  studentNote?: string;
  createdAt: string;
}

export interface SessionHistoryEntry {
  id: string;
  requestId: string;
  date: string;
  duration: string;
  topic: string;
  teacherNotes?: string;
  studentNotes?: string;
  resourcesShared: string[];
  summary?: string;
  assignmentsGiven: string[];
  createdAt: string;
}

// ── Input / Payload Types ─────────────────────────────────────────────────────

export interface BookCounsellingPayload {
  studentId: string;
  studentName: string;
  studentDept: string;
  studentCgpa: number;
  studentAttendance: number;
  studentAvatar?: string;
  teacherId: string;
  teacherName: string;
  teacherDesignation: string;
  teacherDept: string;
  subject: string;
  category: string;
  description: string;
  priority: PriorityLevel;
  preferredDate: string;
  preferredTime: string;
  attachmentPaths: string[];
}

export interface AcceptRequestPayload {
  requestId: string;
  meetingLink: string;
  scheduledDate: string;
  scheduledTime: string;
  teacherNotes?: string;
}

export interface AddResourcePayload {
  requestId: string;
  type: ResourceType;
  title: string;
  url?: string;
  description?: string;
}

export interface AddTaskPayload {
  requestId: string;
  week: string;
  title: string;
  description: string;
  deadline: string;
}

export interface AddSessionHistoryPayload {
  requestId: string;
  date: string;
  duration: string;
  topic: string;
  teacherNotes?: string;
  summary?: string;
  assignmentsGiven?: string[];
}
