import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, Store, Truck } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockOrderService } from '../../services/mock/mockOrderService.js';
import { formatINR } from '../../utils/currency.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const list = await mockOrderService.getOrders();
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = searchTerm.trim() === '' ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      o.shopName.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Network Orders Oversight"
        subtitle="Live audit trail of all transactions, dispatch timings, and merchant fulfillment across the city."
      />

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4) var(--space-5)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ flex: '1 1 280px' }}>
          <Input
            placeholder="Search by order #, customer, or shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={Search}
            style={{ marginBottom: 0 }}
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'PLACED', label: 'Placed' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'PREPARING', label: 'Preparing' },
            { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
            { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
            { value: 'DELIVERED', label: 'Delivered' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'REJECTED', label: 'Declined' }
          ]}
          style={{ marginBottom: 0, minWidth: '180px' }}
        />
      </div>

      {loading ? (
        <LoadingState message="Loading network orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description="Adjust your search query or status filter to see other records."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Store & Locality</th>
                <th>Customer</th>
                <th>Mode</th>
                <th>Total Value</th>
                <th>Assigned Delivery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{ord.orderNumber}</strong>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {new Date(ord.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ord.shopName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{ord.shopLocality}</div>
                  </td>
                  <td>
                    <div>{ord.customerName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{ord.customerPhone}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                      {ord.fulfillmentType}
                    </span>
                  </td>
                  <td>
                    <span className="mono-num" style={{ fontWeight: 'bold' }}>
                      {formatINR(ord.totalAmount)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--font-size-xs)' }}>
                      {ord.assignedDeliveryPerson || '—'}
                    </span>
                  </td>
                  <td>
                    <OrderStatusBadge status={ord.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
