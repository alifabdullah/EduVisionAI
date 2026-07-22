'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { MASTER_STUDENTS } from '@/data/sharedMockData';

const statusConfig: Record<string, { bg: string, color: string }> = {
  'Excellent': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'high': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'Good': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  'average': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
  'Concern': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  'at-risk': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
  'Critical': { bg: 'rgba(220,38,38,0.12)', color: '#DC2626' },
};

export default function DeanStudentsPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = MASTER_STUDENTS.filter(s => {
    if (dept && s.departmentId !== dept) return false;
    if (batch && s.batchYear.toString() !== batch) return false;
    if (semester && s.semester.toString() !== semester) return false;
    if (statusFilter && s.segment !== statusFilter && s.segment !== statusFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.regNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Student Management Center 🎓" subtitle="University-wide Student Directory & Academic Control" accentColor="#3B82F6" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Summary Cards */}
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Students" value="12,850" sub="All departments" icon="🎓" color="#3B82F6" />
          <StatCard label="Active Students" value="12,420" sub="Currently enrolled" icon="✅" color="#10B981" />
          <StatCard label="High Performers" value="2,340" sub="CGPA ≥ 3.5" icon="⭐" color="#F59E0B" />
          <StatCard label="At-Risk Students" value="420" sub="Requiring intervention" icon="⚠️" color="#EF4444" />
          <StatCard label="Average CGPA" value="3.38" sub="University-wide" icon="📈" color="#8B5CF6" />
          <StatCard label="Avg Attendance" value="84.5%" sub="This semester" icon="📅" color="#14B8A6" />
        </div>

        {/* Search Panel */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>🔍 Student Search & Directory</h3>

          {/* Global Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Global Search: Student ID, Name, Registration No., Email, Phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Hierarchy Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            <select value={dept} onChange={e => setDept(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Departments</option>
              <option>CSE</option><option>SWE</option><option>CIS</option>
            </select>
            <select value={batch} onChange={e => setBatch(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Batches</option>
              <option value="63">Batch 63</option><option value="64">Batch 64</option><option value="65">Batch 65</option><option value="66">Batch 66</option>
            </select>
            <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s.toString()}>Semester {s}</option>)}
            </select>
            <select value={section} onChange={e => setSection(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Sections</option>
              <option>A</option><option>B</option><option>C</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
              <option value="">All Statuses</option>
              <option>high</option><option>average</option><option>at-risk</option>
            </select>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            Showing <strong>{filtered.length}</strong> of {MASTER_STUDENTS.length} students (sample — full DB integration in production)
          </p>

          {/* Student Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filtered.map((student, idx) => {
              const sc = statusConfig[student.segment] || { bg: 'var(--surface-2)', color: 'var(--muted)' };
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.1rem', background: 'var(--surface-2)', borderRadius: '12px', border: '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img src={student.photo || '/profile_joy.png'} alt={student.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #3B82F6', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {student.name}
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '10px', background: sc.bg, color: sc.color, fontWeight: 700 }}>{student.segment.toUpperCase()}</span>
                      </p>
                      <p style={{ fontSize: '0.73rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                        <strong>{student.departmentId}</strong> | ID: {student.id} | Batch {student.batchYear} | Sem {student.semester} | CGPA: <strong style={{ color: student.cgpa >= 3.5 ? '#10B981' : student.cgpa < 3.0 ? '#EF4444' : 'var(--text)' }}>{student.cgpa}</strong> | Attendance: <strong style={{ color: student.attendancePct < 75 ? '#EF4444' : 'var(--text)' }}>{student.attendancePct}%</strong>
                      </p>
                    </div>
                  </div>
                  <div />
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/dashboard/authority/dean/student/${student.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>360° Profile</button>
                    </Link>
                    <Link href={`/dashboard/authority/dean/student/${student.id}?override=true`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Admin Override</button>
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
