'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import { useCounseling } from '@/context/CounselingContext';
import { useApp } from '@/context/AppContext';
import type { CounselingRequest, RoadmapItem, CounselingResource } from '@/context/CounselingContext';

const statusColor: Record<string, string> = {
  Pending: '#F59E0B', Accepted: '#10B981', Rejected: '#F43F5E',
  Rescheduled: '#A78BFA', Completed: '#6C63FF',
};
const priorityColor: Record<string, string> = {
  Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Urgent: '#F43F5E',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'var(--text)',
  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
};

export default function TeacherCounselingPage() {
  const { user } = useApp();
  const TEACHER_ID = user?.id || 'TCH-005';

  const { 
    getTeacherRequests, acceptRequest, rejectRequest, rescheduleRequest, 
    completeRequest, addRoadmapItem, addResource 
  } = useCounseling();
  
  const requests = getTeacherRequests(TEACHER_ID);

  const [tab, setTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');
  const [selectedReq, setSelectedReq] = useState<CounselingRequest | null>(null);

  // Modal states
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showResource, setShowResource] = useState(false);

  // Form states
  const [meetLink, setMeetLink] = useState('');
  const [schDate, setSchDate] = useState('');
  const [schTime, setSchTime] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  
  // Roadmap form
  const [rmWeek, setRmWeek] = useState('Week 1');
  const [rmTitle, setRmTitle] = useState('');
  const [rmDesc, setRmDesc] = useState('');
  const [rmDeadline, setRmDeadline] = useState('');

  // Resource form
  const [resType, setResType] = useState<'PDF'|'Video'|'Document'|'Link'|'Book'|'GitHub'>('Link');
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resDesc, setResDesc] = useState('');

  const pending = requests.filter(r => r.status === 'Pending');
  const upcoming = requests.filter(r => r.status === 'Accepted' || r.status === 'Rescheduled');
  const completed = requests.filter(r => r.status === 'Completed');

  const filtered = tab === 'pending' ? pending : tab === 'upcoming' ? upcoming : completed;

  function handleAccept() {
    if (selectedReq && meetLink && schDate && schTime) {
      acceptRequest(selectedReq.id, meetLink, schDate, schTime, notes);
      setShowAccept(false);
      resetForms();
    }
  }

  function handleReject() {
    if (selectedReq && rejectReason) {
      rejectRequest(selectedReq.id, rejectReason);
      setShowReject(false);
      resetForms();
    }
  }

  function handleReschedule() {
    if (selectedReq && schDate && schTime) {
      rescheduleRequest(selectedReq.id, schDate, schTime, notes);
      setShowReschedule(false);
      resetForms();
    }
  }

  function handleComplete() {
    if (selectedReq && notes) {
      completeRequest(selectedReq.id, notes, notes); // using notes for summary too for simplicity
      setShowComplete(false);
      resetForms();
    }
  }

  function handleAddRoadmap() {
    if (selectedReq && rmTitle && rmDeadline) {
      addRoadmapItem(selectedReq.id, {
        week: rmWeek,
        title: rmTitle,
        description: rmDesc,
        deadline: rmDeadline,
      });
      setShowRoadmap(false);
      resetForms();
    }
  }

  function handleAddResource() {
    if (selectedReq && resTitle) {
      addResource(selectedReq.id, {
        type: resType,
        title: resTitle,
        url: resUrl || undefined,
        description: resDesc || undefined,
      });
      setShowResource(false);
      resetForms();
    }
  }

  function resetForms() {
    setMeetLink(''); setSchDate(''); setSchTime(''); setNotes(''); setRejectReason('');
    setRmWeek('Week 1'); setRmTitle(''); setRmDesc(''); setRmDeadline('');
    setResTitle(''); setResUrl(''); setResDesc('');
  }

  function ActionModal({ title, onClose, children, onSubmit, submitLabel, submitColor }: any) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: 480, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.5rem' }}>
            {children}
          </div>
          <button onClick={onSubmit} style={{ width: '100%', padding: '12px', background: submitColor, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {submitLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Counseling Dashboard" subtitle="Manage student requests, sessions, and roadmaps" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {([
            { label: 'Pending Requests', val: pending.length, color: '#F59E0B' },
            { label: 'Upcoming Sessions', val: upcoming.length, color: '#10B981' },
            { label: 'Completed Sessions', val: completed.length, color: '#6C63FF' },
            { label: 'Avg Response Time', val: '4.2 hrs', color: '#22D3EE' },
          ]).map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {(['pending', 'upcoming', 'completed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 16px', borderRadius: 10, fontSize: '0.85rem', fontWeight: tab === t ? 700 : 500,
              background: tab === t ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
              border: tab === t ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)',
              color: tab === t ? '#10B981' : 'var(--muted)', cursor: 'pointer'
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)} ({t === 'pending' ? pending.length : t === 'upcoming' ? upcoming.length : completed.length})
            </button>
          ))}
        </div>

        {/* Request List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.length === 0 && (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              No {tab} counseling requests.
            </div>
          )}
          {filtered.map(req => {
            const sc = statusColor[req.status];
            const pc = priorityColor[req.priority];
            return (
              <div key={req.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${sc}` }}>
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1e293b', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
                      {req.studentAvatar ? (
                        <img src={req.studentAvatar} alt={req.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        req.studentName.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {req.studentName}
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 999, background: `${pc}22`, color: pc, border: `1px solid ${pc}55` }}>{req.priority} Priority</span>
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                        {req.studentId} · Dept of {req.studentDept} · CGPA: {req.studentCgpa} · Attendance: {req.studentAttendance}%
                      </p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 999, background: `${sc}22`, color: sc, fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${sc}55` }}>
                    {req.status}
                  </span>
                </div>

                {/* Request Details */}
                <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{req.category} · Topic: {req.subject}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6 }}>{req.description}</p>
                  {req.preferredDate && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8 }}>
                      🕒 Requested Time: {req.preferredDate} at {req.preferredTime}
                    </p>
                  )}
                </div>

                {/* Scheduled Info */}
                {req.scheduledDate && (
                  <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, marginBottom: '1rem', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>📅</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>Session Scheduled</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{req.scheduledDate} at {req.scheduledTime}</p>
                    </div>
                    {req.meetingLink && <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.2)', borderRadius: 8, color: '#10B981', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>Join Meeting</a>}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => { setSelectedReq(req); setSchDate(req.preferredDate); setSchTime(req.preferredTime); setShowAccept(true); }} style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 8, color: '#10B981', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>✅ Accept & Schedule</button>
                      <button onClick={() => { setSelectedReq(req); setShowReject(true); }} style={{ padding: '8px 16px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', borderRadius: 8, color: '#F43F5E', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>❌ Reject</button>
                    </>
                  )}
                  {(req.status === 'Accepted' || req.status === 'Rescheduled') && (
                    <>
                      <button onClick={() => { setSelectedReq(req); setShowComplete(true); }} style={{ padding: '8px 16px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 8, color: '#A78BFA', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>🎓 Complete Session</button>
                      <button onClick={() => { setSelectedReq(req); setShowReschedule(true); }} style={{ padding: '8px 16px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 8, color: '#F59E0B', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>🔄 Reschedule</button>
                    </>
                  )}
                  {(req.status === 'Accepted' || req.status === 'Completed' || req.status === 'Rescheduled') && (
                    <>
                      <button onClick={() => { setSelectedReq(req); setShowRoadmap(true); }} style={{ padding: '8px 16px', background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: 8, color: '#22D3EE', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>🗺️ Add Roadmap Item</button>
                      <button onClick={() => { setSelectedReq(req); setShowResource(true); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'var(--text)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>📚 Share Resource</button>
                    </>
                  )}
                </div>

                {/* Sub-sections: Roadmaps and Resources */}
                {(req.roadmap.length > 0 || req.sharedResources.length > 0) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                    {req.roadmap.length > 0 && (
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>🗺️ Student Roadmap ({req.roadmap.filter(r => r.status === 'Completed').length}/{req.roadmap.length})</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {req.roadmap.map(rm => (
                            <div key={rm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, borderLeft: `2px solid ${rm.status === 'Completed' ? '#10B981' : '#F59E0B'}` }}>
                              <div>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>{rm.week}: {rm.title}</p>
                                <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Due: {rm.deadline}</p>
                              </div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: rm.status === 'Completed' ? '#10B981' : '#F59E0B' }}>{rm.progress}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {req.sharedResources.length > 0 && (
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>📚 Shared Resources</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {req.sharedResources.map(res => (
                            <div key={res.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                              <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(34,211,238,0.1)', color: '#22D3EE', borderRadius: 4 }}>{res.type}</span>
                              <span style={{ fontSize: '0.78rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Modals */}
      {showAccept && (
        <ActionModal title="Accept & Schedule Session" submitLabel="Confirm Session" submitColor="linear-gradient(135deg, #10B981, #059669)" onClose={() => setShowAccept(false)} onSubmit={handleAccept}>
          <input style={inp} type="date" value={schDate} onChange={e => setSchDate(e.target.value)} />
          <input style={inp} type="time" value={schTime} onChange={e => setSchTime(e.target.value)} />
          <input style={inp} type="url" placeholder="Meeting Link (e.g., Google Meet)" value={meetLink} onChange={e => setMeetLink(e.target.value)} />
          <textarea style={{...inp, resize: 'vertical'}} rows={3} placeholder="Notes for student (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
        </ActionModal>
      )}

      {showReject && (
        <ActionModal title="Reject Request" submitLabel="Reject Request" submitColor="#F43F5E" onClose={() => setShowReject(false)} onSubmit={handleReject}>
          <textarea style={{...inp, resize: 'vertical'}} rows={4} placeholder="Reason for rejection..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
        </ActionModal>
      )}

      {showReschedule && (
        <ActionModal title="Reschedule Session" submitLabel="Update Schedule" submitColor="#F59E0B" onClose={() => setShowReschedule(false)} onSubmit={handleReschedule}>
          <input style={inp} type="date" value={schDate} onChange={e => setSchDate(e.target.value)} />
          <input style={inp} type="time" value={schTime} onChange={e => setSchTime(e.target.value)} />
          <textarea style={{...inp, resize: 'vertical'}} rows={3} placeholder="Reason for reschedule..." value={notes} onChange={e => setNotes(e.target.value)} />
        </ActionModal>
      )}

      {showComplete && (
        <ActionModal title="Complete Session" submitLabel="Mark as Completed" submitColor="#6C63FF" onClose={() => setShowComplete(false)} onSubmit={handleComplete}>
          <textarea style={{...inp, resize: 'vertical'}} rows={5} placeholder="Session summary and internal notes..." value={notes} onChange={e => setNotes(e.target.value)} />
        </ActionModal>
      )}

      {showRoadmap && (
        <ActionModal title="Add Roadmap Item" submitLabel="Assign Task" submitColor="#22D3EE" onClose={() => setShowRoadmap(false)} onSubmit={handleAddRoadmap}>
          <input style={inp} type="text" placeholder="Week (e.g., Week 1)" value={rmWeek} onChange={e => setRmWeek(e.target.value)} />
          <input style={inp} type="text" placeholder="Task Title" value={rmTitle} onChange={e => setRmTitle(e.target.value)} />
          <textarea style={{...inp, resize: 'vertical'}} rows={3} placeholder="Detailed Description" value={rmDesc} onChange={e => setRmDesc(e.target.value)} />
          <input style={inp} type="date" placeholder="Deadline" value={rmDeadline} onChange={e => setRmDeadline(e.target.value)} />
        </ActionModal>
      )}

      {showResource && (
        <ActionModal title="Share Resource" submitLabel="Share" submitColor="rgba(255,255,255,0.2)" onClose={() => setShowResource(false)} onSubmit={handleAddResource}>
          <select style={{...inp, color: 'var(--text)'}} value={resType} onChange={(e: any) => setResType(e.target.value)}>
            <option value="PDF">PDF</option><option value="Video">Video</option><option value="Document">Document</option>
            <option value="Link">Link</option><option value="Book">Book</option><option value="GitHub">GitHub</option>
          </select>
          <input style={inp} type="text" placeholder="Resource Title" value={resTitle} onChange={e => setResTitle(e.target.value)} />
          <input style={inp} type="url" placeholder="Resource URL (optional)" value={resUrl} onChange={e => setResUrl(e.target.value)} />
          <textarea style={{...inp, resize: 'vertical'}} rows={2} placeholder="Description (optional)" value={resDesc} onChange={e => setResDesc(e.target.value)} />
        </ActionModal>
      )}
    </div>
  );
}
