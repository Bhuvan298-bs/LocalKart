import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...', rows = 3 }) {
  return (
    <div style={{ padding: 'var(--space-8)', textAlign: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        <Loader2 className="animate-spin" size={24} />
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
          {message}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '600px', margin: '0 auto' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '40px', width: '100%' }}
          />
        ))}
      </div>
    </div>
  );
}
