import React, { useState } from "react";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";
import { useNavigate } from "react-router-dom";
import ReservationModal from "./ReservationModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowSuccess: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onShowSuccess }) => {
  const { cartItems, removeFromCart, clearCart, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { reserveBook } = useReservations();
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenConfirm = () => {
    if (!isAuthenticated) {
      onClose();
      navigate("/login");
      return;
    }
    if (totalItems > 0) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleFinalConfirm = () => {
    // Reserve all books in cart
    cartItems.forEach((book) => {
      reserveBook(book.id);
    });

    // Clear cart and close
    clearCart();
    setIsConfirmModalOpen(false);
    onClose();
    onShowSuccess();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md bg-[#f5f4f0] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a2e1a] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a2e1a] font-[Lora]">Your Cart</h2>
                  <p className="text-xs text-gray-500 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'} ready to reserve</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {totalItems === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                  <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a2e1a]">Cart is empty</h3>
                    <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Explore our collection and add some books to your cart!</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[#1a2e1a] text-white text-sm font-bold active:scale-95 transition-all"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                cartItems.map((book) => (
                  <div 
                    key={book.id} 
                    className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-black/5 transition-all hover:shadow-md"
                  >
                    <div 
                      className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-inner"
                      style={{ backgroundColor: book.coverColor + '22' }}
                    >
                      <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1a2e1a] leading-tight line-clamp-2 pr-2">{book.title}</h4>
                        <button 
                          onClick={() => removeFromCart(book.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 text-gray-500 italic">{book.genre}</span>
                        <span className="text-sm font-bold text-[#1a2e1a]">${book.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {totalItems > 0 && (
              <div className="px-6 py-6 border-t border-black/10 bg-white/50 backdrop-blur-md sticky bottom-0">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-[#1a2e1a]">
                    ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleOpenConfirm}
                    className="w-full py-4 rounded-2xl bg-[#1a2e1a] text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                  >
                    Confirm Reservation
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear all items
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReservationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalConfirm}
        items={cartItems}
      />
    </>
  );
};

export default CartDrawer;
