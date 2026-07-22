'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

type ApprovalLevel = 'Teacher' | 'Head' | 'Dean';
type SheetStatus = 'Draft' | 'Submitted' | 'Approved by Head' | 'Approved by Dean' | 'Published';

interface GradeSheet {
  id: string; course: string; semester: string;
  students: number; status: SheetStatus;
  submittedAt?: string; headApprovedAt?: string; deanApprovedAt?: string;
}

const initialSheets: GradeSheet[] = [
  { id: 'GS-001', course: 'CSE301 – Data Structures', semester: 'Spring 2026', students: 45, status: 'Approved by Head', headApprovedAt: 'Jun 10, 2026' },
  { id: 'GS-002', course: 'CSE303 – Database Systems', semester: 'Spring 2026', students: 38, status: 'Submitted', submittedAt: 'Jun 12, 2026' },
  { id: 'GS-003', course: 'CSE401 – Algorithms', semester: 'Spring 2026', students: 30, status: 'Draft' },
];

const statusColors: Record<SheetStatus, string> = {
  Draft: '#94A3B8', Submitted: '#F59E0B', 'Approved by Head': '#22D3EE', 'Approved by Dean': '#A78BFA', Published: '#10B981',
};

const statusOrder: SheetStatus[] = ['Draft', 'Submitted', 'Approved by Head', 'Approved by Dean', 'Published'];

function WorkflowTrack({ status }: { status: SheetStatus }) {
  const steps = [
    { label: 'Teacher', icon: '👨‍🏫', key: 'Draft' },
    { label: 'Head', icon: '🏛️', key: 'Submitted' },
    { label: 'Dean', icon: '🎓', key: 'Approved by Head' },
    { label: 'Published', icon: '✅', key: 'Published' },
  ];
  const cur = statusOrder.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((step, i) => {
        const done = cur > i;
        const active = cur === i + 1 || (i === 0 && cur === 0);
        const c = done ? '#10B981' : active ? '#22D3EE' : '#94A3B8';
        return (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#10B98122' : active ? '#22D3EE22' : 'var(--surface-2)', border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                {done ? '✓' : step.icon}
              </div>
              <span style={{ fontSize: '0.6rem', color: c, fontWeight: 700, whiteSpace: 'nowrap' }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 32, height: 2, background: done ? '#10B981' : 'var(--border)', margin: '0 2px', marginBottom: 14, flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function GradeSheetPage() {
  const [sheets, setSheets] = useState<GradeSheet[]>(initialSheets);

  const advance = (id: string) => {
    setSheets(prev => prev.map(s => {
      if (s.id !== id) return s;
      const cur = statusOrder.indexOf(s.status);
      const next = statusOrder[cur + 1];
      if (!next) return s;
      return { ...s, status: next, submittedAt: next === 'Submitted' ? 'Jun 14, 2026' : s.submittedAt, headApprovedAt: next === 'Approved by Head' ? 'Jun 14, 2026' : s.headApprovedAt, deanApprovedAt: next === 'Approved by Dean' ? 'Jun 14, 2026' : s.deanApprovedAt };
    }));
  };

  const nextAction: Partial<Record<SheetStatus, string>> = {
    Draft: '📤 Submit to Head', Submitted: '✅ Head Approve', 'Approved by Head': '🎓 Dean Approve', 'Approved by Dean': '🚀 Publish',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Grade Sheet Approval" subtitle="Multi-level grade sheet review and publishing workflow" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Sheets', value: sheets.length, color: '#1D4ED8' },
            { label: 'Published', value: sheets.filter(s => s.status === 'Published').length, color: '#10B981' },
            { label: 'Pending Approval', value: sheets.filter(s => ['Submitted', 'Approved by Head'].includes(s.status)).length, color: '#F59E0B' },
            { label: 'Draft', value: sheets.filter(s => s.status === 'Draft').length, color: '#94A3B8' },
          ].map(s => (
            <div key={s.label} className="glass-card stat-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Workflow Info */}
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)', borderRadius: 12, marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>📋 Approval Flow: Teacher → Department Head → Dean → Published</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Grade sheets must pass through all approval levels before results are visible to students.</p>
        </div>

        {/* Grade Sheet Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sheets.map(s => (
            <div key={s.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${statusColors[s.status]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 2 }}>{s.course}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{s.semester} · {s.students} Students · ID: {s.id}</p>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${statusColors[s.status]}20`, color: statusColors[s.status], border: `1px solid ${statusColors[s.status]}44`, whiteSpace: 'nowrap' }}>
                  {s.status}
                </span>
              </div>

              {/* Workflow track */}
              <div style={{ marginBottom: '1.25rem' }}>
                <WorkflowTrack status={s.status} />
              </div>

              {/* Timestamps */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '1rem' }}>
                {s.submittedAt && <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>📤 Submitted: {s.submittedAt}</span>}
                {s.headApprovedAt && <span style={{ fontSize: '0.72rem', color: '#22D3EE' }}>✅ Head: {s.headApprovedAt}</span>}
                {s.deanApprovedAt && <span style={{ fontSize: '0.72rem', color: '#A78BFA' }}>🎓 Dean: {s.deanApprovedAt}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {nextAction[s.status] && (
                  <button onClick={() => advance(s.id)}
                    style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                    {nextAction[s.status]}
                  </button>
                )}
                {s.status === 'Published' && (
                  <span style={{ padding: '8px 18px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>
                    🚀 Live – Visible to Students
                  </span>
                )}
                <button style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: 10, color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                  👁️ Preview Sheet
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
