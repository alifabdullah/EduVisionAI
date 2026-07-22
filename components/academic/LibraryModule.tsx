'use client';
import { useState, useMemo } from 'react';
import { LIBRARY_VISITS, ISSUED_BOOKS, LibraryVisit, IssuedBook } from '@/data/academicData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function LibraryModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'books'>('overview');
  const [bookSearch, setBookSearch] = useState('');
  const [bookFilter, setBookFilter] = useState<'all' | 'Reading' | 'Returned' | 'Overdue'>('all');
  
  // Custom mock interactive states
  const [books, setBooks] = useState<IssuedBook[]>(ISSUED_BOOKS);
  const [visits, setVisits] = useState<LibraryVisit[]>(LIBRARY_VISITS);
  const [checkInStatus, setCheckInStatus] = useState<'out' | 'in'>('out');
  const [newBookProgress, setNewBookProgress] = useState<{ [id: string]: number }>({});
  
  // Stats
  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const totalMinutes = visits.reduce((acc, v) => acc + v.duration, 0);
    const avgDuration = Math.round(totalMinutes / totalVisits);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    const reading = books.filter(b => b.status === 'Reading').length;
    const overdue = books.filter(b => b.status === 'Overdue').length;
    const returned = books.filter(b => b.status === 'Returned').length;
    
    return { totalVisits, totalHours, avgDuration, reading, overdue, returned };
  }, [visits, books]);

  // Group visits by date for the Area chart
  const chartData = useMemo(() => {
    return visits.slice(0, 10).reverse().map(v => {
      const parts = v.date.split('-');
      const formattedDate = `${parts[2]}/${parts[1]}`;
      return {
        date: formattedDate,
        hours: parseFloat((v.duration / 60).toFixed(1)),
        duration: v.duration
      };
    });
  }, [visits]);

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
                          b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
                          b.category.toLowerCase().includes(bookSearch.toLowerCase());
      const matchFilter = bookFilter === 'all' ? true : b.status === bookFilter;
      return matchSearch && matchFilter;
    });
  }, [books, bookSearch, bookFilter]);

  const handleCheckInToggle = () => {
    if (checkInStatus === 'out') {
      setCheckInStatus('in');
      // Add current visit to the beginning
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const newVisit: LibraryVisit = {
        date: dateStr,
        entryTime: timeStr,
        exitTime: '--:--',
        duration: 0
      };
      setVisits([newVisit, ...visits]);
    } else {
      setCheckInStatus('out');
      // Complete the duration of first visit (mock 120 mins)
      const updatedVisits = [...visits];
      if (updatedVisits[0] && updatedVisits[0].exitTime === '--:--') {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        updatedVisits[0].exitTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        updatedVisits[0].duration = 120; // Default mock study session duration
        setVisits(updatedVisits);
      }
    }
  };

  const handleProgressChange = (id: string, val: number) => {
    setNewBookProgress(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveProgress = (id: string) => {
    const progressVal = newBookProgress[id];
    if (progressVal === undefined) return;
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        const isComplete = progressVal >= 100;
        return {
          ...b,
          progress: Math.min(100, Math.max(0, progressVal)),
          status: isComplete ? 'Returned' : b.status,
          returnDate: isComplete ? new Date().toISOString().split('T')[0] : b.returnDate
        };
      }
      return b;
    }));
  };

  return (
    <div className="fade-in" style={{ marginBottom: '2rem' }}>
      {/* Header and Live Tracker */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(34,211,238,0.05) 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 20,
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
          }}>📖</div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Smart Library Portal</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Digital borrowing & RFID check-in tracker</p>
          </div>
        </div>
        
        {/* Interactive Check-in Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {checkInStatus === 'in' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 99, border: '1px solid rgba(16,185,129,0.25)' }}>
              <span style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981' }}>Inside Library (Study Room 304)</span>
            </div>
          )}
          <button
            onClick={handleCheckInToggle}
            style={{
              padding: '0.55rem 1.25rem',
              background: checkInStatus === 'in' ? 'var(--danger)' : '#10B981',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            <span>{checkInStatus === 'in' ? '🚪 Tap Out' : '⚡ Tap In (RFID Check-in)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { id: 'overview', label: 'Library Analytics', icon: '📊' },
          { id: 'books', label: 'Issued Books & Logs', icon: '📚' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: '0.5rem 1rem',
              background: activeTab === t.id ? 'rgba(108,99,255,0.12)' : 'transparent',
              color: activeTab === t.id ? '#6C63FF' : 'var(--muted)',
              border: 'none',
              borderBottom: activeTab === t.id ? '2px solid #6C63FF' : '2px solid transparent',
              fontSize: '0.82rem',
              fontWeight: activeTab === t.id ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
              borderRadius: '6px 6px 0 0'
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Analytics Tab */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div className="glass-card stat-card" style={{ padding: '1rem', borderLeft: '3px solid #10B981' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Study Duration</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>{stats.totalHours} hrs</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Accumulated this term</p>
            </div>
            <div className="glass-card stat-card" style={{ padding: '1rem', borderLeft: '3px solid #22D3EE' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Library Visits</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>{stats.totalVisits}</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Recorded RFID entries</p>
            </div>
            <div className="glass-card stat-card" style={{ padding: '1rem', borderLeft: '3px solid #A78BFA' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Avg. Session Time</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: 'var(--text)' }}>{stats.avgDuration} min</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Per entry duration</p>
            </div>
            <div className="glass-card stat-card" style={{ padding: '1rem', borderLeft: '3px solid #F59E0B' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Overdue Books</p>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0', color: stats.overdue > 0 ? 'var(--danger)' : 'var(--text)' }}>{stats.overdue}</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Penalty risk: {stats.overdue > 0 ? 'High' : 'None'}</p>
            </div>
          </div>

          {/* Area Chart & Library Goals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>Study Activity Tracker</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Hours spent in library over the last 10 visits</p>
                </div>
                <span className="badge badge-primary" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>RFID Verified</span>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text)' }} />
                  <Area type="monotone" dataKey="hours" stroke="#10B981" fillOpacity={1} fill="url(#colorHours)" strokeWidth={2} name="Study Time (Hours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Study Target Status & RFID logs */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>Weekly Study Goal</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Progress towards 15 hrs target</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>78%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: '78%', background: 'linear-gradient(90deg, #10B981, #22D3EE)', borderRadius: 99 }} />
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Recent Logged Entries</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {visits.slice(0, 3).map((v, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 600 }}>📅 {v.date}</span>
                      <span style={{ color: 'var(--muted)' }}>⏳ {v.entryTime} - {v.exitTime}</span>
                      <span className="badge badge-low" style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE', fontSize: '0.65rem' }}>{v.duration} min</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issued Books Tab */}
      {activeTab === 'books' && (
        <div className="glass-card fade-in" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>Library Ledger</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Check progress of physical books issued on your RFID account</p>
            </div>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search title, author or tag…"
                value={bookSearch}
                onChange={e => setBookSearch(e.target.value)}
                style={{
                  padding: '0.45rem 0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  minWidth: 180
                }}
              />
              <select
                value={bookFilter}
                onChange={e => setBookFilter(e.target.value as any)}
                style={{
                  padding: '0.45rem 0.75rem',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="all">All Books</option>
                <option value="Reading">Currently Reading</option>
                <option value="Overdue">Overdue Alerts</option>
                <option value="Returned">Returned History</option>
              </select>
            </div>
          </div>

          {/* Book Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {filteredBooks.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', textAlign: 'center', gridColumn: '1/-1', padding: '2rem 0' }}>No books matching filters found.</p>
            ) : filteredBooks.map(book => {
              const progress = book.progress ?? 0;
              const isOverdue = book.status === 'Overdue';
              const isReturned = book.status === 'Returned';
              
              return (
                <div
                  key={book.id}
                  className="stat-card"
                  style={{
                    padding: '1rem',
                    background: 'var(--surface-2)',
                    border: `1px solid ${isOverdue ? 'rgba(244,63,94,0.2)' : 'var(--border)'}`,
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 12,
                    borderLeft: `3px solid ${isOverdue ? 'var(--danger)' : isReturned ? 'var(--success)' : '#6C63FF'}`
                  }}
                >
                  <div>
                    {/* Category & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{book.category}</span>
                      <span className={`badge badge-${isOverdue ? 'high' : isReturned ? 'low' : 'info'}`} style={{ fontSize: '0.68rem' }}>
                        {book.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: '2px 0' }}>{book.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>By {book.author}</p>
                  </div>

                  {/* Progress slide */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Reading Progress</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isReturned ? 'var(--success)' : '#6C63FF' }}>{progress}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: isReturned ? 'var(--success)' : '#6C63FF', borderRadius: 99 }} />
                    </div>
                  </div>

                  {/* Dates / Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: 8,
                    fontSize: '0.72rem',
                    color: 'var(--muted)'
                  }}>
                    <div>
                      <p>Issued: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{book.issueDate}</span></p>
                      <p>{isReturned ? 'Returned: ' : 'Due date: '} <span style={{ color: isOverdue ? 'var(--danger)' : 'var(--text)', fontWeight: 600 }}>{isReturned ? book.returnDate : book.dueDate}</span></p>
                    </div>

                    {/* Progress Editor for current reading books */}
                    {!isReturned && (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="number"
                          placeholder="%"
                          min="0"
                          max="100"
                          value={newBookProgress[book.id] ?? ''}
                          onChange={e => handleProgressChange(book.id, parseInt(e.target.value))}
                          style={{
                            width: 42,
                            padding: '3px 4px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            color: 'var(--text)',
                            fontSize: '0.7rem',
                            outline: 'none',
                            textAlign: 'center'
                          }}
                        />
                        <button
                          onClick={() => handleSaveProgress(book.id)}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(108,99,255,0.2)',
                            color: '#6C63FF',
                            border: '1px solid rgba(108,99,255,0.4)',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
