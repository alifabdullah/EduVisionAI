'use client';
import AIAssistantWorkspace from '@/components/ai/AIAssistantWorkspace';
import { MASTER_STUDENTS, MASTER_DEPARTMENTS, UNIVERSITY_STATS, getAtRiskStudents } from '@/data/sharedMockData';

const atRisk = getAtRiskStudents();
const highRiskDepts = MASTER_DEPARTMENTS.filter(d => d.riskLevel === 'high');
const CONTEXT_BANNER = `${UNIVERSITY_STATS.totalStudents.toLocaleString()} students | ${UNIVERSITY_STATS.totalTeachers} faculty | ${UNIVERSITY_STATS.totalDepartments} departments | ${atRisk.length + 1050} at-risk`;

const QUICK_PROMPTS = [
  '🏆 Compare all department performance',
  '⚠️ Show students at academic risk',
  '👨‍🏫 Analyze faculty effectiveness',
  '📊 Generate executive summary report',
];

export default function DeanAIAssistantPage() {
  const getAIResponse = async (msg: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/dean-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.text || data.error || 'No response received.';
    } catch {
      // Fallback inline
      const q = msg.toLowerCase();
      if (q.includes('department') || q.includes('compare')) {
        return `**Department Performance — ${UNIVERSITY_STATS.semester}**\n\n${MASTER_DEPARTMENTS.map(d => `- **${d.name}:** GPA ${d.avgGPA} | Attendance ${d.avgAttendance}% | At-risk: ${d.atRiskCount} (${d.atRiskPct}%)`).join('\n')}\n\n**High-risk departments:** ${highRiskDepts.map(d => d.name).join(', ')}`;
      }
      if (q.includes('risk') || q.includes('student')) {
        return `**University At-Risk Summary**\n\n- University-wide at-risk: ${UNIVERSITY_STATS.atRiskPercentage}% (~${Math.round(UNIVERSITY_STATS.totalStudents * UNIVERSITY_STATS.atRiskPercentage / 100)} students)\n\n**CIS Dept tracked students:**\n${atRisk.map(s => `- ${s.name}: CGPA ${s.cgpa}, Attendance ${s.attendancePct}%`).join('\n')}\n\n**Critical departments:** ${highRiskDepts.map(d => `${d.name} (${d.atRiskPct}%)`).join(', ')}`;
      }
      return `**Dean AI — Offline Mode**\n\nUniversity: ${UNIVERSITY_STATS.name}\n- Students: ${UNIVERSITY_STATS.totalStudents.toLocaleString()}\n- Teachers: ${UNIVERSITY_STATS.totalTeachers}\n- Avg GPA: ${UNIVERSITY_STATS.avgGPA}\n- Avg Attendance: ${UNIVERSITY_STATS.avgAttendance}%\n\nPlease check your internet connection for full AI analysis.`;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AIAssistantWorkspace
        title="AI Dean Assistant"
        roleTitle="University Academic Intelligence"
        subtitle="Full administrative access to university-wide academic data."
        badgeColor="#F59E0B"
        contextBanner={CONTEXT_BANNER}
        quickPrompts={QUICK_PROMPTS}
        initialMessage={`Welcome, Dean. I have analyzed all ${UNIVERSITY_STATS.totalDepartments} departments, ${UNIVERSITY_STATS.totalStudents.toLocaleString()} students, and ${UNIVERSITY_STATS.totalTeachers} faculty members. Currently ${UNIVERSITY_STATS.atRiskPercentage}% of students are at academic risk, with ${highRiskDepts.map(d => d.name).join(' and ')} requiring urgent intervention. What would you like to analyze?`}
        getAIResponse={getAIResponse}
      />
    </div>
  );
}
