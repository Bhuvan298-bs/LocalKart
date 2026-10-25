import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, Phone, Truck, ShieldCheck, XCircle, AlertCircle } from 'lucide-react';
import OrderTimeline from '../../components/orders/OrderTimeline.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { formatINR } from '../../utils/currency.js';

export default function OrderDetailsPage({ onShowToast }) {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const found = await mockOrderService.getOrderById(id);
        setOrder(found);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <EmptyState
          icon={AlertCircle}
          title="Order Not Found"
          description="We could not locate this order reference in your demo history."
          actionLabel="View All Orders"
          onAction={() => window.location.href = '/orders'}
        />
      </div>
    );
  }

  const canCancel = order.status === 'PLACED' || order.status === 'ACCEPTED';

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const updated = await mockOrderService.updateOrderStatus(
        order.id,
        'CANCELLED',
        'Cancelled by customer request'
      );
      setOrder(updated);
      setIsCancelDialogOpen(false);

      if (onShowToast) {
        onShowToast({
          type: 'warning',
          title: 'Order Cancelled',
          message: `Order #${order.orderNumber} was marked cancelled.`
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelLoading(false);
    }
  };

  const formattedPlacedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{ padding: 'var(--space-6) 0 var(--space-12)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Link
            to="/orders"
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
            <span>Back to Orders List</span>
          </Link>
        </div>

        {/* Order Header Box */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                  {order.orderNumber}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Placed on {formattedPlacedDate} · {order.fulfillmentType === 'PICKUP' ? 'Self Pickup' : 'Home Delivery'}
              </div>
            </div>

            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                icon={XCircle}
                onClick={() => setIsCancelDialogOpen(true)}
                style={{ color: 'var(--color-error)', borderColor: 'var(--color-error-border)' }}
              >
                Cancel Demo Order
              </Button>
            )}
          </div>

          {/* Shop Context Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            <Store size={18} style={{ color: 'var(--color-primary)' }} />
            <div>
              <strong style={{ color: 'var(--color-text-primary)' }}>{order.shopName}</strong>
              <span className="text-separator">·</span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{order.shopLocality}</span>
            </div>
          </div>
        </div>

        {/* Timeline Status Tracker */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
            Live Fulfillment Tracking
          </h2>

          <OrderTimeline
            currentStatus={order.status}
            statusHistory={order.statusHistory}
            fulfillmentType={order.fulfillmentType}
          />

          {order.assignedDeliveryPerson && (
            <div
              style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-primary)'
              }}
            >
              <Truck size={16} />
              <div>
                Assigned Delivery Partner: <strong>{order.assignedDeliveryPerson}</strong>
                {order.deliveryPersonPhone && ` (${order.deliveryPersonPhone})`}
              </div>
            </div>
          )}
        </div>

        {/* Itemized Order Summary */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-6)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
            Items in this Order
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            {order.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 'var(--space-3)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{it.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {it.unit} · <span className="mono-num">{formatINR(it.unitPrice)} each</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    Qty: <strong>{it.quantity}</strong>
                  </span>
                  <span className="mono-num" style={{ fontWeight: 'bold' }}>
                    {formatINR(it.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Items Subtotal</span>
              <span className="mono-num">{formatINR(order.itemSubtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
              <span className="mono-num">
                {order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--space-3)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 'bold',
                color: 'var(--color-text-primary)'
              }}
            >
              <span>Total Amount</span>
              <span className="mono-num" style={{ color: 'var(--color-primary)' }}>
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-subtle)'
          }}
        >
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
            Delivery & Customer Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                Customer Name & Phone
              </div>
              <div style={{ fontWeight: 600 }}>{order.customerName}</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>{order.customerPhone}</div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                {order.fulfillmentType === 'PICKUP' ? 'Pickup Location' : 'Destination Address'}
              </div>
              <div style={{ color: 'var(--color-text-primary)' }}>{order.deliveryAddress}</div>
              {order.landmark && (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Landmark: {order.landmark}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>
                Payment Status
              </div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{order.paymentMethod}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Pay upon order handover</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirm Dialog */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancel This Demo Order?"
        message="Are you sure you wish to cancel this order? The shopkeeper will be notified in the demo simulation."
        confirmLabel="Yes, Cancel Order"
        cancelLabel="Keep Order"
        isDestructive={true}
        loading={cancelLoading}
        onConfirm={handleCancelOrder}
        onCancel={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
}
