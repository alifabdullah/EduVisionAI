'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const DEPARTMENTS = [
  { name: 'CSE', head: 'Dr. Emily Carter', students: 4500, teachers: 45, avgCGPA: 3.42, attendance: 86, research: 18, passRate: 88, score: 92, headPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop', status: 'Excellent' },
  { name: 'EEE', head: 'Prof. Md. Ziaul Haque', students: 2100, teachers: 28, avgCGPA: 3.35, attendance: 82, research: 12, passRate: 85, score: 88, headPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', status: 'Good' },
  { name: 'BBA', head: 'Dr. Farida Begum', students: 3200, teachers: 38, avgCGPA: 3.28, attendance: 80, research: 8, passRate: 82, score: 83, headPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop', status: 'Good' },
  { name: 'Pharmacy', head: 'Dr. Noman Siddiqui', students: 1800, teachers: 22, avgCGPA: 3.50, attendance: 88, research: 22, passRate: 91, score: 89, headPhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=80&h=80&fit=crop', status: 'Excellent' },
  { name: 'English', head: 'Prof. Karim Uddin', students: 1200, teachers: 18, avgCGPA: 3.20, attendance: 78, research: 6, passRate: 79, score: 79, headPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', status: 'Needs Attention' },
];

const comparisonData = DEPARTMENTS.map(d => ({ name: d.name, CGPA: d.avgCGPA, Attendance: d.attendance, PassRate: d.passRate }));

const radarData = [
  { subject: 'CGPA Score', CSE: 88, EEE: 82, BBA: 78, fullMark: 100 },
  { subject: 'Attendance', CSE: 86, EEE: 82, BBA: 80, fullMark: 100 },
  { subject: 'Research', CSE: 95, EEE: 70, BBA: 45, fullMark: 100 },
  { subject: 'Pass Rate', CSE: 88, EEE: 85, BBA: 82, fullMark: 100 },
  { subject: 'Faculty KPI', CSE: 90, EEE: 85, BBA: 78, fullMark: 100 },
];

const statusColor: Record<string, { bg: string, color: string }> = {
  'Excellent': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'Good': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  'Needs Attention': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
};

export default function DeanDepartmentsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Department Management 🏛️" subtitle="University-wide Department Oversight & Comparison" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Departments" value="5" sub="Faculty of S&IT" icon="🏛️" color="#3B82F6" />
          <StatCard label="Total Students" value="12,800" sub="Across all departments" icon="🎓" color="#10B981" />
          <StatCard label="Total Faculty" value="151" sub="All departments" icon="👨‍🏫" color="#8B5CF6" />
          <StatCard label="Best Performing" value="CSE" sub="Score: 92/100" icon="🏆" color="#F59E0B" />
        </div>

        {/* Comparison Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Department Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="Attendance" fill="#3B82F6" radius={[3,3,0,0]} />
                <Bar dataKey="PassRate" fill="#10B981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🎯 Multi-Dimension Comparison (Top 3)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 10 }} />
                <Radar name="CSE" dataKey="CSE" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} />
                <Radar name="EEE" dataKey="EEE" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                <Radar name="BBA" dataKey="BBA" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {DEPARTMENTS.map(dept => {
            const sc = statusColor[dept.status] || { bg: 'var(--surface-2)', color: 'var(--muted)' };
            return (
              <div key={dept.name} className="glass-card" style={{ padding: '1.25rem 1.5rem', border: `1px solid ${dept.status === 'Needs Attention' ? 'rgba(239,68,68,0.2)' : 'var(--border)'}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.25rem', alignItems: 'center' }}>
                  {/* Head Avatar + Dept Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid #3B82F6', margin: '0 auto 4px' }}>
                        <img src={dept.headPhoto} alt={dept.head} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--muted)', margin: 0, textAlign: 'center', maxWidth: 60 }}>HoD</p>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#3B82F6', margin: 0 }}>{dept.name}</h3>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: sc.bg, color: sc.color, fontWeight: 700 }}>{dept.status}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: '8px' }}>Score: {dept.score}/100</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>HoD: <strong style={{ color: 'var(--text)' }}>{dept.head}</strong></p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                    {[
                      { label: 'Students', value: dept.students.toLocaleString(), color: '#3B82F6' },
                      { label: 'Faculty', value: dept.teachers, color: '#10B981' },
                      { label: 'Avg CGPA', value: dept.avgCGPA, color: '#8B5CF6' },
                      { label: 'Attendance', value: `${dept.attendance}%`, color: '#F59E0B' },
                      { label: 'Pass Rate', value: `${dept.passRate}%`, color: '#14B8A6' },
                    ].map(stat => (
                      <div key={stat.label} style={{ textAlign: 'center', padding: '0.6rem', background: 'var(--surface-2)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', margin: '2px 0 0' }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <button style={{ padding: '7px 16px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>View Details</button>
                    <button style={{ padding: '7px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Generate Report</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
