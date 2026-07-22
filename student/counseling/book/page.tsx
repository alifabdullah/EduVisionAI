'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';
import { MASTER_TEACHERS, MASTER_STUDENTS } from '@/data/sharedMockData';
import { useCounseling } from '@/context/CounselingContext';
import type { PriorityLevel } from '@/lib/counselling/types';

type CounselingCategory = 'Academic' | 'Course Difficulty' | 'Career Guidance' | 'Research' | 'Project' | 'Personal Mentorship';

const STUDENT_ID = '261-16-010';
const STUDENT_NAME = 'Joy Kumar Yuv';
const STUDENT_DEPT = 'CIS';
const STUDENT_CGPA = 3.42;
const STUDENT_ATTENDANCE = 71;

const ASSIGNED_TEACHER_ID = 'TCH-002'; // Joy's assigned teacher

const CATEGORIES: CounselingCategory[] = [
  'Academic', 'Course Difficulty', 'Career Guidance', 'Research', 'Project', 'Personal Mentorship'
];
const PRIORITIES: PriorityLevel[] = ['Low', 'Medium', 'High', 'Urgent'];
const ATTACHMENT_TYPES = ['PDF', 'Image', 'Assignment', 'Code File', 'Document'];

const priorityColor: Record<PriorityLevel, string> = {
  Low: '#10B981', Medium: '#F59E0B', High: '#F97316', Urgent: '#F43F5E',
};

const categoryIcons: Record<CounselingCategory, string> = {
  Academic: '📚', 'Course Difficulty': '📉', 'Career Guidance': '🎯',
  Research: '🔬', Project: '💻', 'Personal Mentorship': '🤝',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'var(--text)',
  fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
};

