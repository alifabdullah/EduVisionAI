'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getChatbotResponse } from '@/utils/aiChatbot';
import { useCounseling } from '@/context/CounselingContext';
import { Maximize2, MoreHorizontal, X, Send } from 'lucide-react';

interface MentorCard { name: string; department: string; expertise: string[]; rating: number; availability: string; reason: string; }
interface ActionCard { title: string; description: string; actionText: string; actionId: string; }
interface Message { role: 'user' | 'assistant'; content: string; mentorCard?: MentorCard | null; actionCard?: ActionCard | null; isLoading?: boolean; }
interface GeminiHistoryEntry { role: 'user' | 'model'; parts: Array<{ text: string }>; }

const STUDENT_PROMPTS = [
  'How can I improve my GPA?',
  'Suggest a mentor for Database.',
  'Create a 7-day study plan.',
];

const TEACHER_PROMPTS = [
  'How can I improve student engagement?',
  'Identify at-risk students in my class.',
  'Suggest better assessment strategies.',
];

const AUTHORITY_PROMPTS = [
  'Show department performance summary.',
  'Which department needs urgent attention?',
  'Generate a strategic improvement plan.',
];

function formatText(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return <li key={i} style={{ marginLeft: 16, marginBottom: 4, listStyleType: 'disc', lineHeight: 1.5, fontSize: '0.85rem' }} dangerouslySetInnerHTML={{ __html: bold.replace(/^[\s-•]*/, '') }} />;
    }
    return line.trim() ? <p key={i} style={{ marginBottom: 6, lineHeight: 1.5, fontSize: '0.85rem' }} dangerouslySetInnerHTML={{ __html: bold }} /> : <div key={i} style={{ height: 6 }} />;
  });
}

interface FloatingAIAdvisorProps {
  role?: 'student' | 'teacher' | 'authority';
}

