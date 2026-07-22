'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Realtime hook — subscribes to Supabase Realtime channels and fires callbacks
// Usage: const unsub = subscribeToCounsellingUpdates(onInsert, onUpdate)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { CounsellingRequest, SessionResource, StudentTask } from './types';
import { mapRequest, mapResource, mapTask } from './mappers';

interface RealtimeCallbacks {
  onRequestInsert?: (req: CounsellingRequest) => void;
  onRequestUpdate?: (req: CounsellingRequest) => void;
  onResourceInsert?: (resource: SessionResource) => void;
  onTaskUpdate?: (task: StudentTask) => void;
  onTaskInsert?: (task: StudentTask) => void;
}

export function useCounsellingRealtime(callbacks: RealtimeCallbacks) {
  useEffect(() => {
    // ── Channel: counselling_requests ────────────────────────────────────────
    const requestChannel = supabase
      .channel('counselling_requests_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'counselling_requests' },
        payload => {
          const req = mapRequest(payload.new as Parameters<typeof mapRequest>[0], [], [], []);
          callbacks.onRequestInsert?.(req);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'counselling_requests' },
        payload => {
          const req = mapRequest(payload.new as Parameters<typeof mapRequest>[0], [], [], []);
          callbacks.onRequestUpdate?.(req);
        }
      )
      .subscribe();

    // ── Channel: session_resources ────────────────────────────────────────────
    const resourceChannel = supabase
      .channel('session_resources_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'session_resources' },
        payload => {
          const resource = mapResource(payload.new as Parameters<typeof mapResource>[0]);
          callbacks.onResourceInsert?.(resource);
        }
      )
      .subscribe();

    // ── Channel: student_tasks ────────────────────────────────────────────────
    const taskChannel = supabase
      .channel('student_tasks_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'student_tasks' },
        payload => {
          const task = mapTask(payload.new as Parameters<typeof mapTask>[0]);
          callbacks.onTaskInsert?.(task);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'student_tasks' },
        payload => {
          const task = mapTask(payload.new as Parameters<typeof mapTask>[0]);
          callbacks.onTaskUpdate?.(task);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestChannel);
      supabase.removeChannel(resourceChannel);
      supabase.removeChannel(taskChannel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
