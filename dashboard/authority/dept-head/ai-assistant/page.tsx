'use client';
import AIAssistantWorkspace from '@/components/ai/AIAssistantWorkspace';
import { MASTER_STUDENTS, MASTER_TEACHERS, getDeptStats, getAtRiskStudents, COUNSELING_SESSIONS } from '@/data/sharedMockData';

const stats = getDeptStats('CIS');
const atRisk = getAtRiskStudents('CIS');
const lowAtt = MASTER_STUDENTS.filter(s => s.departmentId === 'CIS' && s.attendancePct < 75);
const CONTEXT_BANNER = `${stats.totalStudents} students | ${stats.totalTeachers} teachers | ${atRisk.length} at-risk | Avg CGPA: ${stats.avgCgpa}`;

const QUICK_PROMPTS = [
  '⚠️ Show at-risk students in my department',
  '👨‍🏫 Analyze teacher workload & KPI',
  '📅 Attendance summary report',
  '📊 Course performance analysis',
];

export default function DeptHeadAIAssistantPage() {
  const getAIResponse = async (msg: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/depthead-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.text || data.error || 'No response received.';
    } catch {
      const q = msg.toLowerCase();
      if (q.includes('risk') || q.includes('weak') || q.includes('student')) {
        return `**CIS Dept — At-Risk Students (${atRisk.length})**\n\n${atRisk.map(s => `🔴 **${s.name}** | CGPA: ${s.cgpa} | Attendance: ${s.attendancePct}%\nWeak subjects: ${s.subjects.filter(sub => sub.risk === 'high').map(sub => sub.name).join(', ')}`).join('\n\n')}\n\n**Also:** ${lowAtt.length} student(s) below 75% attendance threshold.`;
      }
      if (q.includes('teacher') || q.includes('faculty') || q.includes('workload')) {
        return `**CIS Faculty Overview (${stats.totalTeachers} teachers)**\n\n${MASTER_TEACHERS.filter(t => t.departmentId === 'CIS').map(t => `- **${t.name}** (${t.designation})\n  KPI: ${t.kpiScore}/100 | ${t.courses.length} courses | ${t.totalStudents} students`).join('\n\n')}`;
      }
      if (q.includes('attendance')) {
        return `**CIS Attendance Summary**\n\n- Dept Avg: ${stats.avgAttendance}%\n- Below 75%: ${lowAtt.length} students\n\n${lowAtt.map(s => `⚠️ ${s.name}: ${s.attendancePct}%`).join('\n')}`;
      }
      return `**Dept-Head AI — Offline Mode**\n\nCIS Department:\n- Students: ${stats.totalStudents}\n- Teachers: ${stats.totalTeachers}\n- Avg CGPA: ${stats.avgCgpa}\n- At-Risk: ${atRisk.length}\n- Counseling Sessions: ${COUNSELING_SESSIONS.length}`;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AIAssistantWorkspace
        title="AI Department Assistant"
        roleTitle="Departmental Intelligence System"
        subtitle="Access restricted to CIS department: students, teachers, courses, attendance, counseling."
        badgeColor="#6366F1"
        contextBanner={CONTEXT_BANNER}
        quickPrompts={QUICK_PROMPTS}
        initialMessage={`Welcome, Department Head. I have analyzed all ${stats.totalStudents} CIS students and ${stats.totalTeachers} faculty members. Currently ${atRisk.length} student(s) are at academic risk (CGPA < 2.5) and ${lowAtt.length} student(s) are below the 75% attendance threshold. The department average CGPA is ${stats.avgCgpa}. What would you like to investigate?`}
        getAIResponse={getAIResponse}
      />
    </div>
  );
}
