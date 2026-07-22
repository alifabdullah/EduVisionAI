'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck,
  FileBarChart, ClipboardList, Heart, BarChart3, FileText,
  Bot, Settings, LogOut, Shield, BrainCircuit
} from 'lucide-react';

const navItems = [
  { href: '/dashboard/authority/dept-head', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/dashboard/authority/dept-head/students', icon: GraduationCap, label: 'Students' },
  { href: '/dashboard/authority/dept-head/teachers', icon: Users, label: 'Teachers' },
  { href: '/dashboard/authority/dept-head/courses', icon: BookOpen, label: 'Courses' },
  { href: '/dashboard/authority/dept-head/attendance', icon: CalendarCheck, label: 'Attendance' },
  { href: '/dashboard/authority/dept-head/results', icon: FileBarChart, label: 'Results' },
  { href: '/dashboard/authority/dept-head/registration', icon: ClipboardList, label: 'Course Registration' },
  { href: '/dashboard/authority/dept-head/mentorship', icon: Heart, label: 'Mentorship' },
  { href: '/dashboard/authority/dept-head/analytics', icon: BarChart3, label: 'Academic Analytics' },
  { href: '/dashboard/authority/dept-head/reports', icon: FileText, label: 'Reports Center' },
  { href: '/dashboard/authority/dept-head/ai-monitoring', icon: BrainCircuit, label: 'AI Monitoring & Alerts', badge: 'AI' },
  { href: '/dashboard/authority/dept-head/ai-assistant', icon: Bot, label: 'AI Dept. Assistant', badge: 'AI' },
  { href: '/dashboard/authority/dept-head/profile', icon: Settings, label: 'Profile & Settings' },
];

export default function DeptHeadSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useApp();
  const handleLogout = () => { logout(); router.push('/authority-access'); };

  const initials = user?.name
    ?.split(' ')
    .filter(n => n.length > 1 && !['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'].includes(n))
    .map(n => n[0])
    .join('')
    .slice(0, 2) || 'DH';

  const accent = '#10B981';
  const accentLight = '#D1FAE5';
  const accentDark = '#065F46';

  return (
    <aside className="hide-scrollbar" style={{
      width: 270, minHeight: '100vh', background: '#FFFFFF',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      boxShadow: '1px 0 10px rgba(0,0,0,0.04)'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ background: '#003B95', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            Daffodil<br/>International<br/>University
          </h1>
        </div>
        <div style={{ background: accent, color: '#fff', padding: '6px 0', textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
          Department Head Portal
        </div>
      </div>

      <div style={{ padding: '0 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 0', borderBottom: '1px solid #F1F5F9', marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 999, overflow: 'hidden',
            flexShrink: 0, border: `3px solid ${accent}`,
            background: 'linear-gradient(135deg, #10B981, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: '#fff', position: 'relative'
          }}>
            {user?.avatar
              ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials
            }
            <span style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: '50%',
              background: '#10B981', border: '2px solid #fff'
            }} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Dr. Emily Carter'}
            </p>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 8px 0' }}>HoD • CSE</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} color={accent} />
              <span style={{ background: accentLight, color: accentDark, padding: '3px 10px', borderRadius: 999, fontWeight: 700, fontSize: 11, display: 'inline-block' }}>
                Dept. Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, padding: '0 8px' }}>
            Navigation
          </p>
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '11px 16px', borderRadius: 12,
                  textDecoration: 'none', fontWeight: 600, fontSize: '14px',
                  transition: 'all 0.2s',
                  background: isActive ? accentLight : 'transparent',
                  color: isActive ? accentDark : '#64748B',
                  borderLeft: isActive ? `4px solid ${accent}` : '4px solid transparent',
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <IconComponent size={19} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: accent, color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: 999 }}>{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Card + Logout */}
      <div style={{ padding: '20px', marginTop: 'auto' }}>
        <div style={{ background: `linear-gradient(135deg, #065F46, #10B981)`, padding: '18px 20px', borderRadius: 18, color: 'white', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <img src="/diu_crest.png" alt="DIU" style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>DIU Dept. Head</h4>
              <p style={{ fontSize: '11px', color: '#A7F3D0', margin: 0 }}>EduVision AI Platform</p>
            </div>
          </div>
          <p style={{ color: '#A7F3D0', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            Full departmental control at your command.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
            borderRadius: 12, background: 'none', border: 'none',
            color: '#EF4444', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', width: '100%', justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <LogOut size={18} strokeWidth={2.5} /> Logout
        </button>
      </div>
    </aside>
  );
}
