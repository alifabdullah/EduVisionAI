const fs = require('fs');

const teacherFile = 'd:/EduVision-AI/app/teacher/mentorship/page.tsx';
let content = fs.readFileSync(teacherFile, 'utf8');

// 1. Add Supabase import
if (!content.includes('supabaseClient')) {
  content = content.replace(
    "import teacherData from '@/data/teacher.json';",
    "import teacherData from '@/data/teacher.json';\nimport { supabase } from '@/lib/supabaseClient';"
  );
}

// 2. Add useEffect import
if (!content.includes('useEffect')) {
  content = content.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect } from 'react';"
  );
}

const fetchLogic = `
  useEffect(() => {
    const teacherId = teacher.id || 'TCH-002'; // Fallback to TCH-002 if no id in JSON

    async function fetchData() {
      // Fetch Requests
      const { data: reqs } = await supabase.from('mentor_requests').select('*').eq('mentor_id', teacherId).order('created_at', { ascending: false });
      if (reqs && reqs.length > 0) {
        setRequests(reqs.map((r: any) => ({
          id: r.id, studentId: r.student_id, studentName: r.student_name, course: r.course || '', semester: r.semester || 1,
          cgpa: r.cgpa || 3.0, weakAreas: r.weak_areas || [], purpose: r.purpose, goal: r.goal, meetingType: r.meeting_type,
          message: r.message, sentDate: new Date(r.created_at).toLocaleString(), status: r.status, teacherNote: r.teacher_note
        })));
      }

      // Fetch Sessions
      const { data: sess } = await supabase.from('mentor_sessions').select('*').eq('mentor_id', teacherId).order('session_date', { ascending: true });
      if (sess && sess.length > 0) {
        setSessions(sess.map((s: any) => ({
          id: s.id, studentName: s.student_name, studentId: s.student_id, title: s.title, type: s.type, date: s.session_date,
          time: s.session_time, duration: s.duration, status: s.status, topics: s.topics, mentorNotes: s.mentor_notes, link: s.meeting_link
        })));
      }

      // Fetch Tasks
      const { data: tsks } = await supabase.from('mentor_tasks').select('*').eq('mentor_id', teacherId);
      if (tsks && tsks.length > 0) {
        setTasks(tsks.map((t: any) => ({
          id: t.id, studentName: t.student_name, title: t.title, description: t.description, deadline: t.deadline,
          status: t.status, subject: t.subject, submittedNote: t.submitted_note
        })));
      }
    }

    fetchData();

    const channel = supabase.channel('teacher_mentorship_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_requests', filter: \`mentor_id=eq.\${teacherId}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_sessions', filter: \`mentor_id=eq.\${teacherId}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_tasks', filter: \`mentor_id=eq.\${teacherId}\` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);
`;

content = content.replace(
  "const pendingCount = requests.filter(r => r.status === 'Pending').length;",
  fetchLogic + "\n  const pendingCount = requests.filter(r => r.status === 'Pending').length;"
);

// updateReqStatus
content = content.replace(
  /function updateReqStatus\(id: string, status: ReqStatus\) \{[\s\S]*?setResponseNote\(''\);\s*\}/,
  `async function updateReqStatus(id: string, status: ReqStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, teacherNote: responseNote || r.teacherNote } : r));
    setShowRequestModal(false);
    await supabase.from('mentor_requests').update({ status, teacher_note: responseNote }).eq('id', id);
    setResponseNote('');
  }`
);

// updateSessionStatus
content = content.replace(
  /function updateSessionStatus\(id: string, status: SessionStatus, notes\?: string\) \{[\s\S]*?setShowSessionModal\(false\);\s*\}/,
  `async function updateSessionStatus(id: string, status: SessionStatus, notes?: string) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status, mentorNotes: notes || s.mentorNotes } : s));
    setShowSessionModal(false);
    await supabase.from('mentor_sessions').update({ status, mentor_notes: notes }).eq('id', id);
  }`
);

// updateTaskStatus
content = content.replace(
  /function updateTaskStatus\(id: string, status: TaskStatus\) \{[\s\S]*?\}/,
  `async function updateTaskStatus(id: string, status: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await supabase.from('mentor_tasks').update({ status }).eq('id', id);
  }`
);

// addTask
content = content.replace(
  /function addTask\(\) \{[\s\S]*?setShowAddTaskModal\(false\);\s*\}/,
  `async function addTask() {
    if (!taskTitle) return;
    const newTask = { id: \`TSK-\${Date.now()}\`, studentName: taskStudent, title: taskTitle, description: taskDesc, deadline: taskDeadline, status: 'Assigned' as TaskStatus, subject: taskSubject };
    setTasks(prev => [...prev, newTask]);
    setTaskTitle(''); setTaskDesc(''); setTaskDeadline(''); setTaskSubject('');
    setShowAddTaskModal(false);
    await supabase.from('mentor_tasks').insert({
      mentor_id: teacher.id || 'TCH-002', student_id: taskStudent, student_name: taskStudent,
      title: taskTitle, description: taskDesc, subject: taskSubject, deadline: taskDeadline, status: 'Assigned'
    });
  }`
);

fs.writeFileSync(teacherFile, content, 'utf8');
console.log('Teacher page updated.');
