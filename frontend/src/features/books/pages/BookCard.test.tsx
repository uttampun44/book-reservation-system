import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookCard from "./BookCard";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";
import { useCart } from "../../../context/useCart";
import type { Book } from "../types/book";

vi.mock("../../auth/hooks/useAuth");
vi.mock("../hooks/useReservations");
vi.mock("../../../context/useCart");

const mockBook: Book = {
  id: "book-001",
  title: "The Midnight Library",
  author: "Matt Haig",
  genre: "Fiction",
  subGenre: "Philosophical Fiction",
  publishedYear: 2020,
  isbn: "978-0-525-55947-4",
  rating: 4.2,
  reviewCount: 98400,
  price: 14.99,
  currency: "USD",
  imageUrl: "test-url",
  coverImage: { small: "test-url-s", medium: "test-url-m", large: "test-url-l" },
  pages: 304,
  language: "English",
  publisher: "Viking",
  coverColor: "#1a3a5c",
  description: "A beautiful story about life and choices.",
  tags: ["life", "choices"],
  inStock: true,
  available: 5,
  featured: true,
};

const defaultReservationsMock = {
  reservedBooks: [],
  loading: false,
  error: null,
  isBookReserved: () => false,
  handleReserve: vi.fn(),
  handleUnreserve: vi.fn(),
  refreshReservations: vi.fn(),
};

const defaultCartMock = {
  cartItems: [],
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
  isInCart: () => false,
  isCartOpen: false,
  setIsCartOpen: vi.fn(),
};

describe("BookCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useReservations).mockReturnValue(defaultReservationsMock);
    vi.mocked(useCart).mockReturnValue(defaultCartMock);
  });

  it("shows 'Add to List' button when book is in stock and not reserved", () => {
    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );
    expect(screen.getByText("Add to List")).toBeInTheDocument();
  });

  it("calls addToCart and opens cart when 'Add to List' is clicked by an authenticated user", () => {
    const addToCart = vi.fn();
    const setIsCartOpen = vi.fn();
    vi.mocked(useCart).mockReturnValue({
      ...defaultCartMock,
      addToCart,
      setIsCartOpen,
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add to List"));

    expect(addToCart).toHaveBeenCalledWith(mockBook);
    expect(setIsCartOpen).toHaveBeenCalledWith(true);
  });

  it("opens the login modal instead of adding to cart when user is not authenticated", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add to List"));

    expect(defaultCartMock.addToCart).not.toHaveBeenCalled();
  });

  it("shows 'Remove from List' when the book is already in the cart", () => {
    vi.mocked(useCart).mockReturnValue({
      ...defaultCartMock,
      isInCart: () => true,
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    expect(screen.getByText("Remove from List")).toBeInTheDocument();
  });

  it("shows 'Already Reserved' disabled button when book is already reserved", () => {
    const handleUnreserveMock = vi.fn();
    vi.mocked(useReservations).mockReturnValue({
      ...defaultReservationsMock,
      isBookReserved: () => true,
      handleUnreserve: handleUnreserveMock,
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const button = screen.getByText("Already Reserved");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleUnreserveMock).not.toHaveBeenCalled();
  });

  it("shows 'Unavailable' disabled button when book is out of stock", () => {
    const outOfStockBook = { ...mockBook, inStock: false };

    render(
      <MemoryRouter>
        <BookCard book={outOfStockBook} />
      </MemoryRouter>
    );

    const button = screen.getByText("Unavailable");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
