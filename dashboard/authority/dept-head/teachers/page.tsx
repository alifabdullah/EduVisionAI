'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DEPT_TEACHERS = [
  { id: 'TCH-001', name: 'Dr. Md. Sarwar Hossain Mollah', photo: '/images/teachers/sarwar.png', designation: 'Associate Professor', courses: ['CSE401', 'CSE301', 'CSE499'], teachingScore: 92, researchStatus: 'Active', publications: 18, email: 'headcis@diu.edu.bd', status: 'Active' },
  { id: 'TCH-011', name: 'Dr. Anika Rahman', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', designation: 'Professor', courses: ['CSE101', 'CSE201'], teachingScore: 95, researchStatus: 'Active', publications: 34, email: 'anika.cse@diu.edu.bd', status: 'Active' },
  { id: 'TCH-012', name: 'Mr. Faisal Hasan', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', designation: 'Senior Lecturer', courses: ['CSE205', 'CSE303'], teachingScore: 81, researchStatus: 'Inactive', publications: 5, email: 'faisal.cse@diu.edu.bd', status: 'Active' },
  { id: 'TCH-013', name: 'Dr. Nasreen Begum', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop', designation: 'Assistant Professor', courses: ['CSE401', 'CSE455'], teachingScore: 88, researchStatus: 'Active', publications: 12, email: 'nasreen.cse@diu.edu.bd', status: 'On Leave' },
  { id: 'TCH-014', name: 'Mr. Imran Hossain', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', designation: 'Lecturer', courses: ['CSE101', 'CSE102'], teachingScore: 76, researchStatus: 'Inactive', publications: 2, email: 'imran.cse@diu.edu.bd', status: 'Active' },
  { id: 'TCH-015', name: 'Dr. Sumaiya Khanam', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', designation: 'Associate Professor', courses: ['CSE301', 'CSE401'], teachingScore: 90, researchStatus: 'Active', publications: 21, email: 'sumaiya.cse@diu.edu.bd', status: 'Active' },
];

export default function DeptHeadTeachersPage() {
  const [search, setSearch] = useState('');
  const [designation, setDesignation] = useState('');

  const filtered = DEPT_TEACHERS.filter(t => {
    if (designation && t.designation !== designation) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Faculty Management 👨‍🏫" subtitle="CSE Department — Full Faculty Directory" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Faculty" value="45" sub="Department of CSE" icon="👨‍🏫" color="#3B82F6" />
          <StatCard label="Professors" value="4" sub="Including Associate" icon="🎓" color="#10B981" />
          <StatCard label="Active Research" value="12" sub="Ongoing projects" icon="🔬" color="#8B5CF6" />
          <StatCard label="On Leave" value="3" sub="This semester" icon="🏖️" color="#F59E0B" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔍 Faculty Directory & Search</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Search by Name, Employee ID, Email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
            <select value={designation} onChange={e => setDesignation(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Designations</option>
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
              <option>Senior Lecturer</option>
              <option>Lecturer</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 52, height: 52, minWidth: 52, minHeight: 52, flexShrink: 0, borderRadius: '50%', border: '2px solid #10B981', overflow: 'hidden' }}>
                    <img src={teacher.photo} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {teacher.name}
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: teacher.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: teacher.status === 'Active' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{teacher.status}</span>
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                      {teacher.designation} | ID: {teacher.id} | Teaching Score: <strong>{teacher.teachingScore}%</strong> | Publications: <strong>{teacher.publications}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '5px', flexWrap: 'wrap' }}>
                      {teacher.courses.map(c => (
                        <span key={c} style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', borderRadius: '4px', fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href={`/dashboard/authority/dept-head/teacher/${teacher.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '0.5rem 1.1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>
                    View 360° Profile
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
