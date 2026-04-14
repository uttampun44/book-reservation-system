import { createContext } from 'react';
import type { Book } from '../features/books/types/book';

export interface CartContextType {
  cartItems: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  isInCart: (bookId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Plain context object — no JSX, no component. Safe to export from a .ts file.
export const CartContext = createContext<CartContextType | undefined>(undefined);
