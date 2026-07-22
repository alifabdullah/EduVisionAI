'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface MenteeItem {
  id: string; name: string; roll: string; program: string;
  regApproval: ApprovalStatus;
  midtermApproval: ApprovalStatus;
  finalApproval: ApprovalStatus;
}

const initialMentees: MenteeItem[] = [
  { id: 'CS21001', name: 'Joy Kumar Yuv', roll: '261-16-010', program: 'B.Sc. CSE', regApproval: 'Approved', midtermApproval: 'Approved', finalApproval: 'Pending' },
  { id: 'CS21003', name: 'Liam Scott', roll: 'CS21049', program: 'B.Sc. CSE', regApproval: 'Approved', midtermApproval: 'Pending', finalApproval: 'Pending' },
  { id: 'CS21004', name: 'Noah Wilson', roll: 'CS21050', program: 'B.Sc. CSE', regApproval: 'Approved', midtermApproval: 'Approved', finalApproval: 'Approved' },
];

const statusColor: Record<ApprovalStatus, string> = {
  Approved: '#10B981', Rejected: '#F43F5E', Pending: '#F59E0B',
};

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const c = statusColor[status];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${c}20`, color: c, border: `1px solid ${c}44`, whiteSpace: 'nowrap' }}>
      {status === 'Approved' ? '✅' : status === 'Rejected' ? '❌' : '⏳'} {status}
    </span>
  );
}

function ApprovalButtons({ field, student, onUpdate }: { field: keyof MenteeItem; student: MenteeItem; onUpdate: (id: string, field: keyof MenteeItem, val: ApprovalStatus) => void }) {
  const current = student[field] as ApprovalStatus;
  if (current !== 'Pending') return <ApprovalBadge status={current} />;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button onClick={() => onUpdate(student.id, field, 'Approved')}
        style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}>✅</button>
      <button onClick={() => onUpdate(student.id, field, 'Rejected')}
        style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)', color: '#F43F5E', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}>❌</button>
    </div>
  );
}

export default function MentorClearancePage() {
  const [mentees, setMentees] = useState<MenteeItem[]>(initialMentees);

  const update = (id: string, field: keyof MenteeItem, val: ApprovalStatus) => {
    setMentees(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const totalApproved = mentees.filter(m => m.finalApproval === 'Approved').length;
  const totalPending = mentees.reduce((acc, m) => acc + (['regApproval','midtermApproval','finalApproval'] as const).filter(f => m[f] === 'Pending').length, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Mentor Clearance" subtitle="Verify and approve student registration, midterm, and final exam clearances" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Mentees', value: mentees.length, color: '#1D4ED8' },
            { label: 'Final Approved', value: totalApproved, color: '#10B981' },
            { label: 'Pending Actions', value: totalPending, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className="glass-card stat-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Approval Info Banner */}
        <div style={{ padding: '1rem 1.25rem', background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)', borderRadius: 12, marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            💡 <strong style={{ color: 'var(--text)' }}>Mentor Clearance Workflow:</strong> As assigned mentor, you must approve each student&apos;s registration, midterm, and final exam clearance. Approval unlocks exam access in the system.
          </p>
        </div>

        {/* Mentee Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mentees.map(m => (
            <div key={m.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>
                  {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 2 }}>{m.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>ID: {m.id} · Roll: {m.roll} · {m.program}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {([
                  { label: '📋 Registration Clearance', field: 'regApproval' as const },
                  { label: '📝 Midterm Clearance', field: 'midtermApproval' as const },
                  { label: '🎓 Final Exam Clearance', field: 'finalApproval' as const },
                ]).map(({ label, field }) => (
                  <div key={field} style={{ padding: '0.875rem 1rem', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</p>
                    <ApprovalButtons field={field} student={m} onUpdate={update} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
