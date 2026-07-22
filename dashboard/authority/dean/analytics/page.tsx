'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area } from 'recharts';

const semCGPA = [
  { semester: 'Spr 24', CSE: 3.35, EEE: 3.28, BBA: 3.20, Pharmacy: 3.45 },
  { semester: 'Sum 24', CSE: 3.38, EEE: 3.30, BBA: 3.22, Pharmacy: 3.48 },
  { semester: 'Fall 24', CSE: 3.40, EEE: 3.32, BBA: 3.24, Pharmacy: 3.50 },
  { semester: 'Spr 25', CSE: 3.42, EEE: 3.35, BBA: 3.27, Pharmacy: 3.50 },
  { semester: 'Sum 26', CSE: 3.45, EEE: 3.38, BBA: 3.30, Pharmacy: 3.52 },
];

const teacherPerf = [
  { name: 'Dr. Anika', teaching: 95, research: 88, mentoring: 90, kpi: 96 },
  { name: 'Dr. Sarwar', teaching: 92, research: 85, mentoring: 94, kpi: 90 },
  { name: 'Prof. Karim', teaching: 94, research: 92, mentoring: 88, kpi: 95 },
  { name: 'Dr. Sumaiya', teaching: 90, research: 82, mentoring: 88, kpi: 88 },
  { name: 'Dr. Fatema', teaching: 85, research: 60, mentoring: 82, kpi: 82 },
];

const skillRadar = [
  { subject: 'Programming', value: 85, fullMark: 100 },
  { subject: 'Research', value: 72, fullMark: 100 },
  { subject: 'Problem Solving', value: 88, fullMark: 100 },
  { subject: 'Communication', value: 78, fullMark: 100 },
  { subject: 'Teamwork', value: 90, fullMark: 100 },
  { subject: 'AI/ML', value: 68, fullMark: 100 },
];

const researchOutput = [
  { month: 'Jan', publications: 18, grants: 3 },
  { month: 'Feb', publications: 24, grants: 4 },
  { month: 'Mar', publications: 32, grants: 5 },
  { month: 'Apr', publications: 41, grants: 8 },
  { month: 'May', publications: 55, grants: 11 },
  { month: 'Jun', publications: 68, grants: 14 },
];

const gradPrediction = [
  { dept: 'CSE', onTrack: 92, atRisk: 8 },
  { dept: 'EEE', onTrack: 88, atRisk: 12 },
  { dept: 'BBA', onTrack: 84, atRisk: 16 },
  { dept: 'Pharmacy', onTrack: 95, atRisk: 5 },
  { dept: 'English', onTrack: 80, atRisk: 20 },
];

export default function DeanAnalyticsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Academic Analytics 📊" subtitle="University Intelligence & Strategic Insights Hub" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="University CGPA" value="3.38" sub="↑ +0.06 vs last sem" icon="📈" color="#3B82F6" />
          <StatCard label="Research Output" value="+45%" sub="YoY growth" icon="🔬" color="#8B5CF6" />
          <StatCard label="Graduation Prediction" value="88%" sub="On-track university avg" icon="🎓" color="#10B981" />
          <StatCard label="AI Risk Alerts" value="8" sub="Need strategic action" icon="🤖" color="#F59E0B" />
        </div>

        {/* Row 1: CGPA Trend + Teacher Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📅 Semester CGPA Trend by Department</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={semCGPA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.1, 3.6]} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="EEE" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="BBA" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Pharmacy" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>👨‍🏫 Top Faculty Performance Index</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={teacherPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="teaching" name="Teaching" fill="#3B82F6" radius={[3,3,0,0]} />
                <Bar dataKey="research" name="Research" fill="#8B5CF6" radius={[3,3,0,0]} />
                <Bar dataKey="kpi" name="KPI" fill="#10B981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Skill Radar + Research Output */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🎯 University Skill Growth Radar</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 11 }} />
                <Radar name="University Avg" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔬 Research & Publication Growth (2026)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={researchOutput}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="publications" name="Publications" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="grants" name="Active Grants" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graduation Prediction */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🎓 Graduation Prediction by Department</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {gradPrediction.map(dept => (
              <div key={dept.dept}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dept.dept}</span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✅ On-Track: {dept.onTrack}%</span>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>⚠️ At Risk: {dept.atRisk}%</span>
                  </div>
                </div>
                <div style={{ height: '10px', background: 'var(--bg)', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ height: '100%', width: `${dept.onTrack}%`, background: '#10B981', transition: 'width 0.8s ease' }} />
                  <div style={{ height: '100%', width: `${dept.atRisk}%`, background: '#EF4444', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
