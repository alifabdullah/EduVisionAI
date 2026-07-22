'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import { motion } from 'framer-motion';

const DEPARTMENTS = [
  { name: 'CSE', head: 'Dr. Emily Carter', headRole: 'Department Head', employees: 120, faculty: 95, staff: 25, vacancies: 3, budget: '৳ 2.5M/mo' },
  { name: 'EEE', head: 'Prof. Md. Ziaul Haque', headRole: 'Department Head', employees: 85, faculty: 70, staff: 15, vacancies: 1, budget: '৳ 1.8M/mo' },
  { name: 'BBA', head: 'Dr. Farida Begum', headRole: 'Department Head', employees: 110, faculty: 90, staff: 20, vacancies: 2, budget: '৳ 2.1M/mo' },
  { name: 'Human Resources', head: 'Sarah Jenkins', headRole: 'HR Director', employees: 12, faculty: 0, staff: 12, vacancies: 1, budget: '৳ 0.8M/mo' },
  { name: 'IT Support', head: 'Md. Tariqul Islam', headRole: 'System Admin', employees: 18, faculty: 0, staff: 18, vacancies: 2, budget: '৳ 1.2M/mo' },
];

export default function HRDepartmentsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Department Management 🏢" subtitle="Workforce Distribution & Departmental HR Structure" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Departments" value="14" sub="Academic & Administrative" icon="🏢" color="#0EA5E9" />
          <StatCard label="Total Headcount" value="842" sub="University-wide" icon="👥" color="#8B5CF6" />
          <StatCard label="Avg Dept Size" value="60" sub="Employees per dept" icon="📊" color="#10B981" />
          <StatCard label="Open Vacancies" value="14" sub="Across all depts" icon="🎯" color="#F59E0B" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>📋 Department HR Directory</h3>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>+ Add Department</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {DEPARTMENTS.map((dept, idx) => (
              <motion.div key={dept.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                style={{ padding: '1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '2fr 3fr auto', gap: '1rem', alignItems: 'center' }}>
                
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0EA5E9', margin: '0 0 4px 0' }}>{dept.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>
                    Head: <strong style={{ color: 'var(--text)' }}>{dept.head}</strong> ({dept.headRole})
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: '#8B5CF6', margin: 0 }}>{dept.employees}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: 0 }}>Total Headcount</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: '#10B981', margin: 0 }}>{dept.faculty} / {dept.staff}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: 0 }}>Faculty / Staff</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: '#F59E0B', margin: 0 }}>{dept.vacancies}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: 0 }}>Vacancies</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Manage Dept</button>
                  <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Workforce Plan</button>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
