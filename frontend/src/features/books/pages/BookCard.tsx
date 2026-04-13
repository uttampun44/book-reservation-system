import React, { useState } from "react";
import {  Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Book } from "../types/book";
import AvailabilityBadge from "../../../components/ui/availablityBadge";
import { useReservations } from "../hooks/useReservations";
import ReservationModal from "../components/ReservationModal";
import { useAuth } from "../../auth/hooks/useAuth";
import LoginModal from "../../auth/components/LoginModal";
interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { isBookReserved, handleReserve, handleUnreserve, loading } = useReservations();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserved = isBookReserved(book.id);
  const canReserve = book.inStock;
  const isOut = !canReserve;

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOut) return;

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (reserved) {
      await handleUnreserve(book.id);
    } else {
      setIsModalOpen(true);
    }
  };

  const onConfirmReservation = async () => {
    setError(null);
    const result = await handleReserve(book);
    if (result.success) {
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setError(result.message || "Failed to reserve book");
    }
  };

  const getButtonStyle = (): React.CSSProperties => {
    if (isOut) return { background: "#e8e8e8", color: "#aaa", cursor: "not-allowed" };
    if (reserved) return { background: "#ef444415", color: "#ef4444", border: "1.5px solid #ef444430", cursor: "pointer" };
    
    return { background: "#1a2e1a", color: "#fff", cursor: "pointer" };
  };

  const getButtonLabel = () => {
    if (isOut) return "Unavailable";
    if (loading) return "Processing...";
    return reserved ? "Unreserve Book" : "Reserve Now";
  };

  return (
    <>
      <Link
        to={`/books/${book.id}`}
        className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl no-underline"
        style={{
          background: "#fff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          border: "1px solid rgba(0,0,0,0.06)",
          color: "inherit"
        }}
      >
        {showSuccess && (
          <div 
            className="absolute inset-x-0 top-0 bg-[#c9a84c] text-white py-2 text-center text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300 z-50 shadow-md"
          >
            ✨ Reservation Confirmed!
          </div>
        )}

        <div
          className="relative h-48 flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: book.coverColor || "#1a2e1a",
          }}
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
            <h3
              className="font-bold text-base leading-tight"
              style={{ color: "#1a2e1a", fontFamily: "'Lora', Georgia, serif" }}
            >
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
   
          </div>

          <button
            onClick={handleAction}
            disabled={isOut || loading}
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2"
            style={getButtonStyle()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (reserved ? null : null)}
            {getButtonLabel()}
          </button>
        </div>
      </Link>

      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmReservation}
        items={[book]}
        isLoading={loading}
        error={error}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default BookCard;

