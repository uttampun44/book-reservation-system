import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BookGrid from "./BookList";
import type { Book } from "../types/book";

const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    subGenre: "Fiction",
    publishedYear: 1925,
    isbn: "1234567890",
    imageUrl: "https://example.com/gatsby.jpg",
    coverImage: { small: "", medium: "", large: "" },
    pages: 180,
    language: "English",
    publisher: "Scribner",
    rating: 4.5,
    reviewCount: 100,
    price: 15.99,
    currency: "USD",
    coverColor: "#1a2e1a",
    description: "A classic novel set in the Roaring Twenties.",
    tags: ["classic", "jazz age"],
    inStock: true,
    available: 5,
    featured: false,
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-fi",
    subGenre: "Epic",
    publishedYear: 1965,
    isbn: "0987654321",
    imageUrl: "https://example.com/dune.jpg",
    coverImage: { small: "", medium: "", large: "" },
    pages: 412,
    language: "English",
    publisher: "Chilton Books",
    rating: 4.8,
    reviewCount: 500,
    price: 18.5,
    currency: "USD",
    coverColor: "#e8c39e",
    description: "A science fiction masterpiece.",
    tags: ["sci-fi", "space opera"],
    inStock: false,
    available: 0,
    featured: true,
  },
];

describe("BookGrid", () => {
  it("renders 'No books found' when books array is empty", () => {
    render(<BookGrid books={[]} totalCount={0} searchQuery="" />);
    expect(screen.getByText("No books found")).toBeInTheDocument();
    expect(
      screen.getByText("Try a different search term or genre filter")
    ).toBeInTheDocument();
  });

  it("renders 'Available Now' when there is no search query and books exist", () => {
    render(<BookGrid books={mockBooks} totalCount={2} searchQuery="" />);
    expect(screen.getByText("Available Now")).toBeInTheDocument();
  });

  it("renders search results title when a search query is provided", () => {
    render(
      <BookGrid books={mockBooks} totalCount={2} searchQuery="Gatsby" />
    );
    expect(screen.getByText('Results for "Gatsby"')).toBeInTheDocument();
  });

  it("displays the correct showing count", () => {
    render(<BookGrid books={mockBooks} totalCount={10} searchQuery="" />);
    expect(screen.getByText("Showing 2 of 10 results")).toBeInTheDocument();
  });

  it("renders a BookCard for each book in the array", () => {
    render(<BookGrid books={mockBooks} totalCount={2} searchQuery="" />);
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("Dune")).toBeInTheDocument();
  });
});
