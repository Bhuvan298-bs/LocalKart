import { useNavigate } from 'react-router-dom';
import { Store, Calendar, ArrowRight } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import Button from '../common/Button.jsx';
import { formatINR } from '../../utils/currency.js';

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/orders/${order.id}`);
  };

  const formattedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        marginBottom: 'var(--space-4)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)'
      }}
      onClick={handleNavigate}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
            {order.orderNumber}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)' }}>
        <Store size={16} />
        <span>{order.shopName}</span>
        <span className="text-separator">·</span>
        <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400, fontSize: 'var(--font-size-xs)' }}>
          {order.shopLocality}
        </span>
      </div>

      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
        {order.items.map((it, idx) => (
          <span key={idx}>
            {it.quantity}x {it.name} ({it.unit}){idx < order.items.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-subtle)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>
            Total Amount ({order.fulfillmentType === 'PICKUP' ? 'Store Pickup' : 'Home Delivery'})
          </span>
          <span className="mono-num" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
            {formatINR(order.totalAmount)}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          View Details & Tracking
        </Button>
      </div>
    </div>
  );
}
