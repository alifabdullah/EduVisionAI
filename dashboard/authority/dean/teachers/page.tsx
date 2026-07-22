'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ALL_TEACHERS = [
  { id: 'TCH-001', name: 'Dr. Md. Sarwar Hossain Mollah', photo: '/images/teachers/sarwar.png', dept: 'CSE', designation: 'Associate Professor', courses: ['CSE401', 'CSE301', 'CSE499'], teachingScore: 92, researchStatus: 'Active', publications: 18, email: 'headcis@diu.edu.bd', status: 'Active', kpi: 90 },
  { id: 'TCH-002', name: 'Dr. Anika Rahman', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Professor', courses: ['CSE101', 'CSE201'], teachingScore: 95, researchStatus: 'Active', publications: 34, email: 'anika.cse@diu.edu.bd', status: 'Active', kpi: 96 },
  { id: 'TCH-003', name: 'Prof. Rashid Khan', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', dept: 'SWE', designation: 'Professor', courses: ['SWE201', 'SWE301'], teachingScore: 88, researchStatus: 'Active', publications: 32, email: 'rashid.swe@diu.edu.bd', status: 'Active', kpi: 88 },
  { id: 'TCH-004', name: 'Dr. Tamanna Akter', photo: '/images/teachers/tamanna.png', dept: 'CIS', designation: 'Lecturer', courses: ['CIS303', 'CIS301', 'CIS201'], teachingScore: 85, researchStatus: 'Inactive', publications: 9, email: 'tamanna@daffodilvarsity.edu.bd', status: 'Active', kpi: 82 },
  { id: 'TCH-005', name: 'Dr. Nusrat Jahan', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', dept: 'SWE', designation: 'Associate Professor', courses: ['SWE301', 'SWE201'], teachingScore: 90, researchStatus: 'Active', publications: 22, email: 'nusrat.swe@diu.edu.bd', status: 'Active', kpi: 85 },
  { id: 'TCH-006', name: 'Mr. Anisur Rahman', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Lecturer', courses: ['CSE102', 'CSE101'], teachingScore: 76, researchStatus: 'Inactive', publications: 5, email: 'anisur.cse@diu.edu.bd', status: 'Active', kpi: 72 },
  { id: 'TCH-007', name: 'Dr. Laila Hossain', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', dept: 'CSE', designation: 'Assistant Professor', courses: ['CSE303', 'CSE205'], teachingScore: 86, researchStatus: 'Active', publications: 11, email: 'laila.cse@diu.edu.bd', status: 'Active', kpi: 84 },
  { id: 'TCH-008', name: 'Prof. Karim Uddin', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', dept: 'SWE', designation: 'Professor', courses: ['SWE401', 'SWE501', 'SWE301'], teachingScore: 94, researchStatus: 'Active', publications: 40, email: 'karim.swe@diu.edu.bd', status: 'Active', kpi: 95 },
  { id: 'TCH-009', name: 'Dr. Shirin Begum', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', dept: 'CIS', designation: 'Associate Professor', courses: ['CIS501', 'CIS201'], teachingScore: 81, researchStatus: 'Active', publications: 15, email: 'shirin.cis@diu.edu.bd', status: 'Active', kpi: 80 },
  { id: 'TCH-010', name: 'Mr. Tanvir Ahmed', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', dept: 'CIS', designation: 'Senior Lecturer', courses: ['CIS101', 'CIS102', 'CIS201'], teachingScore: 79, researchStatus: 'Inactive', publications: 7, email: 'tanvir.cis@diu.edu.bd', status: 'Active', kpi: 75 },
];


const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer'];

export default function DeanTeachersPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [designation, setDesignation] = useState('');
  const [researchFilter, setResearchFilter] = useState('');

  const filtered = ALL_TEACHERS.filter(t => {
    if (dept && t.dept !== dept) return false;
    if (designation && t.designation !== designation) return false;
    if (researchFilter && t.researchStatus !== researchFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Teacher Management Center 👨‍🏫" subtitle="University-wide Faculty Directory & Academic Control" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Faculty" value="485" sub="University-wide" icon="👨‍🏫" color="#3B82F6" />
          <StatCard label="Active Faculty" value="462" sub="Currently teaching" icon="✅" color="#10B981" />
          <StatCard label="Professors" value="48" sub="Including associate" icon="🎓" color="#8B5CF6" />
          <StatCard label="Research Active" value="198" sub="Active publications" icon="🔬" color="#F59E0B" />
          <StatCard label="Avg Teaching Score" value="87%" sub="This semester" icon="📊" color="#14B8A6" />
          <StatCard label="On Leave" value="23" sub="Current semester" icon="🏖️" color="#94A3B8" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>🔍 Faculty Search & Directory</h3>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by Employee ID, Name, Email, Phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <select value={dept} onChange={e => setDept(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Departments</option>
              <option>CSE</option><option>SWE</option><option>CIS</option>
            </select>
            <select value={designation} onChange={e => setDesignation(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Designations</option>
              {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={researchFilter} onChange={e => setResearchFilter(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Research Status</option>
              <option>Active</option><option>Inactive</option>
            </select>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>Showing <strong>{filtered.length}</strong> of {ALL_TEACHERS.length} faculty members</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, flexShrink: 0, borderRadius: '50%', border: '2px solid #3B82F6', overflow: 'hidden' }}>
                    <img src={teacher.photo} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {teacher.name}
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: teacher.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: teacher.status === 'Active' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{teacher.status}</span>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: teacher.researchStatus === 'Active' ? 'rgba(139,92,246,0.1)' : 'rgba(148,163,184,0.1)', color: teacher.researchStatus === 'Active' ? '#8B5CF6' : '#94A3B8', fontWeight: 700 }}>🔬 Research {teacher.researchStatus}</span>
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '4px 0 0' }}>
                      {teacher.designation} • {teacher.dept} | ID: {teacher.id} | Teaching Score: <strong>{teacher.teachingScore}%</strong> | KPI: <strong>{teacher.kpi}</strong> | Publications: {teacher.publications}
                    </p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '5px', flexWrap: 'wrap' }}>
                      {teacher.courses.map(c => <span key={c} style={{ fontSize: '0.65rem', padding: '1px 6px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', borderRadius: '4px', fontWeight: 600 }}>{c}</span>)}
                    </div>
                  </div>
                </div>
                <div />
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link href={`/dashboard/authority/dean/teacher/${teacher.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>360° Profile</button>
                  </Link>
                  <Link href={`/dashboard/authority/dean/teacher/${teacher.id}?override=true`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Admin Override</button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
