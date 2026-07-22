'use client';
import { SubjectData } from '@/data/academicData';

interface Props { subjects: SubjectData[]; }

interface Warning {
  subject: string;
  code: string;
  type: 'attendance' | 'marks' | 'assignment' | 'quiz' | 'final';
  message: string;
  suggestion: string;
  severity: 'critical' | 'warning';
}

function detectWarnings(subjects: SubjectData[]): Warning[] {
  const warnings: Warning[] = [];
  for (const s of subjects) {
    if (s.attendance < 75) {
      warnings.push({
        subject: s.name, code: s.code,
        type: 'attendance',
        message: `Attendance is ${s.attendance}% — below the 75% minimum threshold.`,
        suggestion: `Attend all remaining ${s.name} classes to avoid being barred from finals.`,
        severity: s.attendance < 60 ? 'critical' : 'warning',
      });
    }
    if (s.mid < 40 || s.quiz < 40) {
      warnings.push({
        subject: s.name, code: s.code,
        type: 'quiz',
        message: `Low quiz/mid scores (Quiz: ${s.quiz}%, Mid: ${s.mid}%) detected.`,
        suggestion: `${s.name} needs more quiz practice. Review past papers and join study groups.`,
        severity: 'warning',
      });
    }
    if (s.final < 50) {
      warnings.push({
        subject: s.name, code: s.code,
        type: 'final',
        message: `Final exam score of ${s.final}% is below passing threshold.`,
        suggestion: `Schedule dedicated revision sessions for ${s.name}. Focus on core concepts.`,
        severity: s.final < 40 ? 'critical' : 'warning',
      });
    }
    const assignPct = (s.assignmentsDone / s.assignmentsTotal) * 100;
    if (assignPct < 70) {
      warnings.push({
        subject: s.name, code: s.code,
        type: 'assignment',
        message: `Only ${s.assignmentsDone}/${s.assignmentsTotal} assignments submitted (${Math.round(assignPct)}%).`,
        suggestion: `Complete pending ${s.name} assignments immediately — missing submissions hurt your grade.`,
        severity: 'warning',
      });
    }
    if ((s.mid + s.final) / 2 < 50 && s.attendance < 70) {
      warnings.push({
        subject: s.name, code: s.code,
        type: 'marks',
        message: `${s.name} is at serious risk — low marks AND low attendance combined.`,
        suggestion: `Consult your ${s.name} teacher immediately and create a recovery plan.`,
        severity: 'critical',
      });
    }
  }
  // Deduplicate by subject+type
  const seen = new Set<string>();
  return warnings.filter(w => {
    const key = `${w.code}-${w.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const typeIcon: Record<Warning['type'], string> = {
  attendance: '📅',
  marks: '📉',
  assignment: '📌',
  quiz: '✏️',
  final: '📝',
};
const typeLabel: Record<Warning['type'], string> = {
  attendance: 'Attendance Risk',
  marks: 'Overall Risk',
  assignment: 'Missing Assignments',
  quiz: 'Quiz/Mid Risk',
  final: 'Final Exam Risk',
};

export default function WeakSubjectAlert({ subjects }: Props) {
  const warnings = detectWarnings(subjects);
  const criticals = warnings.filter(w => w.severity === 'critical');
  const regularWarnings = warnings.filter(w => w.severity === 'warning');

  if (warnings.length === 0) {
    return (
      <div style={{
        padding: '1.25rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem',
      }}>
        <span style={{ fontSize: '1.5rem' }}>✅</span>
        <div>
          <p style={{ fontWeight: 700, color: '#10B981', fontSize: '0.95rem' }}>Excellent Performance!</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>No weak subjects detected this semester. Keep up the great work!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1.25rem' }} className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚠️</div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Weak Subject Detection</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{criticals.length} critical · {regularWarnings.length} warnings detected</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {criticals.length > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(244,63,94,0.15)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.3)' }}>
              {criticals.length} Critical
            </span>
          )}
          {regularWarnings.length > 0 && (
            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
              {regularWarnings.length} Warning
            </span>
          )}
        </div>
      </div>

      {/* Critical warnings */}
      {criticals.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {criticals.map((w, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '0.875rem 1rem', marginBottom: 8,
              background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.25)',
              borderLeft: '4px solid #F43F5E', borderRadius: 12,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                {typeIcon[w.type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F43F5E' }}>{w.subject}</span>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--muted)', background: 'rgba(255,255,255,0.06)', padding: '1px 7px', borderRadius: 6 }}>{w.code}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(244,63,94,0.2)', color: '#F43F5E' }}>{typeLabel[w.type]}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6 }}>{w.message}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: 'rgba(108,99,255,0.08)', borderRadius: 8, padding: '6px 10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6C63FF', flexShrink: 0 }}>🤖</span>
                  <p style={{ fontSize: '0.78rem', color: '#A78BFA', fontStyle: 'italic' }}>{w.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regular warnings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8 }}>
        {regularWarnings.map((w, i) => (
          <div key={i} style={{
            padding: '0.85rem 1rem',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            borderLeft: '3px solid #F59E0B', borderRadius: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem' }}>{typeIcon[w.type]}</span>
              <span style={{ fontWeight: 700, fontSize: '0.83rem', color: '#F59E0B' }}>{w.subject}</span>
              <span style={{ padding: '1px 7px', borderRadius: 999, fontSize: '0.62rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{typeLabel[w.type]}</span>
            </div>
            <p style={{ fontSize: '0.77rem', color: 'var(--muted)', marginBottom: 6 }}>{w.message}</p>
            <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontStyle: 'italic' }}>💡 {w.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
