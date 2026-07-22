interface AlertBadgeProps {
  priority: 'high' | 'medium' | 'low';
  label?: string;
}

export default function AlertBadge({ priority, label }: AlertBadgeProps) {
  const map = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' };
  return <span className={`badge ${map[priority]}`}>{label || priority}</span>;
}
