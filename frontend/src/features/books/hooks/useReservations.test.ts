import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useReservations } from "./useReservations";

describe("useReservations Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should reserve a book and mark it as reserved", () => {
    const { result } = renderHook(() => useReservations());
    
    act(() => {
      result.current.reserveBook("book-1");
    });

    expect(result.current.isBookReserved("book-1")).toBe(true);
  });
});
