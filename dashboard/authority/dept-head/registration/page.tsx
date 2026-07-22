'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';

const regData = [
  { id: 'CSE-221-15-5231', name: 'Arafat Islam Rafi', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop', courses: 4, credits: 12, status: 'Approved', payment: 'Cleared' },
  { id: 'CSE-221-15-5232', name: 'Sanjida Akter Mim', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', courses: 3, credits: 9, status: 'Pending', payment: 'Cleared' },
  { id: 'CSE-221-15-5233', name: 'Mehedi Hasan Shanto', photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop', courses: 2, credits: 6, status: 'Incomplete', payment: 'Pending' },
  { id: 'CSE-231-15-6101', name: 'Raihan Karim', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', courses: 4, credits: 12, status: 'Approved', payment: 'Cleared' },
  { id: 'CSE-231-15-6102', name: 'Fahima Khatun', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', courses: 4, credits: 12, status: 'Approved', payment: 'Cleared' },
  { id: 'CSE-231-15-6103', name: 'Sabbir Rahman', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop', courses: 1, credits: 3, status: 'Hold', payment: 'Pending' },
];

const statusStyle = (status: string) => {
  const map: Record<string, { bg: string, color: string }> = {
    'Approved': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    'Pending': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
    'Incomplete': { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' },
    'Hold': { bg: 'rgba(220,38,38,0.1)', color: '#DC2626' },
  };
  return map[status] || { bg: 'var(--surface-2)', color: 'var(--muted)' };
};

export default function DeptHeadRegistrationPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Course Registration 📋" subtitle="CSE Department — Enrollment Monitoring" accentColor="#10B981" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Registered" value="1,148" sub="This semester" icon="📋" color="#3B82F6" />
          <StatCard label="Approved" value="1,040" sub="Registration finalized" icon="✅" color="#10B981" />
          <StatCard label="Pending Approval" value="62" sub="Awaiting clearance" icon="⏳" color="#F59E0B" />
          <StatCard label="On Hold / Issues" value="46" sub="Payment/Academic hold" icon="🚫" color="#DC2626" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>📋 Registration Status Directory</h3>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
              <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: '6px', fontWeight: 700 }}>✅ Approved: 1,040</span>
              <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', borderRadius: '6px', fontWeight: 700 }}>⏳ Pending: 62</span>
              <span style={{ padding: '4px 10px', background: 'rgba(220,38,38,0.1)', color: '#DC2626', borderRadius: '6px', fontWeight: 700 }}>🚫 Hold: 46</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {regData.map(student => {
              const s = statusStyle(student.status);
              return (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={student.photo} alt={student.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{student.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '3px 0 0' }}>
                        ID: {student.id} | Courses: {student.courses} | Credits: {student.credits} | Payment: <strong style={{ color: student.payment === 'Cleared' ? '#10B981' : '#DC2626' }}>{student.payment}</strong>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '8px', background: s.bg, color: s.color, fontWeight: 700 }}>{student.status}</span>
                    {student.status === 'Pending' && (
                      <button style={{ padding: '5px 12px', borderRadius: '6px', background: '#10B981', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                    )}
                    {student.status === 'Hold' && (
                      <button style={{ padding: '5px 12px', borderRadius: '6px', background: '#3B82F6', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Review</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
