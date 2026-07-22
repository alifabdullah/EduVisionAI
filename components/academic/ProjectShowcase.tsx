'use client';
import { useState } from 'react';
import { Project, INITIAL_PROJECTS } from '@/data/academicData';

// Temporary default demo link — replaced when students submit real project URLs
const DEFAULT_DEMO_LINK = 'https://joysarkar.netlify.app/';

// ── Supervisor search mock ────────────────────
const TEACHERS = [
  'Mr. Md. Sarwar Hossain Mollah',
  'Prof. Rashid Khan',
  'Dr. Mehedi Hasan',
  'Prof. Sumaiya Akter',
  'Dr. Noman Ahmed',
  'Prof. Karim Uddin',
];

// ── Tag component ────────────────────────────
function Tag({ label, color = '#6C63FF' }: { label: string; color?: string }) {
  return (
    <span style={{
      padding: '2px 9px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 600,
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>{label}</span>
  );
}

// ── Project Card ─────────────────────────────
function ProjectCard({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const sectorColors: Record<string, string> = {
    'EdTech': '#6C63FF', 'IoT / Smart Systems': '#22D3EE',
    'Social / Networking': '#10B981', 'AI / ML': '#A78BFA',
    'Blockchain': '#F59E0B', 'Mobile': '#F43F5E',
  };
  const color = sectorColors[project.sector] || project.color;

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 40px ${color}25` : 'none',
        border: `1px solid ${color}20`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Color band header */}
      <div style={{
        height: 6,
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
      }} />

      <div style={{ padding: '1.1rem 1.2rem' }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 3, lineHeight: 1.3 }}>{project.title}</h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{project.topic}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
              background: project.status === 'Ongoing' ? 'rgba(34,211,238,0.15)' : 'rgba(16,185,129,0.15)',
              color: project.status === 'Ongoing' ? '#22D3EE' : '#10B981',
              border: `1px solid ${project.status === 'Ongoing' ? 'rgba(34,211,238,0.3)' : 'rgba(16,185,129,0.3)'}`,
            }}>
              {project.status === 'Ongoing' ? '⚡ Ongoing' : '✅ Completed'}
            </span>
            {project.supervisorVerified && (
              <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: 10 }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {project.techStack.map(t => <Tag key={t} label={t} color={color} />)}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 2 }}>Supervisor</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>{project.supervisor || 'Not assigned'}</p>
              {project.supervisorVerified && <span style={{ fontSize: '0.7rem', color: '#10B981' }}>✓</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 2 }}>Timeline</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              {project.endDate ? ` → ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' → Present'}
            </p>
          </div>
        </div>

        {/* Team members */}
        {project.teamMembers.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted)', marginRight: 2 }}>Team:</span>
            {project.teamMembers.map((m, i) => (
              <span key={i} title={m} style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: '0.62rem', fontWeight: 700, color: '#fff',
                background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{m.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
            ))}
            {project.teamMembers.length > 3 && <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>+{project.teamMembers.length - 3}</span>}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {/* Live Demo — always shown, fallback to portfolio link */}
          <a
            href={project.liveLink || DEFAULT_DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '5px 14px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.06) 100%)',
              color: '#22D3EE',
              border: '1px solid rgba(34,211,238,0.4)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
              boxShadow: '0 0 8px rgba(34,211,238,0.1)',
              transition: 'all 0.2s',
            }}
          >
            🌐 Live Demo
          </a>
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
              padding: '5px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', border: '1px solid var(--border)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
            }}>⌨️ GitHub</a>
          )}
          {!project.supervisorVerified && (
            <button style={{
              padding: '5px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)',
              cursor: 'pointer',
            }}>+ Add Supervisor</button>
          )}
          <button
            onClick={() => onDelete(project.id)}
            style={{
              marginLeft: 'auto', padding: '5px 10px', borderRadius: 8, fontSize: '0.72rem',
              background: 'transparent', color: 'rgba(244,63,94,0.5)', border: '1px solid rgba(244,63,94,0.15)',
              cursor: 'pointer',
            }}
          >🗑</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Project Modal ──────────────────────────
