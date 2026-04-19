import React, { useState, useEffect, type ReactNode} from 'react';
import type { Book } from '../features/books/types/book';
import { CartContext } from './CartContextEntity';
import { useAuth } from '../features/auth/hooks/useAuth';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userEmail } = useAuth();
  const cartKey = userEmail ? `cartItems_${userEmail}` : 'cartItems';

  const [cartItems, setCartItems] = useState<Book[]>(() => {
    try {
      const savedCart = localStorage.getItem(cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart items from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (book: Book) => {
    setCartItems(prev => {
      if (prev.some(item => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== bookId));
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (bookId: string) => cartItems.some(item => item.id === bookId);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      isCartOpen,
      setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};
