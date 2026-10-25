import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, Store, ExternalLink } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function SellerSidebar() {
  const { user } = useAuth();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Store className="brand-icon" size={24} />
          <span className="sidebar-brand-name">LocalKart</span>
        </Link>
        <span className="sidebar-role-badge">Seller</span>
      </div>

      <div className="sidebar-shop-info">
        <div className="sidebar-shop-name">{user?.shopName || 'Shri Krishna Kirana'}</div>
        <div className="sidebar-shop-sub">Indiranagar 12th Main</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/seller/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={17} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/seller/products"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Package size={17} />
          <span>Product Catalog</span>
        </NavLink>

        <NavLink
          to="/seller/orders"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={17} />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/seller/store"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Settings size={17} />
          <span>Store Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <Link
          to={`/shops/${user?.shopId ? 'shri-krishna-kirana' : ''}`}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-primary)' }}
        >
          <ExternalLink size={14} />
          <span>View Public Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
