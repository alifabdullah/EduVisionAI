'use client';
import AuthoritySidebar from '@/components/layout/AuthoritySidebar';
import FloatingAIAdvisor from '@/components/ai/FloatingAIAdvisor';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthorityLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide the parent AuthoritySidebar on:
  // 1. The gateway page (no role selected yet)
  // 2. Dept-head routes (they use their own DeptHeadSidebar via nested layout)
  // 3. Dean routes (they use their own DeanSidebar via nested layout)
  // 4. HR routes (they use their own HRSidebar via nested layout)
  const isGatewayPage = pathname === '/dashboard/authority';
  const isDeptHeadPortal = pathname.startsWith('/dashboard/authority/dept-head');
  const isDeanPortal = pathname.startsWith('/dashboard/authority/dean');
  const isHrPortal = pathname.startsWith('/dashboard/authority/hr');
  const hideSidebar = isGatewayPage || isDeptHeadPortal || isDeanPortal || isHrPortal;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && !hideSidebar && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ flexShrink: 0 }}>
          <AuthoritySidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Mobile top bar */}
        {!hideSidebar && (
          <div className="mobile-topbar" style={{ display: 'none' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 10, background: '#FEF3C7',
                border: 'none', cursor: 'pointer', flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/diu_crest.png" alt="DIU" style={{ height: 32, objectFit: 'contain' }} />
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#003B95' }}>EduVision AI</span>
            </div>
          </div>
        )}

        {children}
      </div>
      <FloatingAIAdvisor role="authority" />
    </div>
  );
}
