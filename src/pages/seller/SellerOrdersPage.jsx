import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, X, Clock, Truck, Eye } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { formatINR } from '../../utils/currency.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function SellerOrdersPage({ onShowToast }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const shopId = user?.shopId || 'shop-1';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [shopId]);

  async function loadOrders() {
    setLoading(true);
    try {
      const list = await mockOrderService.getOrders({ shopId });
      setOrders(list);
    } catch (err) {
      console.error('Failed to load seller orders', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId, nextStatus, note) => {
    setActionLoadingId(orderId);
    try {
      const updated = await mockOrderService.updateOrderStatus(orderId, nextStatus, note);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Order Status Updated',
          message: `Order #${updated.orderNumber} transitioned to ${nextStatus}.`
        });
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW') return o.status === 'PLACED';
    if (activeTab === 'ACCEPTED') return o.status === 'ACCEPTED';
    if (activeTab === 'PREPARING') return o.status === 'PREPARING';
    if (activeTab === 'READY') return o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY';
    if (activeTab === 'COMPLETED') return o.status === 'DELIVERED';
    if (activeTab === 'CANCELLED') return o.status === 'CANCELLED' || o.status === 'REJECTED';
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Store Orders & Fulfillment"
        subtitle="Review new incoming customer baskets, accept requests, and manage packing."
      />

      {/* Order Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'ALL', label: `All Orders (${orders.length})` },
          { id: 'NEW', label: `New (${orders.filter(o => o.status === 'PLACED').length})` },
          { id: 'ACCEPTED', label: `Accepted (${orders.filter(o => o.status === 'ACCEPTED').length})` },
          { id: 'PREPARING', label: `Preparing (${orders.filter(o => o.status === 'PREPARING').length})` },
          { id: 'READY', label: `Ready/En Route (${orders.filter(o => ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)).length})` },
          { id: 'COMPLETED', label: `Delivered (${orders.filter(o => o.status === 'DELIVERED').length})` },
          { id: 'CANCELLED', label: `Closed (${orders.filter(o => ['CANCELLED', 'REJECTED'].includes(o.status)).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading store orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found in this category"
          description="Orders matching this workflow state will appear here automatically."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Time & Date</th>
                <th>Customer</th>
                <th>Fulfillment</th>
                <th>Items Summary</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Order Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => {
                const isCurrentActionLoading = actionLoadingId === ord.id;
                const formattedDate = new Date(ord.placedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{ord.orderNumber}</strong>
                    </td>
                    <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {formattedDate}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{ord.customerPhone}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                        {ord.fulfillmentType === 'PICKUP' ? 'Self Pickup' : 'Local Delivery'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: 'var(--font-size-xs)' }}>
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td>
                      <span className="mono-num" style={{ fontWeight: 'bold' }}>
                        {formatINR(ord.totalAmount)}
                      </span>
                    </td>
                    <td>
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        {/* Status-specific action buttons */}
                        {ord.status === 'PLACED' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Check}
                              loading={isCurrentActionLoading}
                              onClick={() => handleUpdateStatus(ord.id, 'ACCEPTED', 'Store confirmed stock')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={X}
                              disabled={isCurrentActionLoading}
                              onClick={() => handleUpdateStatus(ord.id, 'REJECTED', 'Store unable to fulfill at this moment')}
                              style={{ color: 'var(--color-error)' }}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {ord.status === 'ACCEPTED' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Clock}
                            loading={isCurrentActionLoading}
                            onClick={() => handleUpdateStatus(ord.id, 'PREPARING', 'Weighing and packing items')}
                          >
                            Start Packing
                          </Button>
                        )}

                        {ord.status === 'PREPARING' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Truck}
                            loading={isCurrentActionLoading}
                            onClick={() => {
                              const next = ord.fulfillmentType === 'PICKUP' ? 'READY_FOR_PICKUP' : 'OUT_FOR_DELIVERY';
                              handleUpdateStatus(ord.id, next, ord.fulfillmentType === 'PICKUP' ? 'Ready at counter' : 'Dispatched with delivery partner');
                            }}
                          >
                            {ord.fulfillmentType === 'PICKUP' ? 'Ready for Pickup' : 'Send for Delivery'}
                          </Button>
                        )}

                        {(ord.status === 'READY_FOR_PICKUP' || ord.status === 'OUT_FOR_DELIVERY') && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            loading={isCurrentActionLoading}
                            onClick={() => handleUpdateStatus(ord.id, 'DELIVERED', 'Successfully handed over to customer')}
                          >
                            Mark Delivered
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Eye}
                          onClick={() => navigate(`/seller/orders/${ord.id}`)}
                          title="View order details"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
