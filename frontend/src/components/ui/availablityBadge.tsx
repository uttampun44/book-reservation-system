import React from "react";
import type { Book } from "../../features/books/types/book";

interface AvailabilityBadgeProps {
  book: Book;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ book }) => {
  if (book.available >= 2) {
    return (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "rgba(45,106,79,0.15)", color: "#2d6a4f" }}
      >
        {book.available} available
      </span>
    );
  }

  if (book.available === 1) {
    return (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "rgba(180,140,30,0.15)", color: "#b48c1e" }}
      >
        1 available
      </span>
    );
  }

  if (book.waitlist) {
    return (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "rgba(180,120,0,0.12)", color: "#b47800" }}
      >
        Waitlist
      </span>
    );
  }

  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "rgba(180,60,60,0.12)", color: "#b43c3c" }}
    >
      Out
    </span>
  );
};

export default AvailabilityBadge;