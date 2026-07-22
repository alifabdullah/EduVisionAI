'use client';
import { useState, useMemo } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell
} from 'recharts';
import { 
  BarChart2, Target, Shield, Crown, Calendar, Trophy, FileText, Link as LinkIcon, Bot, 
  Clock, CheckCircle, GraduationCap, Laptop, Microscope, Palette, Briefcase, Plus,
  Globe, Lock, Check, Edit, Eye, MapPin, Mail, Image as ImageIcon
} from 'lucide-react';

// TS Type Definitions for Unified System
interface SkillItem {
  id: string;
  category: 'academic' | 'programming' | 'research' | 'leadership' | 'contest' | 'creative' | 'professional';
  name: string;
  baseLevel: number; // The static level
  verification: 'Self Added' | 'Pending Verification' | 'Verified by Club' | 'Rejected';
  verifiedBy?: string;
  evidence?: string;
}

interface ClubItem {
  id: string;
  name: string;
  role: string;
  verification: 'Self Added' | 'Pending Verification' | 'Verified by Club' | 'Rejected';
  verifiedBy?: string;
  eventsCount: number;
  volunteerHours: number;
  skillsDeveloped: string[];
  joinDate: string;
  lastActive: string;
  category: string;
  description: string;
}

interface EventItem {
  id: string;
  name: string;
  organizer: string;
  role: 'Participant' | 'Volunteer' | 'Coordinator' | 'Host' | 'Speaker' | 'Lead Coordinator';
  eventType: 'Workshop' | 'Seminar' | 'Competition' | 'Volunteer Program' | 'Hackathon' | 'Cultural Event' | 'Sports' | 'Bootcamp' | 'Tech Fest';
  date: string;
  verification: 'Self Added' | 'Pending Verification' | 'Verified by Club' | 'Rejected';
  proofUrl?: string;
  certificateUrl?: string;
  hoursAdded?: number;
}

interface LeadershipItem {
  club: string;
  role: string;
  duration: string;
  status: 'Active' | 'Previous';
  gainedBoost: string;
}

interface AchievementItem {
  id: string;
  title: string;
  event: string;
  organization: string;
  award: string;
  date: string;
  proofUrl?: string;
  mediaUrl?: string;
  description: string;
  verification: 'Self Added' | 'Pending Verification' | 'Verified by Club' | 'Rejected';
}

interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  proofUrl?: string;
  verification: 'Self Added' | 'Pending Verification' | 'Verified by Club' | 'Rejected';
  verifiedBy?: string;
}

interface ContributionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl?: string;
  proofUrl?: string;
  relatedEvent?: string;
}

interface MediaItem {
  id: string;
  url: string;
  title: string;
  category: 'posters' | 'photos' | 'certs' | 'designs';
}

