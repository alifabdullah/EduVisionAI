const fs = require('fs');
const file = 'd:/EduVision-AI/app/teacher/mentorship/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
if (!content.includes('lucide-react')) {
  content = content.replace(
    "import TopNavbar from '@/components/layout/TopNavbar';",
    "import TopNavbar from '@/components/layout/TopNavbar';\nimport { BarChart, Inbox, Users, Calendar, CheckCircle, BookOpen, Award, Settings, Clock, Eye, XCircle, MessageSquare, RefreshCw, ClipboardList, Send, Edit, PlayCircle, FileText, Link as LinkIcon, Microscope, Laptop, Check, X, Bell, User } from 'lucide-react';"
  );
}

// 2. statusIcon and resIcon
content = content.replace(
  /const statusIcon: Record<string, string> = \{[\s\S]*?\};/,
  `const statusIcon: Record<string, JSX.Element> = {
  Pending: <Clock size={14} />, Viewed: <Eye size={14} />, Accepted: <CheckCircle size={14} />, Rejected: <XCircle size={14} />,
  'Need More Info': <MessageSquare size={14} />, Upcoming: <Calendar size={14} />, Completed: <CheckCircle size={14} />,
  Missed: <XCircle size={14} />, Rescheduled: <RefreshCw size={14} />, 'Pending Approval': <Clock size={14} />,
  Assigned: <ClipboardList size={14} />, 'In Progress': <RefreshCw size={14} />, Submitted: <Send size={14} />, Approved: <CheckCircle size={14} />,
  'Needs Revision': <Edit size={14} />, 'More Info Required': <MessageSquare size={14} />, Active: <CheckCircle size={14} />, Paused: <RefreshCw size={14} />,
};`
);

content = content.replace(
  /const resIcon: Record<string, string> = \{[^\}]+\};/,
  "const resIcon: Record<string, JSX.Element> = { Book: <BookOpen size={16} />, Video: <PlayCircle size={16} />, Paper: <FileText size={16} />, Template: <ClipboardList size={16} />, Notes: <MessageSquare size={16} />, Link: <LinkIcon size={16} /> };"
);

// 3. StatusBadge
content = content.replace(
  /\{statusIcon\[status\] \?\? '•'\} \{status\}/,
  "{statusIcon[status] ?? <span style={{fontSize:14}}>•</span>} {status}"
);

