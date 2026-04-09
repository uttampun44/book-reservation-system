import React, { useState, useEffect } from "react";
import type { Book } from "../types/book";
import { CartContext } from "../hooks/useCart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Book[]>(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book: Book) => {
    if (!cartItems.find((item) => item.id === book.id)) {
      setCartItems((prev) => [...prev, book]);
    }
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isBookInCart = (bookId: string) => {
    return !!cartItems.find((item) => item.id === bookId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isBookInCart,
        totalItems: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
