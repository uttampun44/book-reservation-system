import React from "react";
import type { Book } from "../types/book";
import BookCard from "./BookCard";

interface BookGridProps {
  books: Book[];
  totalCount: number;
  searchQuery: string;
}

const NoBooksFound: React.FC = () => (
  <div className="text-center py-24">
    <div className="text-5xl mb-4">📚</div>
    <h3 className="text-xl font-bold mb-2 font-lora text-green-900">
      No books found
    </h3>
    <p className="text-sm text-gray-500">
      Try a different search term or genre filter
    </p>
  </div>
);

const BookListHeader: React.FC<{ searchQuery: string; booksLength: number; totalCount: number }> = ({
  searchQuery,
  booksLength,
  totalCount,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold font-lora text-green-900">
        {searchQuery ? `Results for "${searchQuery}"` : "Available Now"}
      </h2>
      <p className="text-sm mt-1 text-gray-500">
        Showing {booksLength} of {totalCount} results
      </p>
    </div>
  </div>
);

const BookGrid: React.FC<BookGridProps> = ({ books, totalCount, searchQuery }) => {
  if (books.length === 0) {
    return <NoBooksFound />;
  }

  return (
    <>
      <BookListHeader searchQuery={searchQuery} booksLength={books.length} totalCount={totalCount} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </>
  );
};

export default BookGrid;