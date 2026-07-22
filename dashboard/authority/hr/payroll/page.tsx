'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PAYROLL_HISTORY = [
  { month: 'Jan', amount: 8400000 },
  { month: 'Feb', amount: 8450000 },
  { month: 'Mar', amount: 8450000 },
  { month: 'Apr', amount: 9200000 }, // Bonus month
  { month: 'May', amount: 8500000 },
  { month: 'Jun', amount: 8550000 },
];

export default function HRPayrollPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Payroll Management 💵" subtitle="Salary, Bonus & Deductions Processing" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Payroll (Jun)" value="৳ 8.55M" sub="Disbursed successfully" icon="💵" color="#10B981" />
          <StatCard label="Pending Processing" value="July 2026" sub="Due in 24 days" icon="⏳" color="#F59E0B" />
          <StatCard label="Tax Deducted (YTD)" value="৳ 1.2M" sub="Remitted to NBR" icon="🏢" color="#3B82F6" />
          <StatCard label="Avg Salary" value="৳ 45,500" sub="Across all employees" icon="📊" color="#8B5CF6" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>📈 Payroll Disbursement History</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={PAYROLL_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={value => `৳${(value/1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} formatter={(value: any) => `৳ ${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" name="Disbursed Amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>⚙️ Payroll Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚡</span> Generate Monthly Payroll (July 2026)
              </button>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🎁</span> Process Festival Bonus
              </button>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📉</span> Manage Deductions & Advances
              </button>
              <button style={{ padding: '1rem', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📄</span> Export Bank Disbursement Sheet
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
