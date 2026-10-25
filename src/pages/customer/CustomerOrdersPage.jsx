import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock } from 'lucide-react';
import OrderCard from '../../components/orders/OrderCard.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const list = await mockOrderService.getOrders({
          customerId: user?.id || 'user-cust-1'
        });
        setOrders(list);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return ['PLACED', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status);
    }
    if (statusFilter === 'COMPLETED') {
      return o.status === 'DELIVERED';
    }
    if (statusFilter === 'CANCELLED') {
      return o.status === 'CANCELLED' || o.status === 'REJECTED';
    }
    return true;
  });

  return (
    <div style={{ padding: 'var(--space-6) 0 var(--space-12)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              Your Orders & Local Deliveries
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
              Track live preparation and delivery status across your local shop orders.
            </p>
          </div>

          <Link to="/shops" className="btn btn-primary btn-sm">
            Browse More Shops
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'ALL', label: `All Orders (${orders.length})` },
            { id: 'ACTIVE', label: 'Active & In Progress' },
            { id: 'COMPLETED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled / Declined' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: statusFilter === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: statusFilter === tab.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: statusFilter === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState message="Loading your orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No orders found in this category"
            description="You don't have any orders matching your selected filter tab."
            actionLabel="Explore Neighbourhood Stores"
            onAction={() => window.location.href = '/shops'}
          />
        ) : (
          <div>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
