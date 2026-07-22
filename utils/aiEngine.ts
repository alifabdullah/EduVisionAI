// Rule-based AI engine for EduVision AI
// Designed to be easily replaceable with real ML/API calls

import studentRaw from '@/data/student.json';
import teacherRaw from '@/data/teacher.json';

// ─── Student AI ───────────────────────────────────────────────
export function getStudentAlerts() {
  const data = studentRaw;
  const alerts: { id: number; type: string; title: string; message: string; priority: 'high' | 'medium' | 'low'; subject: string | null }[] = [];
  let id = 1;

  data.subjects.forEach((sub) => {
    if (sub.attendance < 65) {
      alerts.push({ id: id++, type: 'attendance', title: 'Critical Attendance', message: `${sub.name} attendance is ${sub.attendance}% — critically low.`, priority: 'high', subject: sub.name });
    } else if (sub.attendance < 75) {
      alerts.push({ id: id++, type: 'attendance', title: 'Low Attendance Warning', message: `${sub.name} attendance is ${sub.attendance}%, below 75% threshold.`, priority: 'medium', subject: sub.name });
    }
    if (sub.marks < 50) {
      alerts.push({ id: id++, type: 'marks', title: 'Weak Subject Alert', message: `${sub.name} score ${sub.marks}% is critically low — at risk of failing.`, priority: 'high', subject: sub.name });
    } else if (sub.marks < 60) {
      alerts.push({ id: id++, type: 'marks', title: 'Improvement Needed', message: `${sub.name} score ${sub.marks}% needs attention before finals.`, priority: 'medium', subject: sub.name });
    }
  });

  const skills = data.skills;
  const weakSkills = Object.entries(skills).filter(([, v]) => v < 55).map(([k]) => k);
  if (weakSkills.length > 0) {
    alerts.push({ id: id++, type: 'skill', title: 'Skill Gap Detected', message: `${weakSkills.join(', ')} score below 55% — needs focused development.`, priority: 'medium', subject: null });
  }

  return alerts;
}

export function getStudentRecommendations() {
  const data = studentRaw;
  const recs: { id: number; category: string; title: string; description: string; priority: string; icon: string }[] = [];
  let id = 1;

  const weakSubjects = data.subjects.filter((s) => s.marks < 60);
  weakSubjects.forEach((s) => {
    recs.push({ id: id++, category: 'Academic', title: `Improve in ${s.name}`, description: `Score of ${s.marks}% is below target. Schedule focused study sessions and consult your mentor.`, priority: s.marks < 50 ? 'high' : 'medium', icon: 'book' });
  });

  const lowAttendance = data.subjects.filter((s) => s.attendance < 75);
  if (lowAttendance.length > 0) {
    recs.push({ id: id++, category: 'Attendance', title: 'Regularize Attendance', description: `${lowAttendance.map(s => s.name).join(', ')} attendance is below 75%. Attend all remaining classes.`, priority: 'high', icon: 'calendar' });
  }

  if (data.skills.Communication < 60) {
    recs.push({ id: id++, category: 'Skill', title: 'Join Debate Society', description: 'Communication score is low. Debate club will help build articulation and confidence.', priority: 'medium', icon: 'mic' });
  }
  if (data.skills.Leadership < 60) {
    recs.push({ id: id++, category: 'Skill', title: 'Take a Leadership Role', description: 'Volunteer as team lead in your next club project to build leadership skills.', priority: 'medium', icon: 'users' });
  }
  if (data.skills.Teamwork > 70) {
    recs.push({ id: id++, category: 'Skill', title: 'Leverage Your Teamwork Strength', description: 'Your teamwork score is strong. Consider collaborative research or group projects to shine.', priority: 'low', icon: 'star' });
  }

  recs.push({ id: id++, category: 'Mentorship', title: 'Book a Mentor Session', description: `${data.mentorRecommendation.teacherName} is recommended for your weak areas. Request a session this week.`, priority: 'low', icon: 'user-check' });

  return recs;
}

export function getWeakSubjects() {
  return studentRaw.subjects.filter((s) => s.marks < 60);
}

export function getPeerComparison() {
  return studentRaw.peers;
}

// ─── Teacher AI ───────────────────────────────────────────────
export function getTeacherAlerts() {
  const data = teacherRaw;
  return data.alerts;
}

export function getTeacherSuggestions() {
  return teacherRaw.aiSuggestions;
}

export function getTeacherAtRiskStudents() {
  return teacherRaw.students.filter((s) => s.segment === 'at-risk');
}

export function getStudentsBySegment(segment: string) {
  return teacherRaw.students.filter((s) => s.segment === segment);
}

// ─── Authority AI ─────────────────────────────────────────────
export { getDeptStats, searchStudents, searchTeachers, getStudentsByDept, getTeachersByDept, getAtRiskStudents } from '@/data/sharedMockData';

export function getDepartmentRisks() {
  const { MASTER_DEPARTMENTS } = require('@/data/sharedMockData');
  return MASTER_DEPARTMENTS.filter((d: { riskLevel: string }) => d.riskLevel === 'high');
}
