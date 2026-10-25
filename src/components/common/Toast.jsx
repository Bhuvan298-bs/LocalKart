import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        const Icon =
          type === 'success'
            ? CheckCircle2
            : type === 'error'
            ? AlertCircle
            : type === 'warning'
            ? AlertTriangle
            : Info;

        return (
          <div key={toast.id} className={`toast toast-${type}`}>
            <Icon
              size={18}
              style={{
                color:
                  type === 'success'
                    ? 'var(--color-success)'
                    : type === 'error'
                    ? 'var(--color-error)'
                    : type === 'warning'
                    ? 'var(--color-warning)'
                    : 'var(--color-primary)',
                flexShrink: 0,
                marginTop: '1px'
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="btn btn-ghost btn-icon-only"
              style={{ padding: '2px', marginLeft: 'auto', color: 'var(--color-text-muted)' }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
