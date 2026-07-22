const fs = require('fs');

const studentFile = 'd:/EduVision-AI/app/student/mentor/page.tsx';
let content = fs.readFileSync(studentFile, 'utf8');

// 1. Add Supabase import
if (!content.includes('supabaseClient')) {
  content = content.replace(
    "import studentData from '@/data/student.json';",
    "import studentData from '@/data/student.json';\nimport { supabase } from '@/lib/supabaseClient';"
  );
}

// 2. Add useEffect import
if (!content.includes('useEffect')) {
  content = content.replace(
    "import { useState } from 'react';",
    "import { useState, useEffect } from 'react';"
  );
}

// 3. Inject State and Fetch Logic inside MentorPage
const fetchLogic = `
  // Supabase states
  const [requests, setRequests] = useState<MentorRequest[]>(REQUESTS);
  const [sessions, setSessions] = useState<Session[]>(SESSIONS);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>(TRACKING_STEPS);

  useEffect(() => {
    const studentId = profile.id;

    async function fetchData() {
      // Fetch Requests
      const { data: reqs } = await supabase.from('mentor_requests').select('*').eq('student_id', studentId).order('created_at', { ascending: false });
      if (reqs && reqs.length > 0) {
        setRequests(reqs.map((r: any) => ({
          id: r.id, mentorId: r.mentor_id, mentorName: r.mentor_name, mentorType: r.mentor_type as any,
          purpose: r.purpose, goal: r.goal, meetingType: r.meeting_type, message: r.message,
          sentDate: new Date(r.created_at).toLocaleString(), status: r.status, statusDate: new Date(r.updated_at).toLocaleString(),
          mentorNote: r.teacher_note
        })));
      }

      // Fetch Sessions
      const { data: sess } = await supabase.from('mentor_sessions').select('*').eq('student_id', studentId).order('session_date', { ascending: true });
      if (sess && sess.length > 0) {
        setSessions(sess.map((s: any) => ({
          id: s.id, title: s.title, mentorName: s.mentor_name, date: s.session_date, time: s.session_time,
          duration: s.duration, type: s.type, status: s.status, topics: s.topics,
          mentorNotes: s.mentor_notes, studentNotes: s.student_notes, followUp: s.follow_up, link: s.meeting_link
        })));
      }

      // Fetch Tasks
      const { data: tsks } = await supabase.from('mentor_tasks').select('*').eq('student_id', studentId);
      if (tsks && tsks.length > 0) {
        setTasks(tsks.map((t: any) => ({
          id: t.id, title: t.title, assignedBy: t.mentor_id, description: t.description,
          deadline: t.deadline, status: t.status, progress: t.progress, mentorFeedback: t.mentor_feedback
        })));
      }

      // Fetch Resources
      const { data: res } = await supabase.from('mentor_resources').select('*').eq('student_id', studentId);
      if (res && res.length > 0) {
        setResources(res.map((r: any) => ({
          id: r.id, title: r.title, sharedBy: r.mentor_id, type: r.resource_type as any,
          description: r.description, link: r.link, saved: r.is_saved, date: new Date(r.created_at).toLocaleDateString()
        })));
      }
    }

    fetchData();

    // Supabase Realtime Subscription
    const channel = supabase.channel('student_mentorship_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_requests', filter: \`student_id=eq.\${studentId}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_sessions', filter: \`student_id=eq.\${studentId}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_tasks', filter: \`student_id=eq.\${studentId}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentor_resources', filter: \`student_id=eq.\${studentId}\` }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile.id]);
`;

content = content.replace(
  "const [activeTab, setActiveTab] = useState(0);",
  "const [activeTab, setActiveTab] = useState(0);\n" + fetchLogic
);

// 4. Update the sendRequest function to insert into Supabase
const sendRequestLogic = `
  async function sendRequest() {
    if (!requestingMentor) return;
    setReqSent(true);
    await supabase.from('mentor_requests').insert({
      student_id: profile.id,
      student_name: profile.name,
      mentor_id: requestingMentor.id,
      mentor_name: requestingMentor.name,
      mentor_type: requestingMentor.mentorType,
      purpose: reqPurpose,
      goal: reqGoal,
      meeting_type: reqMeetType,
      message: reqMsg,
      status: 'Pending'
    });
  }
`;
content = content.replace(
  /function sendRequest\(\) \{\s*setReqSent\(true\);\s*\}/,
  sendRequestLogic
);

// 5. Update task progress to Supabase
const updateTaskLogic = `
  async function updateTaskStatus(id: string, status: TaskStatus, progress: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, progress } : t));
    await supabase.from('mentor_tasks').update({ status, progress }).eq('id', id);
  }
`;
content = content.replace(
  /function updateTaskStatus\(id: string, status: TaskStatus, progress: number\) \{[\s\S]*?\}/,
  updateTaskLogic
);

// 6. Request Supervisor update to Supabase
const reqSupervisorSubmit = `
            <button onClick={async () => { 
              setSupervisorStatus('Pending'); 
              setShowSupervisorModal(false); 
              await supabase.from('mentor_requests').insert({
                student_id: profile.id,
                student_name: profile.name,
                mentor_id: 'SUPERVISOR', // Typically you'd pick the specific mentor
                mentor_name: 'Tamanna Akter',
                mentor_type: 'Academic',
                purpose: 'Supervisor Request',
                goal: 'N/A',
                meeting_type: 'N/A',
                message: 'Requesting supervisor conversion',
                status: 'Pending',
                supervisor_type: supervisorType,
                project_title: 'Student Attendance Optimization using ML'
              });
            }} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, var(--primary), #22D3EE)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
`;
content = content.replace(
  /<button onClick=\{\(\) => \{ setSupervisorStatus\('Pending'\); setShowSupervisorModal\(false\); \}\} style=\{\{ flex: 1, padding: '11px', background: 'linear-gradient\(135deg, var\(--primary\), #22D3EE\)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0\.88rem', cursor: 'pointer' \}\}>/g,
  reqSupervisorSubmit
);

// 7. Replace REQUESTS with requests in rendering
content = content.replace(/REQUESTS/g, "requests").replace(/requests\.length/g, "requests.length");
// Revert the mocked data definitions back to REQUESTS to avoid breaking
content = content.replace(/const requests: MentorRequest\[\] = \[/g, "const REQUESTS: MentorRequest[] = [");
// Wait, global replace might be dangerous. Let's fix SESSIONS and others too
content = content.replace(/SESSIONS/g, "sessions").replace(/const sessions: Session\[\] = \[/g, "const SESSIONS: Session[] = [");

fs.writeFileSync(studentFile, content, 'utf8');
console.log('Student page updated.');
