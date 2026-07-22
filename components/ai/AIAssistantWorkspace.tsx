'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Paperclip, Send, Info } from 'lucide-react';

export type Message = { role: 'user' | 'ai'; content: string; timestamp?: string };

function formatText(text: string): React.ReactNode[] {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return <li key={i} style={{ marginLeft: 16, marginBottom: 4, listStyleType: 'disc', lineHeight: 1.5, fontSize: '0.85rem' }} dangerouslySetInnerHTML={{ __html: bold.replace(/^[\s-•]*/, '') }} />;
    }
    return line.trim() ? <p key={i} style={{ marginBottom: 6, lineHeight: 1.5, fontSize: '0.85rem' }} dangerouslySetInnerHTML={{ __html: bold }} /> : <div key={i} style={{ height: 6 }} />;
  });
}

interface AIAssistantWorkspaceProps {
  title: string;
  roleTitle: string;
  subtitle: string;
  contextBanner: string;
  quickPrompts: string[];
  initialMessage: string;
  getAIResponse: (msg: string) => string | Promise<string>;
  badgeColor?: string;
}

export default function AIAssistantWorkspace({
  title, roleTitle, subtitle, contextBanner, quickPrompts, initialMessage, getAIResponse, badgeColor = '#F59E0B'
}: AIAssistantWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: initialMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (msg: string) => {
    if (!msg.trim() || loading) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: time }]);
    setInput('');
    setLoading(true);
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const response = await getAIResponse(msg);
    const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: aiTime }]);
    setLoading(false);
  };

  const THEME_BLUE = '#003B95';
  const USER_BLUE = '#1D4ED8';

  return (
    <div style={{ flex: 1, display: 'flex', gap: '1.5rem', padding: '1.5rem', overflow: 'hidden', height: '100%', background: '#F1F5F9' }}>
      {/* Left Panel: AI Information */}
      <div className="glass-card hide-scrollbar" style={{ width: '320px', display: 'flex', flexDirection: 'column', padding: '1.5rem', flexShrink: 0, overflowY: 'auto', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', background: THEME_BLUE, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem', boxShadow: '0 8px 24px rgba(0,59,149,0.25)'
          }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0F172A' }}>{title}</h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0' }}>{roleTitle}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '6px 12px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: badgeColor, boxShadow: `0 0 0 2px ${badgeColor}30` }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Online & Ready</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Suggestions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickPrompts.map((p, i) => (
              <button key={i} onClick={() => handleSend(p.replace(/^[^\s]+ /, ''))}
                style={{ 
                  textAlign: 'left', padding: '10px 14px', borderRadius: '12px', 
                  background: '#F8FAFC', border: '1px solid #E5E7EB', 
                  color: '#0F172A', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', gap: '10px' }}>
          <Info size={16} color="#64748B" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            {subtitle} <br/><br/>
            <strong>Context:</strong> {contextBanner}
          </p>
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#FFFFFF', borderRadius: 28, border: '1px solid #E5E7EB', boxShadow: '0 12px 40px rgba(15,23,42,0.05)' }}>
        
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
              <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '0.2px' }}>{title}</p>
              <p style={{ fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: badgeColor, fontSize: '14px', lineHeight: 1 }}>●</span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompts below header */}
        <div style={{ padding: '12px 24px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }} className="hide-scrollbar">
          {quickPrompts.map((p, i) => (
            <button key={i} onClick={() => handleSend(p.replace(/^[^\s]+ /, ''))} disabled={loading}
              style={{ padding: '8px 12px', background: '#F8FAFC', border: '1px solid #E5E7EB', color: '#0F172A', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#F1F5F9')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#F8FAFC')}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Conversation Area */}
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, background: '#F8FAFC' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src="/diu_crest.png" alt="DIU" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ maxWidth: msg.role === 'user' ? '75%' : '80%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ 
                    padding: '16px', 
                    borderRadius: '18px', 
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '18px',
                    background: msg.role === 'user' ? USER_BLUE : '#FFFFFF', 
                    color: msg.role === 'user' ? 'white' : '#0F172A', 
                    boxShadow: msg.role === 'ai' ? '0 2px 8px rgba(15,23,42,0.04)' : 'none',
                    fontSize: '0.9rem', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap', fontFamily: 'inherit'
                  }}>
                    {formatText(msg.content)}
                  </div>
                  {msg.timestamp && (
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px', padding: '0 4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src="/diu_crest.png" alt="DIU" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', display: 'flex', gap: '6px', alignItems: 'center', height: 24 }}>
                {[0, 0.2, 0.4].map((d, di) => <div key={di} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94A3B8', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: `${d}s` }} />)}
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 24px 24px', background: '#FFFFFF', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button style={{ padding: '12px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Paperclip size={20} />
            </button>
            <textarea 
              value={input} onChange={e => setInput(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input); } }}
              placeholder="Ask anything about your university..."
              style={{ flex: 1, padding: '14px 20px', border: '2px solid #E2E8F0', borderRadius: 999, background: 'white', color: '#0F172A', fontSize: '0.9rem', outline: 'none', resize: 'none', maxHeight: '120px', minHeight: '50px', lineHeight: 1.5 }} 
              rows={1}
            />
            <button style={{ padding: '12px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Mic size={20} />
            </button>
            <button onClick={() => handleSend(input)} disabled={loading || !input.trim()}
              style={{ 
                width: 52, height: 52, borderRadius: 999, background: THEME_BLUE, 
                color: '#fff', border: 'none', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (loading || !input.trim()) ? 0.5 : 1
              }}
              onMouseEnter={e => !loading && input.trim() && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => !loading && input.trim() && (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Send size={22} style={{ marginLeft: 2 }} />
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94A3B8', margin: '12px 0 0 0' }}>
            DIU AI Assistant can make mistakes. Consider verifying important information.
          </p>
        </div>
        <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
      </div>
    </div>
  );
}
