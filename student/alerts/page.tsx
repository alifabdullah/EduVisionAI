'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import AlertBadge from '@/components/ui/AlertBadge';
import { getStudentAlerts, getStudentRecommendations } from '@/utils/aiEngine';

const categoryColors: Record<string, string> = {
  Academic: '#6C63FF',
  Attendance: '#F43F5E',
  Skill: '#22D3EE',
  Mentorship: '#10B981',
  Library: '#F59E0B',
  Deadline: '#EF4444'
};

const iconMap: Record<string, string> = {
  academic: '📚',
  attendance: '📅',
  skill: '🎯',
  mentorship: '🤝',
  library: '📖',
  deadline: '⏰',
  book: '📚',
  calendar: '📅',
  mic: '🎤',
  users: '👥',
  'user-check': '✅',
  star: '⭐'
};

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'academic' | 'others'>('all');

  const ruleAlerts = getStudentAlerts();
  const ruleRecommendations = getStudentRecommendations();

  // Combine rule-based alerts and recommendations into a comprehensive list representing the updated Alerts system
  const allSystemAlerts = [
    // 1. High priority academic risk alert
    {
      id: 'al-1',
      category: 'Academic',
      type: 'marks',
      title: 'Critical Academic Risk: Database Systems',
      message: 'Your current course score in Database Systems (CSE303) is 48%, putting you at risk of failing the term.',
      priority: 'high' as const,
      subject: 'Database Systems'
    },
    // 2. High priority attendance alert
    {
      id: 'al-2',
      category: 'Attendance',
      type: 'attendance',
      title: 'Attendance Below Requirement: Database Systems',
      message: 'Your attendance is at 62%, which is below the mandatory 75% threshold. Sit-in authorization is pending.',
      priority: 'high' as const,
      subject: 'Database Systems'
    },
    // 3. Medium priority attendance warning
    {
      id: 'al-3',
      category: 'Attendance',
      type: 'attendance',
      title: 'Low Attendance Warning: Data Structures',
      message: 'Your Data Structures (CSE301) attendance is 68%. Avoid missing any more classes.',
      priority: 'medium' as const,
      subject: 'Data Structures'
    },
    // 4. Medium priority weak subject warning
    {
      id: 'al-4',
      category: 'Academic',
      type: 'marks',
      title: 'Improvement Needed: Data Structures',
      message: 'Your current score of 55% requires improvement before the final examinations.',
      priority: 'medium' as const,
      subject: 'Data Structures'
    },
    // 5. Assignment deadline alert
    {
      id: 'al-5',
      category: 'Deadline',
      type: 'deadline',
      title: 'Upcoming Deadline: Normalization Assignment',
      message: 'Database Systems Homework 3 (Normalization Practice Set) is due in 3 days (May 31).',
      priority: 'high' as const,
      subject: 'Database Systems'
    },
    // 6. Mentor request status alert
    {
      id: 'al-6',
      category: 'Mentorship',
      type: 'mentorship',
      title: 'Mentorship Request Accepted',
      message: 'Tamanna Akter has accepted your academic mentoring request. A diagnostic session has been scheduled.',
      priority: 'low' as const,
      subject: null
    },
    // 7. Skill Gap alert
    {
      id: 'al-7',
      category: 'Skill',
      type: 'skill',
      title: 'Skill Gap Warning: Soft Skills',
      message: 'Your Leadership (48%) and Communication (52%) indices are below target thresholds. Joining clubs is recommended.',
      priority: 'medium' as const,
      subject: null
    },
    // 8. Library Activity alert
    {
      id: 'al-8',
      category: 'Library',
      type: 'library',
      title: 'Study Duration Target Achieved',
      message: 'You have logged 52.0 study hours in the library this month. Your library card has been unlocked for research borrow.',
      priority: 'low' as const,
      subject: null
    },
    // Adding moved recommendations from AI Advisor to keep them visible
    ...ruleRecommendations.map((rec, index) => ({
      id: `rec-alert-${index}`,
      category: rec.category,
      type: rec.category.toLowerCase(),
      title: rec.title,
      message: rec.description,
      priority: (rec.priority === 'high' ? 'high' : rec.priority === 'medium' ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      subject: rec.category === 'Academic' ? 'General' : null
    }))
  ];

  const filteredAlerts = allSystemAlerts.filter(a => {
    if (activeFilter === 'high') return a.priority === 'high';
    if (activeFilter === 'academic') return a.category === 'Academic' || a.category === 'Attendance';
    if (activeFilter === 'others') return a.category !== 'Academic' && a.category !== 'Attendance';
    return true;
  });

  const counts = {
    high: allSystemAlerts.filter(a => a.priority === 'high').length,
    medium: allSystemAlerts.filter(a => a.priority === 'medium').length,
    low: allSystemAlerts.filter(a => a.priority === 'low').length,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Alerts & Recommendations" subtitle="All academic risk warnings, deadlines, and advisory recommendations" accentColor="#6C63FF" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Priority Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'High Priority', count: counts.high, color: 'var(--danger)', bg: 'rgba(244,63,94,0.1)', icon: '🚨' },
            { label: 'Medium Priority', count: counts.medium, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', icon: '⚠️' },
            { label: 'Low Priority', count: counts.low, color: 'var(--success)', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
          ].map(item => (
            <div key={item.label} className="glass-card" style={{ padding: '1.25rem', background: item.bg, borderColor: `${item.color}33`, textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: 8 }}>{item.icon}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: item.color }}>{item.count}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Navigation */}
        <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
          {[
            { id: 'all', label: 'All Warnings & Recommendations' },
            { id: 'high', label: '🚨 Critical (High Priority)' },
            { id: 'academic', label: '🎓 Academic & Attendance' },
            { id: 'others', label: '🤝 Mentorship, Deadlines & Skills' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              style={{
                padding: '8px 16px',
                background: activeFilter === tab.id ? 'rgba(108,99,255,0.15)' : 'transparent',
                border: activeFilter === tab.id ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                color: activeFilter === tab.id ? '#A78BFA' : 'var(--muted)',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => {
              const accentColor = categoryColors[alert.category] || '#6C63FF';
              return (
                <div
                  key={alert.id}
                  className="glass-card stat-card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `4px solid ${alert.priority === 'high' ? 'var(--danger)' : alert.priority === 'medium' ? 'var(--warning)' : 'var(--success)'}`
                  }}
                >
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: `${accentColor}20`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', flexShrink: 0, color: accentColor
                    }}>
                      {iconMap[alert.type] || iconMap[alert.category.toLowerCase()] || '💡'}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{alert.title}</h3>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            padding: '2px 8px', background: `${accentColor}20`,
                            color: accentColor, borderRadius: 6,
                            fontSize: '0.65rem', fontWeight: 700
                          }}>{alert.category}</span>
                          <AlertBadge priority={alert.priority} />
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{alert.message}</p>
                      
                      {alert.subject && (
                        <span style={{
                          display: 'inline-block', marginTop: 8, fontSize: '0.7rem',
                          padding: '2px 8px', background: 'rgba(255,255,255,0.04)',
                          border: '1px solid var(--border)', color: 'var(--text)',
                          borderRadius: 6, fontWeight: 500
                        }}>
                          📚 Subject Focus: {alert.subject}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>🎉</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No alerts matching the selected filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
