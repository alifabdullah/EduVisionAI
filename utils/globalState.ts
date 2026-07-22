'use client';
import { useState, useEffect } from 'react';

export interface GlobalMentorRequest {
  id: string;
  studentName: string;
  studentId: string;
  dept: string;
  type: string;
  title: string;
  topic: string;
  date: string;
  status: string;
  comment: string;
}

export interface ActiveStudyPlan {
  id: string;
  title: string;
  progress: number;
  tasks: { name: string; completed: boolean }[];
}

export function getGlobalRequests(): GlobalMentorRequest[] {
  if (typeof window === 'undefined') return [];
  const val = localStorage.getItem('ev_global_requests');
  return val ? JSON.parse(val) : [];
}

export function addGlobalRequest(req: GlobalMentorRequest) {
  if (typeof window === 'undefined') return;
  const current = getGlobalRequests();
  localStorage.setItem('ev_global_requests', JSON.stringify([req, ...current]));
  window.dispatchEvent(new Event('ev_requests_updated'));
}

export function updateGlobalRequestStatus(id: string, status: string, comment: string) {
  if (typeof window === 'undefined') return;
  const current = getGlobalRequests();
  const updated = current.map(r => r.id === id ? { ...r, status, comment } : r);
  localStorage.setItem('ev_global_requests', JSON.stringify(updated));
  window.dispatchEvent(new Event('ev_requests_updated'));
}

export function getActiveStudyPlan(): ActiveStudyPlan | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem('ev_active_study_plan');
  return val ? JSON.parse(val) : null;
}

export function setActiveStudyPlan(plan: ActiveStudyPlan) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ev_active_study_plan', JSON.stringify(plan));
  window.dispatchEvent(new Event('ev_study_plan_updated'));
}

export function useGlobalRequests() {
  const [reqs, setReqs] = useState<GlobalMentorRequest[]>([]);
  useEffect(() => {
    setReqs(getGlobalRequests());
    const handleUpdate = () => setReqs(getGlobalRequests());
    window.addEventListener('ev_requests_updated', handleUpdate);
    return () => window.removeEventListener('ev_requests_updated', handleUpdate);
  }, []);
  return reqs;
}

export function useActiveStudyPlan() {
  const [plan, setPlan] = useState<ActiveStudyPlan | null>(null);
  useEffect(() => {
    setPlan(getActiveStudyPlan());
    const handleUpdate = () => setPlan(getActiveStudyPlan());
    window.addEventListener('ev_study_plan_updated', handleUpdate);
    return () => window.removeEventListener('ev_study_plan_updated', handleUpdate);
  }, []);
  return plan;
}
