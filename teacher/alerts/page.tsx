'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';

type AlertType = 'all' | 'attendance' | 'quiz' | 'assignment' | 'performance';

interface AdvancedAlert {
  id: string;
  title: string;
  category: Exclude<AlertType, 'all'>;
  priority: 'high' | 'medium' | 'low';
  score: number; // Priority score (1-100)
  student: string;
  roll: string;
  detail: string;
  suggestedAction: string;
  timestamp: string;
  status: 'New' | 'Intervention Sent' | 'Resolved';
}

const initialAlerts: AdvancedAlert[] = [
  {
    id: 'AL-101',
    title: 'Attendance Drop Warning',
    category: 'attendance',
    priority: 'high',
    score: 94,
    student: 'Liam Scott',
    roll: 'CS21049',
    detail: 'Attendance fell below 50% critical threshold over the last two weeks.',
    suggestedAction: 'Send automated attendance warning & notify mentor.',
    timestamp: '1 hour ago',
    status: 'New',
  },
  {
    id: 'AL-102',
    title: 'Quiz Inconsistency Detected',
    category: 'quiz',
    priority: 'medium',
    score: 78,
    student: 'Mia Reynolds',
    roll: 'CS21046',
    detail: 'Quiz 3 score dropped by 40% compared to previous quiz average.',
    suggestedAction: 'Schedule extra tutoring session or conceptual review.',
    timestamp: '4 hours ago',
    status: 'New',
  },
  {
    id: 'AL-103',
    title: 'Assignment Missing Notice',
    category: 'assignment',
    priority: 'medium',
    score: 72,
    student: 'Joy Kumar Yuv',
    roll: '261-16-010',
    detail: 'Assignment 2 is overdue by 3 days. Digital Systems lab.',
    suggestedAction: 'Email deadline extension or request submission reason.',
    timestamp: 'Yesterday',
    status: 'New',
  },
  {
    id: 'AL-104',
    title: 'Performance Decline Prediction',
    category: 'performance',
    priority: 'high',
    score: 89,
    student: 'Liam Scott',
    roll: 'CS21049',
    detail: 'AI predicts student fails final exam based on combined performance vector.',
    suggestedAction: 'Launch intensive recovery syllabus program immediately.',
    timestamp: '2 days ago',
    status: 'New',
  },
];

export default function AdvancedAlertsPage() {
  const [alerts, setAlerts] = useState<AdvancedAlert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<AlertType>('all');
  const [activeIntervention, setActiveIntervention] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => activeTab === 'all' || a.category === activeTab);

  const triggerIntervention = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Intervention Sent' } : a));
    setActiveIntervention(id);
    setTimeout(() => setActiveIntervention(null), 3000);
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Advanced Alerts Engine" subtitle="Real-time predictive alarms, performance triggers, and action tracking" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Tab filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {(['all', 'attendance', 'quiz', 'assignment', 'performance'] as AlertType[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: activeTab === tab ? '#22D3EE' : 'var(--surface)',
              color: activeTab === tab ? '#fff' : 'var(--muted)',
            }}>
              {tab.toUpperCase()} ({tab === 'all' ? alerts.length : alerts.filter(a => a.category === tab).length})
            </button>
          ))}
        </div>

        {/* Alert Cards Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.map(a => (
            <div key={a.id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${a.priority === 'high' ? '#EF4444' : a.priority === 'medium' ? '#F59E0B' : '#10B981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)' }}>
                    {a.title} <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>({a.id})</span>
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                    Student: <strong>{a.student}</strong> ({a.roll}) · {a.timestamp}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                    Score: {a.score}/100
                  </span>
                  <AlertBadge priority={a.priority} />
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                    background: a.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : a.status === 'Intervention Sent' ? 'rgba(34,211,238,0.1)' : 'rgba(245,158,11,0.1)',
                    color: a.status === 'Resolved' ? '#10B981' : a.status === 'Intervention Sent' ? '#22D3EE' : '#F59E0B',
                    border: `1px solid ${a.status === 'Resolved' ? 'rgba(16,185,129,0.2)' : a.status === 'Intervention Sent' ? 'rgba(34,211,238,0.2)' : 'rgba(245,158,11,0.2)'}`
                  }}>
                    {a.status}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>{a.detail}</p>
              
              <div style={{ padding: '10px 12px', background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 10, marginBottom: 12 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Action: </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{a.suggestedAction}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {a.status !== 'Resolved' && (
                  <>
                    <button 
                      onClick={() => triggerIntervention(a.id)}
                      disabled={a.status === 'Intervention Sent'}
                      style={{ padding: '7px 14px', background: 'linear-gradient(135deg,#1D4ED8,#22D3EE)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer', opacity: a.status === 'Intervention Sent' ? 0.7 : 1 }}>
                      🚀 Send Intervention Email
                    </button>
                    <button 
                      onClick={() => resolveAlert(a.id)}
                      style={{ padding: '7px 14px', border: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: 8, color: 'var(--muted)', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}>
                      ✓ Mark Resolved
                    </button>
                  </>
                )}
                {a.status === 'Resolved' && (
                  <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    ✅ Alert resolved successfully.
                  </span>
                )}
              </div>

              {activeIntervention === a.id && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                  ✉️ Intervention email dispatched to {a.student}&apos;s mentor and parents!
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
