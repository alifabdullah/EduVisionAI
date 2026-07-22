'use client';
import { X, Award, Activity, BookOpen, Phone, Mail, MapPin, BrainCircuit, Users, Star, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { MASTER_STUDENTS } from '@/data/sharedMockData';

interface StudentProfileModalProps {
  student: any;
  onClose: () => void;
}

const gradeColor: Record<string, string> = {
  'A': '#10B981', 'A-': '#10B981', 'A+': '#10B981',
  'B+': '#3B82F6', 'B': '#3B82F6',
  'C+': '#F59E0B', 'C': '#F59E0B',
  'D+': '#EF4444', 'D': '#EF4444', 'F': '#EF4444',
};

export default function StudentProfileModal({ student, onClose }: StudentProfileModalProps) {
  if (!student) return null;

  const real = MASTER_STUDENTS.find(s => s.name.toLowerCase() === student.name.toLowerCase());
  const isAtRisk = (real?.segment || student.segment) === 'at-risk';
  const isHigh   = (real?.segment || student.segment) === 'high';
  const colorPrimary = isAtRisk ? '#EF4444' : isHigh ? '#10B981' : '#3B82F6';
  const avatarUrl = student.name.toLowerCase().includes('joy') ? '/profile_joy.png' : null;

  // Skills data
  const skills = real?.skills
    ? [
        { subject: 'Communication',    A: real.skills.Communication    },
        { subject: 'Leadership',       A: real.skills.Leadership       },
        { subject: 'Teamwork',         A: real.skills.Teamwork         },
        { subject: 'Critical Thinking',A: real.skills.CriticalThinking },
        { subject: 'Problem Solving',  A: real.skills.ProblemSolving   },
      ]
    : [
        { subject: 'Communication', A: 65 },
        { subject: 'Leadership',    A: 55 },
        { subject: 'Teamwork',      A: 70 },
        { subject: 'Critical Thinking', A: 60 },
        { subject: 'Problem Solving',   A: 65 },
      ];

  // Academic subject bar data
  const subjectData = (real?.subjects || []).map(s => ({
    name: s.name.length > 14 ? s.name.substring(0, 14) + '…' : s.name,
    fullName: s.name,
    marks: s.marks,
    attendance: s.attendance,
    grade: s.grade,
    risk: s.risk,
  }));

  const skillColor = (val: number) =>
    val < 55 ? '#EF4444' : val < 70 ? '#F59E0B' : '#10B981';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="fade-in"
        style={{ background: '#F1F5F9', width: '100%', maxWidth: '1080px', maxHeight: '92vh', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.35)' }}
      >
        {/* ── HEADER ──────────────────────────── */}
        <div style={{ padding: '24px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: `3px solid ${colorPrimary}`, overflow: 'hidden', flexShrink: 0, background: colorPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800 }}>
              {avatarUrl
                ? <img src={avatarUrl} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : student.name.substring(0, 2).toUpperCase()
              }
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{real?.name || student.name}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '6px', fontSize: '0.82rem', color: '#93C5FD' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={13}/> {student.program || real?.department}</span>
                <span>•</span>
                <span>ID: {real?.roll || student.roll}</span>
                <span>•</span>
                <span>Semester {real?.semester || '—'}</span>
                <span>•</span>
                <span style={{ background: `${colorPrimary}30`, color: colorPrimary, padding: '2px 10px', borderRadius: '999px', fontWeight: 700, fontSize: '0.78rem' }}>
                  {(real?.segment || student.segment || '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── SCROLL BODY ──────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
            {[
              { label: 'CGPA', value: real?.cgpa?.toFixed(2) ?? '—', icon: <Award size={18} color="#8B5CF6"/>, color: '#8B5CF6' },
              { label: 'Attendance', value: `${real?.attendancePct ?? student.attendance}%`, icon: <Activity size={18} color={((real?.attendancePct ?? student.attendance) < 75) ? '#EF4444' : '#10B981'}/>, color: ((real?.attendancePct ?? student.attendance) < 75) ? '#EF4444' : '#10B981' },
              { label: 'Credits Done', value: real ? `${real.creditsCompleted}/${real.creditsTotal}` : '—', icon: <Target size={18} color="#3B82F6"/>, color: '#3B82F6' },
              { label: 'Class Rank', value: real ? `#${real.rank}` : '—', icon: <Star size={18} color="#F59E0B"/>, color: '#F59E0B' },
              { label: 'Percentile', value: real ? `${real.percentile}th` : '—', icon: <TrendingUp size={18} color="#10B981"/>, color: '#10B981' },
            ].map((k, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${k.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {k.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</p>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{k.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Middle: Radar + Skill Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Radar */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>360° Skills Radar</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: '#94A3B8' }}>Visual overview of soft skill proficiency</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={skills}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 9 }} />
                  <Radar name="Student" dataKey="A" stroke={colorPrimary} fill={colorPrimary} fillOpacity={0.35} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '0.8rem' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Skill progress bars */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Skill Breakdown</h3>
              <p style={{ margin: '0 0 18px 0', fontSize: '0.78rem', color: '#94A3B8' }}>Individual skill levels with gap indicators</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {skills.map((sk, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#475569' }}>{sk.subject}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: skillColor(sk.A) }}>{sk.A}%</span>
                        {sk.A < 60 && <span style={{ fontSize: '0.68rem', background: '#FEF2F2', color: '#DC2626', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>Gap</span>}
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${sk.A}%`, background: skillColor(sk.A), borderRadius: '999px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Subjects */}
          {subjectData.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Subject-wise Academic Performance</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#94A3B8' }}>Marks & attendance per enrolled subject</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {subjectData.map((sub, i) => (
                  <div key={i} style={{ border: `1px solid ${sub.risk === 'high' ? '#FCA5A5' : sub.risk === 'medium' ? '#FCD34D' : '#A7F3D0'}`, borderRadius: '12px', padding: '14px', background: sub.risk === 'high' ? '#FFF5F5' : sub.risk === 'medium' ? '#FFFBEB' : '#F0FDF4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <p style={{ margin: '0 0 2px 0', fontSize: '0.8rem', fontWeight: 700, color: '#1E293B' }}>{sub.fullName}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>{(real?.subjects || [])[i]?.code}</p>
                      </div>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', background: `${gradeColor[sub.grade] || '#64748B'}20`, color: gradeColor[sub.grade] || '#64748B' }}>{sub.grade}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div>
                        <p style={{ margin: '0 0 3px 0', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Marks</p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: sub.marks < 50 ? '#EF4444' : sub.marks < 70 ? '#F59E0B' : '#10B981' }}>{sub.marks}%</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 3px 0', fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Attendance</p>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: sub.attendance < 75 ? '#EF4444' : '#10B981' }}>{sub.attendance}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={subjectData} barSize={20} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '0.8rem' }} />
                  <Bar dataKey="marks" name="Marks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Clubs, Projects, Research + Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Activities */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Co-curricular & Research</h3>
              {real?.clubs && real.clubs.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Clubs & Organizations</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {real.clubs.map((c, i) => (
                      <span key={i} style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {real?.projects && real.projects.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Projects</p>
                  {real.projects.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6', marginTop: '6px', flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', fontWeight: 500 }}>{p}</p>
                    </div>
                  ))}
                </div>
              )}
              {real?.research && real.research.length > 0 && (
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Research</p>
                  {real.research.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', marginTop: '6px', flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', fontWeight: 500, fontStyle: 'italic' }}>{r}</p>
                    </div>
                  ))}
                </div>
              )}
              {(!real?.clubs?.length && !real?.projects?.length && !real?.research?.length) && (
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No co-curricular data recorded.</p>
              )}
            </div>

            {/* Contact */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '22px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Contact Information</h3>
              {[
                { icon: <Phone size={16}/>, label: 'Phone', value: real?.phone || '+880 1712-345678', color: '#3B82F6' },
                { icon: <Mail size={16}/>, label: 'Email', value: real?.email || `${student.name.split(' ')[0].toLowerCase()}@edu.ai`, color: '#8B5CF6' },
                { icon: <MapPin size={16}/>, label: 'Address', value: 'Daffodil Smart City, Ashulia', color: '#10B981' },
                { icon: <Users size={16}/>, label: 'Batch', value: real?.batch || 'Batch-24', color: '#F59E0B' },
              ].map((info, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: i < 3 ? '14px' : '0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${info.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: info.color, flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <p style={{ margin: '0 0 1px 0', fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{info.label}</p>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#1E293B' }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div style={{ background: isAtRisk ? 'linear-gradient(135deg,#FEF2F2,#FFF5F5)' : 'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border: `1px solid ${isAtRisk ? '#FCA5A5' : '#BFDBFE'}`, borderRadius: '16px', padding: '22px', display: 'flex', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isAtRisk ? '#FEE2E2' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isAtRisk ? '#EF4444' : '#3B82F6', flexShrink: 0 }}>
              <BrainCircuit size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: isAtRisk ? '#991B1B' : '#1E40AF' }}>AI Recommendation</h4>
                <span style={{ fontSize: '0.7rem', background: isAtRisk ? '#EF4444' : '#3B82F6', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>For Teacher</span>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: isAtRisk ? '#7F1D1D' : '#1E3A8A', lineHeight: 1.6 }}>
                {isAtRisk
                  ? `${real?.name || student.name}'s attendance (${real?.attendancePct ?? student.attendance}%) is below the 75% threshold and academic scores indicate serious risk. AI strongly recommends an immediate 1-on-1 counseling session to identify root causes and create a personalized recovery plan before the semester closes.`
                  : `${real?.name || student.name} is performing ${isHigh ? 'exceptionally' : 'adequately'}. CGPA stands at ${real?.cgpa?.toFixed(2)}. Consider assigning mentorship responsibilities, research collaboration, or competitive programming challenges to maximize their potential.`}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button style={{ background: isAtRisk ? '#EF4444' : '#3B82F6', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem' }}>
                  {isAtRisk ? '📅 Schedule Counseling' : '🚀 Assign Advanced Task'}
                </button>
                <button style={{ background: 'transparent', color: isAtRisk ? '#EF4444' : '#3B82F6', border: `1.5px solid ${isAtRisk ? '#EF4444' : '#3B82F6'}`, padding: '9px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem' }}>
                  ✉️ Message Student
                </button>
                <button style={{ background: 'transparent', color: '#64748B', border: '1.5px solid #CBD5E1', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem' }}>
                  📄 Generate Report
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
