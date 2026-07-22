'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import studentData from '@/data/student.json';
import { getChatbotResponse } from '@/utils/aiChatbot';
import { Send, Trash2, ChevronRight, Bell, Calendar, Check, AlertCircle, X, Loader2, BookOpen } from 'lucide-react';
import { addGlobalRequest, setActiveStudyPlan, GlobalMentorRequest, ActiveStudyPlan } from '@/utils/globalState';

interface MentorCard { name: string; department: string; expertise: string[]; rating: number; availability: string; reason: string; }
interface ActionCard { title: string; description: string; actionText: string; actionId: string; }
interface Message { role: 'user'|'assistant'; content: string; mentorCard?: MentorCard|null; actionCard?: ActionCard|null; timestamp: Date; isLoading?: boolean; }
interface GeminiHistoryEntry { role: 'user'|'model'; parts: Array<{text:string}>; }

const PROMPTS = [
  { icon: '📈', label: 'How can I improve my GPA?' },
  { icon: '🎓', label: 'Which subject should I focus on first?' },
  { icon: '👥', label: 'Suggest a mentor for Database Systems.' },
  { icon: '📊', label: 'Analyze my Skill Radar.' },
  { icon: '📅', label: 'Create a 7-day study plan.' },
  { icon: '🔬', label: 'Am I ready for research?' },
];

const QUICK_ASK = [
  { label: 'Study Plan', icon: '📅', prompt: 'Create a 7-day study plan.' },
  { label: 'Research', icon: '🔬', prompt: 'Am I ready for research?' },
  { label: 'Best Mentor', icon: '👤', prompt: 'Who is the best mentor for me?' },
  { label: 'Career Guidance', icon: '💼', prompt: 'What career path suits me?' },
  { label: 'Skill Gap', icon: '🎯', prompt: 'What skills should I develop?' },
  { label: 'Study Resources', icon: '📚', prompt: 'Recommend study resources.' },
];

function formatText(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return <li key={i} style={{ marginLeft: 16, marginBottom: 4, lineHeight: 1.5, fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: bold.replace(/^[\s-•]*/, '') }} />;
    }
    return line.trim() ? <p key={i} style={{ marginBottom: 6, lineHeight: 1.55, fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: bold }} /> : <div key={i} style={{ height: 6 }} />;
  });
}

