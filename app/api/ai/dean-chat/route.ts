import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_STUDENTS, MASTER_TEACHERS, MASTER_DEPARTMENTS,
  UNIVERSITY_STATS, getAtRiskStudents, COUNSELING_SESSIONS
} from '@/data/sharedMockData';

export const runtime = 'nodejs';

const DEAN_SYSTEM_INSTRUCTION = `
You are EduVision AI — the Dean's strategic intelligence assistant at Daffodil International University.
You have FULL access to university-wide data: every student, teacher, department, and course.

RULES:
1. Always reference REAL numbers and names from the data provided. NEVER invent data.
2. Be executive-level, data-driven, and concise.
3. Respond in the same language as the user (Bangla/English/Banglish).
4. Prioritize high-impact, actionable recommendations.
5. Use structured formats with bold headers and bullet points.
6. Focus on systemic patterns and institutional insights.
`;

function buildDeanContext(): string {
  const atRisk = getAtRiskStudents();
  const highRiskDepts = MASTER_DEPARTMENTS.filter(d => d.riskLevel === 'high');
  const topDept = [...MASTER_DEPARTMENTS].sort((a, b) => b.performance - a.performance)[0];
  const weakDept = [...MASTER_DEPARTMENTS].sort((a, b) => a.performance - b.performance)[0];
  const lowAttTeachers = MASTER_TEACHERS.filter(t => t.attendanceRate < 95);
  const completedSessions = COUNSELING_SESSIONS.filter(s => s.status === 'Completed').length;

  return `
=== DEAN INTELLIGENCE CONTEXT — ${UNIVERSITY_STATS.name} ===
Semester: ${UNIVERSITY_STATS.semester}

UNIVERSITY OVERVIEW:
- Total Students: ${UNIVERSITY_STATS.totalStudents.toLocaleString()}
- Total Teachers: ${UNIVERSITY_STATS.totalTeachers}
- Total Departments: ${UNIVERSITY_STATS.totalDepartments}
- Total Employees: ${UNIVERSITY_STATS.totalEmployees}
- At-Risk Students: ${UNIVERSITY_STATS.atRiskPercentage}% (${atRisk.length} tracked in CIS dept)
- Avg University GPA: ${UNIVERSITY_STATS.avgGPA}
- Avg Attendance: ${UNIVERSITY_STATS.avgAttendance}%
- Research Publications (YTD): ${UNIVERSITY_STATS.researchPublications}
- Counseling Sessions Completed: ${completedSessions}

TOP PERFORMING DEPT: ${topDept.name} (${topDept.performance}% performance, GPA: ${topDept.avgGPA})
WEAKEST DEPT: ${weakDept.name} (${weakDept.performance}% performance, ${weakDept.atRiskPct}% at-risk)

HIGH-RISK DEPARTMENTS (${highRiskDepts.length}):
${highRiskDepts.map(d => `- ${d.name}: ${d.atRiskCount} at-risk students (${d.atRiskPct}%), avg attendance ${d.avgAttendance}%`).join('\n')}

ALL DEPARTMENTS SUMMARY:
${MASTER_DEPARTMENTS.map(d => `- ${d.name}: ${d.students} students, ${d.teachers} teachers, GPA ${d.avgGPA}, Attendance ${d.avgAttendance}%, At-risk: ${d.atRiskCount}`).join('\n')}

CIS DEPT DETAILED DATA (Sample Dept):
Students: ${MASTER_STUDENTS.length} | At-Risk: ${atRisk.length} | Avg CGPA: ${(MASTER_STUDENTS.reduce((a, s) => a + s.cgpa, 0) / MASTER_STUDENTS.length).toFixed(2)}
At-Risk Students: ${atRisk.map(s => `${s.name} (CGPA: ${s.cgpa}, Attendance: ${s.attendancePct}%)`).join(', ')}

FACULTY EFFECTIVENESS (CIS Dept):
${MASTER_TEACHERS.map(t => `- ${t.name} (${t.designation}): KPI ${t.kpiScore}, ${t.courses.length} courses, ${t.totalStudents} students, Attendance: ${t.attendanceRate}%`).join('\n')}
Low-attendance faculty: ${lowAttTeachers.length > 0 ? lowAttTeachers.map(t => t.name).join(', ') : 'None'}

STRATEGIC PRIORITIES:
1. ${weakDept.name} dept: ${weakDept.atRiskPct}% at-risk rate — highest in university
2. Mathematics dept: Avg attendance 65% — below 75% threshold
3. Communication skill gap: 38% of students below average
4. Leadership gap: 42% of students below threshold
=================================================================
`.trim();
}

