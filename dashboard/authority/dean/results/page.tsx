'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const gradeDistribution = [
  { dept: 'CSE', Aplus: 320, A: 580, AMinus: 420, B: 380, Fail: 80 },
  { dept: 'EEE', Aplus: 180, A: 350, AMinus: 280, B: 220, Fail: 72 },
  { dept: 'BBA', Aplus: 210, A: 420, AMinus: 310, B: 350, Fail: 110 },
  { dept: 'Pharmacy', Aplus: 150, A: 280, AMinus: 210, B: 180, Fail: 30 },
  { dept: 'English', Aplus: 90, A: 200, AMinus: 180, B: 250, Fail: 120 },
];

const semTrend = [
  { semester: 'Spr 24', CSE: 3.35, EEE: 3.28, BBA: 3.20, Pharmacy: 3.45 },
  { semester: 'Sum 24', CSE: 3.38, EEE: 3.30, BBA: 3.22, Pharmacy: 3.48 },
  { semester: 'Fall 24', CSE: 3.40, EEE: 3.32, BBA: 3.24, Pharmacy: 3.50 },
  { semester: 'Spr 25', CSE: 3.42, EEE: 3.35, BBA: 3.27, Pharmacy: 3.50 },
  { semester: 'Sum 26', CSE: 3.45, EEE: 3.38, BBA: 3.30, Pharmacy: 3.52 },
];

const riskPie = [
  { name: 'Safe (CGPA ≥ 3.0)', value: 78, color: '#10B981' },
  { name: 'Low Risk', value: 14, color: '#3B82F6' },
  { name: 'At Risk (< 2.5)', value: 6, color: '#F59E0B' },
  { name: 'Critical (< 2.0)', value: 2, color: '#DC2626' },
];

const topStudents = [
  { name: 'Nusrat Jahan Priya', dept: 'CSE', cgpa: 3.90, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop', rank: 1 },
  { name: 'Riya Chakraborty', dept: 'BBA', cgpa: 3.85, photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&h=60&fit=crop', rank: 2 },
  { name: 'Arafat Islam Rafi', dept: 'CSE', cgpa: 3.85, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop', rank: 3 },
];

export default function DeanResultsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Result Management 📊" subtitle="University-wide Academic Performance Hub" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="University Avg CGPA" value="3.38" sub="Summer 2026" icon="📈" color="#3B82F6" />
          <StatCard label="Top Performers" value="2,340" sub="CGPA ≥ 3.5" icon="🏆" color="#F59E0B" />
          <StatCard label="Failed Students" value="412" sub="This semester" icon="📉" color="#DC2626" />
          <StatCard label="Improvement Cases" value="318" sub="vs last semester" icon="⬆️" color="#10B981" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Grade Distribution */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Grade Distribution by Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="Aplus" name="A+" stackId="a" fill="#10B981" />
                <Bar dataKey="A" name="A" stackId="a" fill="#3B82F6" />
                <Bar dataKey="AMinus" name="A-" stackId="a" fill="#8B5CF6" />
                <Bar dataKey="B" name="B/B+" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Fail" name="Fail" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Pie */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>⚠️ Academic Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {riskPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '0.78rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CGPA Trend + Top Performers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📈 Semester CGPA Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={semTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="semester" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.0, 3.7]} tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="EEE" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="BBA" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Pharmacy" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🏆 Top Performers University-wide</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {topStudents.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', background: 'var(--surface-2)', borderRadius: '10px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: ['#F59E0B', '#94A3B8', '#CD7F32'][s.rank - 1], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, flexShrink: 0 }}>#{s.rank}</div>
                  <img src={s.photo} alt={s.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3B82F6' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '2px 0 0' }}>{s.dept} | CGPA: <strong style={{ color: '#10B981' }}>{s.cgpa}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