// 4. TabButton
content = content.replace(
  /function TabButton\(\{ label, active, onClick, badge \}: \{ label: string; active: boolean; onClick: \(\) => void; badge\?: number \}\) \{/,
  "function TabButton({ label, icon, active, onClick, badge }: { label: string; icon?: React.ReactNode; active: boolean; onClick: () => void; badge?: number }) {"
);
content = content.replace(
  /\{label\}\s*\{badge != null/,
  "{icon}\n      {label}\n      {badge != null"
);

// 5. TABS array inside MentorshipPage
content = content.replace(
  /const TABS = \['📊 Dashboard', '📥 Inbox', '👥 Mentees', '📅 Sessions', '✅ Tasks', '📚 Resources', '🏅 Supervisor', '⚙️ Settings'\];/,
  `const TABS = [
    { label: 'Dashboard', icon: <BarChart size={16} /> },
    { label: 'Inbox', icon: <Inbox size={16} /> },
    { label: 'Mentees', icon: <Users size={16} /> },
    { label: 'Sessions', icon: <Calendar size={16} /> },
    { label: 'Tasks', icon: <CheckCircle size={16} /> },
    { label: 'Resources', icon: <BookOpen size={16} /> },
    { label: 'Supervisor', icon: <Award size={16} /> },
    { label: 'Settings', icon: <Settings size={16} /> }
  ];`
);

content = content.replace(
  /<TabButton label="📊 Dashboard" active=\{activeTab === 0\} onClick=\{\(\) => setActiveTab\(0\)\} \/>[\s\S]*?<TabButton label="⚙️ Settings" active=\{activeTab === 7\} onClick=\{\(\) => setActiveTab\(7\)\} \/>/,
  `{TABS.map((t, i) => (
            <TabButton key={i} label={t.label} icon={t.icon} active={activeTab === i} onClick={() => setActiveTab(i)} badge={
              i === 1 ? pendingCount : i === 4 ? submittedTaskCount : i === 6 ? supervisorPendingCount : 0
            } />
          ))}`
);

// 6. Summary Cards Icons
content = content.replace(/icon: '📥'/g, "icon: <Inbox size={24} />");
content = content.replace(/icon: '👥'/g, "icon: <Users size={24} />");
content = content.replace(/icon: '📅'/g, "icon: <Calendar size={24} />");
content = content.replace(/icon: '⏱️'/g, "icon: <Clock size={24} />");
content = content.replace(/icon: '✅'/g, "icon: <CheckCircle size={24} />");
content = content.replace(/icon: '🏅'/g, "icon: <Award size={24} />");

// 7. Recent Activity Headers
content = content.replace(/📥 Recent Requests/g, "Recent Requests");
content = content.replace(/📅 Upcoming Sessions/g, "Upcoming Sessions");
content = content.replace(/🔔 Notifications/g, "Notifications");
content = content.replace(
  /<p style=\{\{ fontSize: '0.72rem', fontWeight: 700, color: 'var\(--primary\)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 \}\}>Notifications<\/p>/,
  "<p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={14} /> Notifications</p>"
);

// 8. Buttons
content = content.replace(/📋 Review & Respond/g, "Review & Respond");
content = content.replace(/👤 View Profile/g, "View Profile");
content = content.replace(/✅ Accept/g, "<CheckCircle size={14} style={{ display: 'inline' }} /> Accept");
content = content.replace(/🔄 Reschedule/g, "<RefreshCw size={14} style={{ display: 'inline' }} /> Reschedule");
content = content.replace(/✅ Mark Completed/g, "<CheckCircle size={14} style={{ display: 'inline' }} /> Mark Completed");
content = content.replace(/❌ Mark Missed/g, "<XCircle size={14} style={{ display: 'inline' }} /> Mark Missed");
content = content.replace(/🔗 Meeting Link/g, "<LinkIcon size={14} style={{ display: 'inline' }} /> Meeting Link");
content = content.replace(/✅ Approve/g, "<CheckCircle size={14} style={{ display: 'inline' }} /> Approve");
content = content.replace(/✏️ Request Revision/g, "<Edit size={14} style={{ display: 'inline' }} /> Request Revision");
content = content.replace(/🏅 Approve as/g, "<Award size={14} style={{ display: 'inline' }} /> Approve as");
content = content.replace(/💬 Ask for More Info/g, "<MessageSquare size={14} style={{ display: 'inline' }} /> Ask for More Info");
content = content.replace(/❌ Reject/g, "<XCircle size={14} style={{ display: 'inline' }} /> Reject");
content = content.replace(/>🏅<\/span>/g, "><Award size={24} /></span>");
content = content.replace(/>🏅<\/p>/g, "><Award size={32} /></p>");
content = content.replace(/>📅/g, "><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />");

// 9. Inline emojis
content = content.replace(/\{resIcon\[r.type\] \?\? '📄'\}/g, "{resIcon[r.type] ?? <FileText size={16} />}");
content = content.replace(/\{req.supervisorType === 'Research' \? '🔬' : '💻'\}/g, "{req.supervisorType === 'Research' ? <Microscope size={12} style={{display:'inline'}} /> : <Laptop size={12} style={{display:'inline'}} />}");
content = content.replace(/🟢 Availability Status/g, "Availability Status");

// 10. Update buttons missing icons
content = content.replace(
  /<button onClick=\{\(\) => \{ setSelectedMentee\(m\); setShowStudentProfile\(true\); \}\} style=\{\{ flex: 1, padding: '8px', background: 'rgba\(34,211,238,0.12\)', border: '1px solid rgba\(34,211,238,0.3\)', borderRadius: 10, color: '#22D3EE', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' \}\}>/g,
  `<button onClick={() => { setSelectedMentee(m); setShowStudentProfile(true); }} style={{ flex: 1, padding: '8px', background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: 10, color: '#22D3EE', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <User size={14} />`
);
content = content.replace(
  /<button onClick=\{\(\) => \{ setSelectedReq\(req\); setResponseNote\(''\); setShowRequestModal\(true\); \}\} style=\{\{ padding: '8px 18px', background: 'linear-gradient\(135deg, #22D3EE, #6C63FF\)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' \}\}>/g,
  `<button onClick={() => { setSelectedReq(req); setResponseNote(''); setShowRequestModal(true); }} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #22D3EE, #6C63FF)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
    <ClipboardList size={14} />`
);
content = content.replace(/📨 Student Submission/g, "<Send size={14} style={{ display: 'inline', marginRight: 4 }} /> Student Submission");

fs.writeFileSync(file, content, 'utf8');
console.log('Premium UI applied. Emojis removed.');
