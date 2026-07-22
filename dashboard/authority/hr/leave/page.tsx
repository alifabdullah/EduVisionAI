'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { motion } from 'framer-motion';

const LEAVE_REQUESTS = [
  { id: 'LR-2607-01', empName: 'Mr. Anisur Rahman', dept: 'CSE', type: 'Sick Leave', duration: '2 Days', dates: 'July 08 - July 09', reason: 'Viral Fever', status: 'Pending' },
  { id: 'LR-2607-02', empName: 'Sarah Jenkins', dept: 'Human Resources', type: 'Casual Leave', duration: '1 Day', dates: 'July 10', reason: 'Personal work', status: 'Pending' },
  { id: 'LR-2607-03', empName: 'Dr. Md. Sarwar Hossain', dept: 'CSE', type: 'Earned Leave', duration: '5 Days', dates: 'July 15 - July 19', reason: 'Family vacation', status: 'Approved' },
  { id: 'LR-2607-04', empName: 'Fatema Akter', dept: 'BBA', type: 'Casual Leave', duration: '2 Days', dates: 'July 11 - July 12', reason: 'Emergency', status: 'Rejected' },
];

export default function HRLeavePage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Leave Management 🏖️" subtitle="Employee Leave Tracking & Approvals" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Pending Approvals" value="12" sub="Require HR action" icon="⏳" color="#F59E0B" />
          <StatCard label="On Leave Today" value="18" sub="Approved absence" icon="🏖️" color="#3B82F6" />
          <StatCard label="Approved This Month" value="45" sub="Total requests approved" icon="✅" color="#10B981" />
          <StatCard label="Rejected This Month" value="4" sub="Total requests denied" icon="❌" color="#EF4444" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>📩 Recent Leave Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {LEAVE_REQUESTS.map((req, idx) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                style={{ padding: '1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>{req.empName}</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700 }}>{req.dept}</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: req.status === 'Pending' ? 'rgba(245,158,11,0.1)' : req.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: req.status === 'Pending' ? '#F59E0B' : req.status === 'Approved' ? '#10B981' : '#EF4444', fontWeight: 700 }}>{req.status}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                    Type: <strong style={{ color: '#0EA5E9' }}>{req.type}</strong> | Duration: {req.duration} ({req.dates}) | Reason: {req.reason}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {req.status === 'Pending' ? (
                    <>
                      <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#10B981', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                      <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#EF4444', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                    </>
                  ) : (
                    <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View Details</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
