import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MyReservationsPage from "./MyReservationsPage";
import { useAuth } from "../../auth/hooks/useAuth";
import { useReservations } from "../hooks/useReservations";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the hooks
vi.mock("../../auth/hooks/useAuth");
vi.mock("../hooks/useReservations");

const mockReservedBooks = [
  {
    id: "res-1",
    bookId: "book-001",
    reserveDate: "2024-03-20T10:00:00Z",
    bookDetails: {
      title: "The Midnight Library",
      author: "Matt Haig",
      coverColor: "#1a3a5c",
      imageUrl: "mock-url",
    },
  },
  {
    id: "res-2",
    bookId: "book-002",
    reserveDate: "2024-03-21T12:00:00Z",
    bookDetails: {
      title: "Atomic Habits",
      author: "James Clear",
      coverColor: "#c0392b",
      imageUrl: "mock-url",
    },
  },
];

describe("MyReservationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });



 

  it("renders a list of reserved books", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
    vi.mocked(useReservations).mockReturnValue({
      reservedBooks: mockReservedBooks,
      loading: false,
      error: null,
      handleUnreserve: vi.fn(),
    });

    render(
      <BrowserRouter>
        <MyReservationsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId("reservations-list")).toBeInTheDocument();
    expect(screen.getByText("The Midnight Library")).toBeInTheDocument();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("Matt Haig")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
  });


});
