'use client';
import { useState } from 'react';
import { Research, INITIAL_RESEARCH, WORKFLOW_STAGES } from '@/data/academicData';

const TEACHERS = [
  'Mr. Md. Sarwar Hossain Mollah', 'Prof. Rashid Khan', 'Dr. Mehedi Hasan',
  'Prof. Sumaiya Akter', 'Dr. Noman Ahmed', 'Prof. Karim Uddin',
];

const STATUS_CONFIG: Record<Research['status'], { color: string; bg: string; icon: string }> = {
  Draft:                  { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: '📄' },
  'Supervisor Connected': { color: '#6C63FF', bg: 'rgba(108,99,255,0.12)',  icon: '🤝' },
  'In Progress':          { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  icon: '⚙️' },
  'Under Review':         { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  icon: '🔍' },
  'Revision Required':    { color: '#F43F5E', bg: 'rgba(244,63,94,0.12)',   icon: '✏️' },
  Accepted:               { color: '#22D3EE', bg: 'rgba(34,211,238,0.12)',  icon: '✅' },
  Published:              { color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: '🌐' },
};

// ── Workflow Timeline ─────────────────────────
function WorkflowTimeline({ stage }: { stage: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 12, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
      {WORKFLOW_STAGES.map((s, i) => {
        const done = i < stage;
        const active = i === stage;
        const color = active ? '#6C63FF' : done ? '#10B981' : 'rgba(255,255,255,0.1)';
        const textColor = active ? '#6C63FF' : done ? '#10B981' : 'var(--muted)';
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: active ? 'rgba(108,99,255,0.2)' : done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700, color,
                boxShadow: active ? '0 0 12px rgba(108,99,255,0.4)' : done ? '0 0 8px rgba(16,185,129,0.25)' : 'none',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.58rem', color: textColor, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', maxWidth: 55, textAlign: 'center', lineHeight: 1.2 }}>{s}</span>
            </div>
            {i < WORKFLOW_STAGES.length - 1 && (
              <div style={{ width: 28, height: 2, background: i < stage ? '#10B981' : 'rgba(255,255,255,0.08)', marginBottom: 18, transition: 'background 0.4s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Research Card ─────────────────────────────
function ResearchCard({ research, onDelete }: { research: Research; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[research.status];

  return (
    <div
      className="glass-card"
      style={{
        border: `1px solid ${cfg.color}25`,
        borderTop: `4px solid ${cfg.color}`,
        transition: 'box-shadow 0.25s, transform 0.25s',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${cfg.color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'none';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ padding: '1.1rem 1.2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.3, marginBottom: 4 }}>{research.title}</h4>
            <p style={{ fontSize: '0.72rem', color: '#6C63FF', fontWeight: 600 }}>{research.researchArea}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
            <span style={{
              padding: '3px 10px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700,
              background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>{cfg.icon} {research.status}</span>
            {research.supervisorVerified && (
              <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Supervisor Verified</span>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {research.keywords.map(k => (
            <span key={k} style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 600, background: 'rgba(108,99,255,0.12)', color: '#A78BFA', border: '1px solid rgba(108,99,255,0.2)' }}>#{k}</span>
          ))}
        </div>

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10, padding: '8px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 1 }}>Supervisor</p>
            <p style={{ fontSize: '0.78rem', fontWeight: 600 }}>{research.supervisor || 'Not assigned'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 1 }}>Timeline</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {new Date(research.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} → {new Date(research.expectedEndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
          {research.journalConference && (
            <div style={{ gridColumn: '1/-1' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 1 }}>Journal / Conference</p>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#22D3EE' }}>{research.journalConference}</p>
            </div>
          )}
        </div>

        {/* Workflow timeline */}
        <WorkflowTimeline stage={research.workflowStage} />

        {/* Expand button */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            marginTop: 12, width: '100%', padding: '6px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {expanded ? '▲ Hide Abstract' : '▼ View Abstract'}
        </button>
      </div>

      {/* Expanded abstract */}
      {expanded && (
        <div style={{ padding: '0 1.2rem 1.1rem', borderTop: '1px solid var(--border)', animation: 'fadeIn 0.2s ease' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 12, lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic' }}>
            {research.abstract}
          </p>
          {research.coAuthors.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 4 }}>Co-Authors</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {research.coAuthors.map(a => (
                  <span key={a} style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)' }}>👤 {a}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            {!research.supervisorVerified && (
              <button style={{ padding: '5px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer' }}>+ Request Supervisor</button>
            )}
            {research.doi && (
              <a href={research.doi} target="_blank" rel="noreferrer" style={{ padding: '5px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)', textDecoration: 'none' }}>🔗 DOI</a>
            )}
            <button onClick={() => onDelete(research.id)} style={{ marginLeft: 'auto', padding: '5px 10px', borderRadius: 8, fontSize: '0.72rem', background: 'transparent', color: 'rgba(244,63,94,0.5)', border: '1px solid rgba(244,63,94,0.15)', cursor: 'pointer' }}>🗑</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Research Modal ─────────────────────────
function AddResearchModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: Research) => void }) {
  const [form, setForm] = useState({
    title: '', abstract: '', researchArea: '', keywords: '',
    supervisor: '', coAuthors: '', startDate: '', expectedEndDate: '',
    status: 'Draft' as Research['status'], journalConference: '', doi: '',
  });
  const [supQuery, setSupQuery] = useState('');
  const [supOpen, setSupOpen] = useState(false);
  const filteredTeachers = TEACHERS.filter(t => t.toLowerCase().includes(supQuery.toLowerCase()));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.875rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '0.85rem', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4, display: 'block', fontWeight: 600 };

  const stageMap: Record<Research['status'], number> = {
    Draft: 0,
    'Supervisor Connected': 1,
    'In Progress': 2,
    'Under Review': 3,
    'Revision Required': 3,
    Accepted: 4,
    Published: 5,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r: Research = {
      id: `res-${Date.now()}`,
      title: form.title,
      abstract: form.abstract,
      researchArea: form.researchArea,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      supervisor: form.supervisor,
      supervisorVerified: false,
      coAuthors: form.coAuthors.split(',').map(a => a.trim()).filter(Boolean),
      startDate: form.startDate,
      expectedEndDate: form.expectedEndDate,
      status: form.status,
      journalConference: form.journalConference || undefined,
      doi: form.doi || undefined,
      workflowStage: stageMap[form.status],
    };
    onAdd(r);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-2)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 20, padding: '1.75rem', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Add Research Paper</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>Track your academic research & publications</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Research Title *</label>
              <input required style={inputStyle} placeholder="Deep Learning-Based…" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Abstract</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="Brief research abstract…" value={form.abstract} onChange={e => setForm(f => ({ ...f, abstract: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Research Area</label>
              <input style={inputStyle} placeholder="Machine Learning / EdTech" value={form.researchArea} onChange={e => setForm(f => ({ ...f, researchArea: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Keywords (comma-separated)</label>
              <input style={inputStyle} placeholder="Deep Learning, LSTM" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} />
            </div>
            {/* Supervisor */}
            <div style={{ gridColumn: '1/-1', position: 'relative' }}>
              <label style={labelStyle}>Supervisor</label>
              <input style={inputStyle} placeholder="Search teacher…" value={supQuery || form.supervisor}
                onFocus={() => setSupOpen(true)} onBlur={() => setTimeout(() => setSupOpen(false), 150)}
                onChange={e => { setSupQuery(e.target.value); setForm(f => ({ ...f, supervisor: '' })); }}
              />
              {supOpen && filteredTeachers.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', overflow: 'hidden', marginTop: 4 }}>
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
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Co-Authors (comma-separated)</label>
              <input style={inputStyle} placeholder="Nadia Islam, Tasneem Karim" value={form.coAuthors} onChange={e => setForm(f => ({ ...f, coAuthors: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" style={inputStyle} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Expected End Date</label>
              <input type="date" style={inputStyle} value={form.expectedEndDate} onChange={e => setForm(f => ({ ...f, expectedEndDate: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Publication Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Research['status'] }))}>
                {(['Draft', 'Under Review', 'Accepted', 'Published'] as const).map(s => (
                  <option key={s} value={s} style={{ background: 'var(--surface-2)' }}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Journal / Conference</label>
              <input style={inputStyle} placeholder="IEEE Transactions…" value={form.journalConference} onChange={e => setForm(f => ({ ...f, journalConference: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>DOI / Publication Link</label>
              <input style={inputStyle} placeholder="https://doi.org/…" value={form.doi} onChange={e => setForm(f => ({ ...f, doi: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.6rem 1.25rem', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ padding: '0.6rem 1.5rem', borderRadius: 10, background: 'linear-gradient(135deg, #6C63FF, #22D3EE)', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(108,99,255,0.35)' }}>+ Add Research</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────
export default function ResearchModule() {
  const [researchList, setResearchList] = useState<Research[]>(INITIAL_RESEARCH);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'All' | Research['status']>('All');

  const filtered = filter === 'All' ? researchList : researchList.filter(r => r.status === filter);
  const counts: Record<Research['status'], number> = {
    Draft: 0, 'Supervisor Connected': 0, 'In Progress': 0,
    'Under Review': 0, 'Revision Required': 0, Accepted: 0, Published: 0,
  };
  researchList.forEach(r => { counts[r.status]++; });

  return (
    <div className="fade-in">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', value: researchList.length, color: '#6C63FF', icon: '📚' },
          { label: 'Draft', value: counts['Draft'], color: '#94A3B8', icon: '📄' },
          { label: 'Under Review', value: counts['Under Review'], color: '#F59E0B', icon: '🔍' },
          { label: 'Published', value: counts['Published'], color: '#10B981', icon: '🌐' },
        ].map(s => (
          <div key={s.label} className="glass-card stat-card" style={{ padding: '0.875rem 1rem', borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['All', 'Draft', 'Under Review', 'Accepted', 'Published'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              background: filter === f ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? '#6C63FF' : 'var(--muted)', transition: 'all 0.2s',
            }}>{f}</button>
          ))}
        </div>
        <button id="add-research-btn" onClick={() => setShowModal(true)} style={{
          padding: '0.55rem 1.25rem', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #6C63FF, #22D3EE)',
          color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(108,99,255,0.3)',
        }}>+ Add Research</button>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 8 }}>🔬</p>
          <p style={{ fontWeight: 600 }}>No research papers found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {filtered.map(r => (
            <ResearchCard key={r.id} research={r} onDelete={id => setResearchList(rl => rl.filter(r => r.id !== id))} />
          ))}
        </div>
      )}

      {showModal && <AddResearchModal onClose={() => setShowModal(false)} onAdd={r => setResearchList(rl => [r, ...rl])} />}
    </div>
  );
}
