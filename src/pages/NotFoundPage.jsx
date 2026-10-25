import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-8)' }}>
      <div style={{ maxWidth: '440px' }}>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
          404
        </h1>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          The page or neighbourhood storefront you are looking for does not exist or has been relocated.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
          <Link to="/shops" className="btn btn-secondary">
            <span>Browse Shops</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
