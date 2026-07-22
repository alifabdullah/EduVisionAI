// ─────────────────────────────────────────────────────────────────────────────
// Supabase Counselling Module — Service Layer
// All database operations go through here. Zero business logic.
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from '@/lib/supabaseClient';
import { mapRequest, mapResource, mapTask, mapHistory } from './mappers';
import type {
  CounsellingRequest, SessionResource, StudentTask, SessionHistoryEntry,
  BookCounsellingPayload, AcceptRequestPayload, AddResourcePayload,
  AddTaskPayload, AddSessionHistoryPayload,
} from './types';

// ── Fetch all requests with related data ─────────────────────────────────────

export async function fetchAllRequests(): Promise<CounsellingRequest[]> {
  const { data: requests, error } = await supabase
    .from('counselling_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchAllRequests: ${error.message}`);
  if (!requests || requests.length === 0) return [];

  const ids = requests.map(r => r.id);

  const [{ data: resources }, { data: tasks }, { data: history }] = await Promise.all([
    supabase.from('session_resources').select('*').in('request_id', ids),
    supabase.from('student_tasks').select('*').in('request_id', ids).order('created_at'),
    supabase.from('session_history').select('*').in('request_id', ids).order('created_at'),
  ]);

  return requests.map(req =>
    mapRequest(
      req,
      (resources ?? []).filter(r => r.request_id === req.id),
      (tasks ?? []).filter(t => t.request_id === req.id),
      (history ?? []).filter(h => h.request_id === req.id),
    )
  );
}

// ── Fetch requests for a specific student ─────────────────────────────────────

export async function fetchStudentRequests(studentId: string): Promise<CounsellingRequest[]> {
  const { data: requests, error } = await supabase
    .from('counselling_requests')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchStudentRequests: ${error.message}`);
  if (!requests || requests.length === 0) return [];

  return enrichRequests(requests);
}

// ── Fetch requests for a specific teacher ─────────────────────────────────────

export async function fetchTeacherRequests(teacherId: string): Promise<CounsellingRequest[]> {
  const { data: requests, error } = await supabase
    .from('counselling_requests')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchTeacherRequests: ${error.message}`);
  if (!requests || requests.length === 0) return [];

  return enrichRequests(requests);
}

// ── Shared enricher helper ────────────────────────────────────────────────────

async function enrichRequests(requests: Record<string, unknown>[]): Promise<CounsellingRequest[]> {
  const ids = requests.map(r => r.id as string);

  const [{ data: resources }, { data: tasks }, { data: history }] = await Promise.all([
    supabase.from('session_resources').select('*').in('request_id', ids),
    supabase.from('student_tasks').select('*').in('request_id', ids).order('created_at'),
    supabase.from('session_history').select('*').in('request_id', ids).order('created_at'),
  ]);

  return requests.map(req =>
    mapRequest(
      req as any,
      (resources ?? []).filter(r => r.request_id === req.id),
      (tasks ?? []).filter(t => t.request_id === req.id),
      (history ?? []).filter(h => h.request_id === req.id),
    )
  );
}

// ── Book a new counselling session ────────────────────────────────────────────

export async function bookCounsellingRequest(
  payload: BookCounsellingPayload,
  uploadedPaths: string[] = []
): Promise<CounsellingRequest> {
  const { data, error } = await supabase
    .from('counselling_requests')
    .insert({
      student_id: payload.studentId,
      student_name: payload.studentName,
      student_dept: payload.studentDept,
      student_cgpa: payload.studentCgpa,
      student_attendance: payload.studentAttendance,
      student_avatar: payload.studentAvatar,
      teacher_id: payload.teacherId,
      teacher_name: payload.teacherName,
      teacher_designation: payload.teacherDesignation,
      teacher_dept: payload.teacherDept,
      subject: payload.subject,
      category: payload.category,
      description: payload.description,
      priority: payload.priority,
      preferred_date: payload.preferredDate,
      preferred_time: payload.preferredTime,
      attachments: [...payload.attachmentPaths, ...uploadedPaths],
      status: 'Pending',
    })
    .select()
    .single();

  if (error) throw new Error(`bookCounsellingRequest: ${error.message}`);
  return mapRequest(data, [], [], []);
}

