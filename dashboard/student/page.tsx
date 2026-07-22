'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import studentData from '@/data/student.json';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, Legend
} from 'recharts';
import { useActiveStudyPlan, setActiveStudyPlan } from '@/utils/globalState';

export default function StudentDashboard() {
  const { profile, academicSummary, performanceTrend, skills } = studentData;
  const radarData = Object.entries(skills).map(([key, val]) => ({ subject: key, A: val, fullMark: 100 }));
  const activePlan = useActiveStudyPlan();
  const { peers } = studentData;
  const { classSubjectAvgs, classAvgGPA, percentile, rank, totalStudents } = peers;
  
  const handleToggleTask = (index: number) => {
    if (!activePlan) return;
    const newTasks = [...activePlan.tasks];
    newTasks[index].completed = !newTasks[index].completed;
    const completedCount = newTasks.filter(t => t.completed).length;
    const newProgress = Math.round((completedCount / newTasks.length) * 100);
    setActiveStudyPlan({ ...activePlan, tasks: newTasks, progress: newProgress });
  };
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F7FA', minHeight: '100vh' }}>
      <TopNavbar
        title={`Welcome back, ${profile.name} 👋`}
        subtitle={`${profile.department} • Semester ${profile.semester} • Roll: ${profile.roll}`}
      />
      
      <main style={{ flex: 1, display: 'flex', gap: '24px', padding: '24px', overflowY: 'auto' }} className="fade-in">
        
        {/* Main Content Area (Left/Center) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Current CGPA</p>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎓</div>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D4ED8', marginBottom: 4, lineHeight: 1 }}>{academicSummary.currentGPA.toFixed(2)}</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 12 }}>Out of 4.00</p>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#50B748' }}>↑ 5.2% vs last semester</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Attendance</p>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF8EA', color: '#50B748', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#50B748', marginBottom: 4, lineHeight: 1 }}>{academicSummary.attendanceAvg}%</h2>
              <p style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>⚠️ Below threshold</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Assignments</p>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF3FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</div>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1D4ED8', marginBottom: 4, lineHeight: 1 }}>{academicSummary.assignmentsCompleted}/{academicSummary.assignmentsTotal}</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 12 }}>Completed this semester</p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Class Rank</p>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF8EA', color: '#50B748', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏆</div>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#50B748', marginBottom: 4, lineHeight: 1 }}>#{studentData.peers.rank}</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 12 }}>Top {Math.round((studentData.peers.rank / studentData.peers.totalStudents) * 100)}% of {studentData.peers.totalStudents} students</p>
            </div>
          </div>

          {/* Peer Benchmark Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            {/* Percentile Banner */}
            <div className="glass-card" style={{ padding: '24px', background: percentile >= 60 ? '#EAF8EA' : '#FFF7ED', border: `1px solid ${percentile >= 60 ? '#50B748' : '#F59E0B'}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: '3rem', fontWeight: 900, color: percentile >= 60 ? '#50B748' : '#F59E0B', margin: 0, lineHeight: 1 }}>{percentile}%</p>
                <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700, marginTop: 4 }}>Percentile</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                  {percentile >= 75 ? '🏆 Top 25% of your class!' : percentile >= 50 ? '📈 Above class average.' : '⚠️ Below class average.'}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  You are ranked #{rank} out of {totalStudents} students in your batch.
                </p>
              </div>
            </div>

            {/* Subject Comparison Chart */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Subject-wise Comparison</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Your marks vs class average</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={classSubjectAvgs.map(s => ({ ...s, subject: s.subject.split(' ')[0] }))} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#0F172A', fontSize: '0.85rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: 10 }} />
                  <Bar dataKey="student" fill="#1D4ED8" radius={[4, 4, 0, 0]} name="Your Marks" />
                  <Bar dataKey="classAvg" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Class Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alert Banner */}
          <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '12px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span>
              <p style={{ color: '#C2410C', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>1 high-priority alert require your attention</p>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#C2410C', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View All →</button>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* GPA Trend */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>GPA Trend</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Performance over semesters</p>
                </div>
                <select style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E7EB', color: '#1D4ED8', fontWeight: 600, fontSize: '0.8rem', background: '#FFFFFF', outline: 'none' }}>
                  <option>6 Semesters</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="semester" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis domain={[2.5, 4.0]} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#0F172A', fontSize: '0.85rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="gpa" stroke="#1D4ED8" strokeWidth={3} dot={{ fill: '#1D4ED8', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Overview */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Skill Overview</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Current skill levels</p>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#1D4ED8', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Details →</button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Radar name="Skills" dataKey="A" stroke="#1D4ED8" fill="#1D4ED8" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Recent Alerts */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Recent Alerts</h3>
                <button style={{ background: 'none', border: 'none', color: '#1D4ED8', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid #E5E7EB' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFF7ED', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>!</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Low Attendance in Database Systems</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Your attendance is 62% (required: 75%)</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>Today, 10:45 AM</span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🗨</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Data Structures Performance</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Score 48% is below passing threshold</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', whiteSpace: 'nowrap' }}>Yesterday, 09:30 PM</span>
                </div>
              </div>
            </div>

            {/* AI Active Study Plan OR Recommendations */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {activePlan ? '🎯 Active Study Plan' : 'AI Recommendations'}
                </h3>
                <button style={{ background: 'none', border: 'none', color: '#1D4ED8', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>View All →</button>
              </div>

              {activePlan ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{activePlan.title}</p>
                    <span style={{ fontWeight: 800, color: '#1D4ED8' }}>{activePlan.progress}%</span>
                  </div>
                  <div style={{ height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${activePlan.progress}%`, height: '100%', background: '#1D4ED8', transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                    {activePlan.tasks.map((task, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(i)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1D4ED8' }} />
                        <span style={{ fontSize: '0.9rem', color: task.completed ? '#94A3B8' : '#0F172A', textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EAF8EA', color: '#50B748', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>📖</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Focus on Data Structures</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Practice with weekly problem sets</p>
                    </div>
                    <span style={{ color: '#64748B' }}>›</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EAF3FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>👥</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Join Programming Club</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Improve problem solving skills</p>
                    </div>
                    <span style={{ color: '#64748B' }}>›</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>📅</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Attend Extra Class</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Database Systems - Every Thu 3 PM</p>
                    </div>
                    <span style={{ color: '#64748B' }}>›</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </main>

      {/* Footer */}
      <footer style={{ background: '#003B95', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF', fontSize: '0.75rem', flexShrink: 0 }}>
        <p style={{ margin: 0 }}>© 2026 Daffodil International University. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 24, opacity: 0.9 }}>
          <span>EduVision AI v1.0</span>
          <span>Building smarter futures with AI 🤍</span>
        </div>
      </footer>
    </div>
  );
}
