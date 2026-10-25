import { Check, Clock, AlertCircle } from 'lucide-react';
import { ORDER_STATUS_DETAILS } from '../../utils/orderStatus.js';

export default function OrderTimeline({ currentStatus, statusHistory = [], fulfillmentType = 'DELIVERY' }) {
  // If order was rejected or cancelled, show focused notification
  if (currentStatus === 'REJECTED' || currentStatus === 'CANCELLED') {
    return (
      <div
        style={{
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-error-bg)',
          border: '1px solid var(--color-error-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          color: 'var(--color-error)'
        }}
      >
        <AlertCircle size={20} />
        <div>
          <strong style={{ fontSize: 'var(--font-size-sm)' }}>
            {currentStatus === 'REJECTED' ? 'Order Declined by Shop' : 'Order Cancelled'}
          </strong>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {statusHistory[statusHistory.length - 1]?.note || 'This order is closed and will not be fulfilled.'}
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'PLACED', label: 'Order Placed' },
    { key: 'ACCEPTED', label: 'Store Confirmed' },
    { key: 'PREPARING', label: 'Packing Items' },
    fulfillmentType === 'PICKUP'
      ? { key: 'READY_FOR_PICKUP', label: 'Ready at Counter' }
      : { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: fulfillmentType === 'PICKUP' ? 'Picked Up' : 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStatus);
  const effectiveIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="timeline">
      {steps.map((step, idx) => {
        const isCompleted = idx < effectiveIndex || currentStatus === 'DELIVERED';
        const isActive = idx === effectiveIndex && currentStatus !== 'DELIVERED';
        const historyEntry = statusHistory.find(h => h.status === step.key);

        return (
          <div
            key={step.key}
            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="timeline-marker">
              {isCompleted ? (
                <Check size={12} strokeWidth={3} />
              ) : isActive ? (
                <Clock size={12} />
              ) : (
                idx + 1
              )}
            </div>

            <div>
              <div className="timeline-label">{step.label}</div>
              <div className="timeline-time">
                {historyEntry
                  ? new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ORDER_STATUS_DETAILS[step.key]?.description || ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