// ── Accept a request ──────────────────────────────────────────────────────────

export async function acceptRequest(payload: AcceptRequestPayload): Promise<void> {
  const { error } = await supabase
    .from('counselling_requests')
    .update({
      status: 'Accepted',
      meeting_link: payload.meetingLink,
      scheduled_date: payload.scheduledDate,
      scheduled_time: payload.scheduledTime,
      teacher_notes: payload.teacherNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.requestId);

  if (error) throw new Error(`acceptRequest: ${error.message}`);
}

// ── Reject a request ──────────────────────────────────────────────────────────

export async function rejectRequest(requestId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('counselling_requests')
    .update({ status: 'Rejected', rejection_reason: reason, updated_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) throw new Error(`rejectRequest: ${error.message}`);
}

// ── Reschedule a request ──────────────────────────────────────────────────────

export async function rescheduleRequest(
  requestId: string, newDate: string, newTime: string, notes?: string
): Promise<void> {
  const { error } = await supabase
    .from('counselling_requests')
    .update({
      status: 'Rescheduled',
      scheduled_date: newDate,
      scheduled_time: newTime,
      teacher_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) throw new Error(`rescheduleRequest: ${error.message}`);
}

// ── Complete a session ────────────────────────────────────────────────────────

export async function completeSession(
  requestId: string, summary: string, teacherNotes: string
): Promise<void> {
  const { error } = await supabase
    .from('counselling_requests')
    .update({
      status: 'Completed',
      teacher_notes: teacherNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) throw new Error(`completeSession: ${error.message}`);
}

// ── Add a resource ────────────────────────────────────────────────────────────

export async function addResource(payload: AddResourcePayload): Promise<SessionResource> {
  const { data, error } = await supabase
    .from('session_resources')
    .insert({
      request_id: payload.requestId,
      type: payload.type,
      title: payload.title,
      url: payload.url,
      description: payload.description,
    })
    .select()
    .single();

  if (error) throw new Error(`addResource: ${error.message}`);
  return mapResource(data);
}

// ── Add a roadmap task ────────────────────────────────────────────────────────

export async function addTask(payload: AddTaskPayload): Promise<StudentTask> {
  const { data, error } = await supabase
    .from('student_tasks')
    .insert({
      request_id: payload.requestId,
      week: payload.week,
      title: payload.title,
      description: payload.description,
      deadline: payload.deadline,
      progress: 0,
      status: 'Not Started',
    })
    .select()
    .single();

  if (error) throw new Error(`addTask: ${error.message}`);
  return mapTask(data);
}

// ── Update task progress (student) ────────────────────────────────────────────

export async function updateTaskProgress(
  taskId: string, progress: number, status: string, studentNote?: string
): Promise<void> {
  const { error } = await supabase
    .from('student_tasks')
    .update({ progress, status, student_note: studentNote })
    .eq('id', taskId);

  if (error) throw new Error(`updateTaskProgress: ${error.message}`);
}

// ── Add session history ───────────────────────────────────────────────────────

export async function addSessionHistory(payload: AddSessionHistoryPayload): Promise<SessionHistoryEntry> {
  const { data, error } = await supabase
    .from('session_history')
    .insert({
      request_id: payload.requestId,
      date: payload.date,
      duration: payload.duration,
      topic: payload.topic,
      teacher_notes: payload.teacherNotes,
      summary: payload.summary,
      assignments_given: payload.assignmentsGiven ?? [],
      resources_shared: [],
    })
    .select()
    .single();

  if (error) throw new Error(`addSessionHistory: ${error.message}`);
  return mapHistory(data);
}

// ── Upload file to Supabase Storage ──────────────────────────────────────────

export async function uploadAttachment(file: File, requestId: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `counselling/${requestId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const { error } = await supabase.storage
    .from('counselling-attachments')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`uploadAttachment: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from('counselling-attachments')
    .getPublicUrl(path);

  return urlData.publicUrl;
}
