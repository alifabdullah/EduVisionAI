'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useCounseling } from '@/context/CounselingContext';
import { 
  LayoutDashboard, BookOpen, Users, AlertTriangle, BarChart2, Bot, 
  Handshake, Target, Bell, User, CalendarCheck, Edit3, FileText, 
  DollarSign, CheckSquare, BookPlus, ClipboardList, Library, 
  Building, Briefcase, Key, Sparkles, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';

const existingItems = [
  { href: '/dashboard/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/teacher/courses', icon: BookOpen, label: 'Courses' },
  { href: '/teacher/students', icon: Users, label: 'Students' },
  { href: '/teacher/at-risk', icon: AlertTriangle, label: 'At-Risk' },
  { href: '/teacher/course-analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/teacher/ai-advisor', icon: Bot, label: 'AI Advisor' },
  { href: '/teacher/counseling', icon: ClipboardList, label: 'Counseling' },
  { href: '/teacher/mentorship', icon: Handshake, label: 'Mentorship' },
  { href: '/teacher/skill-gap', icon: Target, label: 'Skill Gap' },
  { href: '/teacher/alerts', icon: Bell, label: 'Alerts' },
  { href: '/teacher/profile', icon: User, label: 'Profile' },
];

const erpItems = [
  { href: '/teacher/attendance', icon: CalendarCheck, label: 'Attendance' },
  { href: '/teacher/marks-entry', icon: Edit3, label: 'Marks Entry' },
  { href: '/teacher/results', icon: FileText, label: 'Results' },
  { href: '/teacher/accounts-clearance', icon: DollarSign, label: 'Accounts Clearance' },
  { href: '/teacher/mentor-clearance', icon: CheckSquare, label: 'Mentor Clearance' },
  { href: '/teacher/course-registration', icon: BookPlus, label: 'Course Reg.' },
  { href: '/teacher/grade-sheet', icon: ClipboardList, label: 'Grade Sheet' },
  { href: '/teacher/library', icon: Library, label: 'Library Tracker' },
];


export default function TeacherSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useApp();
  const { getPendingCount } = useCounseling();
  
  const pendingRequests = getPendingCount('TCH-002');

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
        <div style={{ background: '#003B95', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>Daffodil<br/>International<br/>University</h1>
        </div>
        <div style={{ background: '#50B748', color: 'white', padding: '6px 0', textAlign: 'center', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>
          Knowledge • Innovation • Impact
        </div>
      </div>

      <div style={{ padding: '0 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 4. Teacher Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 0', borderBottom: '1px solid #F1F5F9', marginBottom: 24 }}>
          {/* Avatar */}
          <div style={{ width: 72, height: 72, borderRadius: 999, overflow: 'hidden', flexShrink: 0, border: '2px solid #EAF3FF' }}>
            <img src={user?.avatar || "/images/teachers/sarwar.png"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Info */}
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: '0 0 4px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'Faculty Member'}</p>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 8px 0' }}>Teacher • CIS</p>
            <span style={{ background: '#EAF8EA', color: '#50B748', padding: '6px 14px', borderRadius: 999, fontWeight: 600, fontSize: 12, display: 'inline-block' }}>Active</span>
          </div>
        </div>

        {/* 5 & 6. Main Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, padding: '0 8px' }}>Main Navigation</p>
          {existingItems.map(item => {
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
                {item.label === 'Alerts' && <span style={{ marginLeft: 'auto', background: '#EF4444', color: '#FFF', fontSize: '11px', padding: '2px 8px', borderRadius: 999 }}>3</span>}
                {item.label === 'Counseling' && pendingRequests > 0 && <span style={{ marginLeft: 'auto', background: '#F59E0B', color: '#FFF', fontSize: '11px', padding: '2px 8px', borderRadius: 999 }}>{pendingRequests}</span>}
              </Link>
            );
          })}
        </nav>

        {/* ERP Section */}
        <ERPSection pathname={pathname} />


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

function ERPSection({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const active = erpItems.some(i => pathname.startsWith(i.href));
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: active ? '#EAF3FF' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', borderLeft: active ? '4px solid #50B748' : '4px solid transparent' }}
        onMouseEnter={e => !active && (e.currentTarget.style.background = '#F8FAFC')}
        onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Building size={20} strokeWidth={active ? 2.5 : 2} color={active ? '#1D4ED8' : '#94A3B8'} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: active ? '#1D4ED8' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>ERP Modules</span>
        </div>
        <ChevronDown size={16} color={active ? '#1D4ED8' : '#94A3B8'} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4, paddingLeft: 16 }}>
          {erpItems.map(item => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 12,
                textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                background: isActive ? '#EAF8EA' : 'transparent',
                color: isActive ? '#166534' : '#64748B',
              }}
              onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}>
                <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}

