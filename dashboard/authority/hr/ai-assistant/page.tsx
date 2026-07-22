'use client';
import AIAssistantWorkspace from '@/components/ai/AIAssistantWorkspace';
import { HR_EMPLOYEES, PAYROLL_SUMMARY, getPendingLeaves, getLowAttendanceEmployees } from '@/data/sharedMockData';

const pendingLeaves = getPendingLeaves();
const lowAttEmp = getLowAttendanceEmployees(80);
const facultyCount = HR_EMPLOYEES.filter(e => e.employeeType === 'Faculty').length;
const CONTEXT_BANNER = `${HR_EMPLOYEES.length} employees | ${facultyCount} faculty | ${pendingLeaves.length} pending leaves | Payroll: ৳${(PAYROLL_SUMMARY.totalDisbursed / 1000000).toFixed(1)}M`;

const QUICK_PROMPTS = [
  '📅 Show pending leave requests',
  '📊 Employee attendance report',
  '💵 Payroll summary this month',
  '🏆 Employee KPI performance report',
];

export default function HRAIAssistantPage() {
  const getAIResponse = async (msg: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/hr-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.text || data.error || 'No response received.';
    } catch {
      const q = msg.toLowerCase();
      if (q.includes('leave')) {
        return `**Pending Leave Requests (${pendingLeaves.length})**\n\n${pendingLeaves.map(l => `- **${l.employeeName}:** ${l.type} leave, ${l.days} days (${l.from} → ${l.to})\n  Reason: "${l.reason}"`).join('\n\n')}\n\n**Action Required:** ${pendingLeaves.length} request(s) awaiting your approval.`;
      }
      if (q.includes('payroll') || q.includes('salary')) {
        return `**Payroll — ${PAYROLL_SUMMARY.month}**\n\n- Total Disbursed: ৳${PAYROLL_SUMMARY.totalDisbursed.toLocaleString()}\n- Employees Paid: ${PAYROLL_SUMMARY.totalEmployeesPaid}\n- Avg Salary: ৳${PAYROLL_SUMMARY.avgSalary.toLocaleString()}\n- Status: ✅ ${PAYROLL_SUMMARY.status}`;
      }
      if (q.includes('attendance')) {
        return `**Attendance Report**\n\nEmployees below 80%: ${lowAttEmp.length}\n\n${lowAttEmp.map(e => `⚠️ ${e.name} (${e.department}): ${e.attendanceRate}%`).join('\n')}`;
      }
      return `**HR AI — Offline Mode**\n\nTotal Employees: ${HR_EMPLOYEES.length}\nPending Leaves: ${pendingLeaves.length}\nPayroll: ৳${PAYROLL_SUMMARY.totalDisbursed.toLocaleString()} (${PAYROLL_SUMMARY.month})\n\nCheck connection for full AI analysis.`;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AIAssistantWorkspace
        title="AI HR Assistant"
        roleTitle="Workforce Intelligence Engine"
        subtitle="Access restricted to HR operations: employees, payroll, leave, KPI. No academic records."
        badgeColor="#10B981"
        contextBanner={CONTEXT_BANNER}
        quickPrompts={QUICK_PROMPTS}
        initialMessage={`Welcome to the HR Intelligence Center. I have analyzed all ${HR_EMPLOYEES.length} employee records across ${facultyCount} faculty and ${HR_EMPLOYEES.length - facultyCount} staff members. Currently ${pendingLeaves.length} leave request(s) are pending approval and ${lowAttEmp.length} employee(s) are below the 80% attendance threshold. How can I assist you today?`}
        getAIResponse={getAIResponse}
      />
    </div>
  );
}
