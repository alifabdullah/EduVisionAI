'use client';
import { SemesterData } from '@/data/academicData';

interface Props { data: SemesterData; }

interface Insight {
  icon: string;
  text: string;
  color: string;
  bg: string;
}

function buildInsights(data: SemesterData): Insight[] {
  const insights: Insight[] = [];

  const weakSubs = data.subjects.filter(s => s.riskLevel === 'high');
  const strongSubs = data.subjects.filter(s => s.riskLevel === 'low');
  const lowAtt = data.subjects.filter(s => s.attendance < 75);
  const highAtt = data.subjects.filter(s => s.attendance >= 85);

  if (data.attendancePct >= 80 && data.quizAvg < 65) {
    insights.push({ icon: '📈', text: 'Attendance is strong but quiz performance is slipping. Focus on active revision.', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' });
  }
  if (data.finalAvg > data.midAvg + 5) {
    insights.push({ icon: '🚀', text: 'Final exam scores exceeded midterm performance. Great improvement trajectory!', color: '#10B981', bg: 'rgba(16,185,129,0.08)' });
  }
  if (data.midAvg > data.finalAvg + 5) {
    insights.push({ icon: '⚠️', text: 'Midterm scores are higher than finals — review final exam preparation strategy.', color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' });
  }
  if (weakSubs.length >= 2) {
    insights.push({ icon: '🔴', text: `Weak performance detected in ${weakSubs.map(s => s.name.split(' ')[0]).join(', ')}. Prioritize these subjects immediately.`, color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' });
  }
  if (strongSubs.length >= 3) {
    insights.push({ icon: '⭐', text: `Excellent performance in ${strongSubs.length} subjects. Maintain this consistency!`, color: '#10B981', bg: 'rgba(16,185,129,0.08)' });
  }
  if (lowAtt.length > 0) {
    insights.push({ icon: '📅', text: `${lowAtt.length} subject${lowAtt.length > 1 ? 's' : ''} below 75% attendance threshold. Risk of exam bar.`, color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' });
  }
  if (highAtt.length >= 3) {
    insights.push({ icon: '✅', text: 'Library and class attendance consistency is high this semester. Keep it up!', color: '#22D3EE', bg: 'rgba(34,211,238,0.08)' });
  }
  if (data.assignmentMarks >= 85) {
    insights.push({ icon: '📌', text: 'Assignment submission rate is excellent. This significantly boosts your final grade.', color: '#A78BFA', bg: 'rgba(167,139,250,0.08)' });
  }
  if (data.gpa >= 3.7) {
    insights.push({ icon: '🏆', text: 'Outstanding GPA this semester! You are in the top performance tier.', color: '#10B981', bg: 'rgba(16,185,129,0.08)' });
  } else if (data.gpa < 3.0) {
    insights.push({ icon: '📚', text: 'GPA is below 3.0. Consider meeting your academic advisor for a recovery plan.', color: '#F43F5E', bg: 'rgba(244,63,94,0.08)' });
  }
  if (data.labMarks < 65) {
    insights.push({ icon: '🔬', text: 'Lab performance needs improvement. Attend extra lab sessions and review practicals.', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' });
  }

  // Always have at least 3
  if (insights.length < 3) {
    insights.push({ icon: '💡', text: 'Balanced academic performance across components. Continue your current study routine.', color: '#6C63FF', bg: 'rgba(108,99,255,0.08)' });
  }

  return insights.slice(0, 6);
}

export default function AIInsightsPanel({ data }: Props) {
  const insights = buildInsights(data);

  return (
    <div className="fade-in" style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(34,211,238,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
        }}>🤖</div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>AI Insights</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Intelligent analysis of your academic patterns</p>
        </div>
        <span style={{
          marginLeft: 'auto', padding: '3px 10px', borderRadius: 999, fontSize: '0.68rem',
          fontWeight: 700, background: 'rgba(108,99,255,0.15)', color: '#6C63FF',
          border: '1px solid rgba(108,99,255,0.3)', animation: 'pulse-glow 2s infinite',
        }}>● LIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {insights.map((ins, i) => (
          <div
            key={i}
            className="stat-card"
            style={{
              padding: '0.875rem 1rem',
              background: ins.bg,
              border: `1px solid ${ins.color}25`,
              borderLeft: `3px solid ${ins.color}`,
              borderRadius: 12,
              display: 'flex',
              gap: 10,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${ins.color}20`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            <span style={{
              fontSize: '1.2rem', flexShrink: 0, width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{ins.icon}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
              <span style={{ color: ins.color, fontWeight: 700 }}>AI: </span>
              {ins.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
