'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';
import StudentProfileModal from '@/components/teacher/StudentProfileModal';

type Segment = 'all' | 'high' | 'average' | 'at-risk';

const segmentColors: Record<string, string> = { high: '#10B981', average: '#22D3EE', 'at-risk': '#F43F5E' };
const segmentLabels: Record<string, string> = { high: 'High Performer', average: 'Average', 'at-risk': 'At-Risk' };

// Extended students list with: Registration status, Program details, Shift information, Academic status summary
const extendedStudents = teacherData.students.map((s, index) => {
  const regStatuses = ['Registered', 'Pending', 'Registered', 'Not Registered', 'Registered'];
  const programs = ['B.Sc. in CSE', 'B.Sc. in EEE', 'B.Sc. in BBA', 'B.Sc. in CSE', 'B.Sc. in Pharmacy'];
  const shifts = ['Day', 'Day', 'Evening', 'Day', 'Day'];
  const academicStatuses = ['Regular', 'Regular', 'Probation', 'Regular', 'Regular'];

  return {
    ...s,
    regStatus: regStatuses[index % regStatuses.length],
    program: programs[index % programs.length],
    shift: shifts[index % shifts.length],
    academicStatus: academicStatuses[index % academicStatuses.length],
  };
});

export default function StudentsPage() {
  const [filter, setFilter] = useState<Segment>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [regFilter, setRegFilter] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const filteredStudents = extendedStudents.filter(s => {
    const matchesSegment = filter === 'all' || s.segment === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesReg = regFilter === 'All' || s.regStatus === regFilter;
    const matchesShift = shiftFilter === 'All' || s.shift === shiftFilter;

    return matchesSegment && matchesSearch && matchesReg && matchesShift;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Students Directory" subtitle="Full student database with performance segmentation & registration control" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Filters and Search Bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search Input */}
            <input 
              type="text" 
              placeholder="🔍 Search name, roll, course..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--surface-2)',
                fontSize: '0.85rem', color: 'var(--text)', outline: 'none'
              }}
            />

            {/* Registration Status Filter */}
            <select 
              value={regFilter} 
              onChange={e => setRegFilter(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--surface-2)', fontSize: '0.85rem', color: 'var(--text)',
                outline: 'none', cursor: 'pointer', fontWeight: 600
              }}>
              <option value="All">All Registration</option>
              <option value="Registered">Registered</option>
              <option value="Pending">Pending</option>
              <option value="Not Registered">Not Registered</option>
            </select>

            {/* Shift Filter */}
            <select 
              value={shiftFilter} 
              onChange={e => setShiftFilter(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                background: 'var(--surface-2)', fontSize: '0.85rem', color: 'var(--text)',
                outline: 'none', cursor: 'pointer', fontWeight: 600
              }}>
              <option value="All">All Shifts</option>
              <option value="Day">Day</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
          {(['all', 'high', 'average', 'at-risk'] as Segment[]).map(seg => (
            <button key={seg} onClick={() => setFilter(seg)} style={{
              padding: '8px 18px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: filter === seg ? (seg === 'high' ? 'var(--success)' : seg === 'at-risk' ? 'var(--danger)' : seg === 'average' ? '#22D3EE' : '#6C63FF') : 'var(--surface)',
              color: filter === seg ? '#fff' : 'var(--muted)',
            }}>
              {seg === 'all' ? `All (${extendedStudents.length})` : seg === 'high' ? `High (${extendedStudents.filter(s => s.segment === 'high').length})` : seg === 'average' ? `Average (${extendedStudents.filter(s => s.segment === 'average').length})` : `At-Risk (${extendedStudents.filter(s => s.segment === 'at-risk').length})`}
            </button>
          ))}
        </div>

        {/* Student Table */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  {[
                    'Name & Program', 'Roll / Shift', 'Course', 'Marks', 
                    'Attendance', 'Registration', 'Academic Status', 'Segment', 'Action'
                  ].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < filteredStudents.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    
                    {/* Name & Program */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{s.program}</p>
                    </td>

                    {/* Roll / Shift */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{s.roll}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Shift: {s.shift}</p>
                    </td>

                    {/* Course */}
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{s.course}</td>

                    {/* Marks */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: s.marks < 60 ? 'var(--danger)' : s.marks < 75 ? 'var(--warning)' : 'var(--success)' }}>{s.marks}%</span>
                    </td>

                    {/* Attendance */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: s.attendance < 75 ? 'var(--danger)' : 'var(--success)' }}>{s.attendance}%</span>
                    </td>

                    {/* Registration Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700,
                        background: s.regStatus === 'Registered' ? 'rgba(16,185,129,0.1)' : s.regStatus === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: s.regStatus === 'Registered' ? '#10B981' : s.regStatus === 'Pending' ? '#F59E0B' : '#EF4444',
                        border: `1px solid ${s.regStatus === 'Registered' ? 'rgba(16,185,129,0.2)' : s.regStatus === 'Pending' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`
                      }}>
                        {s.regStatus}
                      </span>
                    </td>

                    {/* Academic Status */}
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: s.academicStatus === 'Probation' ? '#EF4444' : 'var(--text)' }}>
                      {s.academicStatus}
                    </td>

                    {/* Segment */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', background: `${segmentColors[s.segment]}20`, color: segmentColors[s.segment], border: `1px solid ${segmentColors[s.segment]}44`, borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {segmentLabels[s.segment]}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '12px 16px' }}>
                      <button 
                        onClick={() => setSelectedStudent(s)}
                        style={{ 
                          padding: '6px 12px', background: 'transparent', border: '1px solid #3B82F6', 
                          color: '#3B82F6', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, 
                          cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#3B82F6'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3B82F6'; }}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 360 Degree Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}
