'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import {
  BrainCircuit, AlertTriangle, Users, GraduationCap, Calendar,
  TrendingUp, Activity, CheckCircle, Clock, ShieldAlert,
  ChevronRight, Search, Filter, Download
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface AIMonitoringDashboardProps {
  role: 'dean' | 'dept-head';
  department?: string; // If dept-head
}

export default function AIMonitoringDashboard({ role, department }: AIMonitoringDashboardProps) {
  const isDean = role === 'dean';
  const scopeText = isDean ? 'University-wide' : `${department} Department`;
  
  const [activeTab, setActiveTab] = useState<'alerts' | 'students' | 'teachers'>('alerts');

  // Dummy Data
  const summary = {
    healthScore: isDean ? 89 : 87,
    healthStatus: isDean ? 'Stable' : 'Excellent',
    atRiskStudents: isDean ? 64 : 18,
    pendingCounselling: isDean ? 142 : 16,
    avgAttendance: isDean ? 81 : 84,
    avgCgpa: isDean ? 3.38 : 3.42,
  };

  const aiInsights = isDean
    ? "University-wide analysis indicates an average CGPA of 3.38 across all departments. AI detected 64 academically at-risk students and identified three departments requiring immediate intervention due to declining attendance and counselling response delays. Faculty performance remains stable with an overall institutional health score of 89%."
    : `The ${department} Department currently maintains an average CGPA of 3.42 with an attendance rate of 84%. AI detected 18 academically at-risk students, primarily due to attendance below 75%. Counselling requests increased by 21% this month. Faculty response time averages 14 hours, with an overall department health score of 87%.`;

  const alerts = [
    { id: 1, type: 'academic', title: 'High Dropout Risk Detected', desc: '18 students are academically at risk due to continuous low attendance and failing grades in core subjects.', priority: 'high', confidence: 94, action: 'Schedule Counselling' },
    { id: 2, type: 'faculty', title: 'Low Faculty Responsiveness', desc: 'Dr. Hasan has 16 pending counselling requests unresponded for over 3 days.', priority: 'medium', confidence: 88, action: 'Notify Teacher' },
    { id: 3, type: 'health', title: 'Attendance Drop in CIS313', desc: 'Average attendance dropped below 75% in Data Structures this week.', priority: 'high', confidence: 92, action: 'Generate Report' },
    { id: 4, type: 'counselling', title: 'Counselling Overload', desc: 'Increased counselling demand in Software Engineering track. Current mentors are overloaded.', priority: 'medium', confidence: 85, action: 'Assign Mentors' },
  ];

  const students = [
    { id: 'STU-001', name: 'Rahim Islam', dept: 'CIS', cgpa: 2.34, attendance: 62, riskScore: 85, riskLevel: 'High' },
    { id: 'STU-002', name: 'Nusrat Jahan', dept: 'CSE', cgpa: 2.8, attendance: 71, riskScore: 65, riskLevel: 'Medium' },
    { id: 'STU-003', name: 'Joy Kumar', dept: 'CIS', cgpa: 3.1, attendance: 58, riskScore: 72, riskLevel: 'Medium' },
  ];

  const teachers = [
    { id: 'TCH-001', name: 'Dr. Hasan Mahmud', dept: 'CIS', pendingRequests: 16, responseTime: '3 Days', kpi: 74, status: 'Overloaded' },
    { id: 'TCH-002', name: 'Prof. Anisur Rahman', dept: 'CSE', pendingRequests: 2, responseTime: '4 Hours', kpi: 92, status: 'Optimal' },
  ];

  const trendData = [
    { name: 'Week 1', risk: 12, attendance: 88, requests: 25 },
    { name: 'Week 2', risk: 15, attendance: 86, requests: 30 },
    { name: 'Week 3', risk: 14, attendance: 85, requests: 28 },
    { name: 'Week 4', risk: 18, attendance: 81, requests: 45 }, // Peak
    { name: 'Week 5', risk: 16, attendance: 83, requests: 35 },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC', height: '100vh' }}>
      <TopNavbar 
        title="AI Monitoring & Alerts" 
        subtitle={`Real-time AI analysis & predictive insights • ${scopeText}`} 
      />

      <main style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        
        {/* AI Insight Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A, #312E81)', borderRadius: '16px', padding: '24px', color: '#fff', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
            <BrainCircuit size={32} color="#60A5FA" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              AI Executive Summary
              <span style={{ fontSize: '0.75rem', background: '#3B82F6', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>Real-time</span>
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#BFDBFE', maxWidth: '1000px' }}>
              {aiInsights}
            </p>
          </div>
          <button style={{ background: '#3B82F6', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Generate Full Report
          </button>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Health Score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{summary.healthScore}%</h3>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>{summary.healthStatus}</span>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #EF4444' }}>
            <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>At-Risk Students</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#EF4444', margin: 0 }}>{summary.atRiskStudents}</h3>
              <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>Critical</span>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
            <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Pending Counselling</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', margin: 0 }}>{summary.pendingCounselling}</h3>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Avg Attendance</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{summary.avgAttendance}%</h3>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Avg CGPA</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{summary.avgCgpa}</h3>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Risk & Counselling Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" fillOpacity={1} fill="url(#colorRisk)" name="At-Risk Students" strokeWidth={2} />
                <Area type="monotone" dataKey="requests" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReq)" name="Counselling Requests" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>AI Timeline</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginTop: '6px' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 2px 0' }}>Today, 10:45 AM</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>3 New Academic Alerts</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', marginTop: '6px' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 2px 0' }}>Yesterday, 04:30 PM</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Teacher Response Improved</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', marginTop: '6px' }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 2px 0' }}>3 Days Ago</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Student Risk Increased in CIS</p>
                </div>
              </div>
            </div>
            <button style={{ background: '#F1F5F9', border: 'none', color: '#475569', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '16px' }}>View Full Log</button>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
            <button onClick={() => setActiveTab('alerts')} style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'alerts' ? '2px solid #3B82F6' : '2px solid transparent', color: activeTab === 'alerts' ? '#3B82F6' : '#64748B', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} /> Critical AI Alerts
            </button>
            <button onClick={() => setActiveTab('students')} style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'students' ? '2px solid #3B82F6' : '2px solid transparent', color: activeTab === 'students' ? '#3B82F6' : '#64748B', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} /> Student Monitoring
            </button>
            <button onClick={() => setActiveTab('teachers')} style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'teachers' ? '2px solid #3B82F6' : '2px solid transparent', color: activeTab === 'teachers' ? '#3B82F6' : '#64748B', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Teacher Monitoring
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {/* ALERTS TAB */}
            {activeTab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {alerts.map(alert => (
                  <div key={alert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '12px', background: '#fff' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: alert.priority === 'high' ? '#FEF2F2' : '#FFF7ED', color: alert.priority === 'high' ? '#EF4444' : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{alert.title}</h4>
                          <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>{alert.confidence}% AI Confidence</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', maxWidth: '600px' }}>{alert.desc}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>{alert.action}</button>
                      <button style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Student Name</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Dept</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>CGPA</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Attendance</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>AI Risk Score</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.id}</div>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>{s.dept}</td>
                        <td style={{ padding: '16px', fontWeight: 500, color: s.cgpa < 2.5 ? '#EF4444' : '#0F172A' }}>{s.cgpa}</td>
                        <td style={{ padding: '16px', fontWeight: 500, color: s.attendance < 75 ? '#EF4444' : '#0F172A' }}>{s.attendance}%</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: s.riskLevel === 'High' ? '#FEF2F2' : '#FFF7ED', color: s.riskLevel === 'High' ? '#EF4444' : '#F59E0B', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {s.riskScore}% {s.riskLevel}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button style={{ color: '#3B82F6', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>View Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TEACHERS TAB */}
            {activeTab === 'teachers' && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Teacher Name</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Dept</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Pending Requests</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Avg Response</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>KPI</th>
                      <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{t.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{t.id}</div>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>{t.dept}</td>
                        <td style={{ padding: '16px', fontWeight: 500, color: t.pendingRequests > 10 ? '#EF4444' : '#0F172A' }}>{t.pendingRequests}</td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>{t.responseTime}</td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>{t.kpi}%</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: t.status === 'Overloaded' ? '#FEF2F2' : '#ECFDF5', color: t.status === 'Overloaded' ? '#EF4444' : '#10B981', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
