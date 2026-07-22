// utils/buildTeacherContext.ts
// Generates a concise, token-efficient teacher profile summary for the Gemini system prompt.

import teacherData from '@/data/teacher.json';

export function buildTeacherContext(): string {
  const { profile, summary, courses, students, alerts, aiSuggestions, mentees } = teacherData;

  const atRiskStudents = students.filter(s => s.segment === 'at-risk');
  const highPerformers = students.filter(s => s.segment === 'high');
  const highAlerts = alerts.filter(a => a.priority === 'high');

  const courseList = courses
    .map(c => `${c.name} (${c.code}) — ${c.totalStudents} students, avg marks ${c.avgMarks}%, avg attendance ${c.avgAttendance}%, risk: ${c.riskLevel}, weak topics: ${c.topicWeaknesses.join(', ')}`)
    .join('\n');

  const atRiskList = atRiskStudents
    .map(s => `${s.name} (${s.roll}) — marks ${s.marks}%, attendance ${s.attendance}%`)
    .join('\n');

  const highPerformerList = highPerformers
    .map(s => `${s.name} (${s.roll}) — marks ${s.marks}%, attendance ${s.attendance}%`)
    .join('\n');

  const alertList = highAlerts
    .map(a => `[HIGH] ${a.title}: ${a.detail} → Action: ${a.action}`)
    .join('\n');

  const suggestionList = aiSuggestions
    .map(s => `[${s.priority.toUpperCase()}] ${s.problem} → ${s.recommendation}`)
    .join('\n');

  const menteeList = mentees
    .map(m => `${m.studentName} — Weak: ${m.weakArea}, Focus: ${m.focusArea}`)
    .join('\n');

  return `
=== EduVision AI — Teacher Profile Context ===
Name: ${profile.name}
Teacher ID: ${profile.id}
Email: ${profile.email}
Role: ${profile.role}
Department: ${profile.department}
Designation: ${profile.designation}
Join Year: ${profile.joinYear}
Expertise: ${profile.expertise.join(', ')}
Mentorship Areas: ${profile.mentorshipAreas.join(', ')}

SUMMARY STATISTICS:
Total Students: ${summary.totalStudents}
Total Courses: ${summary.totalCourses}
At-Risk Students: ${summary.atRiskCount}
Avg Class Performance: ${summary.avgClassPerformance}%
Avg Attendance: ${summary.avgAttendance}%

COURSES BEING TAUGHT:
${courseList}

AT-RISK STUDENTS (need intervention):
${atRiskList || '- None detected'}

HIGH PERFORMERS:
${highPerformerList || '- None'}

HIGH-PRIORITY ALERTS:
${alertList || '- None currently'}

AI TEACHING SUGGESTIONS:
${suggestionList}

CURRENT MENTEES:
${menteeList || '- No active mentees'}
==============================================
`.trim();
}
