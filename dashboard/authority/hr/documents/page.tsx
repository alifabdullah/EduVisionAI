'use client';
import TopNavbar from '@/components/layout/TopNavbar';
import StatCard from '@/components/ui/StatCard';

const DOCUMENTS = [
  { name: 'Employee Policies 2026.pdf', type: 'Policy', size: '2.4 MB', date: 'Jan 10, 2026' },
  { name: 'Dr. Emily Carter - Contract.pdf', type: 'Contract', size: '1.1 MB', date: 'Jan 01, 2026' },
  { name: 'Payroll Register June.xlsx', type: 'Payroll', size: '4.5 MB', date: 'Jul 01, 2026' },
  { name: 'Holiday Calendar 2026.pdf', type: 'General', size: '0.8 MB', date: 'Dec 15, 2025' },
];

export default function HRDocumentsPage() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Documents Center 📂" subtitle="Secure HR Document Storage & Management" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <StatCard label="Total Documents" value="12,450" sub="Securely stored files" icon="📂" color="#0EA5E9" />
          <StatCard label="Contracts" value="842" sub="Active employee contracts" icon="📄" color="#8B5CF6" />
          <StatCard label="Policies" value="15" sub="University guidelines" icon="📜" color="#10B981" />
          <StatCard label="Storage Used" value="14.2 GB" sub="Of 500 GB allocated" icon="💾" color="#F59E0B" />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>📄 Recent Documents</h3>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>+ Upload Document</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DOCUMENTS.map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📄</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: 'var(--text)' }}>{doc.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '3px 0 0' }}>{doc.type} | {doc.size}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{doc.date}</span>
                  <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>View / Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
