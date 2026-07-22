'use client';
import { useState, useRef, useEffect } from 'react';
import { SEMESTERS } from '@/data/academicData';

interface SemesterSelectorProps {
  selectedCode: string;
  onSearch: (code: string) => void;
  loading?: boolean;
}

export default function SemesterSelector({ selectedCode, onSearch, loading }: SemesterSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pendingCode, setPendingCode] = useState(selectedCode);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = SEMESTERS.filter(s =>
    s.label.toLowerCase().includes(query.toLowerCase()) || s.code.includes(query)
  );
  const selected = SEMESTERS.find(s => s.code === pendingCode);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(34,211,238,0.05) 100%)',
      border: '1px solid rgba(108,99,255,0.2)',
      borderRadius: 20,
      padding: '1.5rem 2rem',
      marginBottom: '1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      flexWrap: 'wrap',
    }}>
      {/* Label */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6C63FF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Academic Period</p>
        <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>Select Semester</p>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: 'var(--border)', flexShrink: 0 }} />

      {/* Searchable Dropdown */}
      <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 360 }}>
        <button
          id="semester-dropdown-btn"
          onClick={() => setOpen(o => !o)}
          style={{
            width: '100%',
            padding: '0.7rem 1rem',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${open ? '#6C63FF' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 12,
            color: 'var(--text)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: open ? '0 0 0 3px rgba(108,99,255,0.15)' : 'none',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem' }}>📅</span>
            {selected ? `${selected.label}  ·  ${selected.code}` : 'Choose semester…'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </button>

        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: 'var(--surface-2)',
            border: '1px solid rgba(108,99,255,0.25)',
            borderRadius: 12,
            zIndex: 100,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease',
          }}>
            {/* Search input inside dropdown */}
            <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
              <input
                autoFocus
                placeholder="Search semester…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '0.45rem 0.75rem',
                  color: 'var(--text)',
                  fontSize: '0.83rem',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ maxHeight: 220, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <p style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontSize: '0.82rem' }}>No results</p>
              ) : filtered.map(s => (
                <button
                  key={s.code}
                  onClick={() => { setPendingCode(s.code); setOpen(false); setQuery(''); }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    background: pendingCode === s.code ? 'rgba(108,99,255,0.18)' : 'transparent',
                    border: 'none',
                    borderLeft: pendingCode === s.code ? '3px solid #6C63FF' : '3px solid transparent',
                    color: pendingCode === s.code ? '#6C63FF' : 'var(--text)',
                    fontSize: '0.87rem',
                    fontWeight: pendingCode === s.code ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (pendingCode !== s.code) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { if (pendingCode !== s.code) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <span>{s.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.07)', padding: '2px 8px', borderRadius: 6 }}>{s.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        id="semester-search-btn"
        onClick={() => onSearch(pendingCode)}
        disabled={loading}
        style={{
          padding: '0.7rem 1.5rem',
          background: loading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6C63FF, #22D3EE)',
          border: 'none',
          borderRadius: 12,
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
          boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.35)',
          transition: 'all 0.2s',
          letterSpacing: '0.3px',
        }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; }}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Loading…
          </>
        ) : (
          <> 🔍 Search </>
        )}
      </button>

      {/* Currently loaded label */}
      {selectedCode && (
        <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 2 }}>Showing data for</p>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#22D3EE' }}>
            {SEMESTERS.find(s => s.code === selectedCode)?.label} — {selectedCode}
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
