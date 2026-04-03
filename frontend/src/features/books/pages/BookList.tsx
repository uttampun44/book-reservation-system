import React from "react";
import type { Book } from "../types/book";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  totalCount: number;
  searchQuery: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, totalCount, searchQuery }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">📚</div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: "#1a2e1a", fontFamily: "'Lora', serif" }}
        >
          No books found
        </h3>
        <p className="text-sm" style={{ color: "#888" }}>
          Try a different search term or genre filter
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "#1a2e1a", fontFamily: "'Lora', serif" }}
          >
            {searchQuery ? `Results for "${searchQuery}"` : "Available Now"}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#888" }}>
            Showing {books.length} of {totalCount} results
          </p>
        </div>
       
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
};

export default BookGrid;