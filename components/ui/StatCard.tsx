interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  color?: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ label, value, sub, icon, color = '#6C63FF', trend }: StatCardProps) {
  return (
    <div className="stat-card glass-card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
            {icon}
          </div>
        )}
      </div>
      <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>{sub}</p>}
      {trend && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trend.value >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