export default function AIAdvisorPage() {
  const { profile, academicSummary } = studentData;
  const weakSubjects = studentData.subjects.filter(s => s.marks < 60);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey ${profile.name.split(' ')[0]}! 👋 I'm your EduVision AI Academic Assistant.\n\nI've already reviewed your profile — you're in **Semester ${profile.semester}** with a CGPA of **${profile.cgpa.toFixed(2)}**. I can see a few areas that need urgent attention, especially in **Database Systems** and **Data Structures**.\n\nWhat would you like to work on first?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<GeminiHistoryEntry[]>([]);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [aiMeta, setAiMeta] = useState<{ provider: string; latencyMs: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Mock Action State Managers ---
  const [showMentorRequestModal, setShowMentorRequestModal] = useState(false);
  const [activeMentorForRequest, setActiveMentorForRequest] = useState<MentorCard | null>(null);
  const [requestStates, setRequestStates] = useState<Record<string, 'normal' | 'loading' | 'success' | 'error'>>({});

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeMentorForSchedule, setActiveMentorForSchedule] = useState<MentorCard | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [scheduleStates, setScheduleStates] = useState<Record<string, 'normal' | 'loading' | 'success' | string>>({});

  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [actionStates, setActionStates] = useState<Record<string, 'normal' | 'loading' | 'success'>>({});

  // --- Session Memory Persistence (hydration safe) ---
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('eduvision_advisor_messages');
    const savedHistory = sessionStorage.getItem('eduvision_advisor_history');
    const savedMeta = sessionStorage.getItem('eduvision_advisor_meta');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages) as Message[];
        setMessages(parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    if (savedHistory) {
      try {
        setGeminiHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    }
    if (savedMeta) {
      try {
        setAiMeta(JSON.parse(savedMeta));
      } catch (e) {
        console.error('Failed to parse saved meta', e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      sessionStorage.setItem('eduvision_advisor_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (geminiHistory.length > 0) {
      sessionStorage.setItem('eduvision_advisor_history', JSON.stringify(geminiHistory));
    }
  }, [geminiHistory]);

  useEffect(() => {
    if (aiMeta) {
      sessionStorage.setItem('eduvision_advisor_meta', JSON.stringify(aiMeta));
    }
  }, [aiMeta]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const addAssistantMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content, timestamp: new Date() }
    ]);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    const loadingMsg: Message = { role: 'assistant', content: '', timestamp: new Date(), isLoading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsLoading(true);
    
    const updatedHistory: GeminiHistoryEntry[] = [...geminiHistory, { role: 'user', parts: [{ text }] }];
    
    try {
      let assistantText = '';
      let mentorCard: MentorCard | null = null;
      let actionCard: ActionCard | null = null;
      let meta: { provider: string; latencyMs: number } | null = null;

      try {
        console.log('[Frontend AI Advisor] Requesting backend chat completion payload...');
        const res = await fetch('/api/ai/chat', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ message: text, history: geminiHistory }) 
        });
        
        if (res.ok) {
          const data = await res.json() as { 
            text: string; 
            mentorCard?: MentorCard; 
            actionCard?: ActionCard; 
            error?: string;
            meta?: { provider: string; latencyMs: number }
          };
          if (data.error) throw new Error(data.error);
          assistantText = data.text; 
          mentorCard = data.mentorCard || null; 
          actionCard = data.actionCard || null;
          meta = data.meta || null;
        } else {
          throw new Error(`API returned status ${res.status}`);
        }
      } catch (err) {
        console.warn('[Frontend AI Advisor Fallback] Backend chat endpoint failed or key is missing. Using local mock engine: ', err);
        const mapped = messages.map(m => ({ role: m.role, content: m.content }));
        const r = getChatbotResponse(text, mapped);
        assistantText = r.response;
        mentorCard = r.mentorCard ? { name: r.mentorCard.name, department: r.mentorCard.department, expertise: r.mentorCard.expertise, rating: r.mentorCard.rating, availability: r.mentorCard.availability, reason: r.mentorCard.reason } : null;
        actionCard = r.actionCard ? { title: r.actionCard.title, description: r.actionCard.description, actionText: r.actionCard.actionText, actionId: r.actionCard.actionId } : null;
        meta = { provider: 'mock (offline fallback)', latencyMs: 0 };
      }

      assistantText = assistantText || 'Sorry, please try again.';
      if (meta) {
        setAiMeta(meta);
      }
      
      setGeminiHistory([...updatedHistory, { role: 'model', parts: [{ text: assistantText }] }]);
      setMessages(prev => { 
        const next = [...prev]; 
        next[next.length - 1] = { role: 'assistant', content: assistantText, mentorCard, actionCard, timestamp: new Date() }; 
        return next; 
      });
    } catch (err) {
      console.error('[Frontend AI Advisor Fatal Error]', err);
      setMessages(prev => { 
        const next = [...prev]; 
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Connection error. Please make sure your server environment variable keys are configured.', timestamp: new Date() }; 
        return next; 
      });
    } finally { 
      setIsLoading(false); 
      setTimeout(() => inputRef.current?.focus(), 100); 
    }
  }, [isLoading, geminiHistory, messages]);

  // --- Button Action Handlers ---
  const handleRequestMentorClick = (mentor: MentorCard) => {
    setActiveMentorForRequest(mentor);
    setShowMentorRequestModal(true);
  };

  const confirmMentorRequest = async () => {
    if (!activeMentorForRequest) return;
    const name = activeMentorForRequest.name;
    setShowMentorRequestModal(false);
    setRequestStates(prev => ({ ...prev, [name]: 'loading' }));

    setTimeout(() => {
      const globalReq: GlobalMentorRequest = {
        id: `glb-${Date.now()}`,
        studentName: profile.name,
        studentId: profile.id || '261-16-010',
        dept: profile.department,
        type: 'Mentorship',
        title: 'Academic Mentor Request',
        topic: 'AI Guidance & Mentorship',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        comment: ''
      };
      addGlobalRequest(globalReq);
      setRequestStates(prev => ({ ...prev, [name]: 'success' }));
      addAssistantMessage(`Your mentorship request has been sent to ${name}. I will alert you once they respond.`);
    }, 1000);
  };

  const handleScheduleClick = (mentor: MentorCard) => {
    setActiveMentorForSchedule(mentor);
    setSelectedSlot('');
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    if (!activeMentorForSchedule || !selectedSlot) return;
    const name = activeMentorForSchedule.name;
    setShowScheduleModal(false);
    setScheduleStates(prev => ({ ...prev, [name]: 'loading' }));

    setTimeout(() => {
      const globalReq: GlobalMentorRequest = {
        id: `glb-${Date.now()}`,
        studentName: profile.name,
        studentId: profile.id || '261-16-010',
        dept: profile.department,
        type: 'AI Session',
        title: 'Counselling Session Scheduled',
        topic: selectedSlot,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        comment: ''
      };
      addGlobalRequest(globalReq);
      setScheduleStates(prev => ({ ...prev, [name]: selectedSlot }));
      addAssistantMessage(`Your counselling session with ${name} has been scheduled for ${selectedSlot}.`);
    }, 1000);
  };

  const handleActionCardClick = (card: ActionCard) => {
    const actId = card.actionId;
    setActionStates(prev => ({ ...prev, [actId]: 'loading' }));

    setTimeout(() => {
      setActionStates(prev => ({ ...prev, [actId]: 'success' }));
      if (actId === 'OPEN_LIBRARY') {
        setShowResourcesModal(true);
        addAssistantMessage(`I opened Database Systems practice resources for you. Start with SQL joins, normalization, and ER diagrams first.`);
      } else if (actId === 'ACTIVATE_STUDY_PLAN') {
        const newPlan: ActiveStudyPlan = {
          id: `plan-${Date.now()}`,
          title: 'Database Systems Recovery Plan',
          progress: 0,
          tasks: [
            { name: 'Review SQL Joins and create 10 queries', completed: false },
            { name: 'Understand 1NF, 2NF, 3NF with examples', completed: false },
            { name: 'Solve Midterm Fall 2025 question 3', completed: false },
          ]
        };
        setActiveStudyPlan(newPlan);
        addAssistantMessage(`Study plan activated! I will notify you daily to stay on track. You can monitor its progress on your Student Dashboard.`);
      } else if (actId === 'RESEARCH_ROADMAP') {
        addAssistantMessage(`I pulled up your active thesis manuscript roadmap. Track reviewer feedback in real-time.`);
      } else {
        addAssistantMessage(`Activated action: ${card.title}. Let's get to work!`);
      }
    }, 800);
  };

  const clearChat = () => {
    sessionStorage.removeItem('eduvision_advisor_messages');
    sessionStorage.removeItem('eduvision_advisor_history');
    sessionStorage.removeItem('eduvision_advisor_meta');
    setAiMeta(null);
    setMessages([{ role: 'assistant', content: `Chat cleared! Hi again, ${profile.name.split(' ')[0]}. What would you like help with?`, timestamp: new Date() }]);
    setGeminiHistory([]);
  };

  // Helper to render current mentor button state
  const renderRequestBtn = (mentor: MentorCard) => {
    const state = requestStates[mentor.name] || 'normal';
    if (state === 'loading') {
      return <button disabled style={{ flex: 1, padding: '8px', background: '#94A3B8', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Loader2 size={13} className="animate-spin" /> Sending...</button>;
    }
    if (state === 'success') {
      return <button disabled style={{ flex: 1, padding: '8px', background: '#10B981', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Check size={13} /> Request Sent</button>;
    }
    return <button onClick={() => handleRequestMentorClick(mentor)} style={{ flex: 1, padding: '8px', background: '#50B748', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>Request Mentor</button>;
  };

  const renderScheduleBtn = (mentor: MentorCard) => {
    const state = scheduleStates[mentor.name] || 'normal';
    if (state === 'loading') {
      return <button disabled style={{ flex: 1, padding: '8px', background: '#E2E8F0', color: '#64748B', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Loader2 size={13} className="animate-spin" /> Scheduling...</button>;
    }
    if (state !== 'normal' && state !== 'loading') {
      return <button disabled style={{ flex: 1, padding: '8px', background: '#EEF2F6', color: '#0F172A', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Check size={13} /> {state}</button>;
    }
    return <button onClick={() => handleScheduleClick(mentor)} style={{ flex: 1, padding: '8px', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}>Schedule</button>;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F5F7FA', position: 'relative' }}>

      {/* Blue Header */}
      <header style={{ height: 88, background: 'linear-gradient(90deg, #003B95 0%, #0047B3 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/diu_crest.png" alt="DIU" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>DIU AI Advisor</h1>
              <span style={{ color: '#50B748', fontSize: '1.1rem' }}>✔</span>
            </div>
            <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.85 }}>Your AI Academic Assistant — Powered by Gemini</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.9 }} suppressHydrationWarning>
            <Calendar size={18} />
            <div suppressHydrationWarning>
              <p style={{ fontSize: '0.7rem', margin: 0, opacity: 0.8 }}>{dateStr}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{timeStr}</p>
            </div>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', position: 'relative' }}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, background: '#EF4444', borderRadius: '50%', border: '2px solid #003B95' }} />
          </button>
          <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)' }}>
            <img src="/profile_joy.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

          {/* Watermark Logo */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/diu_crest.png)',
            backgroundSize: 'auto 60%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.04,
            zIndex: 0,
            pointerEvents: 'none'
          }} />

          {/* Status Bar */}
          <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #E5E7EB', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: aiMeta?.provider?.includes('fallback') ? '#EF4444' : '#50B748', fontSize: '1rem' }}>●</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                {aiMeta 
                  ? `Active Advisor (${aiMeta.provider}) · Latency: ${aiMeta.latencyMs}ms`
                  : 'Active Advisor · Profile-Aware · Session Memory Enabled'}
              </span>
            </div>
            <button onClick={clearChat} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 8, padding: '5px 12px', color: '#64748B', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Trash2 size={13} /> Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', border: '2px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,59,149,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src="/diu_crest.png" alt="DIU" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ maxWidth: msg.role === 'user' ? '65%' : '75%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: msg.role === 'user' ? '#1D4ED8' : '#FFFFFF', color: msg.role === 'user' ? 'white' : '#0F172A', borderRadius: 28, padding: '20px 24px', boxShadow: '0 8px 30px rgba(15,23,42,0.06)', border: msg.role === 'assistant' ? '1px solid #E5E7EB' : 'none', borderBottomRightRadius: msg.role === 'user' ? 6 : 28, borderBottomLeftRadius: msg.role === 'assistant' ? 6 : 28 }}>
                    {msg.isLoading ? (
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        {[0, 0.2, 0.4].map((d, di) => <div key={di} className="dot-blink" style={{ width: 7, height: 7, borderRadius: '50%', background: '#94A3B8', animationDelay: `${d}s` }} />)}
                      </div>
                    ) : <div>{formatText(msg.content)}</div>}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#94A3B8', paddingLeft: 4 }}>{msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>

                  {/* Mentor Card */}
                  {msg.mentorCard && !msg.isLoading && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderLeft: '4px solid #50B748', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', margin: '0 0 2px 0' }}>{msg.mentorCard.name} — {msg.mentorCard.department}</p>
                        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{msg.mentorCard.reason}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {renderRequestBtn(msg.mentorCard)}
                        {renderScheduleBtn(msg.mentorCard)}
                      </div>
                    </div>
                  )}
                  {/* Action Card */}
                  {msg.actionCard && !msg.isLoading && (
                    <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderLeft: '4px solid #1D4ED8', borderRadius: 16, padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', margin: '0 0 4px 0' }}>{msg.actionCard.title}</p>
                        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{msg.actionCard.description}</p>
                      </div>
                      {actionStates[msg.actionCard.actionId] === 'loading' ? (
                        <button disabled style={{ width: '100%', padding: '8px', background: '#E2E8F0', color: '#64748B', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Loader2 size={13} className="animate-spin" /> Activating...</button>
                      ) : actionStates[msg.actionCard.actionId] === 'success' ? (
                        <button disabled style={{ width: '100%', padding: '8px', background: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Check size={13} /> Completed</button>
                      ) : (
                        <button onClick={() => handleActionCardClick(msg.actionCard!)} style={{ width: '100%', padding: '8px', background: '#EAF3FF', color: '#1D4ED8', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#D2E4FF'} onMouseLeave={e => e.currentTarget.style.background = '#EAF3FF'}>{msg.actionCard.actionText}</button>
                      )}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #E5E7EB' }}>
                    <img src="/profile_joy.png" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Cards — only when 1 message */}
          {messages.length === 1 && (
            <div style={{ padding: '0 28px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flexShrink: 0, position: 'relative', zIndex: 1 }}>
              {PROMPTS.map(p => (
                <button key={p.label} onClick={() => sendMessage(p.label)} disabled={isLoading}
                  style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(5px)', border: '1px solid #DCE6F8', borderRadius: 18, padding: '14px 18px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#003B95'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = '#DCE6F8'; }}>
                  <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '16px 28px 20px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderTop: '1px solid #E5E7EB', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.9)', border: '2px solid #E2E8F0', borderRadius: 999, padding: '10px 10px 10px 22px', height: 76 }}>
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask me about your studies, skills, mentors, research..." disabled={isLoading}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#0F172A', background: 'transparent' }} />
              <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
                style={{ width: 58, height: 58, borderRadius: 999, background: '#003B95', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isLoading || !input.trim() ? 0.5 : 1, transition: 'all 0.2s' }}>
                <Send size={22} style={{ marginLeft: 2 }} />
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', margin: '10px 0 0 0' }}>AI can make mistakes. Verify important information.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="hide-scrollbar" style={{ width: 300, borderLeft: '1px solid #E5E7EB', overflowY: 'auto', background: '#F5F7FA', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>

          {/* Profile */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Your Profile</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#003B95', color: 'white', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {profile.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{profile.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{profile.department}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Semester {profile.semester}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'CGPA', val: profile.cgpa.toFixed(2), color: '#1D4ED8' },
                { label: 'Attendance', val: `${academicSummary.attendanceAvg}%`, color: '#F59E0B' },
                { label: 'Credits', val: `${academicSummary.creditsCompleted}/${academicSummary.creditsTotal}`, color: '#8B5CF6' },
                { label: 'Class Rank', val: `#${studentData.peers.rank}`, color: '#50B748' },
              ].map(s => (
                <div key={s.label} style={{ padding: '10px', background: '#F8FAFC', borderRadius: 12 }}>
                  <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '0 0 4px 0' }}>{s.label}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Risk */}
          {weakSubjects.length > 0 && (
            <div style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', padding: '20px' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>⚠️ Academic Risk</p>
              {weakSubjects.map(s => (
                <div key={s.code} style={{ background: '#FFF7F7', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 14px', marginBottom: 8 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>{s.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>Marks: <span style={{ color: '#EF4444' }}>{s.marks}%</span> · Attendance: <span style={{ color: s.attendance < 75 ? '#EF4444' : '#94A3B8' }}>{s.attendance}%</span></p>
                </div>
              ))}
              <Link href="/student/alerts" style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: '#003B95', textDecoration: 'none', marginTop: 4 }}>View All Academic Alerts →</Link>
            </div>
          )}

          {/* Quick Ask */}
          <div style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', padding: '20px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>Quick Ask</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK_ASK.map(q => (
                <button key={q.label} onClick={() => sendMessage(q.prompt)} disabled={isLoading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF4FF'; e.currentTarget.style.borderColor = '#003B95'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
                  <span>{q.icon} {q.label}</span><ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Action Modal: Request Mentor Confirm --- */}
      {showMentorRequestModal && activeMentorForRequest && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 440, padding: 32, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Send Mentorship Request</h3>
              <button onClick={() => setShowMentorRequestModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Do you want to send a mentorship request to <strong>{activeMentorForRequest.name}</strong>? They will receive your academic overview and profile logs.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setShowMentorRequestModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmMentorRequest} style={{ flex: 1, padding: '12px', background: '#50B748', border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Action Modal: Schedule Slot Picker --- */}
      {showScheduleModal && activeMentorForSchedule && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 440, padding: 32, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Schedule Counselling Session</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0 }}>
              Select an available time slot with <strong>{activeMentorForSchedule.name}</strong>:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Monday, 10:00 AM',
                'Tuesday, 2:00 PM',
                'Thursday, 4:00 PM'
              ].map(slot => (
                <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: selectedSlot === slot ? '#EEF4FF' : '#F8FAFC', border: selectedSlot === slot ? '2px solid #003B95' : '2px solid #E5E7EB', borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <input type="radio" name="slot" value={slot} checked={selectedSlot === slot} onChange={() => setSelectedSlot(slot)} style={{ display: 'none' }} />
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selectedSlot === slot ? '#003B95' : 'white', borderColor: selectedSlot === slot ? '#003B95' : '#94A3B8' }}>
                    {selectedSlot === slot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{slot}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setShowScheduleModal(false)} style={{ flex: 1, padding: '12px', background: '#F1F5F9', border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmSchedule} disabled={!selectedSlot} style={{ flex: 1, padding: '12px', background: '#003B95', border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: 'pointer', opacity: selectedSlot ? 1 : 0.5 }}>Confirm Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Action Modal: Practice Resources Dashboard --- */}
      {showResourcesModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 540, padding: 32, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BookOpen size={22} style={{ color: '#003B95' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Database Systems Practice Library</h3>
              </div>
              <button onClick={() => setShowResourcesModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            
            <div className="hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
              
              <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 12 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#003B95', margin: '0 0 6px 0' }}>📄 Class Notes & Tutorials</p>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  <li>Database Normalization (1NF, 2NF, 3NF, BCNF) Tutorial Guide</li>
                  <li>ER Diagram Modeling & Entity Attribute Relationships</li>
                  <li>SQL Joins cheat sheet (Inner, Left, Right, Full Outer)</li>
                </ul>
              </div>

              <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 12 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#003B95', margin: '0 0 6px 0' }}>📝 Practice Question Sets</p>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  <li>Normalization problem set (15 functional dependency schemas)</li>
                  <li>Interactive SQL join workbook challenges</li>
                  <li>Index execution planning exercises</li>
                </ul>
              </div>

              <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: 12 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#003B95', margin: '0 0 6px 0' }}>🎓 Past Exam Papers</p>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  <li>Daffodil Fall 2025 Midterm Exam Paper</li>
                  <li>Daffodil Summer 2025 Final Exam Paper</li>
                </ul>
              </div>

              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#003B95', margin: '0 0 6px 0' }}>✅ Revision Checklist</p>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  <li>Check dependencies for transitive normalization violations</li>
                  <li>Review optimization for multi-table queries</li>
                  <li>Validate primary key indexing rules</li>
                </ul>
              </div>

            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={() => setShowResourcesModal(false)} style={{ flex: 1, padding: '12px', background: '#003B95', border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 700, color: 'white', cursor: 'pointer' }}>Close Resources</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
