'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlanCard {
  title: string;
  summary: string;
  actionText: string;
  actionId: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  planCard?: PlanCard | null;
  timestamp: Date;
  isLoading?: boolean;
}

interface GeminiHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

// ─── Quick Prompt Suggestions ─────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Show me at-risk students',
  'Give me teaching suggestions',
  'Check attendance issues',
  'Analyze CSE301 performance',
  'Generate a faculty report',
  'Suggest intervention strategies',
  'Help with mentorship plan',
  'What topics need extra class?',
];

const ACTION_ICONS: Record<string, string> = {
  SCHEDULE_EXTRA_CLASS: '📅',
  SEND_STUDENT_ALERT: '🚨',
  GENERATE_REPORT: '📊',
  VIEW_AT_RISK: '⚠️',
  REVIEW_CURRICULUM: '📖',
  CONTACT_AUTHORITY: '🏛️',
  MENTORSHIP_PLAN: '🤝',
};

// ─── Text Formatter ───────────────────────────────────────────────────────────
function formatText(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const isBullet = /^[\s]*[-•]/.test(line) || /^\d+\./.test(line.trim());
    if (isBullet) {
      const clean = bold.replace(/^[\s\-•]*/, '').replace(/^\d+\.\s*/, '').trim();
      return <li key={i} style={{ marginLeft: 18, marginBottom: 4, listStyleType: 'disc', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: clean }} />;
    }
    return line.trim()
      ? <p key={i} style={{ marginBottom: 6, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: bold }} />
      : <div key={i} style={{ height: 4 }} />;
  });
}

