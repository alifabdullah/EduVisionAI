'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MASTER_TEACHERS, MASTER_STUDENTS } from '@/data/sharedMockData';
import * as counsellingService from '@/lib/counselling/service';
import { useCounsellingRealtime } from '@/lib/counselling/useRealtime';
import { toast } from 'sonner';
import type {
  CounsellingRequest, SessionResource, StudentTask,
  BookCounsellingPayload, AcceptRequestPayload,
} from '@/lib/counselling/types';

// ─── Re-export types so existing imports still work ───────────────────────────

export type { CounsellingRequest };
export type { SessionResource };
export type { StudentTask };

// Keep backward-compat aliases for existing context consumers
export type CounselingStatus = CounsellingRequest['status'];
export type CounselingCategory = string;
export type PriorityLevel = CounsellingRequest['priority'];
export type ResourceType = SessionResource['type'];
export type CounselingResource = SessionResource;
export type RoadmapItem = StudentTask;

export interface CounselingRequest extends CounsellingRequest {
  // Alias: allow old consumers to still access these keys
  sharedResources: SessionResource[];
  roadmap: StudentTask[];
  sessionHistory: import('@/lib/counselling/types').SessionHistoryEntry[];
  studentAvatar?: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface CounselingAnalytics {
  totalRequests: number;
  pendingRequests: number;
  completedSessions: number;
  avgResponseTimeHours: number;
  acceptanceRate: number;
  teacherStats: { teacherId: string; teacherName: string; pending: number; completed: number; avgResponse: number }[];
  deptStats: { dept: string; total: number; completed: number }[];
  monthlyStats: { month: string; requests: number; completed: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface CounselingContextType {
  requests: CounselingRequest[];
  isLoading: boolean;
  error: string | null;
  addRequest: (payload: BookCounsellingPayload, files?: File[]) => Promise<void>;
  updateRequest: (id: string, updates: Partial<CounselingRequest>) => Promise<void>;
  acceptRequest: (id: string, meetingLink: string, scheduledDate: string, scheduledTime: string, notes: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  rescheduleRequest: (id: string, newDate: string, newTime: string, notes: string) => Promise<void>;
  completeRequest: (id: string, summary: string, teacherNotes: string) => Promise<void>;
  addResource: (reqId: string, resource: Omit<SessionResource, 'id' | 'requestId' | 'createdAt'>) => Promise<void>;
  addRoadmapItem: (reqId: string, item: Omit<StudentTask, 'id' | 'requestId' | 'createdAt' | 'progress' | 'status'>) => Promise<void>;
  updateRoadmapItem: (reqId: string, itemId: string, updates: Partial<StudentTask>) => Promise<void>;
  addSessionHistory: (reqId: string, session: import('@/lib/counselling/types').AddSessionHistoryPayload) => Promise<void>;
  getStudentRequests: (studentId: string) => CounselingRequest[];
  getTeacherRequests: (teacherId: string) => CounselingRequest[];
  getPendingCount: (teacherId: string) => number;
  getAnalytics: () => CounselingAnalytics;
}

// ─── Seed data (shown while Supabase loads or if offline) ─────────────────────

const SEED_REQUESTS: CounselingRequest[] = [
  {
    id: 'CR-001',
    studentId: '261-16-010',
    studentName: 'Joy Kumar Yuv',
    studentDept: 'CIS',
    studentCgpa: 3.42,
    studentAttendance: 71,
    teacherId: 'TCH-002',
    teacherName: 'Mr. Md. Sarwar Hossain Mollah',
    teacherDesignation: 'Associate Professor and Head',
    teacherDept: 'CIS',
    subject: 'Database Systems - Normalization Help',
    category: 'Course Difficulty',
    description: 'I am struggling with database normalization (3NF and BCNF). My mid-term score was 48/100.',
    priority: 'High',
    preferredDate: '2026-07-12',
    preferredTime: '3:00 PM',
    attachments: ['midterm_result.pdf'],
    status: 'Accepted',
    teacherNotes: "Let's start with a diagnostic session.",
    meetingLink: 'https://meet.google.com/eduvision-cr001',
    scheduledDate: '2026-07-12',
    scheduledTime: '3:00 PM',
    assignments: ['20 normalization problems by July 14', 'Watch CMU DB Lectures 5-7'],
    resources: [
      { id: 'RES-001', requestId: 'CR-001', type: 'Book', title: 'Database System Concepts – Silberschatz', description: 'Ch 7–9', createdAt: '2026-07-05T00:00:00Z' },
      { id: 'RES-002', requestId: 'CR-001', type: 'Video', title: 'CMU DB Lecture 7 – Normalization', url: 'https://youtube.com/cmu-db-7', createdAt: '2026-07-05T00:00:00Z' },
    ],
    tasks: [
      { id: 'RM-001', requestId: 'CR-001', week: 'Week 1', title: 'Master 1NF and 2NF', description: 'Understand functional dependency', deadline: '2026-07-14', progress: 80, status: 'In Progress', createdAt: '2026-07-05T00:00:00Z' },
      { id: 'RM-002', requestId: 'CR-001', week: 'Week 2', title: 'Practice 3NF & BCNF', description: 'Solve 20 problems', deadline: '2026-07-21', progress: 0, status: 'Not Started', createdAt: '2026-07-05T00:00:00Z' },
    ],
    sessionHistory: [
      { id: 'SH-001', requestId: 'CR-001', date: '2026-07-05', duration: '65 min', topic: 'Introductory Diagnostic', teacherNotes: 'Assigned normalization workbook.', resourcesShared: [], assignmentsGiven: [], createdAt: '2026-07-05T00:00:00Z' },
    ],
    // backward-compat aliases
    get sharedResources() { return this.resources; },
    get roadmap() { return this.tasks; },
    createdAt: '2026-07-05T10:30:00Z',
    updatedAt: '2026-07-05T14:00:00Z',
  },
  {
    id: 'CR-002',
    studentId: 'CS-21-046',
    studentName: 'Mia Reynolds',
    studentDept: 'CIS',
    studentCgpa: 2.35,
    studentAttendance: 60,
    teacherId: 'TCH-002',
    teacherName: 'Mr. Md. Sarwar Hossain Mollah',
    teacherDesignation: 'Associate Professor and Head',
    teacherDept: 'CIS',
    subject: 'Attendance & Academic Risk',
    category: 'Academic',
    description: 'My attendance has dropped to 60% and I am at risk of failing.',
    priority: 'Urgent',
    preferredDate: '2026-07-10',
    preferredTime: '2:00 PM',
    attachments: [],
    status: 'Pending',
    assignments: [],
    resources: [],
    tasks: [],
    sessionHistory: [],
    get sharedResources() { return this.resources; },
    get roadmap() { return this.tasks; },
    createdAt: '2026-07-08T09:00:00Z',
    updatedAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'CR-003',
    studentId: 'CS-21-049',
    studentName: 'Liam Scott',
    studentDept: 'CIS',
    studentCgpa: 1.98,
    studentAttendance: 50,
    teacherId: 'TCH-002',
    teacherName: 'Mr. Md. Sarwar Hossain Mollah',
    teacherDesignation: 'Associate Professor and Head',
    teacherDept: 'CIS',
    subject: 'Emergency Academic Support',
    category: 'Academic',
    description: 'My CGPA has fallen to 1.98 and attendance is only 50%.',
    priority: 'Urgent',
    preferredDate: '2026-07-09',
    preferredTime: '10:00 AM',
    attachments: [],
    status: 'Pending',
    assignments: [],
    resources: [],
    tasks: [],
    sessionHistory: [],
    get sharedResources() { return this.resources; },
    get roadmap() { return this.tasks; },
    createdAt: '2026-07-07T14:00:00Z',
    updatedAt: '2026-07-07T14:00:00Z',
  },
];

// ─── Helper: merge a Supabase partial update into local state ─────────────────

function mergeRequestUpdate(prev: CounselingRequest[], id: string, updates: Partial<CounsellingRequest>): CounselingRequest[] {
  return prev.map(r => {
    if (r.id !== id) return r;
    const merged = { ...r, ...updates, updatedAt: new Date().toISOString() };
    return { ...merged, get sharedResources() { return merged.resources; }, get roadmap() { return merged.tasks; } };
  });
}

function wrapRequest(r: CounsellingRequest): CounselingRequest {
  return Object.assign(r, {
    get sharedResources() { return r.resources; },
    get roadmap() { return r.tasks; },
  }) as CounselingRequest;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CounselingContext = createContext<CounselingContextType | undefined>(undefined);

export function CounselingProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<CounselingRequest[]>(SEED_REQUESTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Initial load from Supabase ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const data = await counsellingService.fetchAllRequests();
        if (data.length > 0) {
          setRequests(data.map(wrapRequest));
        }
        // else: keep seed data so the UI still has something to show
      } catch (err) {
        // Supabase may be unreachable (no schema yet) — silently use seed data
        console.warn('[CounselingContext] Supabase load failed, using seed data.', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // ── Realtime subscriptions ──────────────────────────────────────────────────
  useCounsellingRealtime({
    onRequestInsert: useCallback((req: CounsellingRequest) => {
      setRequests(prev => {
        if (prev.some(r => r.id === req.id)) return prev;
        toast.info(`New Counselling Request`, { description: `${req.studentName} requested a session on ${req.subject}.` });
        return [wrapRequest(req), ...prev];
      });
    }, []),

    onRequestUpdate: useCallback((req: CounsellingRequest) => {
      setRequests(prev => {
        const existing = prev.find(r => r.id === req.id);
        if (!existing) return prev;
        if (existing.status !== req.status) {
          toast.success(`Request Updated`, { description: `Request for ${req.subject} is now ${req.status}.` });
        }
        return mergeRequestUpdate(prev, req.id, req);
      });
    }, []),

    onResourceInsert: useCallback((resource: SessionResource) => {
      setRequests(prev => prev.map(r => {
        if (r.id !== resource.requestId) return r;
        const updated = { ...r, resources: [...r.resources, resource] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    }, []),

    onTaskInsert: useCallback((task: StudentTask) => {
      setRequests(prev => prev.map(r => {
        if (r.id !== task.requestId) return r;
        const updated = { ...r, tasks: [...r.tasks, task] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    }, []),

    onTaskUpdate: useCallback((task: StudentTask) => {
      setRequests(prev => prev.map(r => {
        if (r.id !== task.requestId) return r;
        
        const existingTask = r.tasks.find(t => t.id === task.id);
        if (existingTask && existingTask.status !== task.status && task.status === 'Completed') {
          toast.success(`Task Completed!`, { description: `"${task.title}" has been completed.` });
        }
        
        const updated = { ...r, tasks: r.tasks.map(t => t.id === task.id ? task : t) };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    }, []),
  });

  // ── Actions ─────────────────────────────────────────────────────────────────

  const addRequest = useCallback(async (payload: BookCounsellingPayload, files?: File[]) => {
    try {
      // Upload files first (if any) — requestId will be placeholder until inserted
      const uploadedPaths: string[] = [];
      const newReq = await counsellingService.bookCounsellingRequest(payload, []);
      
      // Upload files now that we have the real ID
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            const url = await counsellingService.uploadAttachment(file, newReq.id);
            uploadedPaths.push(url);
          } catch (e) {
            console.warn('[CounselingContext] File upload failed:', e);
          }
        }
        // Update attachments in DB if any files were uploaded
        if (uploadedPaths.length > 0) {
          try {
            await import('@/lib/supabaseClient').then(({ supabase }) => 
              supabase.from('counselling_requests').update({ attachments: uploadedPaths }).eq('id', newReq.id)
            );
          } catch (e) {
            console.warn('Failed to update attachments array', e);
          }
        }
      }

      // Optimistically add to local state (Realtime will also fire)
      setRequests(prev => {
        if (prev.some(r => r.id === newReq.id)) return prev;
        return [wrapRequest({ ...newReq, attachments: [...newReq.attachments, ...uploadedPaths] }), ...prev];
      });
    } catch (err) {
      console.error('[CounselingContext] addRequest error:', err);
      throw err;
    }
  }, []);

  const updateRequest = useCallback(async (id: string, updates: Partial<CounselingRequest>) => {
    setRequests(prev => mergeRequestUpdate(prev, id, updates));
  }, []);

  const acceptRequest = useCallback(async (id: string, meetingLink: string, scheduledDate: string, scheduledTime: string, notes: string) => {
    try {
      await counsellingService.acceptRequest({ requestId: id, meetingLink, scheduledDate, scheduledTime, teacherNotes: notes });
    } catch (err) {
      console.warn('[CounselingContext] acceptRequest DB error, applying locally:', err);
    }
    setRequests(prev => mergeRequestUpdate(prev, id, { status: 'Accepted', meetingLink, scheduledDate, scheduledTime, teacherNotes: notes }));
  }, []);

  const rejectRequest = useCallback(async (id: string, reason: string) => {
    try {
      await counsellingService.rejectRequest(id, reason);
    } catch (err) {
      console.warn('[CounselingContext] rejectRequest DB error, applying locally:', err);
    }
    setRequests(prev => mergeRequestUpdate(prev, id, { status: 'Rejected', rejectionReason: reason }));
  }, []);

  const rescheduleRequest = useCallback(async (id: string, newDate: string, newTime: string, notes: string) => {
    try {
      await counsellingService.rescheduleRequest(id, newDate, newTime, notes);
    } catch (err) {
      console.warn('[CounselingContext] rescheduleRequest DB error, applying locally:', err);
    }
    setRequests(prev => mergeRequestUpdate(prev, id, { status: 'Rescheduled', scheduledDate: newDate, scheduledTime: newTime, teacherNotes: notes }));
  }, []);

  const completeRequest = useCallback(async (id: string, summary: string, teacherNotes: string) => {
    try {
      await counsellingService.completeSession(id, summary, teacherNotes);
    } catch (err) {
      console.warn('[CounselingContext] completeRequest DB error, applying locally:', err);
    }
    setRequests(prev => mergeRequestUpdate(prev, id, { status: 'Completed', teacherNotes }));
  }, []);

  const addResource = useCallback(async (reqId: string, resource: Omit<SessionResource, 'id' | 'requestId' | 'createdAt'>) => {
    try {
      const saved = await counsellingService.addResource({ requestId: reqId, ...resource });
      setRequests(prev => prev.map(r => {
        if (r.id !== reqId) return r;
        const updated = { ...r, resources: [...r.resources, saved] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    } catch (err) {
      console.warn('[CounselingContext] addResource DB error, applying locally:', err);
      const localRes: SessionResource = { id: `RES-${Date.now()}`, requestId: reqId, ...resource, createdAt: new Date().toISOString() };
      setRequests(prev => prev.map(r => {
        if (r.id !== reqId) return r;
        const updated = { ...r, resources: [...r.resources, localRes] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    }
  }, []);

  const addRoadmapItem = useCallback(async (reqId: string, item: Omit<StudentTask, 'id' | 'requestId' | 'createdAt' | 'progress' | 'status'>) => {
    try {
      const saved = await counsellingService.addTask({ requestId: reqId, ...item });
      setRequests(prev => prev.map(r => {
        if (r.id !== reqId) return r;
        const updated = { ...r, tasks: [...r.tasks, saved] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    } catch (err) {
      console.warn('[CounselingContext] addRoadmapItem DB error, applying locally:', err);
      const localTask: StudentTask = { id: `RM-${Date.now()}`, requestId: reqId, progress: 0, status: 'Not Started', ...item, createdAt: new Date().toISOString() };
      setRequests(prev => prev.map(r => {
        if (r.id !== reqId) return r;
        const updated = { ...r, tasks: [...r.tasks, localTask] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    }
  }, []);

  const updateRoadmapItem = useCallback(async (reqId: string, itemId: string, updates: Partial<StudentTask>) => {
    try {
      await counsellingService.updateTaskProgress(itemId, updates.progress ?? 0, updates.status ?? 'Not Started', updates.studentNote);
    } catch (err) {
      console.warn('[CounselingContext] updateRoadmapItem DB error, applying locally:', err);
    }
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const updated = { ...r, tasks: r.tasks.map(t => t.id === itemId ? { ...t, ...updates } : t) };
      return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
    }));
  }, []);

  const addSessionHistory = useCallback(async (reqId: string, payload: import('@/lib/counselling/types').AddSessionHistoryPayload) => {
    try {
      const saved = await counsellingService.addSessionHistory(payload);
      setRequests(prev => prev.map(r => {
        if (r.id !== reqId) return r;
        const updated = { ...r, sessionHistory: [...r.sessionHistory, saved] };
        return { ...updated, get sharedResources() { return updated.resources; }, get roadmap() { return updated.tasks; } };
      }));
    } catch (err) {
      console.warn('[CounselingContext] addSessionHistory DB error:', err);
    }
  }, []);

  // ── Selectors ────────────────────────────────────────────────────────────────

  const getStudentRequests = useCallback((studentId: string) =>
    requests.filter(r => r.studentId === studentId), [requests]);

  const getTeacherRequests = useCallback((teacherId: string) =>
    requests.filter(r => r.teacherId === teacherId), [requests]);

  const getPendingCount = useCallback((teacherId: string) =>
    requests.filter(r => r.teacherId === teacherId && r.status === 'Pending').length, [requests]);

  const getAnalytics = useCallback((): CounselingAnalytics => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const accepted = requests.filter(r => r.status === 'Accepted' || r.status === 'Completed').length;

    const teacherMap: Record<string, { name: string; pending: number; completed: number }> = {};
    requests.forEach(r => {
      if (!teacherMap[r.teacherId]) teacherMap[r.teacherId] = { name: r.teacherName, pending: 0, completed: 0 };
      if (r.status === 'Pending') teacherMap[r.teacherId].pending++;
      if (r.status === 'Completed') teacherMap[r.teacherId].completed++;
    });

    const deptMap: Record<string, { total: number; completed: number }> = {};
    requests.forEach(r => {
      if (!deptMap[r.teacherDept]) deptMap[r.teacherDept] = { total: 0, completed: 0 };
      deptMap[r.teacherDept].total++;
      if (r.status === 'Completed') deptMap[r.teacherDept].completed++;
    });

    const catMap: Record<string, number> = {};
    requests.forEach(r => { catMap[r.category] = (catMap[r.category] || 0) + 1; });

    return {
      totalRequests: total,
      pendingRequests: pending,
      completedSessions: completed,
      avgResponseTimeHours: 4.2,
      acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
      teacherStats: Object.entries(teacherMap).map(([id, s]) => ({ teacherId: id, teacherName: s.name, ...s, avgResponse: 4.2 })),
      deptStats: Object.entries(deptMap).map(([dept, s]) => ({ dept, ...s })),
      monthlyStats: [
        { month: 'May', requests: 8, completed: 6 },
        { month: 'Jun', requests: 12, completed: 9 },
        { month: 'Jul', requests: total, completed },
      ],
      categoryBreakdown: Object.entries(catMap).map(([category, count]) => ({ category, count })),
    };
  }, [requests]);

  return (
    <CounselingContext.Provider value={{
      requests, isLoading, error,
      addRequest, updateRequest, acceptRequest, rejectRequest,
      rescheduleRequest, completeRequest, addResource, addRoadmapItem,
      updateRoadmapItem, addSessionHistory, getStudentRequests,
      getTeacherRequests, getPendingCount, getAnalytics,
    }}>
      {children}
    </CounselingContext.Provider>
  );
}

export function useCounseling() {
  const ctx = useContext(CounselingContext);
  if (!ctx) throw new Error('useCounseling must be inside CounselingProvider');
  return ctx;
}
