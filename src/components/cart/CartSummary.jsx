import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Store } from 'lucide-react';
import Button from '../common/Button.jsx';
import { formatINR } from '../../utils/currency.js';
import { useCart } from '../../hooks/useCart.js';

export default function CartSummary({ showCheckoutButton = true }) {
  const navigate = useNavigate();
  const { subtotal, deliveryFee, grandTotal, shopName, shopLocality, items } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="cart-summary-box">
      <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
        Order Summary
      </h3>

      {shopName && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-primary)'
          }}
        >
          <Store size={14} />
          <span>Fulfilling from <strong>{shopName}</strong> ({shopLocality})</span>
        </div>
      )}

      <div className="summary-row">
        <span>Items Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
        <span className="mono-num">{formatINR(subtotal)}</span>
      </div>

      <div className="summary-row">
        <span>Delivery Partner Fee</span>
        <span className="mono-num">
          {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
        </span>
      </div>

      <div className="summary-row summary-total">
        <span>Grand Total</span>
        <span className="mono-num" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' }}>
          {formatINR(grandTotal)}
        </span>
      </div>

      <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
          <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
          <span>No prepayment required — Pay on delivery / pickup</span>
        </div>
        <p>Prices include all applicable local GST and taxes.</p>
      </div>

      {showCheckoutButton && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            style={{ width: '100%' }}
            onClick={() => navigate('/checkout')}
            disabled={isEmpty}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
