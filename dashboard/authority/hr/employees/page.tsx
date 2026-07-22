'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ALL_EMPLOYEES = [
  { id: 'EMP-1001', name: 'Dr. Emily Carter', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Department Head', type: 'Faculty', status: 'Active', contract: 'Permanent', joiningYear: 2015, email: 'head.cse@diu.edu.bd' },
  { id: 'EMP-1002', name: 'Dr. Md. Sarwar Hossain', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Associate Professor', type: 'Faculty', status: 'Active', contract: 'Permanent', joiningYear: 2018, email: 'sarwar.cse@diu.edu.bd' },
  { id: 'EMP-1003', name: 'Sarah Jenkins', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', dept: 'Human Resources', designation: 'HR Director', type: 'Staff', status: 'Active', contract: 'Permanent', joiningYear: 2019, email: 'hr.director@diu.edu.bd' },
  { id: 'EMP-1004', name: 'Mr. Anisur Rahman', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Lecturer', type: 'Faculty', status: 'Probation', contract: 'Contractual', joiningYear: 2024, email: 'anisur.cse@diu.edu.bd' },
  { id: 'EMP-1005', name: 'Prof. Rashid Khan', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', dept: 'EEE', designation: 'Professor', type: 'Faculty', status: 'On Leave', contract: 'Permanent', joiningYear: 2010, email: 'rashid.eee@diu.edu.bd' },
  { id: 'EMP-1006', name: 'Md. Tariqul Islam', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', dept: 'IT Support', designation: 'System Admin', type: 'Staff', status: 'Active', contract: 'Permanent', joiningYear: 2020, email: 'tariqul.it@diu.edu.bd' },
  { id: 'EMP-1007', name: 'Fatema Akter', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', dept: 'BBA', designation: 'Assistant Professor', type: 'Faculty', status: 'Active', contract: 'Permanent', joiningYear: 2021, email: 'fatema.bba@diu.edu.bd' },
  { id: 'EMP-1008', name: 'Nasrin Sultana', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', dept: 'Finance', designation: 'Accounts Officer', type: 'Staff', status: 'Active', contract: 'Permanent', joiningYear: 2022, email: 'nasrin.fin@diu.edu.bd' },
];

const statusConfig: Record<string, { bg: string, color: string }> = {
  'Active': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'Probation': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  'On Leave': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  'Inactive': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
};

export default function HREmployeesPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const filtered = ALL_EMPLOYEES.filter(emp => {
    if (dept && emp.dept !== dept) return false;
    if (type && emp.type !== type) return false;
    if (status && emp.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      return emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Employee Management Center 👥" subtitle="University Human Resource Information System (HRIS)" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Employees" value="842" sub="Across all divisions" icon="👥" color="#0EA5E9" />
          <StatCard label="Active Faculty" value="485" sub="Academic staff" icon="👨‍🏫" color="#8B5CF6" />
          <StatCard label="Active Staff" value="325" sub="Admin & Support" icon="👔" color="#10B981" />
          <StatCard label="On Leave" value="18" sub="Current absent" icon="🏖️" color="#F59E0B" />
          <StatCard label="Probation" value="14" sub="Under evaluation" icon="⏳" color="#3B82F6" />
          <StatCard label="Contractual" value="45" sub="Temporary / Adjunct" icon="📄" color="#64748B" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>🔍 Employee Search & Directory</h3>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by Employee ID, Name, Email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <select value={dept} onChange={e => setDept(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Departments</option>
              <option>CSE</option><option>EEE</option><option>BBA</option><option>Human Resources</option><option>IT Support</option><option>Finance</option>
            </select>
            <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Types</option>
              <option>Faculty</option><option>Staff</option>
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Statuses</option>
              <option>Active</option><option>Probation</option><option>On Leave</option><option>Inactive</option>
            </select>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Showing <strong>{filtered.length}</strong> of {ALL_EMPLOYEES.length} employees
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filtered.map((emp, idx) => {
              const sc = statusConfig[emp.status] || { bg: 'var(--surface-2)', color: 'var(--muted)' };
              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.1rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img src={emp.photo} alt={emp.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0EA5E9', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {emp.name}
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: sc.bg, color: sc.color, fontWeight: 700 }}>{emp.status}</span>
                      </p>
                      <p style={{ fontSize: '0.73rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                        <strong>{emp.designation}</strong> • {emp.dept} | ID: {emp.id} | Type: {emp.type} | Contract: {emp.contract} | Joined: {emp.joiningYear}
                      </p>
                    </div>
                  </div>
                  <div />
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/dashboard/authority/hr/employee/${emp.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', border: '1px solid rgba(14,165,233,0.2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>360° Profile</button>
                    </Link>
                    <Link href={`/dashboard/authority/hr/employee/${emp.id}?hr_admin=true`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>HR Management</button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
