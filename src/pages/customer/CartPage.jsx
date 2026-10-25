import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Store } from 'lucide-react';
import CartItem from '../../components/cart/CartItem.jsx';
import CartSummary from '../../components/cart/CartSummary.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useCart } from '../../hooks/useCart.js';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, shopName, shopLocality, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your neighbourhood shopping basket is empty"
          description="Explore your local kiranas, produce mandis, and bakeries to add fresh groceries and provisions."
          actionLabel="Explore Nearby Shops"
          onAction={() => navigate('/shops')}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6) 0 var(--space-12)' }}>
      <div className="container">
        {/* Header Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <Link
              to="/shops"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.2rem'
              }}
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Your Shopping Cart
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={clearCart}
            style={{ color: 'var(--color-error)' }}
          >
            Clear Basket
          </Button>
        </div>

        {/* Cart Layout */}
        <div className="cart-layout">
          {/* Items List */}
          <div className="cart-items-panel">
            {shopName && (
              <div className="cart-shop-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Store size={15} />
                  <span>
                    Fulfilled directly by <strong>{shopName}</strong> ({shopLocality})
                  </span>
                </div>
                <span>One-shop fulfillment</span>
              </div>
            )}

            <div>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div>
            <CartSummary showCheckoutButton={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
