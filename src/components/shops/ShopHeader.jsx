import { MapPin, Phone, Clock, Truck, ShieldCheck } from 'lucide-react';
import ProductImage from '../products/ProductImage.jsx';
import { formatINR } from '../../utils/currency.js';

export default function ShopHeader({ shop }) {
  if (!shop) return null;

  return (
    <div className="storefront-hero">
      <div className="storefront-banner">
        <ProductImage
          src={shop.bannerImage || shop.image}
          alt={`${shop.name} banner`}
          category="shop"
        />
      </div>

      <div className="container">
        <div className="storefront-info-strip">
          <div className="storefront-header-content">
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
              <div className="storefront-avatar">
                <ProductImage
                  src={shop.image}
                  alt={shop.name}
                  category="shop"
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
                    {shop.name}
                  </h1>
                  <span
                    className="badge-status"
                    style={{
                      backgroundColor: shop.isOpen ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                      color: shop.isOpen ? 'var(--color-success)' : 'var(--color-error)',
                      border: `1px solid ${shop.isOpen ? 'var(--color-success-border)' : 'var(--color-error-border)'}`
                    }}
                  >
                    {shop.isOpen ? 'Open Now' : 'Closed for Orders'}
                  </span>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '0.2rem', maxWidth: '640px' }}>
                  {shop.description}
                </p>

                <div className="storefront-meta-list">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                    {shop.address}
                  </span>
                  <span className="text-separator">·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    {shop.timing}
                  </span>
                  <span className="text-separator">·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={14} />
                    {shop.phone}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                backgroundColor: 'var(--color-surface-subtle)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                alignSelf: 'flex-start'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--font-size-xs)' }}>
                <Truck size={14} style={{ color: 'var(--color-primary)' }} />
                <span>
                  Delivery Fee: <strong className="mono-num">{formatINR(shop.deliveryFee)}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--font-size-xs)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
                <span>Verified Local Partner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
