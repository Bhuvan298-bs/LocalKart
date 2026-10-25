import { MOCK_SHOPS } from '../../data/mock/shops.js';

// In-memory working copy
let shopsStore = [...MOCK_SHOPS];

export const mockShopService = {
  async getShops(filters = {}) {
    let result = [...shopsStore];

    // Status filter: by default only return APPROVED unless specified
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    } else if (filters.includePending !== true) {
      result = result.filter(s => s.status === 'APPROVED');
    }

    if (filters.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      result = result.filter(s => s.category.toLowerCase().includes(catLower));
    }

    if (filters.isOpen !== undefined && filters.isOpen !== null) {
      result = result.filter(s => s.isOpen === filters.isOpen);
    }

    if (filters.locality && filters.locality !== 'all') {
      result = result.filter(s => s.locality.toLowerCase().includes(filters.locality.toLowerCase()));
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getShopBySlug(slug) {
    return shopsStore.find(s => s.slug === slug) || null;
  },

  async getShopById(id) {
    return shopsStore.find(s => s.id === id) || null;
  },

  async updateShop(id, updates) {
    const idx = shopsStore.findIndex(s => s.id === id);
    if (idx === -1) {
      throw new Error('Shop not found');
    }
    shopsStore[idx] = { ...shopsStore[idx], ...updates };
    return { ...shopsStore[idx] };
  },

  async approveShop(id) {
    return this.updateShop(id, { status: 'APPROVED' });
  },

  async rejectShop(id) {
    return this.updateShop(id, { status: 'REJECTED' });
  },

  async createShopApplication(shopData) {
    const newShop = {
      id: `shop-${Date.now()}`,
      slug: shopData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: 0,
      reviewsCount: 0,
      status: 'PENDING_APPROVAL',
      deliveryFee: 25,
      minOrder: 150,
      isOpen: false,
      ...shopData
    };
    shopsStore.unshift(newShop);
    return newShop;
  }
};
