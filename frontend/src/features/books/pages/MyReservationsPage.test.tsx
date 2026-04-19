import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";

import MyReservationsPage from "./MyReservationsPage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";

vi.mock("../../auth/hooks/useAuth");
vi.mock("../hooks/useReservations");

vi.mock("../../../components/layout/Navbar", () => ({
  default: () => <div>Navbar</div>,
}));

vi.mock("../components/CancelReservationModal", () => ({
  default: () => <div>Modal</div>,
}));

describe("MyReservationsPage - list rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders reserved books", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      userEmail: "test@example.com",
      login: vi.fn(),
      logout: vi.fn(),
    });

    // mock reservations
    vi.mocked(useReservations).mockReturnValue({
      reservedBooks: [
        {
          id: "1",
          bookId: "b1",
          reserveDate: "2024-03-20",
          book: {
            id: "b1",
            title: "Atomic Habits",
            author: "James Clear",
            coverColor: "#000",
            imageUrl: "img",

            genre: "",
            subGenre: "",
            publishedYear: 2020,
            description: "",
            publisher: "",
            pages: 100,
            language: "EN",
            isbn: "123",
            rating: 4,
            reviewCount: 100,
            price: 10,
            currency: "USD",
            inStock: true,
            available: 5,
            featured: false,
            tags: [],
            coverImage: {
              small: "img",
              medium: "img",
              large: "img", 
            }


          },
        },
      ],
      loading: false,
      error: null,
      handleUnreserve: vi.fn(),
      isBookReserved: vi.fn(),
      handleReserve: vi.fn(),
      refreshReservations: vi.fn(),
    });

    render(
      <BrowserRouter>
        <MyReservationsPage />
      </BrowserRouter>
    );

    // assertions
    expect(screen.getByText("My Reservations")).toBeInTheDocument();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
    expect(screen.getByText("Cancel Reservation")).toBeInTheDocument();
  });
})