export default function MetricCard({ label, value, helperText, icon: Icon, color = 'var(--color-primary)' }) {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span className="metric-label">{label}</span>
        {Icon && (
          <div style={{ color: color, opacity: 0.85 }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="metric-val mono-num">{value}</div>
      {helperText && <div className="metric-helper">{helperText}</div>}
    </div>
  );
}
