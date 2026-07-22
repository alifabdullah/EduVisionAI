'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LibraryLog {
  id: string;
  name: string;
  roll: string;
  readingHours: number;
  resourcesBorrowed: number;
  lastVisit: string;
  behaviorScore: number; // 1-100
  studyPattern: 'Intense Focus' | 'Normal/Balanced' | 'Low Engagement' | 'Late Night Scholar';
}

const mockLibraryLogs: LibraryLog[] = [
  { id: '1', name: 'Joy Kumar Yuv', roll: '261-16-010', readingHours: 18, resourcesBorrowed: 5, lastVisit: 'Today, 10:15 AM', behaviorScore: 92, studyPattern: 'Intense Focus' },
  { id: '2', name: 'Mia Reynolds', roll: 'CS21046', readingHours: 12, resourcesBorrowed: 3, lastVisit: 'Yesterday, 4:30 PM', behaviorScore: 78, studyPattern: 'Normal/Balanced' },
  { id: '3', name: 'Liam Scott', roll: 'CS21049', readingHours: 4, resourcesBorrowed: 1, lastVisit: '3 days ago', behaviorScore: 45, studyPattern: 'Low Engagement' },
  { id: '4', name: 'Noah Wilson', roll: 'CS21050', readingHours: 24, resourcesBorrowed: 8, lastVisit: 'Today, 8:00 AM', behaviorScore: 98, studyPattern: 'Late Night Scholar' },
  { id: '5', name: 'Ava Martinez', roll: 'CS21051', readingHours: 15, resourcesBorrowed: 4, lastVisit: 'Today, 11:00 AM', behaviorScore: 85, studyPattern: 'Intense Focus' },
];

const patternColor: Record<LibraryLog['studyPattern'], string> = {
  'Intense Focus': '#10B981',
  'Normal/Balanced': '#22D3EE',
  'Low Engagement': '#EF4444',
  'Late Night Scholar': '#A78BFA',
};

export default function LibraryTrackerPage() {
  const [logs, setLogs] = useState<LibraryLog[]>(mockLibraryLogs);
  const [search, setSearch] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('All');
  const [selectedLog, setSelectedLog] = useState<LibraryLog | null>(null);

  const filtered = logs.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.roll.toLowerCase().includes(search.toLowerCase());
    const matchesPattern = selectedPattern === 'All' || l.studyPattern === selectedPattern;
    return matchesSearch && matchesPattern;
  });

  const chartData = filtered.map(l => ({
    name: l.name.split(' ')[0],
    Hours: l.readingHours,
    Resources: l.resourcesBorrowed * 3, // scale for visualization
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Library Engagement Tracker" subtitle="Track weekly reading hours, resource borrows, and study behavior scores" accentColor="#A78BFA" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Filters and Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'stretch' }}>
          
          {/* Controls */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12 }}>🔍 Search & Filters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input 
                type="text" 
                placeholder="Search by student name or roll..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.82rem', color: 'var(--text)', outline: 'none' }}
              />
              <select 
                value={selectedPattern} 
                onChange={e => setSelectedPattern(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: '0.82rem', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                <option value="All">All Study Patterns</option>
                <option value="Intense Focus">Intense Focus</option>
                <option value="Normal/Balanced">Normal/Balanced</option>
                <option value="Low Engagement">Low Engagement</option>
                <option value="Late Night Scholar">Late Night Scholar</option>
              </select>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 12 }}>📊 Engagement Distribution</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '0.7rem' }} />
                <Bar dataKey="Hours" fill="#A78BFA" radius={[3, 3, 0, 0]} name="Reading Hours" />
                <Bar dataKey="Resources" fill="#22D3EE" radius={[3, 3, 0, 0]} name="Resources Borrowed (x3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Logs Table */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {['Student', 'Roll', 'Weekly Reading Hours', 'Resources Borrowed', 'Last Visit', 'Study Pattern', 'AI Engagement Score', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{l.name}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{l.roll}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#A78BFA' }}>{l.readingHours} hrs</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{l.resourcesBorrowed} items</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{l.lastVisit}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: `${patternColor[l.studyPattern]}20`, color: patternColor[l.studyPattern], border: `1px solid ${patternColor[l.studyPattern]}44` }}>
                        {l.studyPattern}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: l.behaviorScore >= 80 ? '#10B981' : l.behaviorScore >= 60 ? '#22D3EE' : '#EF4444' }}>{l.behaviorScore}</span>
                        <div style={{ width: 60, height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${l.behaviorScore}%`, background: l.behaviorScore >= 80 ? '#10B981' : l.behaviorScore >= 60 ? '#22D3EE' : '#EF4444' }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setSelectedLog(l)}
                        style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.1)', color: '#A78BFA', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}>
                        🧠 AI Insight
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Modal/Overlay */}
        {selectedLog && (
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(34,211,238,0.05) 100%)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text)' }}>🧠 AI Behavior Insight — {selectedLog.name}</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Based on last 30 days of library logs & resource requests</p>
              </div>
              <button onClick={() => setSelectedLog(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--muted)', cursor: 'pointer' }}>×</button>
            </div>
            
            <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text)', marginBottom: 12 }}>
              {selectedLog.studyPattern === 'Intense Focus' && `Recommended: Student has spent ${selectedLog.readingHours} hours in the library focusing on Database Systems. Shows highly structured learning habits. Suggest nominating for the Departmental Peer Tutor program.`}
              {selectedLog.studyPattern === 'Late Night Scholar' && `Recommended: High study time (${selectedLog.readingHours} hours) recorded predominantly between 10 PM - 2 AM. While engagement is exceptional, monitor for potential burnout or class attendance drops due to late hours.`}
              {selectedLog.studyPattern === 'Normal/Balanced' && `Recommended: Healthy mix of physical space attendance and digital catalog borrows. Learning velocity is steady. Suggest encouraging participation in group study circles.`}
              {selectedLog.studyPattern === 'Low Engagement' && `Recommended: Critical drop detected in library resources and room bookings. Highly correlates with current 45% exam performance. Suggest immediate tutor assignment and digital reading list notification.`}
            </p>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 14px', background: '#A78BFA', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                ✉️ Send Reading List Recommendation
              </button>
              <button onClick={() => setSelectedLog(null)} style={{ padding: '6px 14px', border: '1px solid var(--border)', background: 'transparent', borderRadius: 8, color: 'var(--muted)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                Dismiss
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
