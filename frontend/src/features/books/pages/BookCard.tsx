import React, { useState } from "react";
import { ShoppingBag, BookmarkCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Book } from "../types/book";
import AvailabilityBadge from "../../../components/ui/availablityBadge";
import { useReservations } from "../hooks/useReservations";
import { useCart } from "../../../context/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import LoginModal from "../../auth/components/LoginModal";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { isBookReserved } = useReservations();
  const { addToCart, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const reserved = isBookReserved(book.id);
  const isOut = !book.inStock;

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOut || reserved) return;

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    addToCart(book);
    setIsCartOpen(true);
    toast.success(`"${book.title}" added to your list!`);
  };

  const getButtonConfig = () => {
    if (reserved) {
      return {
        label: "Already Reserved",
        icon: <BookmarkCheck className="w-4 h-4" />,
        style: { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0", cursor: "default" as const }
      };
    }
    if (isOut) {
      return {
        label: "Unavailable",
        icon: <ShoppingBag className="w-4 h-4" />,
        style: { background: "#e8e8e8", color: "#aaa", cursor: "not-allowed" as const }
      };
    }
    return {
      label: "Add to List",
      icon: <ShoppingBag className="w-4 h-4" />,
      style: { background: "#1a2e1a", color: "#fff", cursor: "pointer" as const }
    };
  };

  const { label, icon, style: buttonStyle } = getButtonConfig();

  return (
    <>
      <Link
        to={`/books/${book.id}`}
        className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl no-underline"
        style={{
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          border: "1px solid rgba(0,0,0,0.06)",
          color: "inherit",
        }}
      >
        <div
          className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: book.coverColor || "#1a2e1a" }}
        >
          <img
            src={book.coverImage?.large || book.imageUrl}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-opacity hover:opacity-100"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-2.5 left-2.5 z-10">
            <AvailabilityBadge book={book} />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <div>
            <h3 className="font-bold text-base leading-tight font-lora" style={{ color: "#1a2e1a" }}>
              {book.title}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: "#6b7c6b" }}>
              {book.author}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(26,46,26,0.07)", color: "#3a5a3a" }}
            >
              {book.genre}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold" style={{ color: "#1a2e1a" }}>
                {book.rating}
              </span>
            </div>
          </div>

          <button
            onClick={handleAction}
            disabled={isOut || reserved}
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2"
            style={buttonStyle}
          >
            {icon}
            {label}
          </button>
        </div>
      </Link>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default BookCard;
