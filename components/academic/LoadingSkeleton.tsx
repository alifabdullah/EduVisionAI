'use client';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', animation: 'pulse 1.5s infinite ease-in-out' }}>
      {/* Search Bar Skeleton */}
      <div style={{
        height: 70,
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        width: '100%'
      }} />

      {/* Grid of Mini Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            height: 100,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: 14,
          }} />
        ))}
      </div>

      {/* Chart Rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{
          height: 280,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 16,
        }} />
        <div style={{
          height: 280,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: 16,
        }} />
      </div>

      {/* List / Cards row */}
      <div style={{
        height: 180,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: 16,
        width: '100%'
      }} />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
