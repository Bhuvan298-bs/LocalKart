import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, MapPin, Search, User, ChevronDown } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const BANGALORE_LOCALITIES = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Malleshwaram, Bengaluru',
  'Jayanagar, Bengaluru',
  'HSR Layout, Bengaluru',
  'Whitefield, Bengaluru'
];

export default function CustomerHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { user, role, switchRole, activeLocality, setActiveLocality } = useAuth();

  const [isLocalityModalOpen, setIsLocalityModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <>
      {/* Demo Mode Notice */}
      <div className="demo-banner">
        <span>⚡ <strong>Demonstration Environment</strong>: Client-side local commerce prototype. All orders, shops, and inventory are simulated demo data.</span>
      </div>

      <header className="cust-header">
        <div className="container cust-header-inner">
          {/* Brand & Locality */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <Link to="/" className="brand-lockup">
              <ShoppingBag className="brand-icon" />
              <span>LocalKart</span>
            </Link>

            <button
              type="button"
              className="header-locality-btn"
              onClick={() => setIsLocalityModalOpen(true)}
              title="Change Delivery Locality"
            >
              <MapPin size={13} style={{ color: 'var(--color-primary)' }} />
              <span>{activeLocality.split(',')[0]}</span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Search Bar */}
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <div className="input-wrapper">
              <span className="input-icon-left">
                <Search size={15} />
              </span>
              <input
                type="text"
                className="form-input has-left-icon"
                placeholder="Search staples, fresh veggies, milk, or local shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.45rem 0.85rem 0.45rem 2.2rem', fontSize: 'var(--font-size-xs)' }}
              />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="header-nav-links">
            <Link
              to="/shops"
              className={`header-nav-link ${location.pathname === '/shops' ? 'active' : ''}`}
            >
              Shops
            </Link>

            <Link
              to="/orders"
              className={`header-nav-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`}
            >
              My Orders
            </Link>

            {/* Quick Demo Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '0 0.5rem', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Demo View:</span>
              <select
                value={role}
                onChange={(e) => switchRole(e.target.value)}
                style={{
                  fontSize: '0.75rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '2px 4px',
                  background: 'var(--color-surface-subtle)',
                  cursor: 'pointer'
                }}
              >
                <option value="CUSTOMER">Customer (Priya)</option>
                <option value="SELLER">Shopkeeper (Ramesh)</option>
                <option value="ADMIN">Admin (Operations)</option>
              </select>
            </div>

            {role === 'SELLER' ? (
              <Link to="/seller/dashboard" className="btn btn-outline btn-sm">
                Shop Portal
              </Link>
            ) : role === 'ADMIN' ? (
              <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
                Admin Console
              </Link>
            ) : (
              <Link to="/seller/login" className="header-nav-link" style={{ fontSize: 'var(--font-size-xs)' }}>
                For Retailers
              </Link>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="btn btn-primary btn-sm cart-btn-indicator"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={15} />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="cart-count-badge">{totalItemsCount}</span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Locality Selector Modal */}
      <Modal
        isOpen={isLocalityModalOpen}
        onClose={() => setIsLocalityModalOpen(false)}
        title="Select Your Neighbourhood"
      >
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          LocalKart connects you to participating kirana and retail shops within 4–5 km of your locality.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {BANGALORE_LOCALITIES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setActiveLocality(loc);
                setIsLocalityModalOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeLocality === loc ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: activeLocality === loc ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: activeLocality === loc ? 'var(--color-primary)' : 'var(--color-text-primary)',
                fontWeight: activeLocality === loc ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MapPin size={16} />
                <span>{loc}</span>
              </div>
              {activeLocality === loc && (
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold' }}>Active</span>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
