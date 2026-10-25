import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import ProductImage from '../products/ProductImage.jsx';
import Button from '../common/Button.jsx';
import { formatINR } from '../../utils/currency.js';

export default function ShopCard({ shop }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/shops/${shop.slug}`);
  };

  return (
    <div className="shop-card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
      <div className="shop-card-media">
        <ProductImage
          src={shop.image}
          alt={shop.name}
          category="shop"
        />
        <div className="shop-card-badge">
          <span
            style={{
              color: shop.isOpen ? 'var(--color-success)' : 'var(--color-error)',
              fontWeight: 600
            }}
          >
            {shop.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="shop-card-body">
        <div className="shop-card-category">{shop.category}</div>
        <h3 className="shop-card-title">{shop.name}</h3>

        <div className="shop-card-locality">
          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
          <span>{shop.locality}</span>
        </div>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)', lineClamp: 2 }}>
          {shop.description}
        </p>

        <div className="shop-card-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} />
            <span>{shop.timing}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="mono-num" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
              {formatINR(shop.deliveryFee)} delivery
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
            >
              Visit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
