import React from "react";
import type { Book } from "../../features/books/types/book";

interface AvailabilityBadgeProps {
  book: Book;
}

const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ book }) => {
  if (book.inStock) {
    return (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: "rgba(188, 198, 193, 0.15)", color: "#ecf3f0ff" }}
      >
        In Stock
      </span>
    );
  }

  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "rgba(180,60,60,0.12)", color: "#b43c3c" }}
    >
      Out of Stock
    </span>
  );
};

export default AvailabilityBadge;