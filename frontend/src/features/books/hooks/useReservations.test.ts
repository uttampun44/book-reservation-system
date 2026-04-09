import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useReservations } from "./useReservations";

describe("useReservations Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should initialize with an empty list of reserved book IDs", () => {
    const { result } = renderHook(() => useReservations());
    expect(result.current.reservedBookIds).toEqual([]);
  });

  it("should add a book ID to the list when reserved", () => {
    const { result } = renderHook(() => useReservations());
    
    act(() => {
      result.current.reserveBook("book-1");
    });

    expect(result.current.reservedBookIds).toContain("book-1");
    expect(result.current.isBookReserved("book-1")).toBe(true);
  });

  it("should prevent duplicate reservations for the same book", () => {
    const { result } = renderHook(() => useReservations());
    
    act(() => {
      result.current.reserveBook("book-1");
      result.current.reserveBook("book-1"); // Attempt duplicate
    });

    expect(result.current.reservedBookIds).toHaveLength(1);
    expect(result.current.reservedBookIds).toEqual(["book-1"]);
  });

  it("should persist reservations to localStorage", () => {
    const { result } = renderHook(() => useReservations());
    
    act(() => {
      result.current.reserveBook("book-1");
    });

    // Check if it exists in another instance by simulating a reload
    const { result: secondResult } = renderHook(() => useReservations());
    expect(secondResult.current.reservedBookIds).toContain("book-1");
  });
});
