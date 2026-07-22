'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const semResults = [
  { course: 'CSE101', aPlus: 18, a: 32, aMinus: 25, b: 28, fail: 17 },
  { course: 'CSE201', aPlus: 12, a: 22, aMinus: 20, b: 19, fail: 17 },
  { course: 'CSE301', aPlus: 15, a: 24, aMinus: 18, b: 12, fail: 6 },
  { course: 'CSE303', aPlus: 8, a: 16, aMinus: 18, b: 20, fail: 18 },
  { course: 'CSE401', aPlus: 20, a: 18, aMinus: 10, b: 2, fail: 0 },
];

const topStudents = [
  { name: 'Nusrat Jahan Priya', cgpa: 3.90, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop', rank: 1 },
  { name: 'Arafat Islam Rafi', cgpa: 3.85, photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop', rank: 2 },
  { name: 'Fahima Khatun', cgpa: 3.72, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', rank: 3 },
];

const failRisk = [
  { name: 'Sabbir Rahman', cgpa: 2.50, course: 'CSE303', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop' },
  { name: 'Mehedi Hasan Shanto', cgpa: 2.75, course: 'CSE201', photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop' },
];

export default function DeptHeadResultsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Result Management 📊" subtitle="CSE Department — Academic Performance Hub" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Dept Avg CGPA" value="3.42" sub="Summer 2026" icon="📈" color="#3B82F6" />
          <StatCard label="Top Performers" value="42" sub="CGPA ≥ 3.8" icon="🏆" color="#F59E0B" />
          <StatCard label="Failed Students" value="58" sub="This semester" icon="📉" color="#DC2626" />
          <StatCard label="Improvement Cases" value="31" sub="vs last semester" icon="⬆️" color="#10B981" />
        </div>

        {/* Grade Distribution Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Grade Distribution by Course</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={semResults}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="course" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="aPlus" name="A+" stackId="a" fill="#10B981" />
              <Bar dataKey="a" name="A" stackId="a" fill="#3B82F6" />
              <Bar dataKey="aMinus" name="A-" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="b" name="B/B+" stackId="a" fill="#F59E0B" />
              <Bar dataKey="fail" name="Fail" stackId="a" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers & Risk Students */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🏆 Top Performers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {topStudents.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: '10px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: ['#F59E0B', '#94A3B8', '#CD7F32'][s.rank - 1], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>#{s.rank}</div>
                  <img src={s.photo} alt={s.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, margin: 0 }}>CGPA: {s.cgpa}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🚨 Fail-Risk Students</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {failRisk.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(220,38,38,0.05)', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <img src={s.photo} alt={s.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #DC2626' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{s.name}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '3px 0 0' }}>CGPA: <strong style={{ color: '#DC2626' }}>{s.cgpa}</strong> | Failing: {s.course}</p>
                  </div>
                  <button style={{ padding: '5px 10px', borderRadius: '6px', background: '#DC2626', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Alert</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
