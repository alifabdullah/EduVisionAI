import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import {
  HR_EMPLOYEES, LEAVE_REQUESTS, PAYROLL_SUMMARY,
  MASTER_DEPARTMENTS, UNIVERSITY_STATS,
  getLowAttendanceEmployees, getPendingLeaves
} from '@/data/sharedMockData';

export const runtime = 'nodejs';

const HR_SYSTEM_INSTRUCTION = `
You are EduVision AI — the HR Manager's workforce intelligence assistant at Daffodil International University.
You ONLY have access to HR data: employees, attendance, leave, payroll, and recruitment.
You do NOT have access to student academic records.

RULES:
1. Always reference REAL numbers and names from the HR data provided. NEVER invent data.
2. Be professional and data-driven.
3. Respond in the same language as the user (Bangla/English/Banglish).
4. Focus only on HR operations: attendance, payroll, leave, KPI, recruitment.
5. Use structured formats with bold headers and bullet points.
`;

function buildHRContext(): string {
  const pendingLeaves = getPendingLeaves();
  const lowAttEmp = getLowAttendanceEmployees(80);
  const activeEmployees = HR_EMPLOYEES.filter(e => e.status === 'Active');
  const facultyCount = HR_EMPLOYEES.filter(e => e.employeeType === 'Faculty').length;
  const staffCount = HR_EMPLOYEES.filter(e => e.employeeType !== 'Faculty').length;
  const avgKpi = (HR_EMPLOYEES.reduce((a, e) => a + e.kpiScore, 0) / HR_EMPLOYEES.length).toFixed(1);

  return `
=== HR INTELLIGENCE CONTEXT — ${UNIVERSITY_STATS.name} ===
Semester: ${UNIVERSITY_STATS.semester}

WORKFORCE OVERVIEW:
- Total Employees: ${HR_EMPLOYEES.length}
- Faculty Members: ${facultyCount}
- Administrative/Staff: ${staffCount}
- Active Employees: ${activeEmployees.length}
- Average KPI Score: ${avgKpi}/100

ATTENDANCE STATUS:
- Employees below 80% attendance: ${lowAttEmp.length}
${lowAttEmp.map(e => `  - ${e.name} (${e.designation}): ${e.attendanceRate}%`).join('\n')}

LEAVE MANAGEMENT:
- Total Leave Requests: ${LEAVE_REQUESTS.length}
- Pending Approval: ${pendingLeaves.length}
${pendingLeaves.map(l => `  - ${l.employeeName}: ${l.type} leave, ${l.days} days (${l.from} to ${l.to})`).join('\n')}

PAYROLL SUMMARY (${PAYROLL_SUMMARY.month}):
- Total Disbursed: ৳${PAYROLL_SUMMARY.totalDisbursed.toLocaleString()}
- Employees Paid: ${PAYROLL_SUMMARY.totalEmployeesPaid}
- Average Salary: ৳${PAYROLL_SUMMARY.avgSalary.toLocaleString()}
- Tax Deducted YTD: ৳${PAYROLL_SUMMARY.taxDeductedYTD.toLocaleString()}
- Pending Clearances: ${PAYROLL_SUMMARY.pendingClearances}
- Status: ${PAYROLL_SUMMARY.status}

ALL EMPLOYEES:
${HR_EMPLOYEES.map(e => `- ${e.name} | ${e.designation} | ${e.department} | KPI: ${e.kpiScore} | Attendance: ${e.attendanceRate}% | Contract: ${e.contractType}`).join('\n')}

DEPARTMENT DISTRIBUTION:
${MASTER_DEPARTMENTS.slice(0, 4).map(d => `- ${d.name}: ${d.teachers} faculty members`).join('\n')}
=================================================================
`.trim();
}

