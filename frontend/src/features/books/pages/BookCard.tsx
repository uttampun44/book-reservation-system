import React, { useState } from "react";
import type { Book } from "../types/book";
import AvailabilityBadge from "../../../components/ui/availablityBadge";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [reserved, setReserved] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);

  const canReserve = book.available > 0;
  const isOut = !canReserve && !book.waitlist;

  const handleAction = () => {
    if (isOut) return;
    if (canReserve) setReserved(true);
    else setWaitlisted(true);
  };

  const getButtonStyle = (): React.CSSProperties => {
    if (isOut) return { background: "#e8e8e8", color: "#aaa", cursor: "not-allowed" };
    if (canReserve) {
      return reserved
        ? { background: "#2d6a4f22", color: "#2d6a4f", border: "1.5px solid #2d6a4f55" }
        : { background: "#1a2e1a", color: "#fff", cursor: "pointer" };
    }
    return waitlisted
      ? { background: "#f5eedc", color: "#b48c1e", border: "1.5px solid #c9a84c55" }
      : { background: "#f5eedc", color: "#8b6500", border: "1.5px solid #c9a84c66", cursor: "pointer" };
  };

  const getButtonLabel = (): string => {
    if (isOut) return "Unavailable";
    if (canReserve) return reserved ? "✓ Reserved" : "Reserve";
    return waitlisted ? "✓ On Waitlist" : "Join Waitlist";
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Book Cover */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${book.cover} 0%, ${book.coverAccent}55 100%)`,
        }}
      >
        <div className="absolute top-2.5 left-2.5">
          <AvailabilityBadge book={book} />
        </div>

        {/* Stylised cover art */}
        <div className="flex flex-col items-center justify-center gap-1 px-6 text-center select-none">
          <div
            className="w-8 h-0.5 rounded-full mb-2"
            style={{ background: book.coverAccent + "99" }}
          />
          <span
            className="text-xs font-bold tracking-widest uppercase opacity-60"
            style={{ color: book.coverAccent }}
          >
            {book.genre}
          </span>
          <div
            className="w-12 h-0.5 rounded-full mt-2"
            style={{ background: book.coverAccent + "55" }}
          />
        </div>
      </div>

      {/* Card body */}
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
          disabled={isOut}
          className="mt-2 w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95"
          style={getButtonStyle()}
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
};

export default BookCard;