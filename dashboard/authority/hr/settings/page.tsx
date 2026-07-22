'use client';
import { useState } from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import { useApp } from '@/context/AppContext';

export default function HRSettingsPage() {
  const { user } = useApp();
  const [emailNotif, setEmailNotif] = useState(true);
  const [leaveAlerts, setLeaveAlerts] = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(true);
  const [auditLog, setAuditLog] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div
      onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#0EA5E9' : '#CBD5E1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: 2, left: value ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <TopNavbar title="Settings ⚙️" subtitle="HR Portal Preferences & Configuration" accentColor="#0EA5E9" />
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }} className="fade-in">

        <div style={{ maxWidth: 720 }}>
          {/* Notification Settings */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>🔔 Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Email Notifications', desc: 'Receive HR alerts and reports via email', value: emailNotif, onChange: setEmailNotif },
                { label: 'Leave Request Alerts', desc: 'Real-time notifications for pending leave approvals', value: leaveAlerts, onChange: setLeaveAlerts },
                { label: 'Payroll Reminders', desc: 'Automated alerts for approaching payroll cycles', value: payrollAlerts, onChange: setPayrollAlerts },
                { label: 'HR Audit Logging', desc: 'Enforce logging of all HR administrative actions', value: auditLog, onChange: setAuditLog },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '3px 0 0' }}>{item.desc}</p>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>👤 Account Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Display Name</label>
                <input defaultValue={user?.name || 'Sarah Jenkins'} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Email</label>
                <input defaultValue={user?.email || 'hr.director@edu.ai'} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleSave}
              style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: saved ? '#10B981' : 'linear-gradient(135deg, #0EA5E9, #3B82F6)', color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
              {saved ? '✅ Settings Saved!' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
