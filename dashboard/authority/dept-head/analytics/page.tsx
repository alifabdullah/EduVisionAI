'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area } from 'recharts';

const semComparison = [
  { semester: 'Spring 24', avgCGPA: 3.25, atRisk: 18, passRate: 80 },
  { semester: 'Summer 24', avgCGPA: 3.30, atRisk: 15, passRate: 83 },
  { semester: 'Fall 24', avgCGPA: 3.35, atRisk: 14, passRate: 85 },
  { semester: 'Spring 25', avgCGPA: 3.40, atRisk: 12, passRate: 88 },
  { semester: 'Summer 25', avgCGPA: 3.42, atRisk: 10, passRate: 90 },
  { semester: 'Summer 26', avgCGPA: 3.50, atRisk: 8, passRate: 92 },
];

const skillGrowth = [
  { subject: 'Programming', A: 88, fullMark: 100 },
  { subject: 'Research', A: 72, fullMark: 100 },
  { subject: 'Problem Solving', A: 85, fullMark: 100 },
  { subject: 'Communication', A: 78, fullMark: 100 },
  { subject: 'Teamwork', A: 90, fullMark: 100 },
  { subject: 'AI/ML Skills', A: 70, fullMark: 100 },
];

const teacherPerf = [
  { name: 'Dr. Anika', teaching: 95, research: 88, mentoring: 90 },
  { name: 'Dr. Sarwar', teaching: 92, research: 85, mentoring: 94 },
  { name: 'Dr. Sumaiya', teaching: 90, research: 82, mentoring: 88 },
  { name: 'Mr. Faisal', teaching: 81, research: 40, mentoring: 72 },
  { name: 'Mr. Imran', teaching: 76, research: 30, mentoring: 68 },
];

export default function DeptHeadAnalyticsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Academic Analytics 📊" subtitle="CSE Department — Intelligence & Insights Hub" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Dept CGPA Trend" value="↑ 3.50" sub="+0.08 vs last sem" icon="📈" color="#10B981" />
          <StatCard label="Pass Rate" value="92%" sub="Highest ever" icon="✅" color="#3B82F6" />
          <StatCard label="Grad Prediction" value="96%" sub="On-track this batch" icon="🎓" color="#8B5CF6" />
          <StatCard label="Research Output" value="+45%" sub="YoY publications" icon="🔬" color="#F59E0B" />
        </div>

        {/* Row 1: Semester Comparison + Teacher Performance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📅 Semester CGPA & Pass Rate Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={semComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" domain={[3.0, 4.0]} tick={{ fill: '#3B82F6', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 100]} tick={{ fill: '#10B981', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Line yAxisId="left" type="monotone" dataKey="avgCGPA" name="Avg CGPA" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="passRate" name="Pass Rate %" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>👨‍🏫 Faculty Performance Index</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teacherPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="teaching" name="Teaching" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="research" name="Research" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="mentoring" name="Mentoring" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Skill Radar + At-Risk Trend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🎯 Department Skill Growth Radar</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillGrowth}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text)', fontSize: 11 }} />
                <Radar name="Skill Score" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>⚠️ At-Risk Student Reduction Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={semComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="atRisk" name="At-Risk %" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
