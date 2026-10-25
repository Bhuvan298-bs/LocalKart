export default function PageHeader({ title, subtitle, action, breadcrumb }) {
  return (
    <div className="page-header">
      <div>
        {breadcrumb && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            {breadcrumb}
          </div>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {action && <div style={{ display: 'flex', gap: 'var(--space-2)' }}>{action}</div>}
    </div>
  );
}