function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
  const [form, setForm] = useState({
    title: '', topic: '', sector: 'EdTech', description: '', techStack: '',
    teamMembers: '', supervisor: '', startDate: '', endDate: '',
    status: 'Ongoing' as 'Ongoing' | 'Completed', liveLink: '', githubLink: '',
  });
  const [supQuery, setSupQuery] = useState('');
  const [supOpen, setSupOpen] = useState(false);

  const filteredTeachers = TEACHERS.filter(t => t.toLowerCase().includes(supQuery.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['#6C63FF', '#22D3EE', '#10B981', '#F59E0B', '#A78BFA', '#F43F5E'];
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: form.title,
      topic: form.topic,
      sector: form.sector,
      description: form.description,
      techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      teamMembers: form.teamMembers.split(',').map(m => m.trim()).filter(Boolean),
      supervisor: form.supervisor,
      supervisorVerified: false,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      status: form.status,
      liveLink: form.liveLink || undefined,
      githubLink: form.githubLink || undefined,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    onAdd(newProject);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.875rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, display: 'block', fontWeight: 600 };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto',
        background: 'var(--surface-2)', border: '1px solid rgba(108,99,255,0.25)',
        borderRadius: 20, padding: '1.75rem',
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Add New Project</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>Showcase your academic & personal projects</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Project Title *</label>
              <input required style={inputStyle} placeholder="EduVision AI Platform" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Topic / Focus</label>
              <input style={inputStyle} placeholder="AI-powered analytics" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Sector / Category</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                {['EdTech', 'IoT / Smart Systems', 'AI / ML', 'Blockchain', 'Social / Networking', 'Mobile', 'Web', 'Research', 'Other'].map(s => (
                  <option key={s} value={s} style={{ background: 'var(--surface-2)' }}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Brief description of the project…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Technology Stack (comma-separated)</label>
              <input style={inputStyle} placeholder="React, Node.js, MongoDB" value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Team Members (comma-separated)</label>
              <input style={inputStyle} placeholder="Joy kumar Yuv, Nadia Islam" value={form.teamMembers} onChange={e => setForm(f => ({ ...f, teamMembers: e.target.value }))} />
            </div>
            {/* Supervisor search */}
            <div style={{ gridColumn: '1/-1', position: 'relative' }}>
              <label style={labelStyle}>Supervisor</label>
              <input
                style={inputStyle} placeholder="Search teacher name…"
                value={supQuery || form.supervisor}
                onFocus={() => setSupOpen(true)}
                onBlur={() => setTimeout(() => setSupOpen(false), 150)}
                onChange={e => { setSupQuery(e.target.value); setForm(f => ({ ...f, supervisor: '' })); }}
              />
              {supOpen && filteredTeachers.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)', overflow: 'hidden', marginTop: 4,
                }}>
                  {filteredTeachers.map(t => (
                    <button key={t} type="button" onMouseDown={() => { setForm(f => ({ ...f, supervisor: t })); setSupQuery(''); setSupOpen(false); }}
                      style={{ width: '100%', padding: '8px 14px', background: 'none', border: 'none', color: 'var(--text)', fontSize: '0.83rem', cursor: 'pointer', textAlign: 'left' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.12)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >👤 {t}</button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" style={inputStyle} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input type="date" style={inputStyle} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Ongoing' | 'Completed' }))}>
                <option value="Ongoing" style={{ background: 'var(--surface-2)' }}>Ongoing</option>
                <option value="Completed" style={{ background: 'var(--surface-2)' }}>Completed</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Live Link</label>
              <input style={inputStyle} placeholder="https://…" value={form.liveLink} onChange={e => setForm(f => ({ ...f, liveLink: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>GitHub Link</label>
              <input style={inputStyle} placeholder="https://github.com/…" value={form.githubLink} onChange={e => setForm(f => ({ ...f, githubLink: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{
              padding: '0.6rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" style={{
              padding: '0.6rem 1.5rem', borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #22D3EE)',
              border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(108,99,255,0.35)',
            }}>+ Add Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────
export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Ongoing' | 'Completed'>('All');

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter);
  const ongoing = projects.filter(p => p.status === 'Ongoing').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const verified = projects.filter(p => p.supervisorVerified).length;

  return (
    <div className="fade-in">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Projects', value: projects.length, icon: '🗂️', color: '#6C63FF' },
          { label: 'Ongoing', value: ongoing, icon: '⚡', color: '#22D3EE' },
          { label: 'Completed', value: completed, icon: '✅', color: '#10B981' },
          { label: 'Verified', value: verified, icon: '🛡️', color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} className="glass-card stat-card" style={{ padding: '0.875rem 1rem', borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['All', 'Ongoing', 'Completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: filter === f ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#6C63FF' : 'var(--muted)', transition: 'all 0.2s',
            }}>{f}</button>
          ))}
        </div>
        <button
          id="add-project-btn"
          onClick={() => setShowModal(true)}
          style={{
            padding: '0.55rem 1.25rem', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, #6C63FF, #22D3EE)',
            color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >+ Add Project</button>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>📂</p>
          <p style={{ fontWeight: 600 }}>No projects found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} onDelete={id => setProjects(ps => ps.filter(p => p.id !== id))} />
          ))}
        </div>
      )}

      {showModal && <AddProjectModal onClose={() => setShowModal(false)} onAdd={p => setProjects(ps => [p, ...ps])} />}
    </div>
  );
}
