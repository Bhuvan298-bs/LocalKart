import { MOCK_ORDERS } from '../../data/mock/orders.js';
import { isValidTransition } from '../../utils/orderStatus.js';

let ordersStore = [...MOCK_ORDERS];

export const mockOrderService = {
  async getOrders(filters = {}) {
    let result = [...ordersStore];

    if (filters.customerId) {
      result = result.filter(o => o.customerId === filters.customerId);
    }

    if (filters.shopId) {
      result = result.filter(o => o.shopId === filters.shopId);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(o => o.status === filters.status);
    }

    // Sort by latest placedAt
    return result.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  },

  async getOrderById(id) {
    return ordersStore.find(o => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(payload) {
    const orderIndex = ordersStore.length + 1;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `LK-2026-${800 + orderIndex}`,
      status: 'PLACED',
      placedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'PLACED',
          timestamp: new Date().toISOString(),
          note: 'Demo order placed by customer'
        }
      ],
      ...payload
    };

    ordersStore.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId, nextStatus, note = '') {
    const idx = ordersStore.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) {
      throw new Error('Order not found');
    }

    const currentOrder = ordersStore[idx];
    if (!isValidTransition(currentOrder.status, nextStatus)) {
      throw new Error(`Invalid status transition from ${currentOrder.status} to ${nextStatus}`);
    }

    const updatedHistory = [
      ...(currentOrder.statusHistory || []),
      {
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status changed to ${nextStatus}`
      }
    ];

    const updates = {
      status: nextStatus,
      statusHistory: updatedHistory
    };

    if (nextStatus === 'DELIVERED') {
      updates.deliveredAt = new Date().toISOString();
    }

    ordersStore[idx] = { ...currentOrder, ...updates };
    return { ...ordersStore[idx] };
  },

  async assignDelivery(orderId, deliveryPersonName) {
    const idx = ordersStore.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) {
      throw new Error('Order not found');
    }

    ordersStore[idx] = {
      ...ordersStore[idx],
      assignedDeliveryPerson: deliveryPersonName,
      statusHistory: [
        ...(ordersStore[idx].statusHistory || []),
        {
          status: ordersStore[idx].status,
          timestamp: new Date().toISOString(),
          note: `Assigned delivery partner: ${deliveryPersonName}`
        }
      ]
    };

    return { ...ordersStore[idx] };
  }
};