function getHRFallback(message: string): string {
  const q = message.toLowerCase();
  const pendingLeaves = getPendingLeaves();
  const lowAttEmp = getLowAttendanceEmployees(80);
  const avgKpi = (HR_EMPLOYEES.reduce((a, e) => a + e.kpiScore, 0) / HR_EMPLOYEES.length).toFixed(1);

  if (q.includes('leave') || q.includes('absent')) {
    return `**Leave Management Report**\n\n- Total Leave Requests: ${LEAVE_REQUESTS.length}\n- Pending Approval: ${pendingLeaves.length}\n- Approved: ${LEAVE_REQUESTS.filter(l => l.status === 'Approved').length}\n\n**Pending Requests:**\n${pendingLeaves.map(l => `- **${l.employeeName}:** ${l.type} (${l.days} days, ${l.from} – ${l.to}) — "${l.reason}"`).join('\n')}\n\n**Action Required:** Review and approve/reject ${pendingLeaves.length} pending leave request(s).`;
  }

  if (q.includes('payroll') || q.includes('salary') || q.includes('pay')) {
    return `**Payroll Summary — ${PAYROLL_SUMMARY.month}**\n\n- Total Disbursed: ৳${PAYROLL_SUMMARY.totalDisbursed.toLocaleString()}\n- Employees Paid: ${PAYROLL_SUMMARY.totalEmployeesPaid}\n- Average Salary: ৳${PAYROLL_SUMMARY.avgSalary.toLocaleString()}\n- Tax Deducted (YTD): ৳${PAYROLL_SUMMARY.taxDeductedYTD.toLocaleString()}\n- Pending Clearances: ${PAYROLL_SUMMARY.pendingClearances}\n- Status: ✅ ${PAYROLL_SUMMARY.status}\n\n**Next Action:** Process ${PAYROLL_SUMMARY.pendingClearances} pending salary clearances.`;
  }

  if (q.includes('attendance') || q.includes('present')) {
    return `**Employee Attendance Report**\n\n- Total Employees: ${HR_EMPLOYEES.length}\n- Average Attendance: ${(HR_EMPLOYEES.reduce((a, e) => a + e.attendanceRate, 0) / HR_EMPLOYEES.length).toFixed(1)}%\n- Below 80% threshold: ${lowAttEmp.length} employees\n\n**Low Attendance Employees:**\n${lowAttEmp.map(e => `⚠️ **${e.name}** (${e.department}): ${e.attendanceRate}%`).join('\n')}\n\n**Recommended Action:** Issue formal attendance warning to ${lowAttEmp.length} employee(s) below 80%.`;
  }

  if (q.includes('kpi') || q.includes('performance') || q.includes('employee')) {
    return `**Employee KPI Report**\n\n- Average KPI Score: ${avgKpi}/100\n- Total Employees: ${HR_EMPLOYEES.length}\n\n**Individual KPI Scores:**\n${[...HR_EMPLOYEES].sort((a, b) => b.kpiScore - a.kpiScore).map(e => `- **${e.name}:** KPI ${e.kpiScore} | ${e.designation}`).join('\n')}\n\n**Action:** Employees below KPI 70 should be scheduled for performance review.`;
  }

  return `I'm the HR AI Assistant. I specialize in:\n\n- 👥 **Employee management** — all ${HR_EMPLOYEES.length} employees\n- 📅 **Leave requests** — ${getPendingLeaves().length} pending approvals\n- 💵 **Payroll** — ৳${PAYROLL_SUMMARY.totalDisbursed.toLocaleString()} disbursed\n- 📊 **KPI & attendance** — workforce analytics\n- 📋 **Recruitment** — vacancy tracking\n\n*Note: I do not have access to student academic records.*`;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json() as {
      message: string;
      history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    };

    if (!message?.trim()) return NextResponse.json({ error: 'Empty message.' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json({ text: getHRFallback(message) });
    }

    const hrContext = buildHRContext();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `${HR_SYSTEM_INSTRUCTION}\n\n${hrContext}`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 }
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error('[HR AI Error]', err);
    try {
      const body = await req.clone().json() as { message: string };
      return NextResponse.json({ text: getHRFallback(body.message || '') });
    } catch {
      return NextResponse.json({ error: 'AI response failed.' }, { status: 500 });
    }
  }
}
