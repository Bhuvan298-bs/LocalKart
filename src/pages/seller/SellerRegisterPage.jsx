import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { validateRequired, validatePhone, validateEmail } from '../../utils/validation.js';

export default function SellerRegisterPage({ onShowToast }) {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    category: 'Groceries & Daily Essentials',
    locality: 'Indiranagar',
    address: '',
    timing: '8:00 AM - 9:30 PM',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const shopErr = validateRequired(formData.shopName, 'Shop Name');
    if (shopErr) newErrors.shopName = shopErr;

    const ownerErr = validateRequired(formData.ownerName, 'Owner Name');
    if (ownerErr) newErrors.ownerName = ownerErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const addrErr = validateRequired(formData.address, 'Shop Address');
    if (addrErr) newErrors.address = addrErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const createdShop = await mockShopService.createShopApplication({
        name: formData.shopName,
        ownerName: formData.ownerName,
        phone: `+91 ${formData.phone}`,
        category: formData.category,
        locality: `${formData.locality}, Bengaluru`,
        city: 'Bengaluru',
        address: formData.address,
        timing: formData.timing,
        description: formData.description || 'Verified neighbourhood merchant on LocalKart.'
      });

      await register({
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        role: 'SELLER',
        shopDetails: createdShop
      });

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Storefront Registered!',
          message: 'Your shop application has been submitted for instant demo onboarding.'
        });
      }

      navigate('/seller/dashboard');
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-12) 0', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'inline-flex', padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
            <Store size={28} />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
            List Your Neighbourhood Store
          </h1>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
            Reach hundreds of nearby residential customers with digital ordering
          </p>
        </div>

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
            <strong>Phase 1 Demonstration:</strong> Instantly establishes your mock storefront and gives you access to the shopkeeper dashboard.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Shop / Business Name"
            required
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            error={errors.shopName}
            placeholder="e.g. Mahalakshmi Provision Store"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Proprietor / Owner Name"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              error={errors.ownerName}
              placeholder="e.g. Suresh Gowda"
            />

            <Select
              label="Primary Shop Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                'Groceries & Daily Essentials',
                'Fruits & Vegetables',
                'Bakery & Snacks',
                'Dairy & Breakfast Needs',
                'Organic & Health Mart'
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Contact Mobile (10-Digit)"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="9845012345"
            />

            <Input
              label="Official Email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="store@gmail.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Select
              label="Locality / Ward"
              required
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              options={[
                'Indiranagar',
                'Koramangala',
                'Malleshwaram',
                'Jayanagar',
                'HSR Layout',
                'Whitefield'
              ]}
            />

            <Input
              label="Operating Hours"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              placeholder="8:00 AM - 9:30 PM"
            />
          </div>

          <Input
            label="Shop Street Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            placeholder="#14, 5th Cross, Near Water Tank"
          />

          <div className="form-group">
            <label className="form-label">Brief Shop Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell customers about your fresh specialties, delivery radius, or heritage..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
          >
            Launch Digital Storefront
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          Already registered?{' '}
          <Link to="/seller/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            Shopkeeper Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