export default function BookCounselingPage() {
  const router = useRouter();
  const { addRequest } = useCounseling();

  const studentProfile = MASTER_STUDENTS.find(s => s.id === STUDENT_ID);

  const [selectedTeacherId, setSelectedTeacherId] = useState(ASSIGNED_TEACHER_ID);
  const selectedTeacher = MASTER_TEACHERS.find(t => t.id === selectedTeacherId);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<CounselingCategory>('Academic');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setFiles(Array.from(e.target.files));
  }

  async function handleSubmit() {
    if (!subject.trim() || !description.trim() || !preferredDate || !preferredTime) {
      setError('Please fill in all required fields: Subject, Description, Preferred Date and Time.');
      return;
    }
    if (!selectedTeacher) return;
    setError('');
    setIsSubmitting(true);
    try {
      await addRequest({
        studentId: STUDENT_ID,
        studentName: STUDENT_NAME,
        studentDept: STUDENT_DEPT,
        studentCgpa: studentProfile?.cgpa ?? STUDENT_CGPA,
        studentAttendance: studentProfile?.attendancePct ?? STUDENT_ATTENDANCE,
        studentAvatar: '/profile_joy.png',
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.name,
        teacherDesignation: selectedTeacher.designation,
        teacherDept: selectedTeacher.departmentId,
        subject: subject.trim(),
        category,
        description: description.trim(),
        priority,
        preferredDate,
        preferredTime,
        attachmentPaths: [],
      }, files);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopNavbar title="Book Counselling" subtitle="Your counseling request has been submitted" accentColor="#50B748" />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginBottom: '0.75rem' }}>
              Request Submitted Successfully!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your counseling request has been sent to <strong style={{ color: 'var(--text)' }}>{selectedTeacher?.name}</strong>.
              You&apos;ll be notified once they respond. Track your request status on your Counseling page.
            </p>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Request Summary</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>📌 <strong style={{ color: 'var(--text)' }}>Subject:</strong> {subject}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>📁 <strong style={{ color: 'var(--text)' }}>Category:</strong> {category}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>🎯 <strong style={{ color: 'var(--text)' }}>Priority:</strong> {priority}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>📅 <strong style={{ color: 'var(--text)' }}>Preferred:</strong> {preferredDate} at {preferredTime}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>👨‍🏫 <strong style={{ color: 'var(--text)' }}>Teacher:</strong> {selectedTeacher?.name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => router.push('/student/counseling')}
                style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #003B95, #50B748)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                📋 View My Requests
              </button>
              <button
                onClick={() => { setSubmitted(false); setSubject(''); setDescription(''); setPreferredDate(''); setPreferredTime(''); setFiles([]); }}
                style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                + New Request
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Book Counselling" subtitle="Request a counseling session with your assigned teacher" accentColor="#50B748" />

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        {/* Info Banner */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(80,183,72,0.1), rgba(0,59,149,0.08))', border: '1px solid rgba(80,183,72,0.25)', borderRadius: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>📅</span>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#50B748', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Counseling Request</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              Fill out the form below to request a counseling session. Your assigned teacher will be notified and respond within 24–48 hours.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Left: Teacher Selection */}
          <div>
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👨‍🏫</span> Select Teacher
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MASTER_TEACHERS.filter(t => t.departmentId === 'CIS').map(teacher => {
                  const isSelected = selectedTeacherId === teacher.id;
                  const isAssigned = teacher.id === ASSIGNED_TEACHER_ID;
                  return (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacherId(teacher.id)}
                      style={{
                        padding: '12px 14px', borderRadius: 12, border: isSelected ? '2px solid #50B748' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(80,183,72,0.1)' : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#1e293b' }}>
                          <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teacher.name}</p>
                            {isAssigned && <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', background: 'rgba(80,183,72,0.2)', color: '#50B748', borderRadius: 999, flexShrink: 0 }}>Assigned</span>}
                          </div>
                          <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{teacher.designation}</p>
                        </div>
                        {isSelected && <span style={{ color: '#50B748', fontSize: '1rem' }}>✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teacher Detail Card */}
            {selectedTeacher && (
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Teacher Details</h4>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                    <img src={selectedTeacher.avatar} alt={selectedTeacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 2 }}>{selectedTeacher.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 2 }}>{selectedTeacher.designation}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{selectedTeacher.department}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Courses</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedTeacher.courses.map(c => (
                        <span key={c} style={{ fontSize: '0.7rem', padding: '2px 7px', background: 'rgba(0,59,149,0.15)', color: '#60a5fa', borderRadius: 6, border: '1px solid rgba(0,59,149,0.3)' }}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Expertise</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedTeacher.expertise.map(e => (
                        <span key={e} style={{ fontSize: '0.7rem', padding: '2px 7px', background: 'rgba(80,183,72,0.1)', color: '#10B981', borderRadius: 6, border: '1px solid rgba(80,183,72,0.2)' }}>{e}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Students</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedTeacher.totalStudents} students mentored</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📋</span> Counseling Request Form
            </h3>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.85rem', color: '#F43F5E' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Subject */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Subject <span style={{ color: '#F43F5E' }}>*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Need help with Database Normalization"
                style={inp}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Category <span style={{ color: '#F43F5E' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '10px 8px', borderRadius: 10, border: category === cat ? '2px solid #50B748' : '1px solid rgba(255,255,255,0.1)',
                      background: category === cat ? 'rgba(80,183,72,0.12)' : 'rgba(255,255,255,0.04)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                      color: category === cat ? '#10B981' : 'var(--muted)', fontWeight: category === cat ? 700 : 400,
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: 3 }}>{categoryIcons[cat]}</span>
                    <span style={{ fontSize: '0.68rem' }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Description <span style={{ color: '#F43F5E' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your issue or goal in detail. Include what you've tried, where you're stuck, and what you need help with."
                rows={5}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Priority */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Priority <span style={{ color: '#F43F5E' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {PRIORITIES.map(p => {
                  const c = priorityColor[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      style={{
                        flex: 1, padding: '10px 8px', borderRadius: 10,
                        border: isSelected ? `2px solid ${c}` : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? `${c}18` : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? c : 'var(--muted)', transition: 'all 0.2s',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Preferred Date <span style={{ color: '#F43F5E' }}>*</span>
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  style={{ ...inp, colorScheme: 'dark' }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Preferred Time <span style={{ color: '#F43F5E' }}>*</span>
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  style={{ ...inp, colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Attachments */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                Attachments (Optional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '20px', border: '2px dashed rgba(108,99,255,0.4)', borderRadius: 12,
                  background: 'rgba(108,99,255,0.05)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.05)')}
              >
                <p style={{ fontSize: '1.5rem', marginBottom: 4 }}>📎</p>
                <p style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600 }}>Click to upload files</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 4 }}>PDF, DOC, DOCX, PPT, ZIP, Images — up to 10MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {files.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: 'rgba(108,99,255,0.1)', borderRadius: 8, fontSize: '0.78rem' }}>
                      <span style={{ color: '#A78BFA' }}>📄 {f.name}</span>
                      <span style={{ color: 'var(--muted)' }}>{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '14px', background: isSubmitting ? '#334155' : 'linear-gradient(135deg, #003B95, #50B748)',
                border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800,
                fontSize: '0.95rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(80,183,72,0.3)',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.opacity = '1')}
            >
              {isSubmitting ? '⏳ Submitting to Supabase...' : '📩 Submit Counseling Request'}
            </button>

            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              Your request will appear in the teacher&apos;s inbox as &quot;Pending&quot; immediately after submission.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
