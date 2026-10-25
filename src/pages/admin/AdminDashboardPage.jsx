import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ShoppingBag, Truck, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import MetricCard from '../../components/dashboard/MetricCard.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { mockDeliveryService } from '../../services/mock/mockDeliveryService.js';
import { formatINR } from '../../utils/currency.js';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [allShops, allOrders, deliveryQueue] = await Promise.all([
          mockShopService.getShops({ includePending: true }),
          mockOrderService.getOrders(),
          mockDeliveryService.getDeliveryQueue()
        ]);

        setShops(allShops);
        setOrders(allOrders);
        setDeliveries(deliveryQueue);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  if (loading) {
    return <LoadingState message="Loading platform executive dashboard..." />;
  }

  const approvedShopsCount = shops.filter(s => s.status === 'APPROVED').length;
  const pendingShops = shops.filter(s => s.status === 'PENDING_APPROVAL');
  const activeOrdersCount = orders.filter(o => !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.status)).length;
  const totalVolume = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' && o.status !== 'REJECTED' ? o.totalAmount : 0), 0);

  return (
    <div>
      <PageHeader
        title="LocalKart Operations Center"
        subtitle="Network oversight across Bengaluru neighbourhoods: merchant compliance, orders, and delivery dispatch."
      />

      {/* Metric Cards */}
      <div className="metrics-grid">
        <MetricCard
          label="Approved Merchants"
          value={approvedShopsCount}
          helperText="Serving 5 Bangalore localities"
          icon={Store}
          color="var(--color-primary)"
        />

        <MetricCard
          label="Pending Applications"
          value={pendingShops.length}
          helperText="Awaiting operational review"
          icon={AlertCircle}
          color="var(--color-warning)"
        />

        <MetricCard
          label="Active City Orders"
          value={activeOrdersCount}
          helperText="In progress across stores"
          icon={ShoppingBag}
          color="#1e40af"
        />

        <MetricCard
          label="Delivery Fleet Queue"
          value={deliveries.length}
          helperText="En route or awaiting pickup"
          icon={Truck}
          color="#0d9488"
        />

        <MetricCard
          label="Total Simulated GMV"
          value={formatINR(totalVolume)}
          helperText="Across all completed/active orders"
          icon={ShieldCheck}
          color="#7c3aed"
        />
      </div>

      {/* Pending Shop Approvals Alert Banner */}
      {pendingShops.length > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)'
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-md)', color: '#92400e', marginBottom: '0.2rem' }}>
              Action Required: {pendingShops.length} Merchant Application Awaiting Approval
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: '#b45309' }}>
              {pendingShops.map(s => s.name).join(', ')} submitted details for onboarding.
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/shops')}
            style={{ backgroundColor: '#b45309', borderColor: '#b45309' }}
          >
            Review Applications
          </Button>
        </div>
      )}

      {/* Network Orders & Quick Delivery Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Recent Active Orders */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold' }}>
              Live Network Orders
            </h2>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              <span>All Orders</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <strong style={{ fontSize: 'var(--font-size-sm)' }}>{ord.orderNumber}</strong>
                    <OrderStatusBadge status={ord.status} />
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {ord.shopName} · {ord.customerName}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="mono-num" style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                    {formatINR(ord.totalAmount)}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {ord.fulfillmentType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Dispatch Summary */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold' }}>
              Delivery Dispatch Queue
            </h2>
            <Link to="/admin/deliveries" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              <span>Fleet Queue</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {deliveries.length === 0 ? (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
                No orders currently in the delivery queue.
              </p>
            ) : (
              deliveries.slice(0, 4).map((del) => (
                <div
                  key={del.id}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-xs)' }}>{del.orderNumber}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
                      Partner: {del.assignedDeliveryPerson || 'Needs Assignment'}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    Pickup: {del.shopName} → {del.deliveryAddress}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
