'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import teacherData from '@/data/teacher.json';

export default function TeacherProfilePage() {
  const { profile } = teacherData;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Profile" subtitle="Your teacher profile and account information" accentColor="#22D3EE" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">
        <div style={{ maxWidth: 700 }}>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #22D3EE, #6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {profile.name.split(' ').filter(n => !['Dr.','Prof.'].includes(n)).map(n => n[0]).join('').slice(0,2)}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{profile.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 10 }}>{profile.designation} · {profile.department}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-info">👨‍🏫 Teacher</span>
                <span className="badge badge-primary">Since {profile.joinYear}</span>
              </div>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 14 }}>Professional Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Teacher ID', value: profile.id },
                { label: 'Email', value: profile.email },
                { label: 'Designation', value: profile.designation },
                { label: 'Department', value: profile.department },
                { label: 'Joined', value: profile.joinYear.toString() },
                { label: 'Courses Assigned', value: teacherData.courses.length.toString() },
              ].map(f => (
                <div key={f.label} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, marginBottom: 14 }}>Expertise & Mentorship Areas</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {profile.expertise.map(e => <span key={e} style={{ padding: '5px 12px', background: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500 }}>{e}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.mentorshipAreas.map(m => <span key={m} style={{ padding: '5px 12px', background: 'rgba(108,99,255,0.12)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.25)', borderRadius: 999, fontSize: '0.8rem', fontWeight: 500 }}>{m}</span>)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
