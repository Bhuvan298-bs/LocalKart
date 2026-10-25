import { useState, useEffect } from 'react';
import { Store, Save, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { validateRequired, validatePhone } from '../../utils/validation.js';

export default function SellerStoreSettingsPage({ onShowToast }) {
  const { user } = useAuth();
  const shopId = user?.shopId || 'shop-1';

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    timing: '',
    address: '',
    locality: '',
    description: '',
    isOpen: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchShop() {
      setLoading(true);
      try {
        const found = await mockShopService.getShopById(shopId);
        if (found) {
          setShop(found);
          setFormData({
            name: found.name,
            phone: found.phone.replace('+91 ', ''),
            timing: found.timing,
            address: found.address,
            locality: found.locality,
            description: found.description || '',
            isOpen: found.isOpen ?? true
          });
        }
      } catch (err) {
        console.error('Failed to load shop settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShop();
  }, [shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validateRequired(formData.name, 'Shop Name');
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const addrErr = validateRequired(formData.address, 'Street Address');
    if (addrErr) newErrors.address = addrErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const updated = await mockShopService.updateShop(shopId, {
        name: formData.name,
        phone: `+91 ${formData.phone}`,
        timing: formData.timing,
        address: formData.address,
        locality: formData.locality,
        description: formData.description,
        isOpen: formData.isOpen
      });

      setShop(updated);

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Store Settings Saved',
          message: 'Public storefront details and operating hours have been updated.'
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading store settings..." />;
  }

  return (
    <div>
      <PageHeader
        title="Store Profile & Operational Settings"
        subtitle="Manage your shop name, opening hours, delivery eligibility, and customer support contact."
      />

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(var(--space-5), 3vw, var(--space-8))',
          maxWidth: '740px'
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Operating Status Toggle */}
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              backgroundColor: formData.isOpen ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
              border: '1px solid',
              borderColor: formData.isOpen ? 'var(--color-success-border)' : 'var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)', color: formData.isOpen ? 'var(--color-success)' : 'var(--color-error)' }}>
                {formData.isOpen ? 'Store is Open for Online Orders' : 'Store is Temporarily Closed'}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {formData.isOpen ? 'Customers can add products and place orders.' : 'Store is paused. Customers can view your catalog but cannot submit orders.'}
              </div>
            </div>

            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
              />
              <span>{formData.isOpen ? 'Open' : 'Closed'}</span>
            </label>
          </div>

          <Input
            label="Shop Brand Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Shri Krishna Kirana & Provisions"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input
              label="Contact Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
              placeholder="9845122340"
            />

            <Input
              label="Operating Hours"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              placeholder="7:30 AM - 10:00 PM"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-4)' }}>
            <Input
              label="Locality / Ward"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              placeholder="Indiranagar 12th Main"
            />

            <Input
              label="City"
              value="Bengaluru"
              disabled
            />
          </div>

          <Input
            label="Complete Physical Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            error={errors.address}
            placeholder="#45, 12th Main, HAL 2nd Stage, Indiranagar"
          />

          <div className="form-group">
            <label className="form-label">Shop Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of fresh specialties, delivery radius, or heritage..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              loading={saving}
            >
              Save Store Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
