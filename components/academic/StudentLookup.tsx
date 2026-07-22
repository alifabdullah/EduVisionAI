'use client';
import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { SEMESTER_DATA, INITIAL_PROJECTS, INITIAL_RESEARCH, LIBRARY_VISITS, Project } from '@/data/academicData';
import studentData from '@/data/student.json';
import AlertBadge from '@/components/ui/AlertBadge';

// Helper for initial avatars
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

// Temporary default demo link until students submit their own project URLs
const DEFAULT_DEMO_LINK = 'https://joysarkar.netlify.app/';

export default function StudentLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'projects' | 'research' | 'library' | 'insights'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [filterDept, setFilterDept] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [filterSec, setFilterSec] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setStudent(null);
    setActiveTab('overview');

    // Simulate search delay
    setTimeout(() => {
      // Mock search logic: if it's 261-16-010 or CIS21010, return Joy
      const q = searchQuery.toUpperCase();
      if (q === '261-16-010' || q === 'CIS-21-010' || q === 'JOY') {
        setStudent(studentData);
      } else {
        setStudent(null);
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>🔍 Student Profile Lookup</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Search and view complete academic trajectory and risk profiles</p>
      </div>

      {/* Search Bar & Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(108,99,255,0.2)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by Student ID (e.g. 261-16-010 or CIS-21-010)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, minWidth: 280, padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: '0.85rem', outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isSearching}
              style={{
                padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg, #6C63FF, #22D3EE)', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: isSearching ? 'wait' : 'pointer',
                opacity: isSearching ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(108,99,255,0.25)'
              }}
            >
              {isSearching ? 'Searching...' : 'Search Profile'}
            </button>
          </div>

          {/* Optional Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ padding: '0.45rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem', outline: 'none' }}>
              <option value="">Department (All)</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
            </select>
            <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} style={{ padding: '0.45rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem', outline: 'none' }}>
              <option value="">Batch (All)</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)} style={{ padding: '0.45rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem', outline: 'none' }}>
              <option value="">Semester (All)</option>
              <option value="8">8th Semester</option>
              <option value="7">7th Semester</option>
              <option value="6">6th Semester</option>
            </select>
            <input type="text" placeholder="Section (Optional)" value={filterSec} onChange={e => setFilterSec(e.target.value)} style={{ padding: '0.45rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem', outline: 'none' }} />
          </div>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isSearching && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'pulse 1.5s infinite ease-in-out', opacity: 0.5 }}>
          <div style={{ height: 120, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }} />
          <div style={{ height: 40, background: 'rgba(255,255,255,0.03)', borderRadius: 10, width: '60%' }} />
          <div style={{ height: 300, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }} />
        </div>
      )}

      {/* Not Found */}
      {!isSearching && hasSearched && !student && (
        <div className="glass-card fade-in" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(244,63,94,0.2)' }}>
          <span style={{ fontSize: '2.5rem' }}>📭</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '10px 0', color: 'var(--danger)' }}>Student Not Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>No records matched the ID "{searchQuery}". Please check the ID or adjust your filters.</p>
        </div>
      )}

      {/* Student Profile View */}
      {!isSearching && student && (
        <div className="fade-in">
          {/* Header Profile Card */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)' }} />
            
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #6C63FF, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', boxShadow: '0 8px 24px rgba(108,99,255,0.3)', flexShrink: 0 }}>
              {getInitials(student.profile.name)}
            </div>
            
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{student.profile.name}</h2>
                <span className="badge badge-primary">{student.profile.id}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>{student.profile.department} · Batch {student.profile.batch} · Semester {student.profile.semester}</p>
              
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.78rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 8 }}>📧 {student.profile.email}</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 8 }}>🎫 Roll: {student.profile.roll}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>CGPA</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981' }}>{student.profile.cgpa.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Credits</p>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22D3EE' }}>{student.academicSummary.creditsCompleted}</p>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'overview', icon: '⊞', label: 'Overview' },
              { id: 'academic', icon: '🎓', label: 'Academic Result' },
              { id: 'projects', icon: '🗂️', label: 'Projects' },
              { id: 'research', icon: '🔬', label: 'Research' },
              { id: 'library', icon: '📖', label: 'Library Activity' },
              { id: 'insights', icon: '🤖', label: 'AI Insights' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: activeTab === tab.id ? 'rgba(108,99,255,0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#6C63FF' : 'var(--muted)',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #6C63FF' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '0.82rem',
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="fade-in">
            {/* 1. Overview */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 16 }}>Performance Trend (GPA)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={student.performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="semester" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[2.0, 4.0]} tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8 }} />
                      <Line type="monotone" dataKey="gpa" stroke="#6C63FF" strokeWidth={3} dot={{ r: 4, fill: '#6C63FF' }} name="Semester GPA" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 4 }}>Quick Stats</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Avg Attendance</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: student.academicSummary.attendanceAvg < 75 ? 'var(--danger)' : 'var(--success)' }}>{student.academicSummary.attendanceAvg}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Assignments Complete</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE' }}>{student.academicSummary.assignmentsCompleted} / {student.academicSummary.assignmentsTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Class Rank</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B' }}>{student.peers.rank} out of {student.peers.totalStudents}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Verified Supervisor</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>Tamanna Akter</span>
                  </div>
                  <div style={{ marginTop: 'auto', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', padding: '10px', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.72rem', color: '#F43F5E', fontWeight: 700, marginBottom: 2 }}>⚠️ Academic Risk Level</p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>Medium (Attendance & Weak Subjects)</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Academic Result */}
            {activeTab === 'academic' && (
              <div className="glass-card fade-in" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Current Semester Details (Fall 2026)</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Detailed component marks and weakness indicators</p>
                  </div>
                  <span className="badge badge-primary">Term GPA: 3.42</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: 'var(--muted)' }}>Subject</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: 'var(--muted)' }}>Code</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Quiz</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Mid</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Final</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Attendance</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Grade</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--muted)' }}>Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SEMESTER_DATA['263'].subjects.map((sub, i) => (
                        <tr key={sub.code} style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                          <td style={{ padding: '10px', fontWeight: 600 }}>{sub.name}</td>
                          <td style={{ padding: '10px', fontFamily: 'monospace', color: 'var(--muted)' }}>{sub.code}</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{sub.quiz}/15</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{sub.mid}%</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{sub.final}%</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: sub.attendance < 75 ? 'var(--danger)' : 'inherit', fontWeight: sub.attendance < 75 ? 700 : 400 }}>{sub.attendance}%</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}><span className="badge badge-info">{sub.grade}</span></td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            {sub.riskLevel === 'high' ? <span style={{ color: '#F43F5E', fontSize: '1rem' }} title="High Risk">⚠️</span> : 
                             sub.riskLevel === 'medium' ? <span style={{ color: '#F59E0B', fontSize: '1rem' }} title="Medium Risk">🟡</span> : 
                             <span style={{ color: '#10B981', fontSize: '1rem' }} title="Low Risk">✅</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Projects */}
            {activeTab === 'projects' && (
              <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {INITIAL_PROJECTS.filter(p => p.teamMembers.includes('Joy kumar Yuv')).map(proj => (
                  <div key={proj.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${proj.color}`, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>{proj.title}</h4>
                      <span className={`badge badge-${proj.status === 'Completed' ? 'low' : 'info'}`}>{proj.status}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 12, flex: 1 }}>{proj.description}</p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 12, flexWrap: 'wrap', fontSize: '0.7rem' }}>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>Stack: <strong style={{color: '#fff'}}>{proj.techStack.slice(0,2).join(', ')}{proj.techStack.length > 2 ? '...' : ''}</strong></span>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>📅 {new Date(proj.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} {proj.endDate ? `- ${new Date(proj.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : '- Present'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ color: 'var(--muted)' }}>Supervisor: <strong style={{ color: 'var(--text)' }}>{proj.supervisor || 'None'}</strong></span>
                      {proj.supervisorVerified && <span style={{ color: '#10B981', fontWeight: 700 }}>✓ Verified</span>}
                    </div>

                    {/* Action Links */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {/* Live Demo — always shown, falls back to default portfolio link */}
                      <a
                        href={proj.liveLink || DEFAULT_DEMO_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.4rem 0.9rem',
                          background: 'linear-gradient(135deg, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0.08) 100%)',
                          border: '1px solid rgba(34,211,238,0.45)',
                          borderRadius: 8, fontSize: '0.7rem', color: '#22D3EE',
                          fontWeight: 700, textDecoration: 'none',
                          display: 'flex', alignItems: 'center', gap: 4,
                          boxShadow: '0 0 8px rgba(34,211,238,0.12)',
                          transition: 'all 0.2s',
                        }}
                      >
                        🌐 Live Demo
                      </a>
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.7rem', color: '#E2E8F0', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          💻 Source Code
                        </a>
                      )}
                      {proj.documentationLink && (
                        <a href={proj.documentationLink} target="_blank" rel="noopener noreferrer" style={{ padding: '0.4rem 0.8rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, fontSize: '0.7rem', color: '#A78BFA', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                          📄 Docs
                        </a>
                      )}
                      <button onClick={() => setSelectedProject(proj)} style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg, #6C63FF, #22D3EE)', border: 'none', borderRadius: 8, fontSize: '0.7rem', color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(108,99,255,0.2)' }}>
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Research */}
            {activeTab === 'research' && (
              <div className="fade-in">
                {INITIAL_RESEARCH.filter(r => r.coAuthors.includes('Nadia Islam') || r.supervisor === 'Mr. Md. Sarwar Hossain Mollah').map(res => (
                  <div key={res.id} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem', borderLeft: '3px solid #A78BFA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>{res.title}</h4>
                      <span className="badge badge-primary">{res.status}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: 12 }}>"{res.abstract}"</p>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--muted)' }}>Supervisor: <strong style={{ color: 'var(--text)' }}>{res.supervisor || 'None'}</strong></span>
                      <span style={{ color: 'var(--muted)' }}>Venue: <strong style={{ color: 'var(--text)' }}>{res.journalConference || 'TBD'}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Library Activity */}
            {activeTab === 'library' && (
              <div className="glass-card fade-in" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 16 }}>RFID Library Log Trends</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={LIBRARY_VISITS.slice(0, 14).reverse().map(v => ({ date: v.date.split('-')[2], min: v.duration }))}>
                    <defs>
                      <linearGradient id="libProfileG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="min" stroke="#22D3EE" fill="url(#libProfileG)" strokeWidth={2} name="Time Spent (Mins)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 6. AI Insights */}
            {activeTab === 'insights' && (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {student.alerts.map((alert: any) => (
                  <div key={alert.id} style={{ padding: '12px 14px', background: 'var(--surface-2)', borderLeft: `3px solid ${alert.priority === 'high' ? 'var(--danger)' : 'var(--warning)'}`, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{alert.title}</p>
                      <AlertBadge priority={alert.priority} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{alert.message}</p>
                  </div>
                ))}
                
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '10px 0', color: '#A78BFA' }}>🤖 AI Recommendations</h4>
                {student.aiRecommendations.map((rec: any) => (
                  <div key={rec.id} style={{ padding: '12px 14px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.2rem' }}>{rec.icon === 'book' ? '📚' : rec.icon === 'calendar' ? '📅' : '💡'}</span>
                      <div>
                        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0' }}>{rec.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#A78BFA', marginTop: 2 }}>{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
          <div className="glass-card slide-up" style={{ width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: 'var(--surface-1)', borderTop: `4px solid ${selectedProject.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <span className={`badge badge-${selectedProject.status === 'Completed' ? 'low' : 'info'}`} style={{ marginBottom: 10 }}>{selectedProject.status}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedProject.title}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>Topic: {selectedProject.topic} • Sector: {selectedProject.sector}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 8 }}>Project Description</h4>
                <p style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: 16 }}>{selectedProject.description}</p>
                
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 8 }}>Tech Stack</h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {selectedProject.techStack.map(tech => (
                    <span key={tech} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, fontSize: '0.75rem', color: '#22D3EE' }}>{tech}</span>
                  ))}
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 8 }}>Team Members</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedProject.teamMembers.map(member => (
                    <li key={member} style={{ fontSize: '0.8rem', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 24, height: 24, background: 'rgba(108,99,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#A78BFA' }}>{member[0]}</span>
                      {member} {member === 'Joy kumar Yuv' && <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>(Focus Student)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Supervisor</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedProject.supervisor || 'Unassigned'}</p>
                  {selectedProject.supervisorVerified && <span style={{ fontSize: '0.7rem', color: '#10B981', display: 'inline-block', marginTop: 4 }}>✓ Officially Verified</span>}
                </div>

                <div style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>External Links</p>
                  {/* Live Demo — always shown with fallback */}
                  <a
                    href={selectedProject.liveLink || DEFAULT_DEMO_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '0.45rem 1rem',
                      background: 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.06) 100%)',
                      border: '1px solid rgba(34,211,238,0.4)',
                      borderRadius: 8, fontSize: '0.78rem', color: '#22D3EE',
                      fontWeight: 700, textDecoration: 'none',
                      boxShadow: '0 0 10px rgba(34,211,238,0.1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    🌐 Live Demo
                  </a>
                  {selectedProject.githubLink && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#E2E8F0', textDecoration: 'none' }}>💻 Source Code Repository</a>
                  )}
                  {selectedProject.documentationLink && (
                    <a href={selectedProject.documentationLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#A78BFA', textDecoration: 'none' }}>📄 Technical Documentation</a>
                  )}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Teacher Review & Verification</h4>
              <textarea placeholder="Add feedback or suggestions for improvement..." style={{ width: '100%', minHeight: 80, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem', resize: 'vertical', outline: 'none' }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button style={{ padding: '0.6rem 1.2rem', background: 'rgba(244,63,94,0.1)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>Request Improvement</button>
                <button onClick={() => {
                  /* Mock verification toggle */
                  selectedProject.supervisorVerified = true;
                  setSelectedProject({...selectedProject});
                }} style={{ padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' }}>Approve & Verify Project</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