function getDeanFallback(message: string): string {
  const q = message.toLowerCase();
  const atRisk = getAtRiskStudents();
  const highRiskDepts = MASTER_DEPARTMENTS.filter(d => d.riskLevel === 'high');
  const topDept = [...MASTER_DEPARTMENTS].sort((a, b) => b.performance - a.performance)[0];

  if (q.includes('department') || q.includes('dept') || q.includes('comparison')) {
    return `**Department Performance Analysis — ${UNIVERSITY_STATS.semester}**\n\n**Top Performer:** ${topDept.name} (${topDept.performance}% performance, GPA: ${topDept.avgGPA}, Attendance: ${topDept.avgAttendance}%)\n\n**All Departments:**\n${MASTER_DEPARTMENTS.map(d => `- **${d.name}:** GPA ${d.avgGPA} | Attendance ${d.avgAttendance}% | At-risk: ${d.atRiskCount} students (${d.atRiskPct}%)`).join('\n')}\n\n**Strategic Recommendation:** ${highRiskDepts[0]?.name} requires immediate intervention with ${highRiskDepts[0]?.atRiskCount} at-risk students.`;
  }

  if (q.includes('risk') || q.includes('alert') || q.includes('concern')) {
    return `**University Academic Risk Report**\n\n- Total at-risk students: ${UNIVERSITY_STATS.totalStudents * UNIVERSITY_STATS.atRiskPercentage / 100} (${UNIVERSITY_STATS.atRiskPercentage}%)\n\n**High-Risk Departments:**\n${highRiskDepts.map(d => `🔴 **${d.name}:** ${d.atRiskCount} at-risk students (${d.atRiskPct}%), avg attendance ${d.avgAttendance}%`).join('\n')}\n\n**CIS Dept At-Risk Students (${atRisk.length}):**\n${atRisk.map(s => `- ${s.name}: CGPA ${s.cgpa}, Attendance ${s.attendancePct}%`).join('\n')}\n\n**Recommended Actions:**\n1. Launch emergency mentoring for ${highRiskDepts[0]?.name}\n2. Deploy automated attendance alerts\n3. Assign dedicated counselors to at-risk students`;
  }

  if (q.includes('teacher') || q.includes('faculty') || q.includes('effectiveness')) {
    return `**Faculty Effectiveness — CIS Department**\n\n${MASTER_TEACHERS.map(t => `- **${t.name}** (${t.designation}): KPI ${t.kpiScore}/100 | ${t.courses.length} courses | ${t.totalStudents} students | Attendance: ${t.attendanceRate}%`).join('\n')}\n\n**Top Performer:** ${[...MASTER_TEACHERS].sort((a, b) => b.effectivenessScore - a.effectivenessScore)[0].name} (Score: ${Math.max(...MASTER_TEACHERS.map(t => t.effectivenessScore))})\n\n**Strategic Action:** Faculty with KPI below 70 require professional development intervention.`;
  }

  return `I'm the Dean AI Assistant with full university access. Ask me about:\n\n- 🏛️ **Department comparison** — performance, GPA, attendance\n- ⚠️ **At-risk students** — by department or university-wide\n- 👨‍🏫 **Faculty analytics** — KPI, effectiveness scores\n- 📊 **Strategic recommendations** — based on real data\n- 🔍 **Student/Teacher search** — find any profile`;
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
      return NextResponse.json({ text: getDeanFallback(message) });
    }

    const deanContext = buildDeanContext();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `${DEAN_SYSTEM_INSTRUCTION}\n\n${deanContext}`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 }
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error('[Dean AI Error]', err);
    try {
      const body = await req.clone().json() as { message: string };
      return NextResponse.json({ text: getDeanFallback(body.message || '') });
    } catch {
      return NextResponse.json({ error: 'AI response failed.' }, { status: 500 });
    }
  }
}
