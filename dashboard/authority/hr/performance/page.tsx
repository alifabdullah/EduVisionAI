'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KPI_DATA = [
  { dept: 'CSE', score: 92 },
  { dept: 'Pharmacy', score: 89 },
  { dept: 'EEE', score: 88 },
  { dept: 'BBA', score: 83 },
  { dept: 'English', score: 79 },
  { dept: 'Finance', score: 85 },
  { dept: 'HR', score: 90 },
];

export default function HRPerformancePage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Performance (KPI) 📈" subtitle="Employee Evaluation & Promotion Tracking" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Avg University KPI" value="86.5" sub="Out of 100" icon="📈" color="#0EA5E9" />
          <StatCard label="Pending Evaluations" value="45" sub="Requires supervisor review" icon="📝" color="#F59E0B" />
          <StatCard label="Promotion Eligible" value="28" sub="Met KPI targets" icon="🌟" color="#10B981" />
          <StatCard label="Underperforming" value="12" sub="KPI below 60" icon="⚠️" color="#EF4444" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>📊 Department KPI Averages</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={KPI_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="dept" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="score" name="Avg KPI Score" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>⚙️ Performance Management Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📑</span> Initiate Annual Evaluation
              </button>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🌟</span> Review Promotion Candidates
              </button>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span> Manage Performance Improvement Plans (PIP)
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
