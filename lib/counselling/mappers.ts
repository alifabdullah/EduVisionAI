// ─────────────────────────────────────────────────────────────────────────────
// Supabase Counselling Module — Mapper
// Converts raw DB rows (snake_case) to app types (camelCase).
// ─────────────────────────────────────────────────────────────────────────────

import type {
  DbCounsellingRequest, DbSessionResource, DbStudentTask, DbSessionHistory,
  CounsellingRequest, SessionResource, StudentTask, SessionHistoryEntry,
} from './types';

export function mapRequest(
  row: DbCounsellingRequest,
  resources: DbSessionResource[] = [],
  tasks: DbStudentTask[] = [],
  history: DbSessionHistory[] = []
): CounsellingRequest {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentDept: row.student_dept ?? '',
    studentCgpa: row.student_cgpa ?? 0,
    studentAttendance: row.student_attendance ?? 0,
    studentAvatar: row.student_avatar ?? undefined,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    teacherDesignation: row.teacher_designation ?? '',
    teacherDept: row.teacher_dept ?? '',
    subject: row.subject,
    category: row.category,
    description: row.description,
    priority: row.priority,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    attachments: row.attachments ?? [],
    status: row.status,
    teacherNotes: row.teacher_notes ?? undefined,
    meetingLink: row.meeting_link ?? undefined,
    scheduledDate: row.scheduled_date ?? undefined,
    scheduledTime: row.scheduled_time ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
    studentWeakness: row.student_weakness ?? undefined,
    studyPlan: row.study_plan ?? undefined,
    assignments: row.assignments ?? [],
    resources: resources.map(mapResource),
    tasks: tasks.map(mapTask),
    sessionHistory: history.map(mapHistory),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapResource(r: DbSessionResource): SessionResource {
  return {
    id: r.id,
    requestId: r.request_id,
    type: r.type,
    title: r.title,
    url: r.url ?? undefined,
    description: r.description ?? undefined,
    createdAt: r.created_at,
  };
}

export function mapTask(t: DbStudentTask): StudentTask {
  return {
    id: t.id,
    requestId: t.request_id,
    week: t.week,
    title: t.title,
    description: t.description,
    deadline: t.deadline,
    progress: t.progress,
    status: t.status,
    studentNote: t.student_note ?? undefined,
    createdAt: t.created_at,
  };
}

export function mapHistory(h: DbSessionHistory): SessionHistoryEntry {
  return {
    id: h.id,
    requestId: h.request_id,
    date: h.date,
    duration: h.duration,
    topic: h.topic,
    teacherNotes: h.teacher_notes ?? undefined,
    studentNotes: h.student_notes ?? undefined,
    resourcesShared: h.resources_shared ?? [],
    summary: h.summary ?? undefined,
    assignmentsGiven: h.assignments_given ?? [],
    createdAt: h.created_at,
  };
}
