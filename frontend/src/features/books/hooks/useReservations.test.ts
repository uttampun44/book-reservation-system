import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useReservations } from "./useReservations";
import * as api from "../api/reserveBooks";
import type { Book } from "../types/book";

vi.mock("../api/reserveBooks", () => ({
  getReservedBooks: vi.fn(),
  reserveBooks: vi.fn(),
  unreserveBook: vi.fn(),
}));

const mockBook1 = {
  id: "book-1",
  title: "Mock Title",
  author: "Mock Author",
  isbn: "123",
  genre: "Fiction",
  publishedDate: "2024",
  description: "Desc",
  rating: 5,
  available: 10,
  totalPages: 100,
  language: "Eng"
};

const mockReservationItem = {
  bookId: "book-1",
  reserveDate: "2024-04-12T00:00:00.000Z",
  bookDetails: mockBook1 as unknown as Book
};

describe("useReservations Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with an empty list of reserved books", async () => {
    vi.mocked(api.getReservedBooks).mockResolvedValue({ success: true, message: "", data: [] });
    
    const { result } = renderHook(() => useReservations());
    
    expect(result.current.reservedBooks).toEqual([]);
    expect(result.current.loading).toBe(true);  
  });

  it("should fetch and set reserved books on mount", async () => {
    vi.mocked(api.getReservedBooks).mockResolvedValue({ 
      success: true, 
      message: "Fetched", 
      data: [mockReservationItem] 
    });

    const { result } = renderHook(() => useReservations());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); 
    });

    expect(api.getReservedBooks).toHaveBeenCalledTimes(1);
    expect(result.current.reservedBooks).toEqual([mockReservationItem]);
    expect(result.current.isBookReserved("book-1")).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("should call reservation API and refresh data on success", async () => {
    vi.mocked(api.getReservedBooks)
      .mockResolvedValueOnce({ success: true, message: "", data: [] }) // initial fetch
      .mockResolvedValueOnce({ success: true, message: "", data: [mockReservationItem] }); // refresh fetch
      
    vi.mocked(api.reserveBooks).mockResolvedValue({ success: true, message: "Reserved" });

    const { result } = renderHook(() => useReservations());

    await act(async () => {
      const resp = await result.current.handleReserve(mockBook1 as unknown as Book);
      expect(resp.success).toBe(true);
    });

    expect(api.reserveBooks).toHaveBeenCalledTimes(1);
    expect(api.getReservedBooks).toHaveBeenCalledTimes(2);
    expect(result.current.reservedBooks).toEqual([mockReservationItem]);
  });
});