function timeLabel(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeacherAIAdvisorPage() {
  const { profile, summary } = teacherData;
  const atRiskCount = teacherData.students.filter(s => s.segment === 'at-risk').length;

  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Hello, ${profile.name.split(' ').slice(-1)[0]}! 👋 I'm your EduVision AI Teaching Assistant.\n\nI've reviewed your faculty profile — you're teaching **${summary.totalCourses} courses** with **${summary.totalStudents} students**. I can see **${summary.atRiskCount} students are at-risk** and need immediate attention.\n\nHow can I help you today? You can ask me about student performance, intervention strategies, teaching suggestions, or generate a quick report.`,
    timestamp: new Date(),
  }]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<GeminiHistoryEntry[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [prompts, setPrompts] = useState(QUICK_PROMPTS.slice(0, 6));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    const loadingMsg: Message = { role: 'assistant', content: '', timestamp: new Date(), isLoading: true };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsLoading(true);

    const updatedHistory: GeminiHistoryEntry[] = [
      ...geminiHistory,
      { role: 'user', parts: [{ text }] }
    ];

    try {
      let assistantText = '';
      let planCard: PlanCard | null = null;

      try {
        const res = await fetch('/api/ai/teacher-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: geminiHistory }),
        });

        if (res.ok) {
          const data = await res.json() as { text: string; planCard?: PlanCard; error?: string };
          if (data.error) throw new Error(data.error);
          assistantText = data.text;
          planCard = data.planCard || null;
        } else throw new Error('API down');
      } catch {
        // Inline fallback
        const q = text.toLowerCase();
        if (q.includes('at-risk') || q.includes('risk')) {
          assistantText = `**At-Risk Students in your classes:**\n\n- **Mia Reynolds** (CS21046) — Marks: 55%, Attendance: 60% in Data Structures\n- **Liam Scott** (CS21049) — Marks: 45%, Attendance: 50% in Data Structures\n\n**Recommended:** Schedule 1-on-1 check-ins and send attendance warnings this week.`;
        } else if (q.includes('suggestion') || q.includes('improve') || q.includes('teaching')) {
          assistantText = `**AI Teaching Suggestions:**\n\n- 🚨 **CSE301 Data Structures** — Introduce visual DP algorithm animations and extra practice problems\n- ⚠️ **CSE303 Database Systems** — Add interactive polls every 20 minutes to boost engagement\n- 💡 **General** — Review grading rubrics to ensure consistency`;
        } else if (q.includes('attendance')) {
          assistantText = `**Attendance Overview:**\n\n- CSE303: **85%** avg ✅\n- CSE301: **78%** avg ⚠️\n- CSE201: **90%** avg ✅\n\n**Critical Cases:**\n- Mia Reynolds: 60% → Send formal warning\n- Liam Scott: 50% → Immediate intervention needed`;
        } else if (q.includes('report')) {
          assistantText = `**Faculty Quick Report — Fall 2024:**\n\n- Total Students: ${summary.totalStudents}\n- At-Risk: ${summary.atRiskCount}\n- Avg Performance: ${summary.avgClassPerformance}%\n- Avg Attendance: ${summary.avgAttendance}%\n\n**Top Concern:** Data Structures class has highest at-risk percentage.`;
        } else {
          assistantText = `I can help with:\n\n- 🚨 At-risk student identification\n- 📊 Course performance analysis\n- 💡 Teaching strategy suggestions\n- 📅 Attendance reports\n- 🤝 Mentorship planning\n\nWhat would you like to explore?`;
        }
      }

      assistantText = assistantText || 'Sorry, please try again.';

      setGeminiHistory([...updatedHistory, { role: 'model', parts: [{ text: assistantText }] }]);

      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: assistantText, planCard, timestamp: new Date() };
        return next;
      });

      setPrompts(QUICK_PROMPTS.filter(p => p !== text).slice(0, 6));

    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: '⚠️ AI service temporarily unavailable. Please try again.', timestamp: new Date() };
        return next;
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isLoading, geminiHistory, summary]);

  const handlePlanAction = (actionId: string, title: string) => {
    showNotification(`Activating: ${title}`);
    sendMessage(`I activated "${title}". What are the next steps?`);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared! Hi again, ${profile.name.split(' ').slice(-1)[0]}. What would you like to analyze?`,
      timestamp: new Date(),
    }]);
    setGeminiHistory([]);
    setPrompts(QUICK_PROMPTS.slice(0, 6));
  };

  const THEME_BLUE = '#003B95';
  const USER_BLUE = '#1D4ED8';
  const BADGE_COLOR = '#50B748';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F1F5F9' }}>
      <TopNavbar title="AI Teaching Advisor 👨‍🏫" subtitle="Conversational AI decision-support — powered by Gemini" accentColor="#003B95" />

      {/* Toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 999,
          background: THEME_BLUE, color: '#fff',
          padding: '10px 20px', borderRadius: 10, fontWeight: 600,
          fontSize: '0.82rem', boxShadow: '0 8px 24px rgba(0,59,149,0.25)',
          animation: 'slideIn 0.3s ease'
        }}>
          ✅ {notification}
        </div>
      )}

      {/* Mobile Context Toggle */}
      <div className="mobile-only" style={{ padding: '0.75rem 1.5rem', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: '6px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: '#0F172A' }}>
          {sidebarOpen ? 'Hide Context ✕' : 'View Context Panel ☰'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '0', position: 'relative' }}>

        {/* ── Chat Area ──────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FFFFFF', borderRight: '1px solid #E5E7EB' }}>
          
          {/* Chat Header */}
          <div style={{ 
            padding: '20px 24px', 
            background: THEME_BLUE, color: 'white', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '0.2px' }}>AI Teaching Advisor</p>
                <p style={{ fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                  <span style={{ color: BADGE_COLOR, fontSize: '14px', lineHeight: 1 }}>●</span> Online
                </p>
              </div>
            </div>
            <button onClick={clearChat} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '0.75rem', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, fontWeight: 600 }}>
              🗑 Clear
            </button>
          </div>

          {/* Quick Prompts below header */}
          <div style={{ padding: '12px 24px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }} className="hide-scrollbar">
            {prompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} disabled={isLoading}
                style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E5E7EB', color: '#0F172A', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={e => !isLoading && (e.currentTarget.style.background = '#F8FAFC')}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#F8FAFC' }} className="hide-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>

                {msg.role === 'assistant' && (
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src="/diu_crest.png" alt="DIU" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                  </div>
                )}

                <div style={{ maxWidth: msg.role === 'user' ? '75%' : '80%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Bubble */}
                  <div style={{
                    padding: '16px',
                    background: msg.role === 'user' ? USER_BLUE : '#FFFFFF',
                    color: msg.role === 'user' ? 'white' : '#0F172A',
                    border: msg.role === 'user' ? 'none' : 'none',
                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    fontSize: '0.9rem', lineHeight: 1.6,
                    boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(15,23,42,0.04)' : 'none'
                  }}>
                    {msg.isLoading ? (
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 20 }}>
                        {[0, 0.2, 0.4].map((delay, di) => (
                          <div key={di} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: `${delay}s` }} />
                        ))}
                      </div>
                    ) : (
                      <div>{formatText(msg.content)}</div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8', paddingLeft: 4, paddingRight: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {timeLabel(msg.timestamp)}
                  </p>

                  {/* Plan Card */}
                  {msg.planCard && !msg.isLoading && (
                    <div style={{
                      padding: '12px', borderLeft: '3px solid #1D4ED8',
                      background: '#FFFFFF', borderRadius: 12,
                      boxShadow: '0 2px 8px rgba(15,23,42,0.04)', maxWidth: 420
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: '1.1rem' }}>{ACTION_ICONS[msg.planCard.actionId] || '⚡'}</span>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{msg.planCard.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 10, lineHeight: 1.4 }}>
                        {msg.planCard.summary}
                      </p>
                      <button
                        onClick={() => handlePlanAction(msg.planCard!.actionId, msg.planCard!.title)}
                        style={{
                          padding: '6px 12px', background: '#EAF3FF',
                          color: '#1D4ED8', border: 'none', borderRadius: 8, fontSize: '0.8rem',
                          fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                        }}
                      >
                        {msg.planCard.actionText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '16px 24px 24px', background: '#FFFFFF', flexShrink: 0
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about student performance, interventions..."
                disabled={isLoading}
                style={{
                  flex: 1, padding: '14px 20px', background: 'white',
                  border: '2px solid #E2E8F0', borderRadius: 999, color: '#0F172A',
                  fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = THEME_BLUE}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                style={{
                  width: 52, height: 52, borderRadius: 999, flexShrink: 0,
                  background: THEME_BLUE,
                  color: '#fff',
                  border: 'none', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !input.trim() ? 0.5 : 1, transition: 'all 0.2s',
                }}
              >
                {isLoading ? '⏳' : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Context Sidebar ───────────────────────────── */}
        <div className={`context-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
          width: 320, padding: '1.5rem', display: 'flex', flexDirection: 'column',
          gap: '1.5rem', overflowY: 'auto', background: '#F8FAFC', flexShrink: 0
        }}>
          {/* Teacher snapshot */}
          <div style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Faculty Context</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: '#EAF3FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 800, color: THEME_BLUE
              }}>
                {profile.name.split(' ').filter(n => !['Dr.', 'Prof.'].includes(n)).map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>{profile.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{profile.designation}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Students', val: summary.totalStudents, color: THEME_BLUE },
                { label: 'Courses', val: summary.totalCourses, color: '#6C63FF' },
                { label: 'At-Risk', val: summary.atRiskCount, color: '#EF4444' },
                { label: 'Avg Perf', val: `${summary.avgClassPerformance}%`, color: '#10B981' },
              ].map(s => (
                <div key={s.label} style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10 }}>
                  <p style={{ fontSize: '0.65rem', color: '#64748B', margin: '0 0 4px 0' }}>{s.label}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* At-Risk Alert */}
          {atRiskCount > 0 && (
            <div style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>⚠️ At-Risk Students</p>
              {teacherData.students.filter(s => s.segment === 'at-risk').map(s => (
                <div key={s.id} style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, marginBottom: 8 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 4px 0', color: '#0F172A' }}>{s.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>
                    Marks: <span style={{ color: '#EF4444' }}>{s.marks}%</span> · Att: <span style={{ color: s.attendance < 75 ? '#EF4444' : '#64748B' }}>{s.attendance}%</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ padding: '1.25rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Action Center</p>
            {[
              { label: '🚨 At-Risk Analysis', prompt: 'Show me all at-risk students and what I should do.' },
              { label: '📊 Course Report', prompt: 'Generate a comprehensive course performance report.' },
              { label: '💡 Teaching Tips', prompt: 'Give me AI-powered teaching improvement suggestions.' },
              { label: '📅 Attendance Alert', prompt: 'Which students need an attendance warning?' },
              { label: '🤝 Mentorship Plan', prompt: 'Help me create a mentorship plan for struggling students.' },
            ].map(q => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.prompt)}
                disabled={isLoading}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', marginBottom: 8,
                  padding: '10px 12px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0', borderRadius: 10, color: '#475569',
                  fontSize: '0.8rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.color = THEME_BLUE, e.currentTarget.style.borderColor = THEME_BLUE)}
                onMouseLeave={e => (e.currentTarget.style.color = '#475569', e.currentTarget.style.borderColor = '#E2E8F0')}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        @media (max-width: 768px) {
          .context-sidebar {
            display: none !important;
            position: absolute;
            top: 0; right: 0; bottom: 0;
            z-index: 50;
            box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          }
          .context-sidebar.open {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
