import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('novacart_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('novacart_token', data.data.token);
      localStorage.setItem('novacart_user', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('novacart_token', data.data.token);
      localStorage.setItem('novacart_user', JSON.stringify(data.data));
      setUser(data.data);
      return data.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('novacart_token');
    localStorage.removeItem('novacart_user');
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    const merged = { ...user, ...data.data };
    localStorage.setItem('novacart_user', JSON.stringify(merged));
    if (data.data.token) localStorage.setItem('novacart_token', data.data.token);
    setUser(merged);
    return merged;
  };

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      const merged = { ...user, ...data.data };
      localStorage.setItem('novacart_user', JSON.stringify(merged));
      setUser(merged);
    } catch {}
  };

  useEffect(() => {
    if (user?.token) refreshProfile();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
