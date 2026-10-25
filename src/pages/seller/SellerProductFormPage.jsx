import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Upload, Image as ImageIcon, ShieldAlert, Check } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Modal from '../../components/common/Modal.jsx';
import { mockProductService } from '../../services/mock/mockProductService.js';
import { validateRequired, validatePositiveNumber, validateNonNegativeNumber } from '../../utils/validation.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function SellerProductFormPage({ onShowToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const shopId = user?.shopId || 'shop-1';

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'groceries',
    unit: '1 kg',
    price: '',
    stockQuantity: '10',
    lowStockThreshold: '4',
    description: '',
    isActive: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Simulated AI suggestion modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      async function fetchProduct() {
        try {
          const prod = await mockProductService.getProductById(id);
          if (prod) {
            setFormData({
              name: prod.name,
              brand: prod.brand || '',
              category: prod.category,
              unit: prod.unit,
              price: String(prod.price),
              stockQuantity: String(prod.stockQuantity),
              lowStockThreshold: String(prod.lowStockThreshold || 4),
              description: prod.description || '',
              isActive: prod.isActive ?? true,
              image: prod.image
            });
            setPreviewUrl(prod.image);
          }
        } catch (err) {
          console.error('Failed to load product', err);
        } finally {
          setLoading(false);
        }
      }
      fetchProduct();
    }
  }, [id, isEdit]);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be under 5 MB.');
      return;
    }

    // Revoke previous blob if any
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFormData(prev => ({ ...prev, image: objectUrl }));
  };

  const handleTriggerAiSuggestion = async () => {
    setIsAiModalOpen(true);
    setAiLoading(true);
    try {
      const suggestion = await mockProductService.getMockAiSuggestion(formData.category);
      setAiSuggestion(suggestion);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setFormData(prev => ({
      ...prev,
      name: aiSuggestion.name,
      brand: aiSuggestion.brand,
      category: aiSuggestion.category,
      unit: aiSuggestion.unit,
      price: String(aiSuggestion.price),
      lowStockThreshold: String(aiSuggestion.lowStockThreshold),
      description: aiSuggestion.description
    }));
    setIsAiModalOpen(false);

    if (onShowToast) {
      onShowToast({
        type: 'info',
        title: 'Suggestion Applied',
        message: 'Pre-filled demo details. Review and adjust values before saving.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const nameErr = validateRequired(formData.name, 'Product Name');
    if (nameErr) newErrors.name = nameErr;

    const unitErr = validateRequired(formData.unit, 'Unit / Package');
    if (unitErr) newErrors.unit = unitErr;

    const priceErr = validatePositiveNumber(formData.price, 'Price (INR)');
    if (priceErr) newErrors.price = priceErr;

    const stockErr = validateNonNegativeNumber(formData.stockQuantity, 'Stock Quantity');
    if (stockErr) newErrors.stockQuantity = stockErr;

    const threshErr = validateNonNegativeNumber(formData.lowStockThreshold, 'Low Stock Threshold');
    if (threshErr) newErrors.lowStockThreshold = threshErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await mockProductService.updateProduct(id, {
          ...formData,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          lowStockThreshold: Number(formData.lowStockThreshold)
        });

        if (onShowToast) {
          onShowToast({
            type: 'success',
            title: 'Product Updated',
            message: `${formData.name} was saved successfully.`
          });
        }
      } else {
        await mockProductService.createProduct({
          ...formData,
          shopId,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
          lowStockThreshold: Number(formData.lowStockThreshold)
        });

        if (onShowToast) {
          onShowToast({
            type: 'success',
            title: 'Product Created',
            message: `${formData.name} is now listed in your inventory.`
          });
        }
      }

      navigate('/seller/products');
    } catch (err) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading product information..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link
          to="/seller/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-secondary)',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Product Catalog</span>
        </Link>
      </div>

      <PageHeader
        title={isEdit ? `Edit: ${formData.name || 'Product'}` : 'Add New Inventory Product'}
        subtitle="Specify product attributes, pricing, packaging unit, and stock warning thresholds."
        action={
          <Button
            variant="outline"
            icon={Sparkles}
            onClick={handleTriggerAiSuggestion}
            style={{ color: '#7c3aed', borderColor: '#d8b4fe', backgroundColor: '#faf5ff' }}
          >
            Suggest product details — demo
          </Button>
        }
      />

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(var(--space-5), 3vw, var(--space-8))',
          maxWidth: '820px'
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Section: Basic Details */}
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            1. Basic Item Information
          </h3>

          <Input
            label="Product Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="e.g. Aashirvaad Superior Sharbati Atta"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Brand / Manufacturer"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Aashirvaad or Local Farm"
            />

            <Select
              label="Product Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'groceries', label: 'Groceries & Staples' },
                { value: 'produce', label: 'Fruits & Vegetables' },
                { value: 'dairy', label: 'Dairy & Eggs' },
                { value: 'bakery', label: 'Bakery & Bread' },
                { value: 'snacks', label: 'Snacks & Namkeen' },
                { value: 'beverages', label: 'Beverages & Tea' },
                { value: 'household', label: 'Household Essentials' },
                { value: 'spices', label: 'Spices & Masala' }
              ]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Highlight freshness, regional source, or usage advice..."
            />
          </div>

          {/* Section: Pricing & Stock */}
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', margin: 'var(--space-6) 0 var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            2. Price, Unit & Stock Management
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <Input
              label="Price in INR (₹)"
              required
              type="number"
              step="any"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              placeholder="295"
            />

            <Input
              label="Unit / Packaging"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              error={errors.unit}
              placeholder="e.g. 1 kg, 500 g, 1 L, Pack of 6"
            />

            <Input
              label="Current Stock Quantity"
              required
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              error={errors.stockQuantity}
              placeholder="10"
              helperText="Set to 0 to test out-of-stock backup workflow"
            />

            <Input
              label="Low Stock Alert Threshold"
              required
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              error={errors.lowStockThreshold}
              placeholder="4"
              helperText="Alerts you when stock is at or below this value"
            />
          </div>

          {/* Section: Image Preview & Selection */}
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', margin: 'var(--space-6) 0 var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-border-subtle)' }}>
            3. Product Photo & Preview
          </h3>

          <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {previewUrl || formData.image ? (
                <img
                  src={previewUrl || formData.image}
                  alt="Product preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <ImageIcon size={32} />
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <label className="form-label">Upload Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ fontSize: 'var(--font-size-xs)' }}
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                PNG, JPG or WebP up to 5MB. Preview generated locally using browser Object URL (not uploaded to permanent storage in this phase).
              </p>
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span>Active Listing (Visible to customers on your storefront)</span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button
              variant="secondary"
              onClick={() => navigate('/seller/products')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
            >
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>

      {/* Simulated AI Suggestion Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Simulated Product Details AI Assistant"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAiModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" icon={Check} onClick={handleApplyAiSuggestion} disabled={aiLoading || !aiSuggestion}>
              Confirm & Apply Details
            </Button>
          </>
        }
      >
        <div style={{ padding: 'var(--space-3)', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: '#6d28d9' }}>
          <ShieldAlert size={14} style={{ display: 'inline', marginRight: '4px' }} />
          <strong>Simulated AI (Phase 1):</strong> This suggestion is generated from deterministic local catalog blueprints to demonstrate the future automated camera & catalogue enrichment feature. No live LLM API is called.
        </div>

        {aiLoading ? (
          <LoadingState message="Generating contextual retail attributes..." />
        ) : aiSuggestion ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Suggested Name</span>
              <strong>{aiSuggestion.name}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Brand</span>
                <span>{aiSuggestion.brand}</span>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Package Unit</span>
                <span>{aiSuggestion.unit}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Suggested MRP</span>
              <strong className="mono-num" style={{ color: 'var(--color-primary)' }}>₹{aiSuggestion.price}</strong>
            </div>

            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block' }}>Description</span>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                {aiSuggestion.description}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
