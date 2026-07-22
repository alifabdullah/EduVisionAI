'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import authorityData from '@/data/authority.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface GeminiHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

const QUICK_PROMPTS = [
  'Compare department performance',
  'Show institutional alerts',
  'Analyze teacher effectiveness',
  'Give strategic recommendations',
  'Generate executive summary',
  'Which departments need support?',
  'Analyze student population risk',
  'Research output analysis',
];

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

function getAuthorityFallback(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('department') || q.includes('comparison')) {
    return `**Department Performance Analysis:**\n\n- **CSE**: 85% performance, 88% attendance ✅ Top performer\n- **BBA**: 78% performance ✅ Stable\n- **EEE**: 62% performance ⚠️ Needs attention\n- **Law**: 58% performance 🔴 Critical\n\n**Recommendation:** Deploy emergency academic support to EEE and Law departments immediately.`;
  }
  if (q.includes('alert') || q.includes('risk')) {
    return `**Active High-Priority Alerts:**\n\n🔴 EEE attendance below 70% — immediate intervention required\n🟠 Research publication output declining this semester\n🟡 Student satisfaction scores below benchmark\n\n**Actions:** Schedule emergency review board meeting and deploy counselling resources.`;
  }
  if (q.includes('teacher') || q.includes('faculty')) {
    return `**Faculty Effectiveness Overview:**\n\n- Avg effectiveness: 78%\n- Top performer: Dr. Rahman (92%)\n- 3 teachers below 65% threshold — require review\n\n**Action:** Implement structured faculty development workshops this semester.`;
  }
  if (q.includes('suggest') || q.includes('strategy')) {
    return `**Top Strategic Recommendations:**\n\n1. 🔴 Launch Early Warning System → target 18% reduction in failures\n2. 🟠 Establish Industry Partnership Program → boost employment by 25%\n3. 💡 Digital Literacy Initiative across all departments\n4. 🔬 Research Excellence Center for publication growth\n\nWhich would you like a detailed action plan for?`;
  }
  if (q.includes('executive') || q.includes('report') || q.includes('summary')) {
    const { universityStats } = authorityData;
    return `**Executive Summary — Current Semester:**\n\n📊 **Key Metrics:**\n- Total Students: ${universityStats.totalStudents.toLocaleString()}\n- At-Risk: ${universityStats.atRiskPercentage}%\n- Avg GPA: ${universityStats.avgGPA}\n- Avg Attendance: ${universityStats.avgAttendance}%\n- Active Alerts: ${universityStats.activeAlerts}\n\n⚠️ **Critical Issues:** EEE and Law departments require immediate intervention.\n✅ **Positives:** CSE showing strong performance. Research pipeline growing.\n\n**Board Recommendation:** Allocate additional resources to underperforming departments.`;
  }
  return `I'm your EduVision AI Strategic Advisor! Ask me about:\n\n- 🏛️ Department comparisons\n- ⚠️ Risk alerts\n- 👨‍🏫 Teacher effectiveness\n- 📋 Strategic recommendations\n- 📊 Executive reports`;
}

