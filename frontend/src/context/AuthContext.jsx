import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ai-roadmap-token');
    if (!token) { setLoading(false); return; }

    api.auth.getMe()
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('ai-roadmap-token');
        localStorage.removeItem('ai-roadmap-user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem('ai-roadmap-token', data.token);
    localStorage.setItem('ai-roadmap-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password) => {
    const data = await api.auth.register({ username, email, password });
    localStorage.setItem('ai-roadmap-token', data.token);
    localStorage.setItem('ai-roadmap-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ai-roadmap-token');
    localStorage.removeItem('ai-roadmap-user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}