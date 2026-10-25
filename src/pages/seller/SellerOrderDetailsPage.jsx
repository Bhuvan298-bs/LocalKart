import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, Truck, User, MapPin, Store, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import OrderTimeline from '../../components/orders/OrderTimeline.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { formatINR } from '../../utils/currency.js';

export default function SellerOrderDetailsPage({ onShowToast }) {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
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
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (nextStatus, note) => {
    setActionLoading(true);
    try {
      const updated = await mockOrderService.updateOrderStatus(order.id, nextStatus, note);
      setOrder(updated);

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Status Updated',
          message: `Order #${updated.orderNumber} is now ${nextStatus}.`
        });
      }
    } catch (err) {
      alert(err.message || 'Status transition failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div>
        <EmptyState
          icon={AlertCircle}
          title="Order Not Found"
          description="Could not locate this order in your merchant store records."
          actionLabel="Back to Orders"
          onAction={() => window.location.href = '/seller/orders'}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Link
          to="/seller/orders"
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
          <span>Back to Store Orders</span>
        </Link>
      </div>

      <PageHeader
        title={`Order ${order.orderNumber}`}
        subtitle={`Placed by ${order.customerName} (${order.fulfillmentType === 'PICKUP' ? 'Self Pickup' : 'Home Delivery'})`}
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {order.status === 'PLACED' && (
              <>
                <Button
                  variant="primary"
                  icon={Check}
                  loading={actionLoading}
                  onClick={() => handleUpdateStatus('ACCEPTED', 'Store confirmed item availability')}
                >
                  Accept Order
                </Button>
                <Button
                  variant="danger"
                  icon={X}
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus('REJECTED', 'Store could not fulfill items')}
                >
                  Decline
                </Button>
              </>
            )}

            {order.status === 'ACCEPTED' && (
              <Button
                variant="primary"
                icon={Clock}
                loading={actionLoading}
                onClick={() => handleUpdateStatus('PREPARING', 'Shopkeeper started packing items')}
              >
                Mark as Preparing
              </Button>
            )}

            {order.status === 'PREPARING' && (
              <Button
                variant="primary"
                icon={Truck}
                loading={actionLoading}
                onClick={() => {
                  const next = order.fulfillmentType === 'PICKUP' ? 'READY_FOR_PICKUP' : 'OUT_FOR_DELIVERY';
                  handleUpdateStatus(next, 'Order packed and ready');
                }}
              >
                {order.fulfillmentType === 'PICKUP' ? 'Mark Ready for Pickup' : 'Send for Delivery'}
              </Button>
            )}

            {(order.status === 'READY_FOR_PICKUP' || order.status === 'OUT_FOR_DELIVERY') && (
              <Button
                variant="primary"
                icon={Check}
                loading={actionLoading}
                onClick={() => handleUpdateStatus('DELIVERED', 'Handed over successfully')}
              >
                Mark Delivered
              </Button>
            )}
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Packing Checklist */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)'
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
            Packing & Quantity Checklist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            {order.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{it.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Unit: {it.unit} · {it.brand || 'Local Merchant'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    Qty: {it.quantity}
                  </div>
                  <div className="mono-num" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {formatINR(it.totalPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Order Value (Payable by Customer):</span>
            <span className="mono-num" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-md)' }}>
              {formatINR(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Customer & Tracking Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              Customer Contact & Delivery
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Customer</span>
                <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>{order.customerPhone}</div>
              </div>

              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Fulfillment Mode</span>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {order.fulfillmentType === 'PICKUP' ? 'Customer Store Pickup' : 'Home Delivery'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Address</span>
                <div>{order.deliveryAddress}</div>
                {order.landmark && (
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    Landmark: {order.landmark}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)'
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
              Status Progression
            </h3>

            <OrderTimeline
              currentStatus={order.status}
              statusHistory={order.statusHistory}
              fulfillmentType={order.fulfillmentType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
