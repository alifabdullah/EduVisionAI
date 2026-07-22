'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { motion } from 'framer-motion';

const JOBS = [
  { id: 'JOB-2026-01', title: 'Assistant Professor (CSE)', dept: 'CSE', applicants: 42, shortlisted: 12, status: 'Interviewing', deadline: '2026-07-15' },
  { id: 'JOB-2026-02', title: 'Network Administrator', dept: 'IT Support', applicants: 85, shortlisted: 8, status: 'Open', deadline: '2026-07-20' },
  { id: 'JOB-2026-03', title: 'Lecturer (English)', dept: 'English', applicants: 56, shortlisted: 15, status: 'Evaluating', deadline: '2026-07-10' },
  { id: 'JOB-2026-04', title: 'HR Executive', dept: 'Human Resources', applicants: 120, shortlisted: 5, status: 'Offer Stage', deadline: '2026-06-30' },
];

export default function HRRecruitmentPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Recruitment Center 🎯" subtitle="Job Postings, Applicant Tracking & Hiring Workflow" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Open Positions" value="8" sub="Across 5 departments" icon="🎯" color="#0EA5E9" />
          <StatCard label="Total Applicants" value="303" sub="Active hiring cycle" icon="📄" color="#8B5CF6" />
          <StatCard label="Interviews Scheduled" value="24" sub="This week" icon="📅" color="#F59E0B" />
          <StatCard label="Offers Extended" value="3" sub="Pending acceptance" icon="🤝" color="#10B981" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>📋 Active Job Postings</h3>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>+ Create New Job Post</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {JOBS.map((job, idx) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                style={{ padding: '1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0EA5E9' }}>{job.title}</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', fontWeight: 700 }}>{job.dept}</span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: job.status === 'Open' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: job.status === 'Open' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{job.status}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                    Job ID: {job.id} | Applicants: <strong style={{ color: 'var(--text)' }}>{job.applicants}</strong> | Shortlisted: <strong>{job.shortlisted}</strong> | Deadline: {job.deadline}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>View Applicants</button>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Manage Posting</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
