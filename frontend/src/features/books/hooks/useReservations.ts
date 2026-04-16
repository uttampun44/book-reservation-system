import { useState, useEffect, useCallback } from "react";
import { getReservedBooks, reserveBooks, unreserveBook, type ReservedItem } from "../api/reserveBooks";
import type { Book } from "../types/book";

export function useReservations() {
  const [reservedBooks, setReservedBooks] = useState<ReservedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReservedBooks();
      if (response.success && response.data) {
        setReservedBooks(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
      setError("Failed to load your reservations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleReserve = async (book: Book) => {
    setLoading(true);
    try {
      const response = await reserveBooks([{ 
        bookId: book.id, 
        reserveDate: new Date().toISOString() 
      }]);
      console.log("response-------", response);
      if (response.success) {
        await fetchReservations();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reserve book";
      console.log("errorMessage-------", errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleUnreserve = async (bookId: string) => {
    setLoading(true);
    try {
      const response = await unreserveBook(bookId);
      if (response.success) {
        await fetchReservations();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to unreserve book";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const isBookReserved = (bookId: string) => {
    return reservedBooks.some((item) => item.bookId === bookId);
  };

  return { 
    reservedBooks, 
    loading, 
    error, 
    isBookReserved, 
    handleReserve, 
    handleUnreserve,
    refreshReservations: fetchReservations
  };
}
