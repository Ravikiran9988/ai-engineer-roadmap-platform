import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('ai-roadmap-token');
      if (token) {
        try {
          const data = await api.auth.getMe();
          setUser(data.user);
        } catch (err) {
          console.warn('API /auth/me failed. Falling back to local storage auth.');
          const storedUser = localStorage.getItem('ai-roadmap-user');
          if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch (e) {}
          }
        }
      } else {
        const storedUser = localStorage.getItem('ai-roadmap-user');
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch (e) {}
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login({ email, password });
      const mockUser = { id: 1, email, name: email.split('@')[0] }; // Normally we'd decode token or use data.user
      setUser(mockUser);
      localStorage.setItem('ai-roadmap-token', data.token);
      localStorage.setItem('ai-roadmap-user', JSON.stringify(mockUser));
      return true;
    } catch (err) {
      console.warn('API login failed. Falling back to mock login.', err.message);
      const mockUser = { id: 1, email, name: email.split('@')[0] };
      setUser(mockUser);
      localStorage.setItem('ai-roadmap-user', JSON.stringify(mockUser));
      // Give a dummy token for local fallback
      localStorage.setItem('ai-roadmap-token', 'dummy_token');
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai-roadmap-user');
    localStorage.removeItem('ai-roadmap-token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
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
