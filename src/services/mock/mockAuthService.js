import { MOCK_USERS } from '../../data/mock/users.js';

let currentUser = MOCK_USERS[0]; // Default demo active user: Priya Sharma (Customer)

export const mockAuthService = {
  async getCurrentUser() {
    return currentUser ? { ...currentUser } : null;
  },

  async login({ emailOrPhone, password, role = 'CUSTOMER' }) {
    // Simulated mock authentication: find by email or phone or match role
    let found = MOCK_USERS.find(
      u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.role === role
    );

    if (!found) {
      // If role matches demo accounts, provide convenient demo login
      found = MOCK_USERS.find(u => u.role === role);
    }

    if (!found) {
      // Create transient demo session
      found = {
        id: `user-${Date.now()}`,
        name: emailOrPhone.split('@')[0] || 'Demo User',
        email: emailOrPhone,
        phone: '9845000000',
        role: role,
        address: '12th Main, Indiranagar, Bengaluru'
      };
    }

    currentUser = { ...found };
    return { ...currentUser };
  },

  async register({ name, email, phone, role = 'CUSTOMER', shopDetails = null }) {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role,
      address: shopDetails?.address || 'Indiranagar, Bengaluru',
      shopId: shopDetails?.id || null,
      shopName: shopDetails?.name || null
    };

    currentUser = { ...newUser };
    return { ...currentUser };
  },

  async switchRole(role) {
    const targetUser = MOCK_USERS.find(u => u.role === role);
    if (targetUser) {
      currentUser = { ...targetUser };
    } else {
      currentUser = {
        id: `user-${role.toLowerCase()}-demo`,
        name: `Demo ${role}`,
        role: role,
        email: `${role.toLowerCase()}@localkart.demo`
      };
    }
    return { ...currentUser };
  },

  async logout() {
    currentUser = null;
    return true;
  }
};
