import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_STUDENTS, MASTER_TEACHERS, MASTER_DEPARTMENTS,
  COUNSELING_SESSIONS, getStudentsByDept, getTeachersByDept,
  getAtRiskStudents, getDeptStats
} from '@/data/sharedMockData';

export const runtime = 'nodejs';

const DEPT_HEAD_SYSTEM_INSTRUCTION = `
You are EduVision AI — the Department Head's intelligence assistant for the CIS (Computing and Information System) department at Daffodil International University.
You have access to ONLY your department's data: CIS students, CIS teachers, CIS courses, attendance, results, counseling sessions.
You do NOT have access to other departments or HR payroll data.

RULES:
1. Always reference REAL names and numbers from the data. NEVER invent statistics.
2. Respond in the same language as the user (Bangla/English/Banglish).
3. Focus only on departmental academic operations.
4. Use structured formats with bold headers and bullet points.
5. Provide specific, actionable recommendations.
`;

function buildDeptHeadContext(): string {
  const deptId = 'CIS';
  const stats = getDeptStats(deptId);
  const atRisk = getAtRiskStudents(deptId);
  const highPerformers = MASTER_STUDENTS.filter(s => s.departmentId === deptId && s.cgpa >= 3.5);
  const lowAttStudents = MASTER_STUDENTS.filter(s => s.departmentId === deptId && s.attendancePct < 75);
  const dept = MASTER_DEPARTMENTS.find(d => d.id === deptId)!;
  const sessions = COUNSELING_SESSIONS.filter(s =>
    stats.teachers.some(t => t.id === s.teacherId)
  );

  return `
=== DEPARTMENT HEAD INTELLIGENCE CONTEXT ===
Department: ${dept.name} (${dept.id})
Head: ${dept.head}
Semester: Fall 2026

DEPARTMENT OVERVIEW:
- Total Students: ${stats.totalStudents}
- Total Teachers: ${stats.totalTeachers}
- Department Avg CGPA: ${stats.avgCgpa}
- Department Avg Attendance: ${stats.avgAttendance}%
- At-Risk Students: ${atRisk.length} (${Math.round(atRisk.length / stats.totalStudents * 100)}%)
- High Performers (CGPA ≥ 3.5): ${highPerformers.length}
- Students below 75% attendance: ${lowAttStudents.length}

ALL STUDENTS IN CIS DEPT:
${MASTER_STUDENTS.filter(s => s.departmentId === deptId).map(s =>
  `- ${s.name} | Roll: ${s.roll} | CGPA: ${s.cgpa} | Attendance: ${s.attendancePct}% | Segment: ${s.segment} | Sem: ${s.semester}`
).join('\n')}

AT-RISK STUDENTS (${atRisk.length}):
${atRisk.map(s => `- ${s.name}: CGPA ${s.cgpa}, Attendance ${s.attendancePct}%, Weak: ${s.subjects.filter(sub => sub.risk === 'high').map(sub => sub.name).join(', ') || 'Multiple subjects'}`).join('\n')}

LOW ATTENDANCE STUDENTS (${lowAttStudents.length}):
${lowAttStudents.map(s => `- ${s.name}: ${s.attendancePct}% overall | Critical: ${s.subjects.filter(sub => sub.attendance < 75).map(sub => `${sub.name} (${sub.attendance}%)`).join(', ')}`).join('\n')}

HIGH PERFORMERS:
${highPerformers.map(s => `- ${s.name}: CGPA ${s.cgpa}, Attendance ${s.attendancePct}%`).join('\n')}

TEACHER PERFORMANCE:
${stats.teachers.map(t =>
  `- ${t.name} (${t.designation}): KPI ${t.kpiScore}/100 | ${t.courses.length} courses | ${t.totalStudents} students | Attendance: ${t.attendanceRate}%`
).join('\n')}

COUNSELING SESSIONS (${sessions.length}):
${sessions.map(s => `- ${s.teacherName} ↔ ${s.studentName}: "${s.topic}" | Status: ${s.status} | Date: ${s.date}`).join('\n')}

COURSE HEALTH:
${[...new Set(MASTER_STUDENTS.filter(s => s.departmentId === deptId).flatMap(s => s.subjects))].slice(0, 6).map(sub =>
  `- ${sub.name} (${sub.code}): Avg marks ${sub.marks}%, Attendance ${sub.attendance}%, Risk: ${sub.risk}`
).join('\n')}
=================================================================
`.trim();
}