export default function UnifiedPortfolioPage() {
  // 1. NAVIGATION STATES
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'clubs' | 'leadership' | 'events' | 'achievements' | 'certificates' | 'evidence' | 'ai'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [publicShowcaseMode, setPublicShowcaseMode] = useState<boolean>(false);
  const [selectedClub, setSelectedClub] = useState<ClubItem | null>(null);
  const [selectedClubSubTab, setSelectedClubSubTab] = useState<'overview' | 'events' | 'contributions' | 'skills' | 'evidence' | 'achievements'>('overview');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'all' | 'posters' | 'photos' | 'certs' | 'designs'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState<boolean>(false);

  // 2. MODAL TOGGLE STATES
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAchModal, setShowAchModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  // 3. CORE STATE COLLECTIONS (CRUD-SUPPORTED)
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: 'sk-1', category: 'academic', name: 'Data Structures', baseLevel: 85, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter', evidence: 'https://github.com/joy/eduvision' },
    { id: 'sk-2', category: 'academic', name: 'Database Systems', baseLevel: 78, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter', evidence: 'https://github.com/joy/smart-library' },
    { id: 'sk-3', category: 'academic', name: 'Operating Systems', baseLevel: 60, verification: 'Pending Verification', evidence: 'https://github.com/joy/os-scheduler' },
    { id: 'sk-4', category: 'academic', name: 'Computer Networks', baseLevel: 82, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter' },
    
    { id: 'sk-5', category: 'programming', name: 'React / Next.js', baseLevel: 90, verification: 'Self Added', evidence: 'https://joysarkar.netlify.app/' },
    { id: 'sk-6', category: 'programming', name: 'Python & Django', baseLevel: 80, verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan', evidence: 'https://github.com/joy/eduvision' },
    { id: 'sk-7', category: 'programming', name: 'TypeScript', baseLevel: 85, verification: 'Self Added' },
    { id: 'sk-8', category: 'programming', name: 'PostgreSQL', baseLevel: 75, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter' },

    { id: 'sk-9', category: 'research', name: 'Literature Review', baseLevel: 70, verification: 'Self Added' },
    { id: 'sk-10', category: 'research', name: 'Academic Writing', baseLevel: 80, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter', evidence: 'https://eduvision.demo.app/docs/report.pdf' },
    { id: 'sk-11', category: 'research', name: 'Data Analysis', baseLevel: 75, verification: 'Pending Verification', evidence: 'https://github.com/joy/academic-analytics' },

    { id: 'sk-12', category: 'leadership', name: 'Public Speaking', baseLevel: 65, verification: 'Self Added' },
    { id: 'sk-13', category: 'leadership', name: 'Team Coordination', baseLevel: 85, verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan' },
    { id: 'sk-14', category: 'leadership', name: 'Teamwork', baseLevel: 85, verification: 'Verified by Club', verifiedBy: 'Tamanna Akter' },
    
    { id: 'sk-15', category: 'contest', name: 'Competitive Coding', baseLevel: 78, verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan', evidence: 'https://codeforces.com/profile/joy_yuv' },
    { id: 'sk-16', category: 'creative', name: 'Graphic Design', baseLevel: 72, verification: 'Verified by Club', verifiedBy: 'Photography Club President' },
    { id: 'sk-17', category: 'creative', name: 'Photography & Editing', baseLevel: 88, verification: 'Verified by Club', verifiedBy: 'Photography Club President', evidence: 'https://joysarkar.netlify.app/' },
    { id: 'sk-18', category: 'professional', name: 'Event Management', baseLevel: 82, verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan' },
  ]);

  const [clubs, setClubs] = useState<ClubItem[]>([
    { id: 'cl-1', name: 'AIRIS', role: 'Lead Developer', verification: 'Verified by Club', verifiedBy: 'Tamanna Akter', eventsCount: 8, volunteerHours: 24, skillsDeveloped: ['Web Development', 'Machine Learning', 'Leadership'], joinDate: '2025-01-10', lastActive: '2026-05-20', category: 'Technical Research', description: 'Artificial Intelligence & Robotics Innovative Society focuses on state-of-the-art educational tech and robotics development projects.' },
    { id: 'cl-2', name: 'Robotics Club', role: 'Event Coordinator', verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan', eventsCount: 5, volunteerHours: 12, skillsDeveloped: ['Teamwork', 'Problem Solving', 'Embedded Systems'], joinDate: '2025-09-15', lastActive: '2026-03-10', category: 'Hardware/IoT', description: 'Collaborates on microcontroller designs, autonomous drone setups, and organizes national Tech Fests.' },
    { id: 'cl-3', name: 'Programming Contest Team', role: 'Competitive Programmer', verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan', eventsCount: 6, volunteerHours: 0, skillsDeveloped: ['Algorithms', 'Critical Thinking', 'Problem Solving'], joinDate: '2025-06-01', lastActive: '2025-12-05', category: 'Competitive Coding', description: 'Prepares elite computer science students for regional ACM ICPC contests and online codeforces rounds.' },
    { id: 'cl-4', name: 'Photography Club', role: 'Secretary', verification: 'Verified by Club', verifiedBy: 'Club President', eventsCount: 12, volunteerHours: 20, skillsDeveloped: ['Event Management', 'Visual Branding', 'Leadership', 'Graphic Design'], joinDate: '2026-01-05', lastActive: '2026-05-18', category: 'Creative/Arts', description: 'Curates institutional campus events, organizes annual photos exhibitions, and designs media promotions.' },
    { id: 'cl-5', name: 'Debate Club', role: 'Member', verification: 'Pending Verification', eventsCount: 3, volunteerHours: 5, skillsDeveloped: ['Public Speaking', 'Critical Thinking', 'Communication'], joinDate: '2026-02-12', lastActive: '2026-05-10', category: 'Public Speaking', description: 'Trains and represents the university in national parliamentary and bilingual style debate competitions.' },
    { id: 'cl-6', name: 'Volunteer Club', role: 'Coordinator', verification: 'Verified by Club', verifiedBy: 'Community Service Dean', eventsCount: 10, volunteerHours: 30, skillsDeveloped: ['Team Coordination', 'Event Management', 'Public Speaking'], joinDate: '2025-03-20', lastActive: '2026-04-18', category: 'Social Service', description: 'Spurs campus environmental drives, food distributions, and volunteer blood donation campaigns.' },
  ]);

  const [events, setEvents] = useState<EventItem[]>([
    { id: 'ev-1', name: 'Tech Fest 2026', organizer: 'Robotics Club', role: 'Lead Coordinator', eventType: 'Tech Fest', verification: 'Verified by Club', date: '2026-03-10', proofUrl: 'https://github.com/joy/techfest', hoursAdded: 12 },
    { id: 'ev-2', name: 'AI Summit 2026', organizer: 'AIRIS', role: 'Host', eventType: 'Seminar', verification: 'Verified by Club', date: '2026-04-15', proofUrl: 'https://joysarkar.netlify.app/', hoursAdded: 6 },
    { id: 'ev-3', name: 'Winter Coding Bootcamp', organizer: 'Programming Contest Team', role: 'Speaker', eventType: 'Bootcamp', verification: 'Verified by Club', date: '2026-01-15', proofUrl: 'https://github.com/joy/bootcamp', hoursAdded: 8 },
    { id: 'ev-4', name: 'Flood Relief Volunteer Drive', organizer: 'Volunteer Club', role: 'Coordinator', eventType: 'Volunteer Program', verification: 'Verified by Club', date: '2025-11-20', proofUrl: 'https://joysarkar.netlify.app/', hoursAdded: 15 },
    { id: 'ev-5', name: 'National Hackathon 2025', organizer: 'ICT Division', role: 'Participant', eventType: 'Hackathon', verification: 'Verified by Club', date: '2025-10-15', proofUrl: 'https://github.com/joy/eduvision', hoursAdded: 10 },
    { id: 'ev-6', name: 'Bilingual Debate Championship', organizer: 'Debate Club', role: 'Speaker', eventType: 'Competition', verification: 'Pending Verification', date: '2026-05-10', proofUrl: 'https://joysarkar.netlify.app/', hoursAdded: 4 },
  ]);

  const [achievements, setAchievements] = useState<AchievementItem[]>([
    { id: 'ach-1', title: 'National Hackathon Winner', event: 'National Hackathon 2025', organization: 'ICT Division', award: 'Winner (Best AI Track)', date: '2025-10-15', proofUrl: 'https://github.com/joy/eduvision', description: 'Won top laurels for architecting an intelligent student risk analyzer and early dashboard framework.', verification: 'Verified by Club' },
    { id: 'ach-2', title: 'ACM ICPC 18th Place Medalist', event: 'Dhaka Regional Contest', organization: 'BUBT / ICPC Foundation', award: 'Rank 18th in regional finals', date: '2025-12-05', proofUrl: 'https://icpc.global', description: 'Competed with over 150 elite regional coding teams, resolving 6 complex algorithmic structures.', verification: 'Verified by Club' },
    { id: 'ach-3', title: 'Featured Photographer Merit', event: 'Campus Life Visual Exhibition', organization: 'Photography Club', award: 'Winner (Excellence in Visuals)', date: '2026-03-01', description: 'Earned public display honors for a conceptual landscape series displaying rural campus shadows.', verification: 'Verified by Club' },
    { id: 'ach-4', title: 'Social Service Excellence Medal', event: 'Annual Welfare Gala', organization: 'Volunteer Club', award: 'Community Service Excellence Medal', date: '2025-12-20', description: 'Awarded for contributing 30+ cumulative active hours in environmental and blood donation campaigns.', verification: 'Verified by Club' },
  ]);

  const [certificates, setCertificates] = useState<CertificateItem[]>([
    { id: 'crt-1', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2026-02-15', credentialId: 'AWS-990822', proofUrl: 'https://aws.amazon.com', verification: 'Verified by Club', verifiedBy: 'Prof. Rashid Khan' },
    { id: 'crt-2', title: 'Deep Learning Specialization', issuer: 'Coursera / DeepLearning.AI', date: '2025-11-20', credentialId: 'COURSERA-DL-982', proofUrl: 'https://coursera.org', verification: 'Verified by Club', verifiedBy: 'Tamanna Akter' },
    { id: 'crt-3', title: 'Cisco Certified Network Associate', issuer: 'Cisco Networking Academy', date: '2025-08-10', credentialId: 'CS-552192', proofUrl: 'https://netacad.com', verification: 'Self Added' },
  ]);

  const [contributions, setContributions] = useState<ContributionItem[]>([
    { id: 'cnt-1', title: 'EduVision Portal Web Engine', category: 'Web Development', description: 'Designed, integrated, and deployed the full React Next.js user workspace dashboard on Netlify.', proofUrl: 'https://joysarkar.netlify.app/' },
    { id: 'cnt-2', title: 'Annual Tech Fest Banners', category: 'Graphic Design', description: 'Styled all institutional branding assets, flyers, mockups, and promotional banners.', proofUrl: 'https://github.com/joy/techfest' },
    { id: 'cnt-3', title: 'AI Summit Video Digest', category: 'Media Production', description: 'Filmed, color-graded, and produced a 3-minute professional promotional video recap.', proofUrl: 'https://joysarkar.netlify.app/' },
    { id: 'cnt-4', title: 'Charity Relief Mobilization', category: 'Volunteer Support', description: 'Organized and coordinated a team of 25 volunteers raising 100k BDT for regional disaster relief.', proofUrl: 'https://joysarkar.netlify.app/' },
  ]);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: 'med-1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60', title: 'Tech Fest Stage Opening', category: 'photos' },
    { id: 'med-2', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60', title: 'EduVision Code Workspace', category: 'designs' },
    { id: 'med-3', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60', title: 'Volunteer Group Photo', category: 'photos' },
    { id: 'med-4', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60', title: 'AWS Completion Certificate', category: 'certs' },
    { id: 'med-5', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60', title: 'Tech Fest Branding Poster', category: 'posters' },
    { id: 'med-6', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60', title: 'Robotics Design Mockup', category: 'designs' }
  ]);

  // 4. FORM TRANSACTION STATES
  const [newSkill, setNewSkill] = useState({ name: '', category: 'academic' as const, level: 80, supervisor: '', evidence: '' });
  const [newClub, setNewClub] = useState({ name: '', role: '', category: 'Technical', joinDate: '', description: '', moderator: '' });
  const [newEvent, setNewEvent] = useState({ name: '', organizer: '', role: 'Participant' as const, eventType: 'Workshop' as const, date: '', proofUrl: '', hours: 5 });
  const [newAch, setNewAch] = useState({ title: '', event: '', organization: '', award: '', date: '', proofUrl: '', description: '', supervisor: '' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', credentialId: '', proofUrl: '', supervisor: '' });
  const [newEvidence, setNewEvidence] = useState({ title: '', category: 'Web Development', description: '', proofUrl: '', relatedEvent: '' });

  // 5. AUTO-CALC DYNAMIC SKILL BOOSTERS (DYNAMIC SKILL MAPPING IMPROVEMENT)
  // Auto-calculates booster percentages added to static skills based on student events and contributions
  const skillBoosts = useMemo(() => {
    const boosts: Record<string, number> = {
      'Academic Skills': 0,
      'Programming & Development': 0,
      'Research Skills': 0,
      'Leadership Skills': 0,
      'Contest Skills': 0,
      'Creative Skills': 0,
      'Professional Skills': 0,
    };

    // Calculate boosts from Events
    events.forEach(e => {
      if (e.verification !== 'Rejected') {
        if (e.eventType === 'Hackathon') {
          boosts['Contest Skills'] += 5;
          boosts['Programming & Development'] += 3;
        }
        if (e.eventType === 'Tech Fest' || e.eventType === 'Bootcamp') {
          boosts['Professional Skills'] += 4;
          if (e.role === 'Lead Coordinator' || e.role === 'Coordinator') {
            boosts['Leadership Skills'] += 6;
          }
        }
        if (e.eventType === 'Volunteer Program') {
          boosts['Leadership Skills'] += 3;
          boosts['Professional Skills'] += 2;
        }
        if (e.eventType === 'Seminar') {
          boosts['Research Skills'] += 2;
        }
      }
    });

    // Calculate boosts from Contributions
    contributions.forEach(c => {
      if (c.category === 'Web Development') {
        boosts['Programming & Development'] += 5;
      }
      if (c.category === 'Graphic Design') {
        boosts['Creative Skills'] += 5;
      }
      if (c.category === 'Media Production') {
        boosts['Creative Skills'] += 3;
        boosts['Professional Skills'] += 2;
      }
      if (c.category === 'Volunteer Support') {
        boosts['Leadership Skills'] += 4;
      }
    });

    return boosts;
  }, [events, contributions]);

  // Compute total Volunteer Hours in real time
  const totalVolunteerHours = useMemo(() => {
    const clubHours = clubs.reduce((sum, c) => sum + c.volunteerHours, 0);
    const eventHours = events.reduce((sum, e) => sum + (e.hoursAdded || 0), 0);
    return clubHours + eventHours;
  }, [clubs, events]);

  // Dynamic Skill Calculator Mapper (returns boosted level, capped at 100)
  const getBoostedSkillLevel = (skillName: string, category: string, baseLevel: number) => {
    let categoryKey = 'Academic Skills';
    if (category === 'academic') categoryKey = 'Academic Skills';
    else if (category === 'programming') categoryKey = 'Programming & Development';
    else if (category === 'research') categoryKey = 'Research Skills';
    else if (category === 'leadership') categoryKey = 'Leadership Skills';
    else if (category === 'contest') categoryKey = 'Contest Skills';
    else if (category === 'creative') categoryKey = 'Creative Skills';
    else if (category === 'professional') categoryKey = 'Professional Skills';

    const boost = skillBoosts[categoryKey] || 0;
    return {
      finalLevel: Math.min(100, baseLevel + boost),
      boostAmount: boost
    };
  };

  // 6. CATEGORY CONSTANTS
  const categoryConfig: Record<string, { label: string; gradient: string; border: string; icon: React.ReactNode }> = {
    academic: { label: 'Academic Core', gradient: 'linear-gradient(135deg, #3B82F6, #6C63FF)', border: '#6C63FF', icon: <GraduationCap size={16} /> },
    programming: { label: 'Programming & Dev', gradient: 'linear-gradient(135deg, #22D3EE, #10B981)', border: '#10B981', icon: <Laptop size={16} /> },
    research: { label: 'Research Milestones', gradient: 'linear-gradient(135deg, #F59E0B, #F43F5E)', border: '#F43F5E', icon: <Microscope size={16} /> },
    leadership: { label: 'Leadership Skills', gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: '#EC4899', icon: <Crown size={16} /> },
    contest: { label: 'Contest & Coding', gradient: 'linear-gradient(135deg, #EF4444, #F97316)', border: '#EF4444', icon: <Trophy size={16} /> },
    creative: { label: 'Creative & Design', gradient: 'linear-gradient(135deg, #A855F7, #EC4899)', border: '#A855F7', icon: <Palette size={16} /> },
    professional: { label: 'Professional Skills', gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)', border: '#06B6D4', icon: <Briefcase size={16} /> }
  };

  // Helper: Average score per parent category (including dynamic boosts!)
  const getCategoryProficiency = (cat: string) => {
    const list = skills.filter(s => s.category === cat);
    if (list.length === 0) return 0;
    const totalBoosted = list.reduce((sum, s) => {
      const { finalLevel } = getBoostedSkillLevel(s.name, s.category, s.baseLevel);
      return sum + finalLevel;
    }, 0);
    return Math.round(totalBoosted / list.length);
  };

  // Recharts high level Radar chart data
  const mainRadarData = [
    { subject: 'Academic', A: getCategoryProficiency('academic'), code: 'academic' },
    { subject: 'Programming', A: getCategoryProficiency('programming'), code: 'programming' },
    { subject: 'Research', A: getCategoryProficiency('research'), code: 'research' },
    { subject: 'Leadership', A: getCategoryProficiency('leadership'), code: 'leadership' },
    { subject: 'Contests', A: getCategoryProficiency('contest'), code: 'contest' },
    { subject: 'Creative', A: getCategoryProficiency('creative'), code: 'creative' },
    { subject: 'Professional', A: getCategoryProficiency('professional'), code: 'professional' },
  ];

  // Specific Sub-Category radar chart data
  const subRadarData = selectedCategory ? skills
    .filter(s => s.category === selectedCategory)
    .map(s => {
      const { finalLevel } = getBoostedSkillLevel(s.name, s.category, s.baseLevel);
      return { subject: s.name, A: finalLevel };
    }) : [];

  // Computed Portfolio Ratings
  const leadershipScore = useMemo(() => {
    // Calculates a visual score from active roles and hours
    const activeRoles = clubs.filter(c => c.verification === 'Verified by Club' && c.role !== 'Member').length;
    const base = 50 + (activeRoles * 12) + Math.min(25, Math.round(totalVolunteerHours / 3));
    return Math.min(100, base);
  }, [clubs, totalVolunteerHours]);

  const engagementScore = useMemo(() => {
    // Calculated based on events attended, certifications, and active clubs
    const activeClubs = clubs.length;
    const eventsAttended = events.length;
    const certsCount = certificates.length;
    return Math.min(100, 40 + (activeClubs * 5) + (eventsAttended * 4) + (certsCount * 5));
  }, [clubs, events, certificates]);

  // 7. TRANSACTION HANDLERS
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    const added: SkillItem = {
      id: `sk-${Date.now()}`,
      category: newSkill.category,
      name: newSkill.name.trim(),
      baseLevel: Number(newSkill.level),
      verification: newSkill.supervisor ? 'Pending Verification' : 'Self Added',
      verifiedBy: newSkill.supervisor || undefined,
      evidence: newSkill.evidence.trim() || undefined,
    };
    setSkills([...skills, added]);
    setNewSkill({ name: '', category: 'academic', level: 80, supervisor: '', evidence: '' });
    setShowSkillModal(false);
  };

  const handleAddClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name.trim() || !newClub.role.trim()) return;
    const added: ClubItem = {
      id: `cl-${Date.now()}`,
      name: newClub.name.trim(),
      role: newClub.role.trim(),
      verification: newClub.moderator ? 'Pending Verification' : 'Self Added',
      verifiedBy: newClub.moderator || undefined,
      eventsCount: 0,
      volunteerHours: 0,
      skillsDeveloped: ['Communication', 'Teamwork'],
      joinDate: newClub.joinDate || new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      category: newClub.category,
      description: newClub.description.trim() || 'Club portfolio tracking active.'
    };
    setClubs([...clubs, added]);
    setNewClub({ name: '', role: '', category: 'Technical', joinDate: '', description: '', moderator: '' });
    setShowClubModal(false);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name.trim() || !newEvent.organizer.trim()) return;
    const added: EventItem = {
      id: `ev-${Date.now()}`,
      name: newEvent.name.trim(),
      organizer: newEvent.organizer.trim(),
      role: newEvent.role,
      eventType: newEvent.eventType,
      date: newEvent.date || new Date().toISOString().split('T')[0],
      verification: 'Self Added',
      proofUrl: newEvent.proofUrl.trim() || undefined,
      hoursAdded: Number(newEvent.hours),
    };
    setEvents([...events, added]);
    setNewEvent({ name: '', organizer: '', role: 'Participant', eventType: 'Workshop', date: '', proofUrl: '', hours: 5 });
    setShowEventModal(false);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.title.trim() || !newAch.organization.trim()) return;
    const added: AchievementItem = {
      id: `ach-${Date.now()}`,
      title: newAch.title.trim(),
      event: newAch.event.trim() || 'General Contest Showcase',
      organization: newAch.organization.trim(),
      award: newAch.award.trim(),
      date: newAch.date || new Date().toISOString().split('T')[0],
      proofUrl: newAch.proofUrl.trim() || undefined,
      description: newAch.description.trim(),
      verification: newAch.supervisor ? 'Pending Verification' : 'Self Added'
    };
    setAchievements([...achievements, added]);
    setNewAch({ title: '', event: '', organization: '', award: '', date: '', proofUrl: '', description: '', supervisor: '' });
    setShowAchModal(false);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim() || !newCert.issuer.trim()) return;
    const added: CertificateItem = {
      id: `crt-${Date.now()}`,
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim(),
      date: newCert.date || new Date().toISOString().split('T')[0],
      credentialId: newCert.credentialId.trim() || undefined,
      proofUrl: newCert.proofUrl.trim() || undefined,
      verification: newCert.supervisor ? 'Pending Verification' : 'Self Added',
      verifiedBy: newCert.supervisor || undefined
    };
    setCertificates([...certificates, added]);
    setNewCert({ title: '', issuer: '', date: '', credentialId: '', proofUrl: '', supervisor: '' });
    setShowCertModal(false);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidence.title.trim()) return;
    const added: ContributionItem = {
      id: `cnt-${Date.now()}`,
      title: newEvidence.title.trim(),
      category: newEvidence.category,
      description: newEvidence.description.trim(),
      proofUrl: newEvidence.proofUrl.trim() || undefined,
      relatedEvent: newEvidence.relatedEvent.trim() || undefined,
    };
    setContributions([...contributions, added]);
    
    // Also append to the Media Gallery if url is mock image
    if (newEvidence.proofUrl.includes('images.unsplash.com') || newEvidence.proofUrl) {
      const newMed: MediaItem = {
        id: `med-${Date.now()}`,
        url: newEvidence.proofUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        title: newEvidence.title.trim(),
        category: 'designs'
      };
      setMediaItems([newMed, ...mediaItems]);
    }

    setNewEvidence({ title: '', category: 'Web Development', description: '', proofUrl: '', relatedEvent: '' });
    setShowEvidenceModal(false);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const simulateModeratorVerify = (clubId: string) => {
    setClubs(clubs.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          verification: 'Verified by Club',
          verifiedBy: 'Club Moderator Prof. Khan'
        };
      }
      return c;
    }));
    if (selectedClub && selectedClub.id === clubId) {
      setSelectedClub({
        ...selectedClub,
        verification: 'Verified by Club',
        verifiedBy: 'Club Moderator Prof. Khan'
      });
    }
  };

  const triggerCopyShowcaseLink = () => {
    navigator.clipboard.writeText('https://joysarkar.netlify.app/');
    setCopyLinkSuccess(true);
    setTimeout(() => setCopyLinkSuccess(false), 3000);
  };

  // Filtered Media Gallery items
  const filteredMedia = useMemo(() => {
    if (selectedMediaCategory === 'all') return mediaItems;
    return mediaItems.filter(m => m.category === selectedMediaCategory);
  }, [mediaItems, selectedMediaCategory]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. PUBLIC SHOWCASE MODE TOGGLER AND BAR */}
      <div style={{
        background: publicShowcaseMode ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ 
            width: 10, height: 10, borderRadius: '50%', 
            background: publicShowcaseMode ? 'var(--success)' : 'var(--muted)',
            boxShadow: publicShowcaseMode ? '0 0 10px var(--success)' : 'none'
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: publicShowcaseMode ? 'var(--success)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {publicShowcaseMode ? <><Globe size={14} /> PUBLIC RESUME SHOWCASE IS LIVE</> : <><Lock size={14} /> PRIVATE DASHBOARD CONFIGURATION</>}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {publicShowcaseMode && (
            <button 
              onClick={triggerCopyShowcaseLink}
              style={{
                padding: '6px 12px',
                background: 'rgba(34,211,238,0.15)',
                border: '1px solid rgba(34,211,238,0.3)',
                color: '#22D3EE',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {copyLinkSuccess ? <><Check size={14} /> Link Copied!</> : <><LinkIcon size={14} /> Copy Portfolio Link</>}
            </button>
          )}
          <button
            onClick={() => setPublicShowcaseMode(!publicShowcaseMode)}
            style={{
              padding: '6px 14px',
              background: publicShowcaseMode ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {publicShowcaseMode ? <><Edit size={14} /> Edit Dashboard Model</> : <><Eye size={14} /> Preview Shareable Portfolio</>}
          </button>
        </div>
      </div>

      {/* RENDER MODE A: SHARABLE PUBLIC PROFILE WEB VIEW */}
      {publicShowcaseMode ? (
        <div style={{ flex: 1, padding: '2.5rem', background: '#09090E', overflowY: 'auto' }} className="fade-in">
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Header Showcase Banner Card */}
            <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 220, height: 220,
                background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF 0%, #22D3EE 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 800, color: '#fff',
                boxShadow: '0 0 25px rgba(108,99,255,0.4)', flexShrink: 0
              }}>
                JY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">Computer Science Honors</span>
                  <span className="badge badge-success">Verified Active Leader</span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: 4 }}>Joy kumar Yuv</h1>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
                  Lead Developer at <strong style={{ color: 'var(--text)' }}>AIRIS</strong> · Secretary of <strong style={{ color: 'var(--text)' }}>Photography Club</strong>
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> CIS-21-010</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> joy.yuv@edu.ai</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LinkIcon size={14} /> <a href="https://joysarkar.netlify.app/" target="_blank" rel="noreferrer" style={{ color: '#22D3EE', textDecoration: 'none' }}>joysarkar.netlify.app</a></span>
                </p>
              </div>
            </div>

            {/* Public Statistics */}
            <div className="dashboard-grid">
              <div className="glass-card stat-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#6C63FF' }}>{skills.length}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Active Skills Showcase</p>
              </div>
              <div className="glass-card stat-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22D3EE' }}>{clubs.filter(c => c.verification.includes('Verified')).length}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Verified Club Affiliations</p>
              </div>
              <div className="glass-card stat-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>{totalVolunteerHours} hrs</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Volunteer Service hours</p>
              </div>
              <div className="glass-card stat-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{achievements.length}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Competitive Wins & Awards</p>
              </div>
            </div>

            {/* Split Skills Radar & Top verified leadership path */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16 }}>Skills Radar Model</h3>
                <ResponsiveContainer width="100%" height={230}>
                  <RadarChart data={mainRadarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                    <Radar name="Level" dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Top Leadership Journey</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clubs.filter(c => c.role !== 'Member').slice(0, 3).map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 10 }}>
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.role}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{c.name} ({c.category})</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', color: '#10B981', padding: '2px 8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6 }}>
                          Verified
                        </span>
                        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 4 }}>Since {c.joinDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements Showcase */}
            <div className="glass-card" style={{ padding: '2.0rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Trophy size={20} color="var(--primary)" /> Major Competitive Wins & Recognitions
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {achievements.map(ach => (
                  <div key={ach.id} style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <span style={{ fontSize: '0.68rem', padding: '3px 8px', background: 'rgba(108,99,255,0.15)', color: 'var(--primary)', borderRadius: 6, fontWeight: 700 }}>
                      {ach.organization}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '8px 0 4px' }}>{ach.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Trophy size={14} /> {ach.award}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Gallery */}
            <div className="glass-card" style={{ padding: '2.0rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={20} color="var(--primary)" /> Activity Media Showcase
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {mediaItems.slice(0, 4).map(med => (
                  <div 
                    key={med.id} 
                    onClick={() => setLightboxImage(med.url)}
                    style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 130, cursor: 'pointer' }}
                  >
                    <img src={med.url} alt={med.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, width: '100%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                      padding: '8px', fontSize: '0.7rem', fontWeight: 600
                    }}>
                      {med.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        
        // RENDER MODE B: FULL MASTER COMPONENT LAYOUT WITH TABS
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopNavbar 
            title="Leadership & Skill Portfolio" 
            subtitle="Central workspace for student credentials, extracurricular engagements, event tracking, and volunteer hours." 
            accentColor="#6C63FF" 
          />
          
          <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
            
            {/* Tab navigation headers */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'var(--surface-2)', 
              border: '1px solid var(--border)',
              borderRadius: 16, 
              padding: '8px 12px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { id: 'overview', label: 'Overview', icon: <BarChart2 size={16} /> },
                  { id: 'skills', label: 'Skills Portfolio', icon: <Target size={16} /> },
                  { id: 'clubs', label: 'Club Activities', icon: <Shield size={16} /> },
                  { id: 'leadership', label: 'Positions & Roles', icon: <Crown size={16} /> },
                  { id: 'events', label: 'Events Ledger', icon: <Calendar size={16} /> },
                  { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} /> },
                  { id: 'certificates', label: 'Certificates', icon: <FileText size={16} /> },
                  { id: 'evidence', label: 'Work Evidence', icon: <LinkIcon size={16} /> },
                  { id: 'ai', label: 'AI Leadership Insights', icon: <Bot size={16} /> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: '8px 12px',
                      background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)',
                      border: 'none',
                      borderRadius: 10,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: activeTab === tab.id ? '0 4px 15px var(--primary-glow)' : 'none',
                      gap: 6
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Master Creation Trigger Bar */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => {
                    if (activeTab === 'skills' || activeTab === 'overview') setShowSkillModal(true);
                    else if (activeTab === 'clubs') setShowClubModal(true);
                    else if (activeTab === 'events') setShowEventModal(true);
                    else if (activeTab === 'achievements') setShowAchModal(true);
                    else if (activeTab === 'certificates') setShowCertModal(true);
                    else if (activeTab === 'evidence') setShowEvidenceModal(true);
                  }}
                  style={{
                    padding: '8px 14px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    color: 'var(--text)',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(108,99,255,0.2)'
                  }}
                >
                  <Plus size={16} style={{ marginRight: 6 }} /> 
                  Add {activeTab === 'clubs' ? 'Club' : activeTab === 'events' ? 'Event' : activeTab === 'achievements' ? 'Award' : activeTab === 'certificates' ? 'Certificate' : activeTab === 'evidence' ? 'Evidence' : 'Skill'}
                </button>
              </div>
            </div>

            {/* ──────── TAB 1: OVERVIEW DASHBOARD ──────── */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. Analytics Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div className="glass-card stat-card animate-pulse-subtle" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>TOTAL ACTIVE SKILLS</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{skills.length}</span>
                      <span style={{ color: 'var(--primary)' }}><Target size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>CLUBS JOINED</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#22D3EE' }}>{clubs.length}</span>
                      <span style={{ color: '#22D3EE' }}><Shield size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>LEADERSHIP ROLES</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>
                        {clubs.filter(c => c.role !== 'Member').length}
                      </span>
                      <span style={{ color: '#10B981' }}><Crown size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>EVENTS RECORDED</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{events.length}</span>
                      <span style={{ color: '#F59E0B' }}><Calendar size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>VOLUNTEER HOURS</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F43F5E' }}>{totalVolunteerHours} hrs</span>
                      <span style={{ color: '#F43F5E' }}><Clock size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>CERTIFICATES</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EC4899' }}>{certificates.length}</span>
                      <span style={{ color: '#EC4899' }}><FileText size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>VERIFIED EVENTS</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10B981' }}>
                        {events.filter(e => e.verification === 'Verified by Club').length}
                      </span>
                      <span style={{ color: '#10B981' }}><CheckCircle size={24} /></span>
                    </div>
                  </div>
                  <div className="glass-card stat-card" style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600 }}>AWARDS & WINS</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F59E0B' }}>{achievements.length}</span>
                      <span style={{ color: '#F59E0B' }}><Trophy size={24} /></span>
                    </div>
                  </div>
                </div>

                {/* 2. Charts & Radar Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Skill Radar */}
                  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: '0.92rem', fontWeight: 700 }}>📊 Dynamic Skill Radar Chart</h3>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                          {selectedCategory ? `Drill-down: ${selectedCategory.toUpperCase()}` : 'Click chart sectors or indicators on the right to drill down!'}
                        </p>
                      </div>
                      {selectedCategory && (
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: 6, fontSize: '0.68rem', color: 'var(--text)', cursor: 'pointer' }}
                        >
                          ⬅ Back
                        </button>
                      )}
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart 
                        data={selectedCategory ? subRadarData : mainRadarData}
                        onClick={(state: any) => {
                          if (!selectedCategory && state?.activePayload?.[0]) {
                            const payload = state.activePayload[0].payload;
                            if (payload.code) setSelectedCategory(payload.code);
                          }
                        }}
                      >
                        <PolarGrid stroke="rgba(255,255,255,0.07)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                        <Radar name="Score" dataKey="A" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Skill Growth Line Chart */}
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 4 }}>📈 Dynamic Skill Growth Trend</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 16 }}>Calculated skill level growth over active semesters</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { name: 'Fall 25', Programming: 68, Leadership: 55, Creative: 50 },
                        { name: 'Spring 26', Programming: 75, Leadership: 70, Creative: 68 },
                        { name: 'Summer 26', Programming: 90, Leadership: 85, Creative: 88 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                        <YAxis domain={[40, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.75rem' }} />
                        <Line type="monotone" dataKey="Programming" stroke="#22D3EE" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="Leadership" stroke="#EC4899" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="Creative" stroke="#A855F7" strokeWidth={2.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Bar Charts Trend & Circular Gauges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Activity Trend bar/line */}
                  <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>📅 Event Attendance & Activity Trend</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 12 }}>Semester-wise participation ledger metrics</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={[
                        { name: 'Fall 2025', events: 6, volunteerHours: 25 },
                        { name: 'Spring 2026', events: 10, volunteerHours: 35 },
                        { name: 'Summer 2026', events: events.length, volunteerHours: totalVolunteerHours }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9 }} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 9 }} />
                        <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.7rem' }} />
                        <Bar dataKey="events" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="volunteerHours" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Leadership Score Radial progress ring */}
                  <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>👑 Leadership Competency</h3>
                    <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Simple SVG circle indicator */}
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <circle cx="50" cy="50" r="40" stroke="#EC4899" strokeWidth="8" fill="transparent" 
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - leadershipScore/100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EC4899' }}>{leadershipScore}</span>
                        <span style={{ fontSize: '0.55rem', color: 'var(--muted)' }}>LEVEL</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>Based on 4 verified active student roles</p>
                  </div>

                  {/* Campus Engagement Score Radial progress ring */}
                  <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>⚡ Campus Engagement Index</h3>
                    <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                        <circle cx="50" cy="50" r="40" stroke="#22D3EE" strokeWidth="8" fill="transparent" 
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - engagementScore/100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22D3EE' }}>{engagementScore}</span>
                        <span style={{ fontSize: '0.55rem', color: 'var(--muted)' }}>INDEX</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>Calculated from club events & certifications</p>
                  </div>
                </div>

              </div>
            )}

            {/* ──────── TAB 2: SKILL MANAGEMENT SYSTEM ──────── */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(categoryConfig).map(([cat, cfg]) => {
                  const list = skills.filter(s => s.category === cat);
                  return (
                    <div key={cat} className="glass-card" style={{ padding: '1.5rem' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.4rem' }}>{cfg.icon}</span>
                          <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{cfg.label}</h3>
                            <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Skill mapping and verification index</p>
                          </div>
                        </div>
                        <span style={{ 
                          fontSize: '1.1rem', fontWeight: 800, 
                          background: cfg.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
                        }}>
                          Proficiency Average: {getCategoryProficiency(cat)}%
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {list.map(s => {
                          const { finalLevel, boostAmount } = getBoostedSkillLevel(s.name, s.category, s.baseLevel);
                          return (
                            <div key={s.id} style={{
                              background: 'var(--surface-2)', border: '1px solid var(--border)',
                              borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.name}</p>
                                  {boostAmount > 0 && (
                                    <p style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 600 }}>
                                      ⚡ +{boostAmount}% Dynamic Growth Applied
                                    </p>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: cfg.border }}>{finalLevel}%</span>
                                  {boostAmount > 0 && (
                                    <span style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>Base: {s.baseLevel}%</span>
                                  )}
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${finalLevel}%`, background: cfg.gradient, borderRadius: 99 }} />
                              </div>

                              {/* Action/Delete trigger bar */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                                {s.evidence ? (
                                  <a href={s.evidence} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#22D3EE', textDecoration: 'none' }}>
                                    🔗 View Evidence Link
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>No evidence linked</span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{
                                    fontSize: '0.65rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700,
                                    background: s.verification === 'Verified by Club' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                    color: s.verification === 'Verified by Club' ? 'var(--success)' : 'var(--warning)',
                                    border: s.verification === 'Verified by Club' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)'
                                  }}>
                                    {s.verification}
                                  </span>
                                  <button 
                                    onClick={() => handleDeleteSkill(s.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem' }}
                                  >
                                    🗑
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* ──────── TAB 3: CLUB ACTIVITIES MODULE ──────── */}
            {activeTab === 'clubs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {clubs.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedClub(c)}
                      className="glass-card stat-card"
                      style={{ 
                        padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', 
                        justifyContent: 'space-between', border: '1px solid var(--border)', position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {c.category}
                            </span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4 }}>{c.name}</h3>
                          </div>
                          <span style={{
                            fontSize: '0.68rem', padding: '4px 10px', borderRadius: 99, fontWeight: 700,
                            background: c.verification === 'Verified by Club' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                            color: c.verification === 'Verified by Club' ? 'var(--success)' : 'var(--warning)',
                            border: c.verification === 'Verified by Club' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(245,158,11,0.25)'
                          }}>
                            {c.verification}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineBreak: 'anywhere', marginBottom: 16 }}>
                          {c.description.slice(0, 100)}...
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.72rem' }}>
                          <div>
                            <span style={{ color: 'var(--muted)' }}>Role:</span>
                            <p style={{ fontWeight: 700, color: 'var(--text)' }}>{c.role}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--muted)' }}>Volunteer Hours:</span>
                            <p style={{ fontWeight: 700, color: '#F43F5E' }}>{c.volunteerHours} hrs</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                          {c.skillsDeveloped.map(sk => (
                            <span key={sk} style={{ fontSize: '0.62rem', padding: '2px 6px', background: 'rgba(34,211,238,0.1)', color: '#22D3EE', borderRadius: 4 }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──────── TAB 4 & 5: TIMELINE & POSITION HISTORY ──────── */}
            {activeTab === 'leadership' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                
                {/* Visual Timeline grouped by semester */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>📅 Dynamic Activity Timeline</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 20 }}>Vertical timeline grouped by semester</p>

                  <div style={{ position: 'relative', paddingLeft: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Vertical visual axis */}
                    <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 2, background: 'linear-gradient(180deg, #6C63FF 0%, #22D3EE 100%)' }} />

                    {events.map((e, index) => (
                      <div key={e.id} style={{ position: 'relative' }}>
                        {/* Bullet node */}
                        <div style={{
                          position: 'absolute', left: -26, top: 4, width: 12, height: 12, borderRadius: '50%',
                          background: e.verification === 'Verified by Club' ? '#10B981' : '#F59E0B',
                          border: '3px solid #0F0F1A',
                          boxShadow: e.verification === 'Verified by Club' ? '0 0 10px #10B981' : '0 0 10px #F59E0B'
                        }} />
                        
                        <div style={{ background: 'var(--surface-2)', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.62rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', borderRadius: 4 }}>
                              {e.date} · {e.eventType}
                            </span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: e.verification === 'Verified by Club' ? 'var(--success)' : 'var(--warning)' }}>
                              {e.verification}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '6px 0 2px' }}>{e.name}</h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                            Role: <strong style={{ color: 'var(--text)' }}>{e.role}</strong> with <strong style={{ color: 'var(--text)' }}>{e.organizer}</strong>
                          </p>
                          {e.proofUrl && (
                            <a href={e.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.68rem', color: '#22D3EE', textDecoration: 'none', display: 'inline-block', marginTop: 6 }}>
                              🔗 Proof of Activity
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table of positions and durations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>👑 Active Position Directory</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.68rem', textTransform: 'uppercase' }}>Club</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.68rem', textTransform: 'uppercase' }}>Position</th>
                            <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.68rem', textTransform: 'uppercase' }}>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clubs.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '10px 10px', fontWeight: 700 }}>{c.name}</td>
                              <td style={{ padding: '10px 10px', color: '#22D3EE' }}>{c.role}</td>
                              <td style={{ padding: '10px 10px', color: 'var(--muted)' }}>Since {c.joinDate.split('-')[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI club advisor insight banner */}
                  <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid var(--primary)' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>💡 AI Leadership Assessment</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      "You have exhibited highly coordinated event leading and tech development roles this semester (64+ volunteer hours). We recommend requesting Faculty recommendation from Tamanna Akter to leverage these achievements for next term leadership scholarship applications."
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ──────── TAB 6 & 7: EVENTS & VERIFICATION LEDGERS ──────── */}
            {activeTab === 'events' && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>📅 Institutional Events & Participations Ledger</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Verify and track cumulative volunteer hours</p>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Event Name</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Organizer</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Type</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Role</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Hours</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.68rem', textTransform: 'uppercase' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(e => (
                        <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '12px', fontWeight: 700 }}>{e.name}</td>
                          <td style={{ padding: '12px', color: 'var(--muted)' }}>{e.organizer}</td>
                          <td style={{ padding: '12px' }}>
                            <span className="badge badge-info">{e.eventType}</span>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 600, color: 'var(--secondary)' }}>{e.role}</td>
                          <td style={{ padding: '12px', color: 'var(--muted)' }}>{e.date}</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>{e.hoursAdded || 0} hrs</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              fontSize: '0.68rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700,
                              background: e.verification === 'Verified by Club' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                              color: e.verification === 'Verified by Club' ? 'var(--success)' : 'var(--warning)',
                              border: e.verification === 'Verified by Club' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)'
                            }}>
                              {e.verification}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteEvent(e.id)}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ──────── TAB 8: ACHIEVEMENTS LEDGER ──────── */}
            {activeTab === 'achievements' && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>🏆 Major Competitive Achievements</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 16 }}>Showcase of student contest rewards and medals</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {achievements.map(ach => (
                    <div key={ach.id} style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: '0.68rem', padding: '3px 8px', background: 'rgba(108,99,255,0.15)', color: 'var(--primary)', borderRadius: 6, fontWeight: 700 }}>
                            {ach.organization}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600 }}>✔ verified</span>
                        </div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 4 }}>{ach.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: 10 }}>🏆 {ach.award}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>{ach.description}</p>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                        <span style={{ color: 'var(--muted)' }}>Issued: {ach.date}</span>
                        {ach.proofUrl && (
                          <a href={ach.proofUrl} target="_blank" rel="noreferrer" style={{ color: '#22D3EE', textDecoration: 'none', fontWeight: 600 }}>
                            🔗 Proof URL
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──────── TAB 7: CERTIFICATES LEDGER ──────── */}
            {activeTab === 'certificates' && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>📜 Professional Credentials & Certificates</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 16 }}>Verified external certifications</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {certificates.map(c => (
                    <div key={c.id} style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: '1.25rem', position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ fontSize: '1.4rem' }}>🏅</span>
                        <span style={{
                          fontSize: '0.65rem', padding: '3px 8px', borderRadius: 4, fontWeight: 700,
                          background: c.verification === 'Verified by Club' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                          color: c.verification === 'Verified by Club' ? 'var(--success)' : 'var(--muted)'
                        }}>
                          {c.verification}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>{c.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Issuer: {c.issuer}</p>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.7rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted)' }}>Date:</span>
                          <span style={{ fontWeight: 600 }}>{c.date}</span>
                        </div>
                        {c.credentialId && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--muted)' }}>ID:</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.credentialId}</span>
                          </div>
                        )}
                      </div>
                      {c.proofUrl && (
                        <div style={{ marginTop: 10, textAlign: 'right' }}>
                          <a href={c.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: '#22D3EE', textDecoration: 'none', fontWeight: 600 }}>
                            🔗 Certificate URL →
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──────── TAB 8: WORK EVIDENCE & MEDIA GALLERY ──────── */}
            {activeTab === 'evidence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Interactive contributions portfolio cards */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>🔗 Student Contributions & Work Evidence</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 16 }}>Direct references to project links, posters, and code repos</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {contributions.map(cnt => (
                      <div key={cnt.id} style={{
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(34,211,238,0.1)', color: '#22D3EE', borderRadius: 4, fontWeight: 700 }}>
                            {cnt.category}
                          </span>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '8px 0 4px' }}>{cnt.title}</h4>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>{cnt.description}</p>
                        </div>
                        {cnt.proofUrl && (
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 10, marginTop: 12, textAlign: 'right' }}>
                            <a href={cnt.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>
                              🔗 Open Evidence Link
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Gallery & Lightbox Preview */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>🖼 Institutional Media & Cert Gallery</h3>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Click elements below to toggle lightbox preview overlay</p>
                    </div>
                    
                    {/* Media category select */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['all', 'posters', 'photos', 'certs', 'designs'].map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedMediaCategory(c as any)}
                          style={{
                            padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
                            background: selectedMediaCategory === c ? 'var(--primary)' : 'transparent',
                            color: 'var(--text)', fontSize: '0.68rem', cursor: 'pointer'
                          }}
                        >
                          {c.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {filteredMedia.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => setLightboxImage(m.url)}
                        style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 130, cursor: 'pointer' }}
                      >
                        <img src={m.url} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, width: '100%',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                          padding: '8px', fontSize: '0.7rem', fontWeight: 600
                        }}>
                          {m.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ──────── TAB 9: AI INSIGHTS & ADVANCED RECOMMENDATIONS ──────── */}
            {activeTab === 'ai' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                
                {/* Smart Leadership analysis core */}
                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>AI Leadership Insights Engine</h3>
                      <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Real-time student extracurricular growth models</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ background: 'var(--surface-2)', padding: '12px 14px', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981', marginBottom: 2 }}>👑 Leadership Boost Detected</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                        "Your active involvement as Event Coordinator at Robotics Club and Secretary at Photography Club has boosted your communication capabilities by 20% and team collaboration index by 15% this semester."
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '12px 14px', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22D3EE', marginBottom: 2 }}>🔬 Research Potential Highlight</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                        "Your literature review (70%) and Python dev skills (80%) fit active research streams. Joining the AIRIS Core Development wing would increase overall Research competency index by +12%."
                      </p>
                    </div>

                    <div style={{ background: 'var(--surface-2)', padding: '12px 14px', borderRadius: 10 }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', marginBottom: 2 }}>💼 Professional Placement Recommendation</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                        "Given your 64 volunteer hours, 10 completed events, and AWS Practitioner verified credential, your profile holds a 94% fit match rating for the Student Representative placement Board."
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI club recommender and collaboration projects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Recommender */}
                  <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 10 }}>💡 Suggested Engagements</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700 }}>🤖 AIRIS Web Team Lead</p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Matches React/Next.js proficiency (90%) and team coordinator (85%) skills.</p>
                      </div>
                      <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700 }}>🏆 Inter-University AI Hackathon Coordination</p>
                        <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Leverages your 12 verified event hours and coordinator background.</p>
                      </div>
                    </div>
                  </div>

                  {/* Network collaboration nodes */}
                  <div className="glass-card" style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>👥 Institutional Network</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 8 }}>Primary collaborative clubs & department streams:</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['AIRIS Web team', 'Robotics IoT Lab', 'CSE Department', 'Photography Editorial Panel'].map(tag => (
                        <span key={tag} style={{ fontSize: '0.68rem', padding: '4px 8px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 6, color: '#6C63FF' }}>
                          ✦ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

          </main>
        </div>
      )}

      {/* LIGHTBOX OVERLAY FOR IMAGE PREVIEWS */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out'
          }}
        >
          <img src={lightboxImage} alt="Preview" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 12, boxShadow: '0 0 35px rgba(255,255,255,0.1)' }} />
        </div>
      )}

      {/* ──────────────── MODAL 1: ADD SKILL ──────────────── */}
      {showSkillModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Skill Portfolio Record</h3>
            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Skill Name</label>
                <input 
                  type="text" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. Embedded Systems, TensorFlow, AutoCAD" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Category</label>
                  <select 
                    value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="academic">Academic Core</option>
                    <option value="programming">Programming & Dev</option>
                    <option value="research">Research Skills</option>
                    <option value="leadership">Leadership Skills</option>
                    <option value="contest">Contest Skills</option>
                    <option value="creative">Creative Skills</option>
                    <option value="professional">Professional Skills</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Proficiency ({newSkill.level}%)</label>
                  <input 
                    type="range" min="10" max="100" step="5" value={newSkill.level}
                    onChange={e => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                    style={{ width: '100%', height: '36px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Evidence URL (e.g. GitHub/Webpage)</label>
                <input 
                  type="url" value={newSkill.evidence} onChange={e => setNewSkill({ ...newSkill, evidence: e.target.value })}
                  placeholder="https://..." 
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Verify via Faculty Member (optional)</label>
                <select 
                  value={newSkill.supervisor} onChange={e => setNewSkill({ ...newSkill, supervisor: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                >
                  <option value="">No Verification (Self Added)</option>
                  <option value="Tamanna Akter">Tamanna Akter (CIS)</option>
                  <option value="Prof. Rashid Khan">Prof. Rashid Khan (CSE)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowSkillModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 2: ADD CLUB ──────────────── */}
      {showClubModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Club Membership Portfolio</h3>
            <form onSubmit={handleAddClub} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Club Name</label>
                <input 
                  type="text" value={newClub.name} onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                  placeholder="e.g. Debate Club, Cyber Security Club" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Role</label>
                  <input 
                    type="text" value={newClub.role} onChange={e => setNewClub({ ...newClub, role: e.target.value })}
                    placeholder="e.g. Secretary, Member" required
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Category</label>
                  <select 
                    value={newClub.category} onChange={e => setNewClub({ ...newClub, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Technical">Technical</option>
                    <option value="Creative/Arts">Creative/Arts</option>
                    <option value="Competitive Coding">Competitive Coding</option>
                    <option value="Social Service">Social Service</option>
                    <option value="Public Speaking">Public Speaking</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea 
                  value={newClub.description} onChange={e => setNewClub({ ...newClub, description: e.target.value })}
                  placeholder="Summarize club milestones..." rows={2}
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Join Date</label>
                  <input 
                    type="date" value={newClub.joinDate} onChange={e => setNewClub({ ...newClub, joinDate: e.target.value })}
                    style={{ width: '100%', padding: '9px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Moderator Email/Name</label>
                  <input 
                    type="text" value={newClub.moderator} onChange={e => setNewClub({ ...newClub, moderator: e.target.value })}
                    placeholder="Request moderator verification..."
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowClubModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Club</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 3: ADD EVENT ──────────────── */}
      {showEventModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Event Participation</h3>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Event Name</label>
                <input 
                  type="text" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="e.g. National Hackfest 2026" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Organizer</label>
                  <input 
                    type="text" value={newEvent.organizer} onChange={e => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    placeholder="e.g. Robotics Club" required
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Event Type</label>
                  <select 
                    value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Competition">Competition</option>
                    <option value="Volunteer Program">Volunteer Program</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Cultural Event">Cultural Event</option>
                    <option value="Sports">Sports</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Tech Fest">Tech Fest</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Role</label>
                  <select 
                    value={newEvent.role} onChange={e => setNewEvent({ ...newEvent, role: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Participant">Participant</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Coordinator">Coordinator</option>
                    <option value="Lead Coordinator">Lead Coordinator</option>
                    <option value="Host">Host</option>
                    <option value="Speaker">Speaker</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Volunteer Hours</label>
                  <input 
                    type="number" min="0" value={newEvent.hours} onChange={e => setNewEvent({ ...newEvent, hours: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Event Date</label>
                  <input 
                    type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    style={{ width: '100%', padding: '9px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Proof URL</label>
                  <input 
                    type="url" value={newEvent.proofUrl} onChange={e => setNewEvent({ ...newEvent, proofUrl: e.target.value })}
                    placeholder="https://github.com/..." 
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 4: ADD ACHIEVEMENT ──────────────── */}
      {showAchModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Award & Achievement</h3>
            <form onSubmit={handleAddAchievement} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Achievement/Award Title</label>
                <input 
                  type="text" value={newAch.title} onChange={e => setNewAch({ ...newAch, title: e.target.value })}
                  placeholder="e.g. Tech Fest Champion" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Organizer / Host</label>
                  <input 
                    type="text" value={newAch.organization} onChange={e => setNewAch({ ...newAch, organization: e.target.value })}
                    placeholder="e.g. ICT Division, ACM" required
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Standing Award</label>
                  <input 
                    type="text" value={newAch.award} onChange={e => setNewAch({ ...newAch, award: e.target.value })}
                    placeholder="e.g. Winner, Runner Up" required
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea 
                  value={newAch.description} onChange={e => setNewAch({ ...newAch, description: e.target.value })}
                  placeholder="Description of competition..." rows={2} required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Date Gained</label>
                  <input 
                    type="date" value={newAch.date} onChange={e => setNewAch({ ...newAch, date: e.target.value })}
                    style={{ width: '100%', padding: '9px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Proof URL</label>
                  <input 
                    type="url" value={newAch.proofUrl} onChange={e => setNewAch({ ...newAch, proofUrl: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowAchModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Award</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 5: ADD CERTIFICATE ──────────────── */}
      {showCertModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Certificate</h3>
            <form onSubmit={handleAddCert} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Certificate Title</label>
                <input 
                  type="text" value={newCert.title} onChange={e => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g. AWS Solutions Architect" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Issuer</label>
                  <input 
                    type="text" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="e.g. AWS, Cisco" required
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Date Gained</label>
                  <input 
                    type="date" value={newCert.date} onChange={e => setNewCert({ ...newCert, date: e.target.value })}
                    style={{ width: '100%', padding: '9px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Credential ID</label>
                  <input 
                    type="text" value={newCert.credentialId} onChange={e => setNewCert({ ...newCert, credentialId: e.target.value })}
                    placeholder="e.g. AWS-99228"
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Verification URL</label>
                  <input 
                    type="url" value={newCert.proofUrl} onChange={e => setNewCert({ ...newCert, proofUrl: e.target.value })}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Faculty Sponsor</label>
                <select 
                  value={newCert.supervisor} onChange={e => setNewCert({ ...newCert, supervisor: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                >
                  <option value="">No Faculty verification</option>
                  <option value="Mr. Md. Sarwar Hossain Mollah">Mr. Md. Sarwar Hossain Mollah</option>
                  <option value="Prof. Rashid Khan">Prof. Rashid Khan</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowCertModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Cert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── MODAL 6: ADD WORK EVIDENCE ──────────────── */}
      {showEvidenceModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '480px', margin: '0 1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>➕ Add Work Evidence</h3>
            <form onSubmit={handleAddEvidence} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Work Contribution Title</label>
                <input 
                  type="text" value={newEvidence.title} onChange={e => setNewEvidence({ ...newEvidence, title: e.target.value })}
                  placeholder="e.g. Annual Fest Landing Page" required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Category</label>
                  <select 
                    value={newEvidence.category} onChange={e => setNewEvidence({ ...newEvidence, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Media Production">Media Production</option>
                    <option value="Volunteer Support">Volunteer Support</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Related Event (optional)</label>
                  <input 
                    type="text" value={newEvidence.relatedEvent} onChange={e => setNewEvidence({ ...newEvidence, relatedEvent: e.target.value })}
                    placeholder="e.g. Tech Fest 2026"
                    style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea 
                  value={newEvidence.description} onChange={e => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  placeholder="Describe your visual or code work..." rows={2} required
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Evidence / Media URL (Unsplash or GitHub)</label>
                <input 
                  type="url" value={newEvidence.proofUrl} onChange={e => setNewEvidence({ ...newEvidence, proofUrl: e.target.value })}
                  placeholder="https://..." 
                  style={{ width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowEvidenceModal(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--primary)', color: 'var(--text)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save Evidence</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── CLUB CARD EXPAND DETAILED PORTFOLIO MODAL ──────────────── */}
      {selectedClub && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '850px', height: '80%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Modal Top Header */}
            <div style={{ 
              padding: '1.5rem', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(108,99,255,0.15)', color: 'var(--primary)', borderRadius: 6, fontWeight: 700 }}>
                  {selectedClub.category}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: 4 }}>{selectedClub.name} Portfolio Overview</h2>
              </div>
              <button 
                onClick={() => setSelectedClub(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Internal Navigation Subtabs */}
            <div style={{ display: 'flex', gap: 6, padding: '8px 1.5rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--border)' }}>
              {[
                { id: 'overview', label: '📖 Overview' },
                { id: 'events', label: '📅 Activities' },
                { id: 'contributions', label: '🛠 Contributions' },
                { id: 'skills', label: '🎯 Mapped Skills' },
                { id: 'evidence', label: '🔗 Proof & Media' },
                { id: 'achievements', label: '🏆 Achievements' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedClubSubTab(sub.id as any)}
                  style={{
                    padding: '6px 12px', border: 'none', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                    background: selectedClubSubTab === sub.id ? 'var(--primary)' : 'transparent',
                    color: selectedClubSubTab === sub.id ? 'var(--text)' : 'var(--muted)', cursor: 'pointer'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Modal Body Container */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
              
              {/* SUB TAB A: OVERVIEW */}
              {selectedClubSubTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'var(--surface-2)', padding: '1.25rem', borderRadius: 12 }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>Membership Summary</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{selectedClub.description}</p>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 10 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Current Role</span>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#22D3EE', marginTop: 2 }}>{selectedClub.role}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 10 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Join Date</span>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 2 }}>{selectedClub.joinDate}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 10 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Verification Status</span>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10B981', marginTop: 2 }}>{selectedClub.verification}</p>
                    </div>
                  </div>

                  {selectedClub.verification !== 'Verified by Club' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: 12, borderRadius: 10, marginTop: 10 }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600 }}>🛠 Simulate Moderator Action for Demo purpose:</p>
                      <button 
                        onClick={() => simulateModeratorVerify(selectedClub.id)}
                        style={{ padding: '6px 12px', background: 'var(--success)', border: 'none', color: 'var(--text)', fontSize: '0.72rem', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✔ Instant Moderator Verification
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB B: ACTIVITIES & EVENTS */}
              {selectedClubSubTab === 'events' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Events under {selectedClub.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {events.filter(e => e.organizer === selectedClub.name).map(e => (
                      <div key={e.id} style={{ background: 'var(--surface-2)', padding: '10px 14px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{e.name}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{e.date} · {e.eventType}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)' }}>Role: {e.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB C: CONTRIBUTIONS */}
              {selectedClubSubTab === 'contributions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Portfolio Contributions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {contributions.slice(0, 3).map(c => (
                      <div key={c.id} style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: 10 }}>
                        <span style={{ fontSize: '0.62rem', padding: '2px 6px', background: 'rgba(108,99,255,0.1)', color: '#6C63FF', borderRadius: 4 }}>{c.category}</span>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, margin: '6px 0 2px' }}>{c.title}</h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB D: SKILLS DEVELOPED */}
              {selectedClubSubTab === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Mapped Professional Skills</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedClub.skillsDeveloped.map(sk => (
                      <div key={sk} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 700 }}>{sk}</span>
                          <span style={{ color: '#22D3EE' }}>+12% Activity Boost Applied</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, #22D3EE, #6C63FF)', borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB E: PROOF & EVIDENCE */}
              {selectedClubSubTab === 'evidence' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Proof and Media Gallery</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {mediaItems.slice(0, 3).map(med => (
                      <div key={med.id} style={{ height: 100, borderRadius: 8, overflow: 'hidden' }}>
                        <img src={med.url} alt={med.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB F: ACHIEVEMENTS */}
              {selectedClubSubTab === 'achievements' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Awards and Accolades</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {achievements.slice(0, 2).map(ach => (
                      <div key={ach.id} style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: 10 }}>
                        <p style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 700 }}>🏆 {ach.award}</p>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '4px 0 2px' }}>{ach.title}</h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{ach.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
