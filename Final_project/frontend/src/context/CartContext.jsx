import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_KEY = 'novacart_guest_cart';

const readGuest = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY)) || []; } catch { return []; }
};
const writeGuest = (items) => localStorage.setItem(GUEST_KEY, JSON.stringify(items));

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServer = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // merge guest cart into server on login
  useEffect(() => {
    if (user) {
      const guest = readGuest();
      if (guest.length) {
        (async () => {
          for (const g of guest) {
            try { await api.post('/cart', { productId: g.product._id || g.product, quantity: g.quantity }); } catch {}
          }
          localStorage.removeItem(GUEST_KEY);
          await fetchServer();
        })();
      } else {
        fetchServer();
      }
    } else {
      setItems(readGuest());
    }
  }, [user, fetchServer]);

  const addToCart = async (product, quantity = 1) => {
    const pid = product._id || product;
    if (user) {
      await api.post('/cart', { productId: pid, quantity });
      await fetchServer();
    } else {
      const cur = readGuest();
      const idx = cur.findIndex((c) => (c.product._id || c.product) === pid);
      if (idx > -1) cur[idx].quantity += quantity;
      else cur.push({ product, quantity });
      writeGuest(cur);
      setItems([...cur]);
    }
  };

  const updateQty = async (productId, quantity) => {
    if (user) {
      await api.put(`/cart/${productId}`, { quantity });
      await fetchServer();
    } else {
      const cur = readGuest();
      const idx = cur.findIndex((c) => (c.product._id || c.product) === productId);
      if (idx > -1) {
        if (quantity <= 0) cur.splice(idx, 1);
        else cur[idx].quantity = quantity;
      }
      writeGuest(cur);
      setItems([...cur]);
    }
  };

  const remove = async (productId) => {
    if (user) {
      await api.delete(`/cart/${productId}`);
      await fetchServer();
    } else {
      const cur = readGuest().filter((c) => (c.product._id || c.product) !== productId);
      writeGuest(cur);
      setItems(cur);
    }
  };

  const clear = async () => {
    if (user) {
      await api.delete('/cart');
      setItems([]);
    } else {
      localStorage.removeItem(GUEST_KEY);
      setItems([]);
    }
  };

  const count = items.reduce((a, b) => a + (b.quantity || 0), 0);
  const subtotal = items.reduce((a, b) => a + (b.product?.price || 0) * (b.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQty, remove, clear, count, subtotal, fetchServer }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
