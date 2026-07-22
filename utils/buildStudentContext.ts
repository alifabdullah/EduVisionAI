// utils/buildStudentContext.ts
// Generates a concise, token-efficient student profile summary for the Gemini system prompt.

import studentData from '@/data/student.json';
import { INITIAL_PROJECTS, INITIAL_RESEARCH } from '@/data/academicData';

export function buildStudentContext(): string {
  const { profile, academicSummary, subjects, skills, extracurricular, mentorRecommendation } = studentData;

  const weakSubjects = subjects.filter(s => s.marks < 60);
  const strongSubjects = subjects.filter(s => s.marks >= 75);
  const lowAttendance = subjects.filter(s => s.attendance < 75);

  const weakSkillsList = Object.entries(skills)
    .filter(([, v]) => v < 60)
    .map(([k, v]) => `${k} (${v}%)`);
  const strongSkillsList = Object.entries(skills)
    .filter(([, v]) => v >= 70)
    .map(([k, v]) => `${k} (${v}%)`);

  const projectTitles = INITIAL_PROJECTS.map(p => `${p.title} (${p.status})`).join(', ');
  const researchTitles = INITIAL_RESEARCH.map(r => `${r.title} — Status: ${r.status}`).join('; ');
  const clubList = extracurricular.map(e => `${e.club} (${e.role})`).join(', ');

  return `
=== EduVision AI — Student Profile Context ===
Name: ${profile.name}
Student ID: ${profile.id}
Roll: ${profile.roll}
Department: ${profile.department}
Semester: ${profile.semester}
CGPA: ${profile.cgpa.toFixed(2)} / 4.00
Credits Completed: ${academicSummary.creditsCompleted} / ${academicSummary.creditsTotal}
Average Attendance: ${academicSummary.attendanceAvg}%

WEAK SUBJECTS (below 60%):
${weakSubjects.map(s => `- ${s.name} (${s.code}): ${s.marks}% marks, ${s.attendance}% attendance`).join('\n') || '- None'}

STRONG SUBJECTS (75%+):
${strongSubjects.map(s => `- ${s.name}: ${s.marks}%`).join('\n') || '- None'}

ATTENDANCE RISK (below 75%):
${lowAttendance.map(s => `- ${s.name}: ${s.attendance}%`).join('\n') || '- None'}

SKILLS:
Low (<60%): ${weakSkillsList.join(', ') || 'None'}
Strong (70%+): ${strongSkillsList.join(', ') || 'None'}

CLUBS & ACTIVITIES:
${clubList}

PROJECTS:
${projectTitles}

RESEARCH:
${researchTitles}

RECOMMENDED MENTOR:
${mentorRecommendation.teacherName} — ${mentorRecommendation.expertise} (${mentorRecommendation.department}, Rating: ${mentorRecommendation.rating})

OTHER AVAILABLE MENTORS:
- Prof. Arif Hossain (Research, ML) — TCH-007
- Dr. Nasrin Akter (Project, Software Eng.) — TCH-012
- Mr. Tanvir Rahman (Career, Networking) — TCH-019
==============================================
`.trim();
}
