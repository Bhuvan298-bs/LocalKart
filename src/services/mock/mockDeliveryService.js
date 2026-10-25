import { MOCK_DELIVERY_PERSONNEL } from '../../data/mock/users.js';
import { mockOrderService } from './mockOrderService.js';

let deliveryStore = [...MOCK_DELIVERY_PERSONNEL];

export const mockDeliveryService = {
  async getDeliveryPersonnel() {
    return [...deliveryStore];
  },

  async getDeliveryQueue() {
    const orders = await mockOrderService.getOrders();
    // Delivery queue includes orders needing delivery assignment or currently en route
    return orders.filter(o => 
      o.fulfillmentType === 'DELIVERY' && 
      ['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status)
    );
  },

  async assignPartner(orderId, partnerId) {
    const partner = deliveryStore.find(p => p.id === partnerId);
    if (!partner) {
      throw new Error('Delivery partner not found');
    }

    const updatedOrder = await mockOrderService.assignDelivery(orderId, partner.name);
    return { order: updatedOrder, partner };
  }
};
