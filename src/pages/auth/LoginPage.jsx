import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, EyeOff, UserCheck, ShieldAlert } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { validateRequired } from '../../utils/validation.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const credErr = validateRequired(emailOrPhone, 'Email or Phone');
    if (credErr) newErrors.emailOrPhone = credErr;

    const passErr = validateRequired(password, 'Password');
    if (passErr) newErrors.password = passErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login({ emailOrPhone, password, role: 'CUSTOMER' });
      navigate('/');
    } catch (err) {
      alert(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    try {
      await login({ emailOrPhone: 'priya.sharma@example.com', password: 'demo', role: 'CUSTOMER' });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-12) 0', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'inline-flex', padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
            Customer Sign In
          </h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
            Access your neighbourhood shopping cart and order history
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: '#f7eee4',
            border: '1px solid #ebd9c8',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-5)',
            fontSize: 'var(--font-size-xs)',
            color: '#7d4415',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)'
          }}
        >
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Demo Authentication:</strong> Simulated client-side session. Passwords are not saved or transmitted to any server.
          </div>
        </div>

        {/* Quick fill button */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={UserCheck}
            onClick={handleQuickDemoLogin}
            style={{ width: '100%' }}
          >
            One-Click Demo Login as Priya Sharma
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email or Mobile Phone"
            required
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            error={errors.emailOrPhone}
            placeholder="e.g. priya.sharma@example.com"
          />

          <Input
            label="Password"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            iconRight={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            placeholder="Enter password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            Register as Customer
          </Link>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--font-size-xs)' }}>
          Are you a shopkeeper?{' '}
          <Link to="/seller/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            Go to Shopkeeper Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
