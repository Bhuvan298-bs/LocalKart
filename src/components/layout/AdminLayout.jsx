import { Outlet, NavLink, Link } from 'react-router-dom';
import { Shield, Store, ShoppingBag, Truck, LayoutDashboard } from 'lucide-react';
import DashboardHeader from './DashboardHeader.jsx';

export default function AdminLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Shield className="brand-icon" size={24} style={{ color: '#0f766e' }} />
            <span className="sidebar-brand-name">LocalKart</span>
          </Link>
          <span className="sidebar-role-badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', borderColor: '#99f6e4' }}>
            Admin
          </span>
        </div>

        <div className="sidebar-shop-info">
          <div className="sidebar-shop-name">Operations & Moderation</div>
          <div className="sidebar-shop-sub">Bengaluru Central Hub</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Executive Overview</span>
          </NavLink>

          <NavLink
            to="/admin/shops"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Store size={17} />
            <span>Shop Approvals</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <ShoppingBag size={17} />
            <span>Network Orders</span>
          </NavLink>

          <NavLink
            to="/admin/deliveries"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Truck size={17} />
            <span>Delivery Fleet</span>
          </NavLink>
        </nav>
      </aside>

      <div className="dashboard-main">
        <DashboardHeader title="Admin Center" roleLabel="Platform Operations" />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
