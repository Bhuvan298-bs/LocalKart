import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Store, ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { validateRequired, validatePhone, validateEmail } from '../../utils/validation.js';
import { formatINR } from '../../utils/currency.js';

export default function CheckoutPage({ onShowToast }) {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, grandTotal, shopId, shopName, shopLocality, clearCart } = useCart();
  const { user, activeLocality } = useAuth();

  const [fulfillmentType, setFulfillmentType] = useState('DELIVERY'); // 'DELIVERY' | 'PICKUP'
  const [paymentOption, setPaymentOption] = useState('COD'); // 'COD' | 'PICKUP_COUNTER'

  // Form states initialized with demo user defaults
  const [formData, setFormData] = useState({
    customerName: user?.name || 'Priya Sharma',
    phone: user?.phone || '9845012345',
    email: user?.email || 'priya.sharma@example.com',
    address: user?.address || 'Flat 302, Green Glen Apartments, 12th Main',
    landmark: user?.landmark || 'Opposite Coffee Day',
    locality: activeLocality.split(',')[0],
    pincode: '560038',
    deliveryNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <h2>No items to checkout</h2>
        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-3) 0 var(--space-5)' }}>
          Your basket is empty. Please add items from a neighbourhood shop before checking out.
        </p>
        <Link to="/shops" className="btn btn-primary">
          Explore Shops
        </Link>
      </div>
    );
  }

  const effectiveDeliveryFee = fulfillmentType === 'PICKUP' ? 0 : deliveryFee;
  const effectiveGrandTotal = subtotal + effectiveDeliveryFee;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validations
    const newErrors = {};
    const nameErr = validateRequired(formData.customerName, 'Customer Name');
    if (nameErr) newErrors.customerName = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    if (fulfillmentType === 'DELIVERY') {
      const addrErr = validateRequired(formData.address, 'Delivery Address');
      if (addrErr) newErrors.address = addrErr;
      const pincodeErr = validateRequired(formData.pincode, 'PIN code');
      if (pincodeErr) newErrors.pincode = pincodeErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerId: user?.id || 'user-cust-1',
        customerName: formData.customerName,
        customerPhone: `+91 ${formData.phone}`,
        shopId: shopId,
        shopName: shopName,
        shopLocality: shopLocality,
        fulfillmentType,
        deliveryAddress:
          fulfillmentType === 'PICKUP'
            ? `Store Pickup Counter, ${shopName}, ${shopLocality}`
            : `${formData.address}, ${formData.locality}, Bengaluru - ${formData.pincode}`,
        landmark: formData.landmark,
        paymentMethod:
          fulfillmentType === 'PICKUP'
            ? 'Pay at Store Counter'
            : 'Cash / UPI on Delivery',
        items: items.map(it => ({
          productId: it.id,
          name: it.name,
          brand: it.brand,
          unit: it.unit,
          unitPrice: it.price,
          quantity: it.quantity,
          totalPrice: it.price * it.quantity
        })),
        itemSubtotal: subtotal,
        deliveryFee: effectiveDeliveryFee,
        totalAmount: effectiveGrandTotal
      };

      const createdOrder = await mockOrderService.createOrder(orderPayload);

      // Clear the demo cart
      clearCart();

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Demo Order Placed!',
          message: `Order #${createdOrder.orderNumber} placed with ${shopName}`
        });
      }

      // Navigate to order details
      navigate(`/orders/${createdOrder.id}`);
    } catch (err) {
      console.error('Failed to create order', err);
      alert('Unable to process demo order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6) 0 var(--space-12)' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.2rem'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Cart</span>
          </Link>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
            Checkout & Confirmation
          </h1>
        </div>

        {/* Form & Summary Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'start'
          }}
        >
          {/* Left: Customer & Address Details */}
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Fulfillment Type Toggle */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
                1. Select Fulfillment Mode
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('DELIVERY');
                    setPaymentOption('COD');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: fulfillmentType === 'DELIVERY' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: fulfillmentType === 'DELIVERY' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    color: fulfillmentType === 'DELIVERY' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Truck size={22} style={{ marginBottom: '0.35rem' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Local Delivery</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>Direct to your doorstep</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFulfillmentType('PICKUP');
                    setPaymentOption('PICKUP_COUNTER');
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid',
                    borderColor: fulfillmentType === 'PICKUP' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: fulfillmentType === 'PICKUP' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                    color: fulfillmentType === 'PICKUP' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <Store size={22} style={{ marginBottom: '0.35rem' }} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Self Pickup</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', opacity: 0.85 }}>Collect packed from store</span>
                </button>
              </div>
            </div>

            {/* Step 2: Contact Info */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
                2. Contact Information
              </h2>

              <Input
                label="Full Name"
                required
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                error={errors.customerName}
                placeholder="e.g. Priya Sharma"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Input
                  label="10-Digit Mobile Number"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="e.g. 9845012345"
                />

                <Input
                  label="Email Address"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="e.g. priya@example.com"
                />
              </div>
            </div>

            {/* Step 3: Delivery Address (if Delivery) */}
            {fulfillmentType === 'DELIVERY' && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  marginBottom: 'var(--space-6)'
                }}
              >
                <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
                  3. Delivery Destination
                </h2>

                <Input
                  label="House/Flat No., Apartment & Street"
                  required
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  error={errors.address}
                  placeholder="e.g. Flat 302, Green Glen Apartments, 12th Main"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-3)' }}>
                  <Input
                    label="Nearby Landmark"
                    value={formData.landmark}
                    onChange={(e) => handleChange('landmark', e.target.value)}
                    placeholder="e.g. Opposite Coffee Day"
                  />

                  <Input
                    label="PIN Code"
                    required
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    error={errors.pincode}
                    placeholder="560038"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment Details */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-6)'
              }}
            >
              <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
                {fulfillmentType === 'DELIVERY' ? '4. Payment Mode' : '3. Payment Mode'}
              </h2>

              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid var(--color-primary-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  color: 'var(--color-primary)'
                }}
              >
                <CheckCircle2 size={20} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                    {fulfillmentType === 'DELIVERY' ? 'Cash or UPI on Delivery' : 'Pay at Store Counter'}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)' }}>
                    No payment is collected now. Pay directly via Cash or any UPI App (GPay, PhonePe, Paytm) upon receipt.
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Notice */}
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)',
                fontSize: 'var(--font-size-xs)',
                color: '#92400e'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong>Simulation Notice:</strong> This is a Phase 1 local prototype. Clicking "Place Demo Order" will generate an in-memory test order and navigate to its live tracking screen without real banking transactions.
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              style={{ width: '100%' }}
            >
              Place Demo Order · {formatINR(effectiveGrandTotal)}
            </Button>
          </form>

          {/* Right: Order Summary Preview */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              position: 'sticky',
              top: '80px'
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              Fulfilling Store
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: 'var(--space-4)' }}>
              <Store size={20} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>{shopName}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{shopLocality}</div>
              </div>
            </div>

            <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Items ({items.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
                  <span>{it.quantity}x {it.name} ({it.unit})</span>
                  <span className="mono-num" style={{ fontWeight: 600 }}>{formatINR(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Items Subtotal</span>
                <span className="mono-num">{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
                <span className="mono-num">
                  {effectiveDeliveryFee === 0 ? 'FREE' : formatINR(effectiveDeliveryFee)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)', fontWeight: 'bold', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
                <span>Total Payable</span>
                <span className="mono-num" style={{ color: 'var(--color-primary)' }}>{formatINR(effectiveGrandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