function getDeptHeadFallback(message: string): string {
  const q = message.toLowerCase();
  const stats = getDeptStats('CIS');
  const atRisk = getAtRiskStudents('CIS');
  const lowAttStudents = MASTER_STUDENTS.filter(s => s.departmentId === 'CIS' && s.attendancePct < 75);

  if (q.includes('weak') || q.includes('risk') || q.includes('failing') || q.includes('student')) {
    return `**CIS Department — Academic Risk Report**\n\n- Total Students: ${stats.totalStudents}\n- At-Risk Students: ${atRisk.length} (${Math.round(atRisk.length / stats.totalStudents * 100)}%)\n- Below 75% attendance: ${lowAttStudents.length}\n\n**At-Risk Students:**\n${atRisk.map(s => `🔴 **${s.name}** (Roll: ${s.roll})\n   CGPA: ${s.cgpa} | Attendance: ${s.attendancePct}%\n   Weak subjects: ${s.subjects.filter(sub => sub.risk === 'high').map(sub => sub.name).join(', ')}`).join('\n\n')}\n\n**Recommended Actions:**\n1. Schedule urgent counseling sessions for all at-risk students\n2. Issue attendance warning letters to students below 65%\n3. Assign peer tutors for high-risk subjects`;
  }

  if (q.includes('teacher') || q.includes('faculty') || q.includes('workload')) {
    return `**CIS Faculty Workload Analysis**\n\n${MASTER_TEACHERS.filter(t => t.departmentId === 'CIS').map(t => `**${t.name}** (${t.designation})\n- Courses: ${t.courses.join(', ')}\n- Students: ${t.totalStudents}\n- KPI: ${t.kpiScore}/100 | Effectiveness: ${t.effectivenessScore}/100\n- Attendance Rate: ${t.attendanceRate}%`).join('\n\n')}\n\n**Top Performer:** ${[...MASTER_TEACHERS].sort((a, b) => b.kpiScore - a.kpiScore)[0].name} (KPI: ${Math.max(...MASTER_TEACHERS.map(t => t.kpiScore))})\n**Attention Needed:** ${MASTER_TEACHERS.filter(t => t.kpiScore < 70).map(t => t.name).join(', ') || 'No faculty below threshold'}`;
  }

  if (q.includes('attendance') || q.includes('present')) {
    return `**CIS Department Attendance Summary**\n\n- Department Avg: ${stats.avgAttendance}%\n- Students below 75%: ${lowAttStudents.length}\n\n**Critical Cases:**\n${lowAttStudents.map(s => `⚠️ **${s.name}** (Roll: ${s.roll}): ${s.attendancePct}% overall\n   ${s.subjects.filter(sub => sub.attendance < 75).map(sub => `${sub.name}: ${sub.attendance}%`).join(' | ')}`).join('\n\n')}\n\n**5 students are approaching exam eligibility risk. Intervention required immediately.**`;
  }

  if (q.includes('course') || q.includes('performance')) {
    const allSubjects = MASTER_STUDENTS.filter(s => s.departmentId === 'CIS').flatMap(s => s.subjects);
    const highRiskCourses = [...new Set(allSubjects.filter(s => s.risk === 'high').map(s => s.name))];
    return `**CIS Course Performance Overview**\n\n- Total Active Courses: ${stats.teachers.reduce((a, t) => a + t.courses.length, 0)}\n- Avg Department CGPA: ${stats.avgCgpa}\n\n**High-Risk Courses:**\n${highRiskCourses.map(c => `🔴 ${c} — multiple students struggling`).join('\n')}\n\n**Recommendation:** Conduct extra support sessions for high-risk courses before midterm.`;
  }

  return `I'm the CIS Department Head AI Assistant. I can analyze:\n\n- ⚠️ **At-risk students** — ${atRisk.length} currently in your dept\n- 👨‍🏫 **Teacher performance** — KPI & workload for ${stats.totalTeachers} faculty\n- 📅 **Attendance** — ${lowAttStudents.length} students below threshold\n- 📊 **Course performance** — subject-level analytics\n- 💬 **Counseling sessions** — ${COUNSELING_SESSIONS.length} tracked sessions`;
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
      return NextResponse.json({ text: getDeptHeadFallback(message) });
    }

    const deptContext = buildDeptHeadContext();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `${DEPT_HEAD_SYSTEM_INSTRUCTION}\n\n${deptContext}`
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 }
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();
    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error('[DeptHead AI Error]', err);
    try {
      const body = await req.clone().json() as { message: string };
      return NextResponse.json({ text: getDeptHeadFallback(body.message || '') });
    } catch {
      return NextResponse.json({ error: 'AI response failed.' }, { status: 500 });
    }
  }
}
