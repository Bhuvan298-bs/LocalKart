import { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../../services/mock/mockAuthService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLocality, setActiveLocality] = useState('Indiranagar, Bengaluru');

  useEffect(() => {
    async function initUser() {
      try {
        const u = await mockAuthService.getCurrentUser();
        setUser(u);
      } catch (err) {
        console.error('Failed to load demo user', err);
      } finally {
        setLoading(false);
      }
    }
    initUser();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const u = await mockAuthService.login(credentials);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const u = await mockAuthService.register(userData);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role) => {
    setLoading(true);
    try {
      const u = await mockAuthService.switchRole(role);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await mockAuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CUSTOMER',
        isAuthenticated: !!user,
        loading,
        activeLocality,
        setActiveLocality,
        login,
        register,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
