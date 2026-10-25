import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldAlert } from 'lucide-react';

export default function CustomerFooter() {
  return (
    <footer className="cust-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'white', fontWeight: 'bold', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-3)' }}>
              <ShoppingBag size={22} style={{ color: 'var(--color-primary-subtle)' }} />
              <span>LocalKart</span>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: '#a8b4ad', maxWidth: '340px', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Empowering local Indian neighbourhood grocery stores, fresh vegetable mandis, and bakeries with open digital storefronts and prompt local delivery.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--font-size-xs)', color: '#88988f' }}>
              <span>Built with pride for local retailers</span>
              <Heart size={12} style={{ color: '#e07a39' }} fill="#e07a39" />
            </div>
          </div>

          <div>
            <div className="footer-col-title">Shop Locally</div>
            <ul className="footer-links">
              <li><Link to="/shops" className="footer-link">All Local Stores</Link></li>
              <li><Link to="/shops?category=groceries" className="footer-link">Kirana & Provisions</Link></li>
              <li><Link to="/shops?category=produce" className="footer-link">Fresh Vegetables</Link></li>
              <li><Link to="/shops?category=bakery" className="footer-link">Neighbourhood Bakeries</Link></li>
              <li><Link to="/orders" className="footer-link">Order Status & History</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">For Retailers</div>
            <ul className="footer-links">
              <li><Link to="/seller/register" className="footer-link">List Your Local Shop</Link></li>
              <li><Link to="/seller/login" className="footer-link">Shopkeeper Login</Link></li>
              <li><Link to="/seller/dashboard" className="footer-link">Inventory Console</Link></li>
              <li><Link to="/admin/dashboard" className="footer-link">Operations & Approvals</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Demo Details</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: '#8fa096', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffb380', marginBottom: '0.3rem' }}>
                <ShieldAlert size={14} />
                <strong>Phase 1 Frontend Prototype</strong>
              </div>
              <p>
                All shops, orders, and inventory data are browser-contained mock demonstrations. Supabase persistence and real payment gateways will be integrated in Phase 2.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} LocalKart Technologies. All mock rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span style={{ cursor: 'pointer' }}>Terms of Demo</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Merchant Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
