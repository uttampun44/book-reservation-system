import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookCard from "./BookCard";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";
import type { Book } from "../types/book";

// Mock the hooks
vi.mock("../../auth/hooks/useAuth");
vi.mock("../hooks/useReservations");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
  coverImage: {
    small: "test-url-s",
    medium: "test-url-m",
    large: "test-url-l",
  },
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

describe("BookCard Full Reservation Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should check for authentication when 'Reserve' is clicked", () => {
    // User is NOT authenticated
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: false, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBookIds: [],
      isBookReserved: () => false, 
      reserveBook: vi.fn() 
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const reserveButton = screen.getByText("Reserve");
    fireEvent.click(reserveButton);

    // Should redirect to login
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should allow reservation if user is authenticated", () => {
    const reserveBookMock = vi.fn();
    // User IS authenticated
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBookIds: [],
      isBookReserved: () => false, 
      reserveBook: reserveBookMock 
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Reserve"));
    
    // Should call reserveBook
    expect(reserveBookMock).toHaveBeenCalledWith(mockBook.id);
    
    // Should show success state (checked by button text change or presence of success message)
    expect(screen.getByText(/Book Reserved Successfully/i)).toBeInTheDocument();
  });

  it("should show '✓ Reserved' and disable the button if book is already reserved", () => {
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBookIds: [mockBook.id],
      isBookReserved: () => true, 
      reserveBook: vi.fn() 
    });

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const button = screen.getByText("✓ Reserved");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should disable the button if the book is out of stock", () => {
    const outOfStockBook = { ...mockBook, inStock: false };
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBookIds: [],
      isBookReserved: () => false, 
      reserveBook: vi.fn() 
    });

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
