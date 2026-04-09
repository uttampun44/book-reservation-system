import { createContext, useContext } from "react";
import type { Book } from "../types/book";

export interface CartContextType {
  cartItems: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  isBookInCart: (bookId: string) => boolean;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
