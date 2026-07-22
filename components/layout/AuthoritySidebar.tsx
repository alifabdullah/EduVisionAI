'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Building2, BarChart3, GraduationCap, Users,
  Bell, Bot, BookCheck, Target, FileBarChart, Settings, LogOut, ChevronDown, Shield
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard/authority', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/authority/departments', icon: Building2, label: 'Departments' },
  { href: '/authority/department-comparison', icon: BarChart3, label: 'Dept Comparison' },
  { href: '/authority/teachers', icon: GraduationCap, label: 'Teachers' },
  { href: '/authority/student-insights', icon: Users, label: 'Student Insights' },
  { href: '/authority/counseling-analytics', icon: FileBarChart, label: 'Counseling Analytics' },
  { href: '/authority/institutional-alerts', icon: Bell, label: 'Institutional Alerts' },
  { href: '/authority/ai-strategic-advisor', icon: Bot, label: 'Strategic Advisor' },
  { href: '/authority/course-health', icon: BookCheck, label: 'Course Health' },
  { href: '/authority/skill-overview', icon: Target, label: 'Skill Overview' },
  { href: '/authority/reports', icon: FileBarChart, label: 'Reports' },
  { href: '/authority/profile', icon: Settings, label: 'Profile' },
];

export default function AuthoritySidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useApp();
  const handleLogout = () => { logout(); router.push('/authority-access'); };

  const initials = user?.name
    .split(' ')
    .filter(n => n.length > 1 && !['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'].includes(n))
    .map(n => n[0])
    .join('')
    .slice(0, 2) || 'VC';

  return (
    <aside className="hide-scrollbar" style={{
      width: 270, minHeight: '100vh', background: '#FFFFFF',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      borderRight: 'none', boxShadow: '1px 0 10px rgba(0,0,0,0.02)'
    }}>

      {/* DIU Branding Header */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ background: '#003B95', color: 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/diu_crest.png" alt="DIU Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            Daffodil<br/>International<br/>University
          </h1>
        </div>
        {/* Authority accent strip */}
        <div style={{ background: '#F59E0B', color: '#78350F', padding: '6px 0', textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
          Authority Portal • Vice Chancellor
        </div>
      </div>

      <div style={{ padding: '0 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Profile Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 0', borderBottom: '1px solid #F1F5F9', marginBottom: 24 }}>
          {/* Avatar with gold ring */}
          <div style={{
            width: 72, height: 72, borderRadius: 999, overflow: 'hidden',
            flexShrink: 0, border: '3px solid #F59E0B',
            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: '#fff',
            position: 'relative'
          }}>
            {user?.avatar
              ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials
            }
            {/* Online indicator */}
            <span style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 14, height: 14, borderRadius: '50%',
              background: '#10B981', border: '2px solid #fff'
            }} />
          </div>
          {/* Info */}
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Vice Chancellor'}
            </p>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 8px 0' }}>Authority • CIS</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={12} color="#F59E0B" />
              <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 10px', borderRadius: 999, fontWeight: 700, fontSize: 11, display: 'inline-block' }}>
                Admin Access
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, padding: '0 8px' }}>
            Main Navigation
          </p>
          {navItems.map(item => {
            let itemHref = item.href;
            if (item.label === 'Dashboard') {
              if (user?.id === 'DEAN-001') itemHref = '/dashboard/authority/dean';
              else if (user?.id === 'HR-042') itemHref = '/dashboard/authority/hr';
              else if (user?.id === 'DH-007') itemHref = '/dashboard/authority/dept-head';
            }

            const isActive = pathname === itemHref;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.label}
                href={itemHref}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '11px 16px', borderRadius: 12,
                  textDecoration: 'none', fontWeight: 600, fontSize: '14px',
                  transition: 'all 0.2s',
                  background: isActive ? '#FEF3C7' : 'transparent',
                  color: isActive ? '#B45309' : '#64748B',
                  borderLeft: isActive ? '4px solid #F59E0B' : '4px solid transparent',
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#F8FAFC')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <IconComponent size={19} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.label === 'Institutional Alerts' && (
                  <span style={{ background: '#EF4444', color: '#FFF', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: 999 }}>4</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom DIU Card + Logout */}
      <div style={{ padding: '20px', marginTop: 'auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #003B95, #1D4ED8)', padding: '18px 20px', borderRadius: 18, color: 'white', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <img src="/diu_crest.png" alt="DIU" style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>DIU Authority</h4>
              <p style={{ fontSize: '11px', color: '#BAD4FF', margin: 0 }}>EduVision AI Platform</p>
            </div>
          </div>
          <p style={{ color: '#BAD4FF', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>
            Institutional intelligence at your fingertips.
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
