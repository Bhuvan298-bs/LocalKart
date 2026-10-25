import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, ShoppingBag, Clock, Plus, ExternalLink, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import MetricCard from '../../components/dashboard/MetricCard.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { mockProductService } from '../../services/mock/mockProductService.js';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { formatINR } from '../../utils/currency.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const shopId = user?.shopId || 'shop-1';

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      try {
        const [prodList, orderList] = await Promise.all([
          mockProductService.getProducts({ shopId }),
          mockOrderService.getOrders({ shopId })
        ]);

        setProducts(prodList);
        setOrders(orderList);
      } catch (err) {
        console.error('Failed to load seller dashboard', err);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, [shopId]);

  if (loading) {
    return <LoadingState message="Loading merchant dashboard..." />;
  }

  // Derive metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStockProducts = products.filter(p => p.stockQuantity <= 0).length;
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)).length;

  const newOrders = orders.filter(o => o.status === 'PLACED').length;
  const pendingOrders = orders.filter(o => ['ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status)).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Dashboard · ${user?.shopName || 'Shri Krishna Kirana'}`}
        subtitle="Manage daily inventory stock, monitor incoming neighbourhood orders, and adjust fulfillment."
        action={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/seller/products/new')}
            >
              Add New Product
            </Button>
            <Link
              to="/shops/shri-krishna-kirana"
              className="btn btn-secondary"
            >
              <ExternalLink size={15} />
              <span>View Storefront</span>
            </Link>
          </div>
        }
      />

      {/* KPI Metric Strip */}
      <div className="metrics-grid">
        <MetricCard
          label="Total Products"
          value={totalProducts}
          helperText={`${activeProducts} actively listed`}
          icon={Package}
        />

        <MetricCard
          label="Out of Stock"
          value={outOfStockProducts}
          helperText="Triggers backup shop workflow"
          icon={AlertTriangle}
          color="var(--color-error)"
        />

        <MetricCard
          label="Low Stock Items"
          value={lowStockProducts}
          helperText="At or below threshold"
          icon={AlertTriangle}
          color="var(--color-warning)"
        />

        <MetricCard
          label="New Orders"
          value={newOrders}
          helperText="Awaiting confirmation"
          icon={ShoppingBag}
          color="#1e40af"
        />

        <MetricCard
          label="In Preparation"
          value={pendingOrders}
          helperText="Packing or awaiting pickup"
          icon={Clock}
          color="#0d9488"
        />
      </div>

      {/* Recent Orders Section */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
              Recent Orders
            </h2>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Latest customer baskets submitted to your store
            </p>
          </div>

          <Link to="/seller/orders" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
            <span>Manage all orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-6)' }}>
            No recent orders received yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Fulfillment</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{ord.orderNumber}</strong>
                    </td>
                    <td>
                      <div>{ord.customerName}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{ord.customerPhone}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                        {ord.fulfillmentType === 'PICKUP' ? 'Store Pickup' : 'Home Delivery'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 'var(--font-size-xs)' }}>
                        {ord.items.length} item{ord.items.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <span className="mono-num" style={{ fontWeight: 'bold' }}>
                        {formatINR(ord.totalAmount)}
                      </span>
                    </td>
                    <td>
                      <OrderStatusBadge status={ord.status} />
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/seller/orders/${ord.id}`)}
                      >
                        Process
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low Stock Warning Card */}
      {lowStockProducts > 0 && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: '#92400e' }}>
                Inventory Alert: {lowStockProducts} item(s) are below safety threshold
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: '#b45309' }}>
                Refill your stock quantities now to prevent customer orders from failing over to alternative shops.
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/seller/products?filter=low')}
            style={{ borderColor: '#d97706', color: '#92400e' }}
          >
            Review Low Stock
          </Button>
        </div>
      )}
    </div>
  );
}
