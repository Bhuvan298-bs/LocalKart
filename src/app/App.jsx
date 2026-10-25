import { useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext.jsx';
import { CartProvider, useCartContext } from '../features/cart/CartContext.jsx';
import AppRoutes from './router.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Toast from '../components/common/Toast.jsx';
import { AlertCircle, Store } from 'lucide-react';

function ShopConflictModal() {
  const { shopConflict, resolveConflictReplace, cancelConflict } = useCartContext();

  if (!shopConflict) return null;

  return (
    <Modal
      isOpen={Boolean(shopConflict)}
      onClose={cancelConflict}
      title="Start a new order with this shop?"
      footer={
        <>
          <Button variant="secondary" onClick={cancelConflict}>
            Keep Current Cart
          </Button>
          <Button variant="primary" onClick={resolveConflictReplace}>
            Clear Cart & Add Item
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <div style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }}>
          <AlertCircle size={24} />
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            Your current cart already contains items from{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>{shopConflict.currentShopName}</strong>.
          </p>
          <p style={{ marginBottom: 'var(--space-3)' }}>
            To ensure rapid fulfillment and local accountability, LocalKart orders are fulfilled by <strong>one shop per order</strong>.
          </p>
          <p style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-xs)' }}>
            Would you like to discard items from {shopConflict.currentShopName} and start a new basket with{' '}
            <strong>{shopConflict.newShopName}</strong>?
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default function App() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes onShowToast={showToast} />
          <ShopConflictModal />
          <Toast toasts={toasts} onDismiss={dismissToast} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
