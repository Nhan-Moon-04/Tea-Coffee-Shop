import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, options = {}) => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return { success: false, needAuth: true };
    }

    try {
      setLoading(true);
      const response = await cartAPI.add({
        productId,
        quantity: options.quantity || 1,
        variant: options.variant || '',
        note: options.note || ''
      });
      setCart(response.data.cart);
      toast.success('Đã thêm vào giỏ hàng!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thêm vào giỏ hàng thất bại');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.update(itemId, { quantity });
      setCart(response.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.remove(itemId);
      setCart(response.data.cart);
      toast.success('Đã xóa khỏi giỏ hàng');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clear();
      setCart({ items: [], totalAmount: 0 });
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    loading,
    cartItemsCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
