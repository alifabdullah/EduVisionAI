'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useCounseling } from '@/context/CounselingContext';
import { LayoutDashboard, BookOpen, Target, Bot, Bell, BarChart2, Users, User, Calendar, MessageSquare, LogOut, ClipboardList } from 'lucide-react';

const navItems = [
  { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/academic', icon: BookOpen, label: 'Academic' },
  { href: '/student/skills', icon: Target, label: 'Skill Radar' },
  { href: '/student/ai-advisor', icon: Bot, label: 'AI Advisor' },
  { href: '/student/counseling', icon: ClipboardList, label: 'Counseling' },
  { href: '/student/alerts', icon: Bell, label: 'Alerts' },
  { href: '/student/mentor', icon: Users, label: 'Mentor' },
  { href: '/student/profile', icon: User, label: 'Profile' },
];

export default function StudentSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useApp();
  const { getStudentRequests } = useCounseling();
  const pendingCounseling = getStudentRequests('261-16-010').filter(r => r.status === 'Pending').length;

  const handleLogout = () => { logout(); router.push('/role-selection'); };

  return (
    <aside className="hide-scrollbar" style={{
      width: 270, minHeight: '100vh', background: '#FFFFFF',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      borderRight: 'none', boxShadow: '1px 0 10px rgba(0,0,0,0.02)'
    }}>
      
      {/* 1 & 2. DIU Branding Header */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Blue Header Area */}
        <div style={{ background: '#003B95', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>Daffodil<br/>International<br/>University</h1>
        </div>
        {/* Green Strip */}
        <div style={{ background: '#50B748', color: 'white', padding: '6px 0', textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>
          Knowledge • Innovation • Impact
        </div>
      </div>

      <div style={{ padding: '0 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 4. Student Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 0', borderBottom: '1px solid #F1F5F9', marginBottom: 24 }}>
          {/* Avatar */}
          <div style={{ width: 72, height: 72, borderRadius: 999, overflow: 'hidden', flexShrink: 0, border: '2px solid #EAF3FF' }}>
            <img src="/profile_joy.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Info */}
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 22, fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Joy Kumar'}</p>
            <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 8px 0' }}>Student • CIS</p>
            <span style={{ background: '#EAF8EA', color: '#50B748', padding: '6px 14px', borderRadius: 999, fontWeight: 600, fontSize: 12, display: 'inline-block' }}>Active</span>
          </div>
        </div>

        {/* 5 & 6. Main Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 32 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, padding: '0 8px' }}>Main Navigation</p>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12,
                textDecoration: 'none', fontWeight: 600, fontSize: '15px', transition: 'all 0.2s',
                background: isActive ? '#EAF3FF' : 'transparent',
                color: isActive ? '#1D4ED8' : '#64748B',
                borderLeft: isActive ? '4px solid #50B748' : '4px solid transparent',
              }}
              onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              onClick={onClose}
              >
                <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.label === 'Alerts' && <span style={{ marginLeft: 'auto', background: '#EF4444', color: '#FFF', fontSize: '11px', padding: '2px 8px', borderRadius: 999 }}>1</span>}
                {item.label === 'Counseling' && pendingCounseling > 0 && <span style={{ marginLeft: 'auto', background: '#F59E0B', color: '#FFF', fontSize: '11px', padding: '2px 8px', borderRadius: 999 }}>{pendingCounseling}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div style={{ marginBottom: 'auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, padding: '0 8px' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { router.push('/student/counseling/book'); onClose?.(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#EAF8EA', border: 'none', color: '#166534', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#d1f5ce')}
              onMouseLeave={e => (e.currentTarget.style.background = '#EAF8EA')}>
              <Calendar size={18} /> Book Counselling
            </button>
            <button onClick={() => { router.push('/student/ai-advisor'); onClose?.(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#F1F5F9', border: 'none', color: '#334155', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}>
              <MessageSquare size={18} /> Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* 8. Bottom DIU Card */}
      <div style={{ padding: '20px', marginTop: 'auto' }}>
        <div style={{ background: '#003B95', padding: '20px', borderRadius: 18, color: 'white', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }} />
            <h4 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>DIU</h4>
          </div>
          <p style={{ color: '#EAF3FF', fontSize: '13px', margin: 0, lineHeight: 1.4, opacity: 0.9 }}>
            Empowering Minds<br/>Transforming Lives
          </p>
        </div>
        
        {/* Logout */}
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 12, background: 'none', border: 'none', color: '#EF4444', fontSize: '15px', fontWeight: 700, cursor: 'pointer', width: '100%', justifyContent: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
          <LogOut size={18} strokeWidth={2.5} /> Logout
        </button>
      </div>
    </aside>
  );
}
