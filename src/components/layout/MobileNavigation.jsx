import { NavLink } from 'react-router-dom';
import { Home, Store, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function MobileNavigation() {
  const { totalItemsCount } = useCart();
  const { role } = useAuth();

  const accountRoute = role === 'SELLER' ? '/seller/dashboard' : role === 'ADMIN' ? '/admin/dashboard' : '/login';

  return (
    <nav className="mobile-bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={19} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/shops"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Store size={19} />
        <span>Shops</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <ShoppingBag size={19} />
        <span>Cart</span>
        {totalItemsCount > 0 && (
          <span className="mobile-cart-badge">{totalItemsCount}</span>
        )}
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Clock size={19} />
        <span>Orders</span>
      </NavLink>

      <NavLink
        to={accountRoute}
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <User size={19} />
        <span>{role === 'SELLER' ? 'Store' : role === 'ADMIN' ? 'Admin' : 'Account'}</span>
      </NavLink>
    </nav>
  );
}
