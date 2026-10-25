import { useState, useEffect } from 'react';
import { Truck, UserCheck, ShieldAlert, CheckCircle2, MapPin, Store } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockDeliveryService } from '../../services/mock/mockDeliveryService.js';
import { mockOrderService } from '../../services/mock/mockOrderService.js';

export default function AdminDeliveriesPage({ onShowToast }) {
  const [deliveryQueue, setDeliveryQueue] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assignment Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    loadDeliveryData();
  }, []);

  async function loadDeliveryData() {
    setLoading(true);
    try {
      const [queue, partners] = await Promise.all([
        mockDeliveryService.getDeliveryQueue(),
        mockDeliveryService.getDeliveryPersonnel()
      ]);
      setDeliveryQueue(queue);
      setPersonnel(partners);
    } catch (err) {
      console.error('Failed to load delivery fleet data', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAssignModal = (order) => {
    setSelectedOrder(order);
    const existing = personnel.find(p => p.name === order.assignedDeliveryPerson);
    setSelectedPartnerId(existing ? existing.id : personnel[0]?.id || '');
  };

  const handleSaveAssignment = async () => {
    if (!selectedOrder || !selectedPartnerId) return;

    setAssignLoading(true);
    try {
      const { order: updatedOrder, partner } = await mockDeliveryService.assignPartner(
        selectedOrder.id,
        selectedPartnerId
      );

      setDeliveryQueue(prev => prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
      setSelectedOrder(null);

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Partner Assigned',
          message: `${partner.name} assigned to deliver Order #${updatedOrder.orderNumber}.`
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to assign partner');
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Delivery Fleet Dispatch & Queues"
        subtitle="Coordinate nearby delivery partners between neighbourhood merchants and customer doorsteps."
      />

      {/* Simulated Notice */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--font-size-xs)',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}
      >
        <ShieldAlert size={16} />
        <span>
          <strong>Simulated Fleet Coordination:</strong> Real-time rider GPS tracking, vehicle telemetry, and SMS notifications are simulated demonstration records in Phase 1.
        </span>
      </div>

      {/* Active Fleet Personnel Status Grid */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
          Active Delivery Fleet Personnel
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {personnel.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}
            >
              <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-full)', color: 'var(--color-primary)' }}>
                <Truck size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>{p.name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{p.vehicle}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {p.phone}
                </div>
              </div>
              <span className="badge-status status-in-stock" style={{ fontSize: '0.65rem' }}>
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Queue */}
      <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>
        Live Orders Needing Dispatch or En Route
      </h3>

      {loading ? (
        <LoadingState message="Loading delivery queue..." />
      ) : deliveryQueue.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Delivery queue is clear"
          description="There are currently no orders in preparation or awaiting partner dispatch."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Merchant Pickup</th>
                <th>Customer Destination</th>
                <th>Status</th>
                <th>Assigned Courier</th>
                <th style={{ textAlign: 'right' }}>Assignment</th>
              </tr>
            </thead>
            <tbody>
              {deliveryQueue.map((del) => (
                <tr key={del.id}>
                  <td>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{del.orderNumber}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{del.shopName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{del.shopLocality}</div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '280px', fontSize: 'var(--font-size-xs)' }}>
                      {del.deliveryAddress}
                    </div>
                  </td>
                  <td>
                    <OrderStatusBadge status={del.status} />
                  </td>
                  <td>
                    {del.assignedDeliveryPerson ? (
                      <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>
                        {del.assignedDeliveryPerson}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-warning)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                        Needs Partner
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant={del.assignedDeliveryPerson ? 'secondary' : 'primary'}
                      size="sm"
                      icon={UserCheck}
                      onClick={() => handleOpenAssignModal(del)}
                    >
                      {del.assignedDeliveryPerson ? 'Reassign' : 'Assign Courier'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Assign Delivery Courier · ${selectedOrder?.orderNumber}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={assignLoading}
              onClick={handleSaveAssignment}
            >
              Confirm Assignment
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Select a verified delivery partner to collect the package from <strong>{selectedOrder?.shopName}</strong> and transport it to the customer.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {personnel.map((p) => {
            const isSelected = selectedPartnerId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPartnerId(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{p.vehicle} · {p.phone}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} />
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
