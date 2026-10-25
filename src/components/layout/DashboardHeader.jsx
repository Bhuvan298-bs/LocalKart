import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Store } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import Button from '../common/Button.jsx';

export default function DashboardHeader({ title, roleLabel = 'Merchant Console' }) {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  return (
    <header className="dashboard-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Link to="/" className="btn btn-ghost btn-sm" title="Back to Customer Store">
          <ArrowLeft size={16} />
          <span>Exit to Marketplace</span>
        </Link>
        <span className="text-separator">|</span>
        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
          {roleLabel}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            {user?.name || 'Authorized Merchant'}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {user?.email || 'demo@merchant.com'}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={LogOut}
          onClick={() => {
            switchRole('CUSTOMER');
            navigate('/');
          }}
          title="Switch back to Customer view"
        >
          Customer View
        </Button>
      </div>
    </header>
  );
}
