'use client';
import DeanSidebar from '@/components/layout/DeanSidebar';
import FloatingAIAdvisor from '@/components/ai/FloatingAIAdvisor';
import { useState } from 'react';

export default function DeanLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)', position: 'relative' }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          className="mobile-backdrop"
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ flexShrink: 0 }}>
        <DeanSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minWidth: 0 }}>
        <div className="mobile-topbar" style={{ display: 'none' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 10, background: '#DBEAFE',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/diu_crest.png" alt="DIU" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#003B95' }}>EduVision AI</span>
          </div>
        </div>
        {children}
      </div>
      <FloatingAIAdvisor role="authority" />
    </div>
  );
}
