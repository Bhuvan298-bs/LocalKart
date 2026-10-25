import { Trash2 } from 'lucide-react';
import QuantitySelector from '../products/QuantitySelector.jsx';
import ProductImage from '../products/ProductImage.jsx';
import { formatINR } from '../../utils/currency.js';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="cart-item-row">
      <ProductImage
        src={item.image}
        alt={item.name}
        className="cart-item-img"
      />

      <div className="cart-item-details">
        <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
          {item.name}
        </h4>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          {item.unit} · <span className="mono-num">{formatINR(item.price)} each</span>
        </div>
      </div>

      <div className="cart-item-qty">
        <QuantitySelector
          value={item.quantity}
          onChange={(newQty) => onUpdateQuantity(item.id, newQty)}
          min={1}
          max={99}
        />
      </div>

      <div className="cart-item-total" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className="mono-num" style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>
          {formatINR(lineTotal)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="btn btn-ghost btn-icon-only"
          style={{ color: 'var(--color-text-muted)', padding: '4px' }}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
