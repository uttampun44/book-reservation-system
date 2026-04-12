import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookCard from "./BookCard";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";
import type { Book } from "../types/book";

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

  it("should open reservation modal when 'Reserve Now' is clicked", () => {
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBooks: [],
      loading: false,
      error: null,
      isBookReserved: () => false, 
      handleReserve: vi.fn(),
      handleUnreserve: vi.fn(),
      refreshReservations: vi.fn()
    } as unknown as ReturnType<typeof useReservations>);

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const reserveButton = screen.getByText("Reserve Now");
    fireEvent.click(reserveButton);

    expect(screen.getByText("Confirm Reservation")).toBeInTheDocument();
  });

  it("should complete reservation when confirmed in modal", async () => {
    const handleReserveMock = vi.fn().mockResolvedValue({ success: true });
    
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBooks: [],
      loading: false,
      error: null,
      isBookReserved: () => false, 
      handleReserve: handleReserveMock,
      handleUnreserve: vi.fn(),
      refreshReservations: vi.fn()
    } as unknown as ReturnType<typeof useReservations>);

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Reserve Now"));
    
    const confirmButtons = screen.getAllByText("Confirm Reservation");
    fireEvent.click(confirmButtons[1]); 
    
    expect(handleReserveMock).toHaveBeenCalledWith(mockBook);
    
    await waitFor(() => {
      expect(screen.getByText("✨ Reservation Confirmed!")).toBeInTheDocument();
    });
  });

  it("should show 'Unreserve Book' and call unreserve if book is already reserved", () => {
    const handleUnreserveMock = vi.fn().mockResolvedValue({ success: true });

    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBooks: [{bookId: mockBook.id}],
      loading: false,
      error: null,
      isBookReserved: () => true, 
      handleReserve: vi.fn(),
      handleUnreserve: handleUnreserveMock,
      refreshReservations: vi.fn()
    } as unknown as ReturnType<typeof useReservations>);

    render(
      <MemoryRouter>
        <BookCard book={mockBook} />
      </MemoryRouter>
    );

    const button = screen.getByText("Unreserve Book");
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleUnreserveMock).toHaveBeenCalledWith(mockBook.id);
  });

  it("should show 'Unavailable' and disable the button if the book is out of stock", () => {
    const outOfStockBook = { ...mockBook, inStock: false };
    vi.mocked(useAuth).mockReturnValue({ 
      isAuthenticated: true, 
      login: vi.fn(), 
      logout: vi.fn() 
    });
    vi.mocked(useReservations).mockReturnValue({ 
      reservedBooks: [],
      loading: false,
      error: null,
      isBookReserved: () => false, 
      handleReserve: vi.fn(),
      handleUnreserve: vi.fn(),
      refreshReservations: vi.fn()
    } as unknown as ReturnType<typeof useReservations>);

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
