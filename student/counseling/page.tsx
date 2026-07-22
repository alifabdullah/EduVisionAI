'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';
import { useCounseling } from '@/context/CounselingContext';

const STUDENT_ID = '261-16-010';

const statusColor: Record<string, string> = {
  Pending: '#F59E0B', Accepted: '#10B981', Rejected: '#F43F5E',
  Rescheduled: '#A78BFA', Completed: '#6C63FF',
};
const statusIcon: Record<string, string> = {
  Pending: '⏳', Accepted: '✅', Rejected: '❌', Rescheduled: '🔄', Completed: '🎓',
};
const priorityColor: Record<string, string> = {
  Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Urgent: '#F43F5E',
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}55`, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {statusIcon[label] ?? '•'} {label}
    </span>
  );
}

export default function MyCounselingPage() {
  const router = useRouter();
  const { getStudentRequests, updateRoadmapItem } = useCounseling();
  const requests = getStudentRequests(STUDENT_ID);
  const [tab, setTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [progressInputs, setProgressInputs] = useState<Record<string, number>>({});
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  const filtered = requests.filter(r => {
    if (tab === 'pending') return r.status === 'Pending';
    if (tab === 'active') return r.status === 'Accepted' || r.status === 'Rescheduled';
    if (tab === 'completed') return r.status === 'Completed' || r.status === 'Rejected';
    return true;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    active: requests.filter(r => r.status === 'Accepted' || r.status === 'Rescheduled').length,
    completed: requests.filter(r => r.status === 'Completed' || r.status === 'Rejected').length,
  };

  function handleProgressUpdate(reqId: string, itemId: string) {
    const prog = progressInputs[itemId] ?? 0;
    const note = noteInputs[itemId] ?? '';
    const status = prog >= 100 ? 'Completed' : prog > 0 ? 'In Progress' : 'Not Started';
    updateRoadmapItem(reqId, itemId, { progress: prog, status, studentNote: note || undefined });
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="My Counseling Requests" subtitle="Track all your counseling sessions, roadmaps, and teacher feedback" accentColor="#6C63FF" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {([
            { label: 'Total Requests', val: counts.all, color: '#6C63FF' },
            { label: 'Pending', val: counts.pending, color: '#F59E0B' },
            { label: 'Active', val: counts.active, color: '#10B981' },
            { label: 'Completed', val: counts.completed, color: '#22D3EE' },
          ]).map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + New Request button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'pending', 'active', 'completed'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 16px', borderRadius: 10, fontSize: '0.82rem', fontWeight: tab === t ? 700 : 500,
                border: tab === t ? '1px solid rgba(108,99,255,0.5)' : '1px solid transparent',
                background: tab === t ? 'rgba(108,99,255,0.18)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--muted)', cursor: 'pointer',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)} ({counts[t]})
              </button>
            ))}
          </div>
          <button onClick={() => router.push('/student/counseling/book')} style={{
            padding: '8px 18px', background: 'linear-gradient(135deg, #003B95, #50B748)', border: 'none', borderRadius: 10,
            color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
          }}>
            + Book New Session
          </button>
        </div>

        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>📋</p>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>No requests found</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>Book your first counseling session to get started.</p>
            <button onClick={() => router.push('/student/counseling/book')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#003B95,#50B748)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              📅 Book Counselling
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(req => {
            const isExpanded = expanded === req.id;
            const sc = statusColor[req.status] ?? '#94A3B8';
            const pc = priorityColor[req.priority] ?? '#F59E0B';
            return (
              <div key={req.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${sc}` }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.875rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{req.subject}</h3>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${pc}22`, color: pc, border: `1px solid ${pc}44` }}>{req.priority}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      👨‍🏫 {req.teacherName} · 📁 {req.category} · 📅 {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge label={req.status} color={sc} />
                    <button onClick={() => setExpanded(isExpanded ? null : req.id)} style={{
                      padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer',
                    }}>
                      {isExpanded ? 'Collapse ▲' : 'Details ▼'}
                    </button>
                  </div>
                </div>

                {/* Scheduled info if accepted */}
                {(req.status === 'Accepted' || req.status === 'Rescheduled') && req.scheduledDate && (
                  <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>Session Confirmed</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{req.scheduledDate} at {req.scheduledTime}</p>
                    </div>
                    {req.meetingLink && (
                      <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', padding: '6px 14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                        🔗 Join Meeting
                      </a>
                    )}
                  </div>
                )}

                {/* Teacher notes / rejection */}
                {req.teacherNotes && (
                  <div style={{ padding: '8px 12px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>💬 Teacher Notes</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>"{req.teacherNotes}"</p>
                  </div>
                )}
                {req.status === 'Rejected' && req.rejectionReason && (
                  <div style={{ padding: '8px 12px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, marginBottom: '0.875rem' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>❌ Rejection Reason</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{req.rejectionReason}</p>
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Description */}
                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Your Description</p>
                      <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>{req.description}</p>
                    </div>

                    {/* Meeting Summary (from completed session history) */}
                    {req.sessionHistory.length > 0 && req.sessionHistory[req.sessionHistory.length - 1].summary && (
                      <div style={{ padding: '10px 14px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>📝 Meeting Summary</p>
                        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.6 }}>{req.sessionHistory[req.sessionHistory.length - 1].summary}</p>
                      </div>
                    )}

                    {/* Shared Resources */}
                    {req.sharedResources.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>📚 Shared Resources</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {req.sharedResources.map(res => (
                            <div key={res.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                              <span style={{ fontSize: '1.1rem' }}>{res.type === 'PDF' ? '📄' : res.type === 'Video' ? '▶️' : res.type === 'Book' ? '📗' : res.type === 'GitHub' ? '🐙' : '🔗'}</span>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{res.title}</p>
                                {res.description && <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{res.description}</p>}
                              </div>
                              {res.url && <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: '#22D3EE', textDecoration: 'none', fontWeight: 600 }}>Open →</a>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Roadmap */}
                    {req.roadmap.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>🗺️ Personalized Roadmap</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {req.roadmap.map(item => {
                            const ic = item.status === 'Completed' ? '#10B981' : item.status === 'In Progress' ? '#6C63FF' : item.status === 'Missed' ? '#F43F5E' : '#94A3B8';
                            return (
                              <div key={item.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, borderLeft: `3px solid ${ic}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
                                  <div>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--muted)', marginRight: 8 }}>{item.week}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.title}</span>
                                  </div>
                                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: ic, background: `${ic}22`, padding: '2px 8px', borderRadius: 999 }}>{item.status}</span>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 6 }}>{item.description}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 8 }}>📅 Deadline: {item.deadline}</p>
                                {/* Progress bar */}
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Progress</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ic }}>{item.progress}%</span>
                                  </div>
                                  <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                                    <div style={{ height: '100%', width: `${item.progress}%`, background: ic, borderRadius: 99, transition: 'width 0.4s' }} />
                                  </div>
                                </div>
                                {item.studentNote && <p style={{ fontSize: '0.72rem', color: '#A78BFA', fontStyle: 'italic', marginBottom: 8 }}>📝 Your note: {item.studentNote}</p>}
                                {item.status !== 'Completed' && (
                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <input
                                      type="number" min={0} max={100}
                                      value={progressInputs[item.id] ?? item.progress}
                                      onChange={e => setProgressInputs(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
                                      style={{ width: 70, padding: '5px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)', fontSize: '0.78rem', outline: 'none' }}
                                    />
                                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>%</span>
                                    <input
                                      type="text"
                                      placeholder="Add a note..."
                                      value={noteInputs[item.id] ?? ''}
                                      onChange={e => setNoteInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                                      style={{ flex: 1, padding: '5px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'var(--text)', fontSize: '0.78rem', outline: 'none', minWidth: 120 }}
                                    />
                                    <button
                                      onClick={() => handleProgressUpdate(req.id, item.id)}
                                      style={{ padding: '5px 12px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8, color: '#A78BFA', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      Update
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Session History */}
                    {req.sessionHistory.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>📅 Session History</p>
                        {req.sessionHistory.map(s => (
                          <div key={s.id} style={{ padding: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.topic}</p>
                              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.date} · {s.duration}</span>
                            </div>
                            {s.summary && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 4 }}>{s.summary}</p>}
                            {s.teacherNotes && <p style={{ fontSize: '0.75rem', color: '#22D3EE', fontStyle: 'italic' }}>Teacher: "{s.teacherNotes}"</p>}
                            {s.studentNotes && <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontStyle: 'italic', marginTop: 2 }}>You: "{s.studentNotes}"</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Assignments */}
                    {req.assignments && req.assignments.length > 0 && (
                      <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>📌 Assignments</p>
                        {req.assignments.map((a, i) => (
                          <p key={i} style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 2 }}>• {a}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
