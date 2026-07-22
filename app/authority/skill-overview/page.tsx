'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function SkillOverviewPage() {
  const { skillOverview } = authorityData;
  const radarData = Object.entries(skillOverview.universityAvg).map(([key, val]) => ({ subject: key, avg: val, fullMark: 100 }));
  const skillKeys = Object.keys(skillOverview.universityAvg);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Professional Readiness & Skill Overview" subtitle="Institution-wide skill development analysis" accentColor="#F59E0B" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>University Average Skill Radar</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 16 }}>Overall skill profile of the institution</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }} />
                <Radar name="University Avg" dataKey="avg" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Institution-Wide Skill Averages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {radarData.map(item => (
                <div key={item.subject}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.subject}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.avg < 60 ? 'var(--danger)' : item.avg < 70 ? 'var(--warning)' : 'var(--success)' }}>{item.avg}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.avg}%`, background: item.avg < 60 ? 'var(--danger)' : item.avg < 70 ? 'var(--warning)' : '#F59E0B', borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 16 }}>Skill Profile by Department</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</th>
                  {skillKeys.map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skillOverview.byDepartment.map((d, i) => (
                  <tr key={d.dept} style={{ borderBottom: i < skillOverview.byDepartment.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 600 }}>{d.dept}</td>
                    {skillKeys.map(k => {
                      const val = d[k as keyof typeof d] as number;
                      return (
                        <td key={k} style={{ padding: '12px 12px' }}>
                          <span style={{ fontWeight: 600, color: val < 60 ? 'var(--danger)' : val < 70 ? 'var(--warning)' : 'var(--success)' }}>{val}%</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
