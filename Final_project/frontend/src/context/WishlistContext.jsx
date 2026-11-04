import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setItems(data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (product) => {
    if (!user) return false;
    const pid = product._id || product;
    const exists = items.some((p) => (p._id || p) === pid);
    if (exists) {
      await api.delete(`/wishlist/${pid}`);
    } else {
      await api.post(`/wishlist/${pid}`);
    }
    await fetchWishlist();
    return !exists;
  };

  const isWished = (productId) => items.some((p) => (p._id || p) === productId);

  const moveToCart = async (product, addToCartFn) => {
    await addToCartFn(product, 1);
    await api.delete(`/wishlist/${product._id || product}`);
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{ items, loading, toggle, isWished, fetchWishlist, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
