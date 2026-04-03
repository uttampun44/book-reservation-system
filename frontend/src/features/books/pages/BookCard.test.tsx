import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BookCard from "./BookCard";
import type { Book } from "../types/book";

const inStockBook: Book = {
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
  description: "A classic novel.",
  tags: ["classic"],
  inStock: true,
  available: 5,
  featured: false,
};

const outOfStockBook: Book = {
  ...inStockBook,
  id: "2",
  title: "Dune",
  inStock: false,
  available: 0,
};

describe("BookCard", () => {
  it("renders the book details correctly", () => {
    render(<BookCard book={inStockBook} />);
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("$15.99")).toBeInTheDocument();
  });

  it("shows 'In Stock' badge and 'Reserve' button when book is available", () => {
    render(<BookCard book={inStockBook} />);
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve" })).toBeEnabled();
  });

  it("shows 'Out of Stock' badge and 'Unavailable' button when book is not available", () => {
    render(<BookCard book={outOfStockBook} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Unavailable" });
    expect(button).toBeDisabled();
  });

  it("changes button text to '✓ Reserved' when Reserve button is clicked", () => {
    render(<BookCard book={inStockBook} />);
    const button = screen.getByRole("button", { name: "Reserve" });
    fireEvent.click(button);
    expect(screen.getByText("✓ Reserved")).toBeInTheDocument();
  });

  it("renders the book image", () => {
    render(<BookCard book={inStockBook} />);
    const img = screen.getByAltText("The Great Gatsby");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", inStockBook.imageUrl);
  });
});