export default function FloatingAIAdvisor({ role = 'student' }: FloatingAIAdvisorProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<GeminiHistoryEntry[]>([]);
  const [hasNew, setHasNew] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getStudentRequests, getPendingCount } = useCounseling();
  
  // Get Context
  const studentReqs = getStudentRequests('261-16-010');
  const studentPending = studentReqs.find(r => r.status === 'Pending');
  const teacherPendingCount = getPendingCount('TCH-002');

  // Role-specific config
  const config = {
    student: {
      prompts: STUDENT_PROMPTS,
      greeting: studentPending 
        ? `Hi! 👋 I'm your AI Advisor. You have a **pending counseling request** with ${studentPending.teacherName}. Would you like me to suggest topics while you wait?` 
        : "Hi! 👋 I'm your AI Advisor. You have **critical risks** in Database Systems (48%) and Data Structures (55%). How can I help?",
      fullPageLink: '/student/ai-advisor',
      accentColor: '#003B95',
      badgeColor: '#50B748',
      btnBg: '#003B95',
      label: 'DIU AI Assistant',
    },
    teacher: {
      prompts: TEACHER_PROMPTS,
      greeting: teacherPendingCount > 0 
        ? `Hello Teacher! 👋 I'm your **AI Teaching Assistant**. You have **${teacherPendingCount} pending counseling request(s)**. Should I draft acceptance notes?` 
        : "Hello Teacher! 👋 I'm your **AI Teaching Assistant**. I can help you analyze student performance, identify at-risk students, and suggest course improvements. What would you like to explore?",
      fullPageLink: '/teacher/ai-advisor',
      accentColor: '#003B95',
      badgeColor: '#50B748',
      btnBg: '#003B95',
      label: 'DIU AI — Teacher',
    },
    authority: {
      prompts: AUTHORITY_PROMPTS,
      greeting: "Welcome Vice Chancellor! 👋 I'm your **Strategic AI Advisor**. I can provide institutional insights, departmental analysis, and strategic recommendations. How can I assist you today?",
      fullPageLink: '/authority/ai-strategic-advisor',
      accentColor: '#003B95',
      badgeColor: '#F59E0B',
      btnBg: '#003B95',
      label: 'DIU AI — Authority',
    },
  }[role];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: config.greeting }
  ]);
  const [prompts, setPrompts] = useState(config.prompts);

  useEffect(() => {
    if (isOpen) {
      setHasNew(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen, messages]);

  // Block on full-page AI screens
  const isFullAdvisorPage =
    pathname === '/student/ai-advisor' ||
    pathname === '/teacher/ai-advisor' ||
    pathname === '/authority/ai-strategic-advisor';

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    const loadingMsg: Message = { role: 'assistant', content: '', isLoading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsLoading(true);

    const updatedHistory: GeminiHistoryEntry[] = [...geminiHistory, { role: 'user', parts: [{ text }] }];

    try {
      let assistantText = '';
      let mentorCard: MentorCard | undefined = undefined;
      let actionCard: ActionCard | undefined = undefined;

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: geminiHistory, role }),
        });

        if (res.ok) {
          const data = await res.json() as { text: string; mentorCard?: MentorCard; actionCard?: ActionCard; error?: string };
          if (data.error) throw new Error(data.error);
          assistantText = data.text;
          mentorCard = data.mentorCard;
          actionCard = data.actionCard;
        } else {
          throw new Error('API down');
        }
      } catch (apiErr) {
        console.warn('Floating Advisor API failed, switching to local...', apiErr);
        const mappedHistory = messages.map(m => ({ role: m.role, content: m.content }));
        const mockResult = getChatbotResponse(text, mappedHistory);
        assistantText = mockResult.response;
        mentorCard = mockResult.mentorCard ? {
          name: mockResult.mentorCard.name,
          department: mockResult.mentorCard.department,
          expertise: mockResult.mentorCard.expertise,
          rating: mockResult.mentorCard.rating,
          availability: mockResult.mentorCard.availability,
          reason: mockResult.mentorCard.reason
        } : undefined;
        actionCard = mockResult.actionCard ? {
          title: mockResult.actionCard.title,
          description: mockResult.actionCard.description,
          actionText: mockResult.actionCard.actionText,
          actionId: mockResult.actionCard.actionId
        } : undefined;
      }

      assistantText = assistantText || 'Sorry, please try again.';

      setGeminiHistory([...updatedHistory, { role: 'model', parts: [{ text: assistantText }] }]);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: assistantText, mentorCard, actionCard };
        return next;
      });
      setPrompts(config.prompts.filter(p => p !== text).slice(0, 3));
    } catch {
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Connection error. Please try again.' };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, geminiHistory, messages, role, config.prompts]);

  if (isFullAdvisorPage) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open DIU AI Assistant"
          style={{
            width: 64, height: 64, borderRadius: '999px',
            background: config.btnBg, color: 'white',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            boxShadow: '0 8px 24px rgba(0,59,149,0.25)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,59,149,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,59,149,0.25)';
          }}
        >
          <img src="/diu_crest.png" alt="DIU" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          {hasNew && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 14, height: 14, borderRadius: '50%',
              background: config.badgeColor, border: '3px solid ' + config.btnBg,
            }} />
          )}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          width: 380, height: 600, display: 'flex', flexDirection: 'column',
          background: '#FFFFFF', borderRadius: 28, overflow: 'hidden',
          border: '1px solid #E5E7EB',
          boxShadow: '0 12px 40px rgba(15,23,42,0.12)',
          animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)'
        }}>

          {/* Header */}
          <div style={{
            padding: '20px 24px',
            background: config.accentColor, color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0, letterSpacing: '0.2px' }}>{config.label}</p>
                <p style={{ fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                  <span style={{ color: config.badgeColor, fontSize: '14px', lineHeight: 1 }}>●</span> Online
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link
                href={config.fullPageLink}
                onClick={() => setIsOpen(false)}
                style={{ color: 'white', opacity: 0.8, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                title="Full Page"
              >
                <Maximize2 size={18} />
              </Link>
              <button style={{ background: 'none', border: 'none', color: 'white', opacity: 0.8, cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.8, cursor: 'pointer' }}><X size={20} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, background: '#F8FAFC' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src="/diu_crest.png" alt="DIU" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  </div>
                )}

                <div style={{ maxWidth: msg.role === 'user' ? '75%' : '80%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    padding: '16px',
                    background: msg.role === 'user' ? '#1D4ED8' : '#FFFFFF',
                    color: msg.role === 'user' ? 'white' : '#0F172A',
                    boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(15,23,42,0.04)' : 'none',
                    borderRadius: '18px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                  }}>
                    {msg.isLoading ? (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 20 }}>
                        {[0, 0.2, 0.4].map((d, di) => (
                          <div key={di} className="dot-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', animationDelay: `${d}s` }} />
                        ))}
                      </div>
                    ) : <div>{formatText(msg.content)}</div>}
                  </div>

                  {/* Mini action card */}
                  {msg.actionCard && !msg.isLoading && (
                    <div style={{ padding: '12px', borderLeft: '3px solid #1D4ED8', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                      <p style={{ fontWeight: 700, margin: '0 0 6px 0', fontSize: '0.85rem', color: '#0F172A' }}>{msg.actionCard.title}</p>
                      <button
                        onClick={() => sendMessage(`I activated: ${msg.actionCard!.title}. What next?`)}
                        style={{ padding: '6px 12px', background: '#EAF3FF', color: '#1D4ED8', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                        {msg.actionCard.actionText}
                      </button>
                    </div>
                  )}

                  {/* Mini mentor card */}
                  {msg.mentorCard && !msg.isLoading && (
                    <div style={{ padding: '12px', borderLeft: '3px solid #50B748', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                      <p style={{ fontWeight: 700, margin: '0 0 4px 0', fontSize: '0.85rem', color: '#0F172A' }}>{msg.mentorCard.name} — {msg.mentorCard.department}</p>
                      <p style={{ color: '#64748B', fontSize: '0.75rem', margin: '0 0 10px 0', lineHeight: 1.4 }}>{msg.mentorCard.reason}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => sendMessage(`I sent a mentorship request to ${msg.mentorCard!.name}. What should I prepare?`)}
                          style={{ flex: 1, padding: '6px', background: '#50B748', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                          Request Mentor
                        </button>
                        <button
                          onClick={() => sendMessage(`I want to schedule a session with ${msg.mentorCard!.name}.`)}
                          style={{ flex: 1, padding: '6px', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                          Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '12px 24px 0', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, background: '#FFFFFF' }} className="hide-scrollbar">
            {prompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} disabled={isLoading}
                style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E5E7EB', color: '#0F172A', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, opacity: isLoading ? 0.5 : 1, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={e => !isLoading && (e.currentTarget.style.background = '#F8FAFC')}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '16px 24px 24px', background: '#FFFFFF', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type your message..." disabled={isLoading}
                style={{ flex: 1, padding: '14px 20px', background: 'white', border: '2px solid #E2E8F0', borderRadius: 999, color: '#0F172A', fontSize: '0.9rem', outline: 'none' }}
              />
              <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
                style={{ width: 52, height: 52, borderRadius: 999, background: config.accentColor, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isLoading || !input.trim() ? 0.5 : 1, transition: 'all 0.2s' }}
                onMouseEnter={e => !isLoading && input.trim() && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => !isLoading && input.trim() && (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Send size={22} style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
