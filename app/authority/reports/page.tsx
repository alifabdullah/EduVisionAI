'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import { useState } from 'react';

const reports = [
  { id: 'univ-perf', name: 'University Performance Summary', desc: 'Comprehensive overview of institutional academic performance, attendance, and risk factors.', icon: '📊' },
  { id: 'dept-perf', name: 'Department Performance Report', desc: 'Detailed breakdown of individual department metrics and comparative analysis.', icon: '🏛️' },
  { id: 'teacher-eff', name: 'Teacher Effectiveness Report', desc: 'Analytics on faculty performance, student improvement rates, and mentorship outcomes.', icon: '👨‍🏫' },
  { id: 'student-risk', name: 'Student Risk Analysis Report', desc: 'In-depth analysis of at-risk student populations, common weak subjects, and failure predictions.', icon: '⚠️' },
  { id: 'skill-gap', name: 'Institutional Skill Gap Report', desc: 'Assessment of professional readiness and skill development across all departments.', icon: '🎯' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Reports Center" subtitle="Generate and view institutional analytics reports" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {reports.map(report => (
            <div key={report.id} className="glass-card stat-card" style={{ padding: '1.5rem', cursor: 'pointer', border: selectedReport === report.id ? '2px solid #F59E0B' : '1px solid var(--border)' }} onClick={() => setSelectedReport(report.id)}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {report.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, color: selectedReport === report.id ? '#F59E0B' : 'var(--text)' }}>{report.name}</h3>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>{report.desc}</p>
              <button style={{ width: '100%', padding: '10px', background: selectedReport === report.id ? '#F59E0B' : 'rgba(255,255,255,0.05)', color: selectedReport === report.id ? '#000' : 'var(--text)', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                {selectedReport === report.id ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          ))}
        </div>

        {selectedReport && (
          <div className="glass-card fade-in" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>Report Generated Successfully</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>The selected report has been generated using current institutional data. PDF export functionality will be available in the next release.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button style={{ padding: '10px 20px', background: '#F59E0B', color: '#000', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>View Details</button>
              <button style={{ padding: '10px 20px', background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'not-allowed', opacity: 0.5 }}>Export PDF</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
