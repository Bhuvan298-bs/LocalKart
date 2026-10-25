import { MOCK_PRODUCTS } from '../../data/mock/products.js';

let productsStore = [...MOCK_PRODUCTS];

export const mockProductService = {
  async getProducts(filters = {}) {
    let result = [...productsStore];

    if (filters.shopId) {
      result = result.filter(p => p.shopId === filters.shopId);
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.activeOnly) {
      result = result.filter(p => p.isActive === true);
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getProductById(id) {
    return productsStore.find(p => p.id === id) || null;
  },

  async createProduct(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      isActive: true,
      stockQuantity: Number(productData.stockQuantity || 0),
      lowStockThreshold: Number(productData.lowStockThreshold || 5),
      price: Number(productData.price || 0),
      image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      ...productData
    };
    productsStore.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id, updates) {
    const idx = productsStore.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error('Product not found');
    }
    const cleanUpdates = { ...updates };
    if (cleanUpdates.stockQuantity !== undefined) {
      cleanUpdates.stockQuantity = Number(cleanUpdates.stockQuantity);
    }
    if (cleanUpdates.price !== undefined) {
      cleanUpdates.price = Number(cleanUpdates.price);
    }
    if (cleanUpdates.lowStockThreshold !== undefined) {
      cleanUpdates.lowStockThreshold = Number(cleanUpdates.lowStockThreshold);
    }

    productsStore[idx] = { ...productsStore[idx], ...cleanUpdates };
    return { ...productsStore[idx] };
  },

  async deleteProduct(id) {
    const idx = productsStore.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error('Product not found');
    }
    const removed = productsStore.splice(idx, 1);
    return removed[0];
  },

  async getAlternativeShops(productId) {
    const prod = await this.getProductById(productId);
    if (!prod || !prod.alternativeShops) {
      return [];
    }
    return prod.alternativeShops;
  },

  // Simulated AI suggestion per section 13 of requirements
  async getMockAiSuggestion(category = 'groceries') {
    const suggestions = {
      groceries: {
        name: 'Organic Royal Sona Masoori Rice Hand-Pounded',
        brand: 'Karnataka Heritage Organics',
        category: 'groceries',
        unit: '5 kg Bag',
        price: 360,
        lowStockThreshold: 5,
        description: 'Single-origin unpolished Sona Masoori aged naturally for 12 months. Low GI index, aromatic aroma, and gentle on digestion.'
      },
      produce: {
        name: 'Hydroponic English Cucumber & Cherry Tomatoes Box',
        brand: 'Urban Greens',
        category: 'produce',
        unit: '500 g Box',
        price: 75,
        lowStockThreshold: 4,
        description: 'Crisp pesticide-free English salad cucumbers paired with sweet vine-ripened red cherry tomatoes.'
      },
      bakery: {
        name: 'Artisanal Multigrain Sourdough Loaf with Flaxseeds',
        brand: 'Neighbourhood Bakehouse',
        category: 'bakery',
        unit: '400 g Loaf',
        price: 110,
        lowStockThreshold: 3,
        description: 'Slow-fermented 36-hour sourdough with rye, rolled oats, sesame, and toasted golden flaxseeds.'
      }
    };

    return suggestions[category] || suggestions.groceries;
  }
};