export default function AIStrategicAdvisorPage() {
  const { profile, universityStats, institutionalAlerts, strategicSuggestions } = authorityData;
  const highAlerts = institutionalAlerts.filter((a: any) => a.priority === 'high').length;

  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Good day! 🏛️ I'm your EduVision AI Strategic Advisor.\n\nI've analyzed your institutional data — **${universityStats.totalStudents.toLocaleString()} students** across **${universityStats.totalDepartments} departments**. Currently **${universityStats.atRiskPercentage}% of students are at-risk** and there are **${universityStats.activeAlerts} active institutional alerts** requiring strategic attention.\n\nHow can I assist your decision-making today?`,
    timestamp: new Date(),
  }]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiHistory, setGeminiHistory] = useState<GeminiHistoryEntry[]>([]);
  const [prompts, setPrompts] = useState(QUICK_PROMPTS.slice(0, 6));

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    setMessages(prev => [...prev,
      { role: 'user', content: text, timestamp: new Date() },
      { role: 'assistant', content: '', timestamp: new Date(), isLoading: true }
    ]);
    setInput('');
    setIsLoading(true);

    const updatedHistory: GeminiHistoryEntry[] = [...geminiHistory, { role: 'user', parts: [{ text }] }];

    try {
      let assistantText = '';
      try {
        const res = await fetch('/api/ai/authority-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: geminiHistory }),
        });
        if (res.ok) {
          const data = await res.json() as { text: string; error?: string };
          if (data.error) throw new Error(data.error);
          assistantText = data.text;
        } else throw new Error('API down');
      } catch {
        assistantText = getAuthorityFallback(text);
      }

      assistantText = assistantText || 'Sorry, please try again.';
      setGeminiHistory([...updatedHistory, { role: 'model', parts: [{ text: assistantText }] }]);

      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: assistantText, timestamp: new Date() };
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
  }, [isLoading, geminiHistory]);

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Chat cleared. How can I assist your strategic planning today?`,
      timestamp: new Date(),
    }]);
    setGeminiHistory([]);
    setPrompts(QUICK_PROMPTS.slice(0, 6));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopNavbar title="AI Strategic Advisor" subtitle="Executive-level AI intelligence — institutional decision support" accentColor="#F59E0B" />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT: Chat ─────────────────────────────────── */}
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

          {/* Toolbar */}
          <div style={{ padding: '8px 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(245,158,11,0.03)', flexShrink: 0, position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 }}>Gemini 2.5 Flash · Institutional-Context Aware · Session Memory Active</span>
            </div>
            <button onClick={clearChat} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>🗑 Clear Chat</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: '#FFFFFF', border: '1px solid #E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.15)'
                  }}>
                    <img src="/diu_crest.png" alt="DIU" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ maxWidth: msg.role === 'user' ? '72%' : '78%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    padding: '12px 16px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--surface-2)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    fontSize: '0.85rem',
                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(245,158,11,0.25)' : 'none'
                  }}>
                    {msg.isLoading
                      ? <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
                          {[0, 0.2, 0.4].map((delay, di) => (
                            <div key={di} className="dot-blink" style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', animationDelay: `${delay}s` }} />
                          ))}
                        </div>
                      : <div>{formatText(msg.content)}</div>
                    }
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--muted)', paddingLeft: 4, paddingRight: 4 }}>{timeLabel(msg.timestamp)}</p>
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #F59E0B, #6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>
                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '8px 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, position: 'relative', zIndex: 1, backdropFilter: 'blur(10px)' }} className="hide-scrollbar">
            {prompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} disabled={isLoading}
                style={{ padding: '6px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', borderRadius: 20, fontSize: '0.74rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', flexShrink: 0, transition: 'all 0.2s', opacity: isLoading ? 0.5 : 1 }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.background = 'rgba(245,158,11,0.16)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.08)')}
              >{p}</button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '12px 1.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about departments, alerts, faculty performance, strategic planning..."
              disabled={isLoading}
              style={{ flex: 1, padding: '11px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s', opacity: isLoading ? 0.7 : 1 }}
              onFocus={e => e.target.style.borderColor = '#F59E0B'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()}
              style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: isLoading || !input.trim() ? 'var(--surface-2)' : 'linear-gradient(135deg, #F59E0B, #EF4444)', color: isLoading || !input.trim() ? 'var(--muted)' : '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '1.1rem', transition: 'all 0.2s', boxShadow: !isLoading && input.trim() ? '0 4px 16px rgba(245,158,11,0.3)' : 'none' }}>
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ──────────────────────────────── */}
        <div style={{ width: 260, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', borderLeft: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', flexShrink: 0 }}>

          {/* Institution Snapshot */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Institution Overview</p>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '0.82rem', fontWeight: 700 }}>{profile.institution}</p>
              <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{profile.name} · {profile.role}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { label: 'Students', val: universityStats.totalStudents.toLocaleString(), color: '#F59E0B' },
                { label: 'At-Risk', val: `${universityStats.atRiskPercentage}%`, color: '#F43F5E' },
                { label: 'Avg GPA', val: universityStats.avgGPA.toFixed(1), color: '#10B981' },
                { label: 'Alerts', val: universityStats.activeAlerts, color: '#F43F5E' },
              ].map(s => (
                <div key={s.label} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{s.label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 800, color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* High-priority alerts */}
          {highAlerts > 0 && (
            <div className="glass-card" style={{ padding: '1rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>🔴 High Priority Alerts</p>
              {institutionalAlerts.filter((a: any) => a.priority === 'high').slice(0, 3).map((a: any) => (
                <button key={a.id} onClick={() => sendMessage(`Analyze this alert and suggest action: ${a.title} in ${a.dept}`)} disabled={isLoading}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 6, padding: '8px 10px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F43F5E', marginBottom: 2 }}>{a.title}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{a.dept}</p>
                </button>
              ))}
            </div>
          )}

          {/* Strategic Suggestions */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Strategic Quick Ask</p>
            {[
              { label: '📊 Full Dept Analysis', prompt: 'Give me a full analysis of all departments and which need immediate attention.' },
              { label: '👨‍🏫 Faculty Review', prompt: 'Analyze teacher effectiveness across departments and suggest improvements.' },
              { label: '🎯 Skill Gaps', prompt: 'What are the biggest skill gaps across the institution?' },
              { label: '📋 Executive Brief', prompt: 'Generate a board-ready executive summary of institutional performance.' },
              { label: '🔬 Research Output', prompt: 'Analyze research publication trends and suggest ways to improve output.' },
            ].map(q => (
              <button key={q.label} onClick={() => sendMessage(q.prompt)} disabled={isLoading}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 6, padding: '7px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: '0.76rem', fontWeight: 500, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => !isLoading && (e.currentTarget.style.color = 'var(--text)', e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)', e.currentTarget.style.borderColor = 'var(--border)')}
              >{q.label}</button>
            ))}
          </div>

          {/* Top Strategies */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Top Strategies</p>
            {strategicSuggestions.slice(0, 3).map((s: any) => (
              <button key={s.id} onClick={() => sendMessage(`Tell me more about this strategic recommendation: ${s.suggestion}`)} disabled={isLoading}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 6, padding: '8px 10px', background: 'rgba(245,158,11,0.05)', border: `1px solid ${s.priority === 'high' ? 'rgba(244,63,94,0.25)' : 'rgba(245,158,11,0.2)'}`, borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>{s.suggestion.slice(0, 60)}...</p>
                <p style={{ fontSize: '0.65rem', color: '#F59E0B' }}>Impact: {s.impact}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
