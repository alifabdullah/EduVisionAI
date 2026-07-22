'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { MASTER_STUDENTS } from '@/data/sharedMockData';

const statusStyle = (status: string) => {
  if (status === 'high') return { bg: 'rgba(16,185,129,0.1)', color: '#10B981' };
  if (status === 'average') return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' };
  if (status === 'at-risk') return { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' };
  return { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' };
};

export default function DeptHeadStudentsPage() {
  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');

  const filtered = MASTER_STUDENTS.filter(s => {
    if (s.departmentId !== 'CIS') return false; // Dept Head scoped
    if (batch && s.batchYear.toString() !== batch) return false;
    if (semester && s.semester.toString() !== semester) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Student Management 🎓" subtitle="CSE Department — Full Enrollment Control" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Students" value="1,240" sub="All batches" icon="🎓" color="#3B82F6" />
          <StatCard label="Excellent Standing" value="420" sub="CGPA ≥ 3.5" icon="⭐" color="#10B981" />
          <StatCard label="At Risk" value="52" sub="Below 75% attendance" icon="⚠️" color="#F59E0B" />
          <StatCard label="Critical" value="14" sub="Need immediate action" icon="🚨" color="#DC2626" />
        </div>

        {/* Search & Filters */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔍 Student Search & Directory</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(3, auto)', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by Name, ID, Registration No..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '0.9rem' }}
            />
            <select value={batch} onChange={e => setBatch(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Batches</option>
              <option value="63">Batch 63</option>
              <option value="64">Batch 64</option>
              <option value="65">Batch 65</option>
            </select>
            <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
            </select>
            <select value={section} onChange={e => setSection(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
            Showing <strong>{filtered.length}</strong> students
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filtered.map((student, idx) => {
              const s = statusStyle(student.segment);
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={"/profile_joy.png"} alt={student.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {student.name}
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: s.bg, color: s.color, fontWeight: 700 }}>{student.segment.toUpperCase()}</span>
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                        ID: {student.id} | Reg: {student.regNo} | Batch {student.batchYear} | Sem {student.semester} | CGPA: <strong style={{ color: 'var(--text)' }}>{student.cgpa}</strong> | Attendance: <strong style={{ color: student.attendancePct < 75 ? '#DC2626' : 'var(--text)' }}>{student.attendancePct}%</strong>
                      </p>
                    </div>
                  </div>
                  <Link href={`/dashboard/authority/dept-head/student/${student.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '0.5rem 1.1rem', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>
                      View 360° Profile
                    </button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
