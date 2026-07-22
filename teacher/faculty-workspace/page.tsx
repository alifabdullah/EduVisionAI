'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

const kpiData = [
  { label: 'Teaching Effectiveness', value: 87, target: 90, color: '#22D3EE' },
  { label: 'Course Outcome', value: 78, target: 85, color: '#10B981' },
  { label: 'Student Feedback Rating', value: 92, target: 90, color: '#6C63FF' },
  { label: 'Mentorship Success Rate', value: 74, target: 80, color: '#F59E0B' },
  { label: 'Research Output', value: 60, target: 75, color: '#A78BFA' },
  { label: 'Attendance Compliance', value: 95, target: 95, color: '#10B981' },
];

const evalHistory = [
  { period: 'Fall 2025', score: 82, supervisor: 'Dr. Rahman', status: 'Reviewed' },
  { period: 'Summer 2025', score: 78, supervisor: 'Dr. Rahman', status: 'Reviewed' },
  { period: 'Spring 2025', score: 75, supervisor: 'Dr. Karim', status: 'Archived' },
];

export default function FacultyWorkspacePage() {
  const [activeTab, setActiveTab] = useState<'kpi' | 'research' | 'workspace'>('kpi');

  const supervised = [
    { id: 'CS21004', name: 'Noah Wilson', project: 'Distributed Query Processing', status: 'In Progress', since: 'Apr 2026' },
    { id: 'CS21001', name: 'Joy Kumar Yuv', project: 'Smart Student Analytics Dashboard', status: 'Draft', since: 'May 2026' },
  ];

  const deadlines = [
    { title: 'Assignment 2 Deadline – CSE303', date: 'Jun 15, 2026', type: 'Assignment' },
    { title: 'Midterm Results Submission', date: 'Jun 18, 2026', type: 'Result' },
    { title: 'Thesis Defense – Noah Wilson', date: 'Jun 22, 2026', type: 'Research' },
    { title: 'Final Exam – CSE301', date: 'Jun 28, 2026', type: 'Exam' },
  ];

  const typeColor: Record<string, string> = { Assignment: '#F59E0B', Result: '#22D3EE', Research: '#A78BFA', Exam: '#F43F5E' };

  const overallKPI = Math.round(kpiData.reduce((a, k) => a + k.value, 0) / kpiData.length);

  const tabBtn = (key: typeof activeTab, label: string) => (
    <button key={key} onClick={() => setActiveTab(key)}
      style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s', background: activeTab === key ? 'linear-gradient(135deg,#1D4ED8,#22D3EE)' : 'var(--surface)', color: activeTab === key ? '#fff' : 'var(--muted)', boxShadow: activeTab === key ? '0 4px 12px rgba(29,78,216,0.3)' : 'none' }}>
      {label}
    </button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Faculty Academic Workspace" subtitle="KPI tracking, research supervision, and academic timeline" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {tabBtn('kpi', '📊 KPI Dashboard')}
          {tabBtn('research', '🔬 Research Supervision')}
          {tabBtn('workspace', '📅 Timeline & Deadlines')}
        </div>

        {/* ─── KPI TAB ─── */}
        {activeTab === 'kpi' && (
          <div>
            {/* Overall KPI */}
            <div style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.1),rgba(34,211,238,0.08))', border: '1px solid rgba(29,78,216,0.2)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `conic-gradient(#22D3EE ${overallKPI}%, var(--surface-3) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#22D3EE' }}>{overallKPI}</span>
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>Overall KPI Score</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Performance across {kpiData.length} key indicators · Spring 2026</p>
                <p style={{ fontSize: '0.78rem', color: overallKPI >= 85 ? '#10B981' : overallKPI >= 70 ? '#F59E0B' : '#F43F5E', fontWeight: 700, marginTop: 4 }}>
                  {overallKPI >= 85 ? '🌟 Excellent Performance' : overallKPI >= 70 ? '📈 Good — Above Average' : '⚠️ Needs Improvement'}
                </p>
              </div>
            </div>

            {/* KPI Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {kpiData.map(k => (
                <div key={k.label} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{k.label}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: k.value >= k.target ? '#10B981' : '#F59E0B' }}>{k.value}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '100%', width: `${k.value}%`, background: k.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                    <div style={{ position: 'absolute', top: 0, left: `${k.target}%`, width: 2, height: '100%', background: '#F43F5E', opacity: 0.7 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>0%</span>
                    <span style={{ fontSize: '0.65rem', color: '#F43F5E' }}>Target: {k.target}%</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>100%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Evaluation History */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Supervisor Evaluation History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {evalHistory.map(e => (
                  <div key={e.period} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 10, alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>{e.period}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Supervisor: {e.supervisor}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: e.score >= 80 ? '#10B981' : '#F59E0B' }}>{e.score}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>/ 100</span>
                      <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, background: 'var(--surface-3)', color: 'var(--muted)', border: '1px solid var(--border)' }}>{e.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RESEARCH TAB ─── */}
        {activeTab === 'research' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {supervised.map(s => (
                <div key={s.id} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#A78BFA,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '0.85rem', flexShrink: 0 }}>
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 2 }}>{s.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{s.id} · Since {s.since}</p>
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(167,139,250,0.08)', borderRadius: 10, border: '1px solid rgba(167,139,250,0.15)', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 2 }}>Research Title</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.project}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s.status === 'In Progress' ? 'rgba(34,211,238,0.15)' : 'rgba(245,158,11,0.15)', color: s.status === 'In Progress' ? '#22D3EE' : '#F59E0B', border: `1px solid ${s.status === 'In Progress' ? 'rgba(34,211,238,0.3)' : 'rgba(245,158,11,0.3)'}` }}>{s.status}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(29,78,216,0.3)', background: 'rgba(29,78,216,0.1)', color: '#1D4ED8', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>💬 Comment</button>
                      <button style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>✅ Approve</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── WORKSPACE TAB ─── */}
        {activeTab === 'workspace' && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '1rem' }}>📅 Upcoming Deadlines & Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {deadlines.map((d, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.125rem 1.25rem', borderLeft: `4px solid ${typeColor[d.type]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{d.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>📅 {d.date}</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${typeColor[d.type]}20`, color: typeColor[d.type], border: `1px solid ${typeColor[d.type]}44` }}>{d.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
