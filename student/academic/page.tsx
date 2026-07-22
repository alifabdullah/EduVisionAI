'use client';
import { useState, useEffect } from 'react';
import { GraduationCap, FlaskConical, Library } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import SemesterSelector from '@/components/academic/SemesterSelector';
import AcademicOverview from '@/components/academic/AcademicOverview';
import AIInsightsPanel from '@/components/academic/AIInsightsPanel';
import SubjectCards from '@/components/academic/SubjectCards';
import WeakSubjectAlert from '@/components/academic/WeakSubjectAlert';
import ProjectShowcase from '@/components/academic/ProjectShowcase';
import ResearchModule from '@/components/academic/ResearchModule';
import LibraryModule from '@/components/academic/LibraryModule';
import LoadingSkeleton from '@/components/academic/LoadingSkeleton';
import { SEMESTER_DATA } from '@/data/academicData';

export default function AcademicPage() {
  const [selectedCode, setSelectedCode] = useState<string>('263');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'academic' | 'projects' | 'library'>('academic');

  // Semester change trigger
  const handleSemesterSearch = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCode(code);
      setLoading(false);
    }, 600); // 600ms premium feeling query loading
  };

  const semesterData = SEMESTER_DATA[selectedCode] || SEMESTER_DATA['263'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavbar
        title="Student Academic Workspace"
        subtitle="Multi-dimensional academic profile, supervisor collaboration, RFID study tracker"
        accentColor="#6C63FF"
      />

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '4px 6px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          marginBottom: '1.5rem',
          maxWidth: 'fit-content'
        }}>
          {[
            { id: 'academic', label: 'Academic & Performance', icon: <GraduationCap size={18} /> },
            { id: 'projects', label: 'Projects & Research', icon: <FlaskConical size={18} /> },
            { id: 'library', label: 'RFID Library Portal', icon: <Library size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                background: activeTab === tab.id
                  ? 'var(--primary)'
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--muted)',
                border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent',
                borderRadius: 10,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--muted)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content renderer */}
        {activeTab === 'academic' && (
          <div className="fade-in">
            {/* Search/Period selector */}
            <SemesterSelector
              selectedCode={selectedCode}
              onSearch={handleSemesterSearch}
              loading={loading}
            />

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Warnings / Highlights */}
                <WeakSubjectAlert subjects={semesterData.subjects} />

                {/* AI Insights banner */}
                <AIInsightsPanel data={semesterData} />

                {/* Overall performance overview metrics & charts */}
                <AcademicOverview data={semesterData} />

                {/* Individual subject-wise performance breakdown */}
                <SubjectCards subjects={semesterData.subjects} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ProjectShowcase />
            <div style={{ height: 1, background: 'var(--border)' }} />
            <ResearchModule />
          </div>
        )}

        {activeTab === 'library' && (
          <div className="fade-in">
            <LibraryModule />
          </div>
        )}
      </main>
    </div>
  );
}
