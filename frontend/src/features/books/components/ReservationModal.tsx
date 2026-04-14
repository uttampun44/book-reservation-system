import React, { useState } from "react";
import { X, ShoppingBag, Trash2, CheckCircle, Info, Loader2, ArrowRight, AlertTriangle } from "lucide-react";
import type { Book } from "../types/book";
import { useCart } from "../../../context/useCart";
import { reserveBooks } from "../api/reserveBooks";
import { useReservations } from "../hooks/useReservations";
import { toast } from "react-toastify";

interface ReservationError {
  message: string;
  duplicates: string[]; 
}

const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { refreshReservations } = useReservations();
  const [isLoading, setIsLoading] = useState(false);
  const [reservationError, setReservationError] = useState<ReservationError | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleConfirm = async () => {
    if (cartItems.length === 0) return;
    setIsLoading(true);
    setReservationError(null);
    try {
      const response = await reserveBooks(
        cartItems.map((book) => ({
          bookId: book.id,
          reserveDate: new Date().toISOString(),
        }))
      );

      if (response.success) {
        toast.success("Books reserved successfully!");
        clearCart();
        setShowSuccess(true);
        await refreshReservations();
        setTimeout(() => {
          setShowSuccess(false);
          setIsCartOpen(false);
        }, 2500);
      } else {
        const msg = response.message || "Reservation failed. Please try again.";
        toast.error(msg);
        setReservationError({
          message: msg,
          duplicates: response.duplicates || [],
        });
      }
    } catch (err) {
      const apiData = (err as { response?: { data?: { message?: string; duplicates?: string[] } } }).response?.data;
      const msg = apiData?.message || (err instanceof Error ? err.message : "Something went wrong. Please try again.");
      toast.error(msg);
      setReservationError({
        message: msg,
        duplicates: apiData?.duplicates || [],
      });
    } finally {
      setIsLoading(false);
    }
  };


  const bookMap = Object.fromEntries(cartItems.map((b) => [b.id, b]));

  const duplicateBooks =
    reservationError?.duplicates
      .map((id) => bookMap[id])
      .filter(Boolean) ?? [];

  const handleRemoveDuplicates = () => {
    reservationError?.duplicates.forEach((id) => removeFromCart(id));
    setReservationError(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => !isLoading && setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md z-[110] flex flex-col bg-[#fafaf8] shadow-2xl animate-in slide-in-from-right duration-300">

        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a2e1a] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1a2e1a] font-[Lora]">Reservation List</h2>
              <p className="text-xs text-gray-400 font-medium">
                {cartItems.length} book{cartItems.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">

          {showSuccess && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-black text-[#1a2e1a] font-[Lora] text-center">All Reserved!</h3>
              <p className="text-sm text-gray-400 text-center max-w-xs">
                Your books are reserved for 48 hours. Visit the main desk with your library ID to collect them.
              </p>
            </div>
          )}

          {reservationError && !showSuccess && (
            <div >


              {duplicateBooks.length > 0 && (
                <div className="px-4 pb-4">
                  <button
                    onClick={handleRemoveDuplicates}
                    className="w-full py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold transition-colors active:scale-95"
                  >
                    Remove {duplicateBooks.length} duplicate{duplicateBooks.length !== 1 ? "s" : ""} from list
                  </button>
                </div>
              )}
            </div>
          )}

 

          {!showSuccess && cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-gray-300" />
              </div>
              <div>
                <h3 className="font-bold text-[#1a2e1a] text-lg">Your list is empty</h3>
                <p className="text-sm text-gray-400 mt-1">Add books by clicking "Add to List" on any book card.</p>
              </div>
            </div>
          )}

          {!showSuccess &&
            cartItems.map((book) => (
              <CartItem
                key={book.id}
                book={book}
                onRemove={removeFromCart}
                disabled={isLoading}
                isDuplicate={reservationError?.duplicates.includes(book.id) ?? false}
              />
            ))}
        </div>

        {!showSuccess && cartItems.length > 0 && (
          <div className="px-6 pb-6 pt-4 border-t border-black/8 bg-white space-y-3">
            <div className="flex gap-2 px-1">
              <Info className="w-4 h-4 text-[#c9a84c] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                Books will be reserved for <span className="font-bold text-gray-600">48 hours</span>. Bring your library ID to the main desk to collect.
              </p>
            </div>

            <div className="flex items-center justify-between px-1 py-2">
              <span className="text-sm font-semibold text-gray-500">Total books</span>
              <span className="text-sm font-black text-[#1a2e1a]">{cartItems.length}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                disabled={isLoading}
                className="px-4 py-3 rounded-2xl border border-black/10 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-red-400 transition-all active:scale-95 disabled:opacity-50"
              >
                Clear All
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 py-3 rounded-2xl bg-[#1a2e1a] text-white font-bold text-sm shadow-lg shadow-black/10 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  <>
                    Confirm & Reserve
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e2e2; border-radius: 10px; }
      `}</style>
    </>
  );
};

interface CartItemProps {
  book: Book;
  onRemove: (id: string) => void;
  disabled: boolean;
  isDuplicate: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ book, onRemove, disabled, isDuplicate }) => (
  <div
    className={`flex gap-3 p-3 rounded-2xl border shadow-sm group transition-all ${
      isDuplicate
        ? "bg-red-50 border-red-200 shadow-red-100"
        : "bg-white border-black/5 hover:shadow-md"
    }`}
  >
    <div
      className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm"
      style={{ backgroundColor: book.coverColor || "#1a2e1a" }}
    >
      <img
        src={book.coverImage?.large || book.imageUrl}
        alt={book.title}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
      <div>
        <p className={`font-bold text-sm leading-snug line-clamp-2 transition-colors ${isDuplicate ? "text-red-700" : "text-[#1a2e1a] group-hover:text-[#2d6a4f]"}`}>
          {book.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(26,46,26,0.07)", color: "#3a5a3a" }}
        >
          {book.genre}
        </span>
        {isDuplicate && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
            Already reserved
          </span>
        )}
      </div>
    </div>

    <button
      onClick={() => onRemove(book.id)}
      disabled={disabled}
      className="self-center p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all active:scale-95 disabled:opacity-50"
      aria-label="Remove from list"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

export default CartDrawer;
