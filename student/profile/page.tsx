'use client';
import { useState, useEffect } from 'react';
import { Bell, Calendar, Menu, Edit, ChevronRight, GraduationCap, Hash, FileText, Mail, Building, Users, BookOpen, BarChart2, Lock, Shield, Activity, Monitor, Award, Star, Trophy } from 'lucide-react';
import studentData from '@/data/student.json';

export default function ProfilePage() {
  const { profile, academicSummary } = studentData;
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const creditsPercent = Math.round((academicSummary.creditsCompleted / academicSummary.creditsTotal) * 100);

  const infoFields = [
    { icon: <GraduationCap size={20} color="#003B95" />, label: 'FULL NAME', value: profile.name },
    { icon: <Hash size={20} color="#003B95" />, label: 'STUDENT ID', value: '261-16-010' },
    { icon: <FileText size={20} color="#003B95" />, label: 'ROLL NUMBER', value: 'CIS-21-010' },
    { icon: <Mail size={20} color="#003B95" />, label: 'EMAIL', value: 'joy.yuv@edu.ai' },
    { icon: <Building size={20} color="#003B95" />, label: 'DEPARTMENT', value: profile.department },
    { icon: <Users size={20} color="#003B95" />, label: 'BATCH', value: '2021' },
    { icon: <BookOpen size={20} color="#003B95" />, label: 'SEMESTER', value: `${profile.semester}th Semester` },
    { icon: <BarChart2 size={20} color="#003B95" />, label: 'CURRENT CGPA', value: profile.cgpa.toFixed(2) },
  ];

  const achievements = [
    { icon: <Trophy size={18} color="#F59E0B" />, bg: '#FEF3C7', title: "Dean's List", sub: 'Spring 2025' },
    { icon: <Star size={18} color="#8B5CF6" />, bg: '#EDE9FE', title: 'Project Excellence Award', sub: 'Database Management System' },
    { icon: <Award size={18} color="#EC4899" />, bg: '#FCE7F3', title: 'Programming Contest', sub: '2nd Position' },
  ];

  const security = [
    { icon: <Lock size={16} />, label: 'Change Password', badge: null },
    { icon: <Shield size={16} />, label: 'Two-Factor Authentication', badge: 'Enabled' },
    { icon: <Activity size={16} />, label: 'Login Activity', badge: null },
    { icon: <Monitor size={16} />, label: 'Linked Devices', badge: null },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F5F7FA', overflow: 'hidden' }}>

      {/* Blue Header */}
      <header style={{ height: 88, background: 'linear-gradient(90deg, #003B95 0%, #0047B3 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}><Menu size={20} /></button>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Profile</h1>
            <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.85 }}>Your academic profile and account information</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.9 }} suppressHydrationWarning>
            <Calendar size={18} />
            <div suppressHydrationWarning>
              <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>{dateStr}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{timeStr}</p>
            </div>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, background: '#EF4444', borderRadius: '50%', border: '2px solid #003B95' }} />
          </button>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)' }}>
            <img src="/profile_joy.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', gap: 24, padding: 24, overflowY: 'auto' }}>

        {/* Left + Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

          {/* Profile Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 28, padding: 32, border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(15,23,42,0.04)', display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 120, height: 120, borderRadius: 28, background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 700, color: 'white', overflow: 'hidden' }}>
                <img src="/profile_joy.png" alt="Joy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button style={{ position: 'absolute', bottom: -6, right: -6, width: 32, height: 32, borderRadius: '50%', background: '#003B95', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <Edit size={14} />
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{profile.name}</h2>
              <p style={{ fontSize: '1rem', color: '#64748B', margin: '0 0 16px 0' }}>{profile.department}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: '🎓 STUDENT', green: false },
                  { label: `SEMESTER ${profile.semester}`, green: false },
                  { label: 'BATCH 2021', green: true },
                ].map(b => (
                  <span key={b.label} style={{ background: b.green ? '#EAF8EA' : '#EEF4FF', color: b.green ? '#50B748' : '#003B95', padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>{b.label}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div style={{ background: '#FFFFFF', borderRadius: 28, padding: 32, border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: '#EEF4FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={18} color="#003B95" /></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Academic Information</h3>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#EEF4FF', border: '1px solid #DCE6F8', borderRadius: 10, color: '#003B95', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                <Edit size={14} /> Edit Profile
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {infoFields.map(f => (
                <div key={f.label} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 20, padding: 22, display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: '#EEF4FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#64748B', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{f.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Degree Progress */}
          <div style={{ background: '#FFFFFF', borderRadius: 28, padding: 32, border: '1px solid #E5E7EB', boxShadow: '0 8px 30px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, background: '#EEF4FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={18} color="#003B95" /></div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Degree Progress</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' }}>Credits Completed</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563EB' }}>{academicSummary.creditsCompleted} / {academicSummary.creditsTotal}</span>
            </div>
            <div style={{ height: 14, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${creditsPercent}%`, background: 'linear-gradient(90deg, #2563EB 0%, #38BDF8 100%)', borderRadius: 999, transition: 'width 0.8s ease' }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>{creditsPercent}% of degree completed</p>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>

          {/* Academic Summary */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <BarChart2 size={18} color="#003B95" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Academic Summary</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'CGPA', value: profile.cgpa.toFixed(2), color: '#2563EB' },
                { label: 'Attendance', value: `${academicSummary.attendanceAvg}%`, color: '#F59E0B' },
                { label: 'Credits Completed', value: `${academicSummary.creditsCompleted} / ${academicSummary.creditsTotal}`, color: '#8B5CF6' },
                { label: 'Rank', value: `#${studentData.peers.rank}`, color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} style={{ padding: '14px', background: '#F8FAFC', borderRadius: 14 }}>
                  <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '0 0 4px 0', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Trophy size={18} color="#003B95" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Recent Achievements</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {achievements.map(a => (
                <div key={a.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.icon}</div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{a.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account & Security */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Shield size={18} color="#003B95" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Account & Security</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {security.map(s => (
                <button key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                  <span style={{ color: '#64748B' }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>{s.label}</span>
                  {s.badge && <span style={{ background: '#EAF8EA', color: '#50B748', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{s.badge}</span>}
                  <ChevronRight size={16} color="#94A3B8" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
