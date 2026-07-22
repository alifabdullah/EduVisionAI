'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export type Role = 'student' | 'teacher' | 'dean' | 'hr' | 'dept-head' | 'authority' | null;

interface User {
  name: string;
  email: string;
  role: Role;
  id: string;
  avatar?: string;
}

interface AppContextType {
  role: Role;
  user: User | null;
  isAuthenticated: boolean;
  setRole: (role: Role) => void;
  login: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Role-based auto-login profiles
const ROLE_PROFILES: Record<string, User> = {
  student: { name: 'Joy Kumar Yuv', email: 'joy.yuv@edu.ai', role: 'student', id: '261-16-010', avatar: '/profile_joy.png' },
  teacher: { name: 'Tamanna Akter', email: 'tamanna@daffodilvarsity.edu.bd', role: 'teacher', id: 'TCH-005', avatar: '/images/teachers/tamanna.png' },
  dean: { name: 'Prof. Dr. Md. Fokhray Hossain', email: 'dean@daffodilvarsity.edu.bd', role: 'dean', id: 'AUTH-DEAN', avatar: '/images/authority/dean_fokhray.png' },
  hr: { name: 'Ms. Nasrin Sultana', email: 'hr@daffodilvarsity.edu.bd', role: 'hr', id: 'AUTH-HR', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop' },
  'dept-head': { name: 'Mr. Md. Sarwar Hossain Mollah', email: 'headcis@daffodilvarsity.edu.bd', role: 'dept-head', id: 'TCH-002', avatar: '/images/teachers/sarwar.png' },
};

function detectRoleFromPath(pathname: string): User | null {
  if (pathname.startsWith('/student') || pathname.startsWith('/dashboard/student')) return ROLE_PROFILES.student;
  if (pathname.startsWith('/teacher') || pathname.startsWith('/dashboard/teacher')) return ROLE_PROFILES.teacher;
  if (pathname.startsWith('/dashboard/authority/dean')) return ROLE_PROFILES.dean;
  if (pathname.startsWith('/dashboard/authority/hr')) return ROLE_PROFILES.hr;
  if (pathname.startsWith('/dashboard/authority/dept-head')) return ROLE_PROFILES['dept-head'];
  return null;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('ev_role') as Role;
    const savedUser = localStorage.getItem('ev_user');
    if (savedRole) setRoleState(savedRole);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-login based on pathname
  useEffect(() => {
    if (!pathname) return;
    const detectedUser = detectRoleFromPath(pathname);
    if (detectedUser && (!user || user.role !== detectedUser.role)) {
      setUser(detectedUser);
      setRoleState(detectedUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('ev_user', JSON.stringify(detectedUser));
      localStorage.setItem('ev_role', detectedUser.role ?? '');
    }
  }, [pathname, user]);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (r) localStorage.setItem('ev_role', r);
  };

  const login = (u: User) => {
    setUser(u);
    setIsAuthenticated(true);
    setRoleState(u.role);
    localStorage.setItem('ev_user', JSON.stringify(u));
    localStorage.setItem('ev_role', u.role ?? '');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRoleState(null);
    localStorage.removeItem('ev_user');
    localStorage.removeItem('ev_role');
  };

  return (
    <AppContext.Provider value={{ role, user, isAuthenticated, setRole, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
