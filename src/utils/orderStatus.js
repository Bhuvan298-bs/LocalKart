/**
 * Order status dictionary, labels, badge classes, and transition logic
 */

export const ORDER_STATUSES = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_DETAILS = {
  [ORDER_STATUSES.PLACED]: {
    label: 'Order Placed',
    badgeClass: 'status-placed',
    description: 'Received by store and awaiting confirmation',
    nextPossible: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  },
  [ORDER_STATUSES.ACCEPTED]: {
    label: 'Order Accepted',
    badgeClass: 'status-accepted',
    description: 'Shop confirmed availability and accepted order',
    nextPossible: ['PREPARING', 'CANCELLED'],
  },
  [ORDER_STATUSES.PREPARING]: {
    label: 'Preparing Items',
    badgeClass: 'status-preparing',
    description: 'Items are being packed by the shopkeeper',
    nextPossible: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
  },
  [ORDER_STATUSES.READY_FOR_PICKUP]: {
    label: 'Ready for Pickup',
    badgeClass: 'status-ready',
    description: 'Order packed and ready for customer or delivery pickup',
    nextPossible: ['DELIVERED', 'OUT_FOR_DELIVERY'],
  },
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    badgeClass: 'status-out-for-delivery',
    description: 'Delivery partner is bringing your order',
    nextPossible: ['DELIVERED'],
  },
  [ORDER_STATUSES.DELIVERED]: {
    label: 'Delivered',
    badgeClass: 'status-delivered',
    description: 'Successfully handed over to customer',
    nextPossible: [],
  },
  [ORDER_STATUSES.REJECTED]: {
    label: 'Declined by Store',
    badgeClass: 'status-rejected',
    description: 'Store was unable to fulfill this order',
    nextPossible: [],
  },
  [ORDER_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    badgeClass: 'status-cancelled',
    description: 'Order was cancelled',
    nextPossible: [],
  },
};

export const ORDER_TIMELINE_STEPS = [
  ORDER_STATUSES.PLACED,
  ORDER_STATUSES.ACCEPTED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.OUT_FOR_DELIVERY,
  ORDER_STATUSES.DELIVERED,
];

export function getStatusLabel(status) {
  return ORDER_STATUS_DETAILS[status]?.label || status;
}

export function getStatusBadgeClass(status) {
  return ORDER_STATUS_DETAILS[status]?.badgeClass || 'status-placed';
}

export function isValidTransition(currentStatus, nextStatus) {
  const allowed = ORDER_STATUS_DETAILS[currentStatus]?.nextPossible || [];
  return allowed.includes(nextStatus);
}
