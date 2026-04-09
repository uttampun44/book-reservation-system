import { useState } from "react";

export function useReservations() {
  const [reservedBookIds, setReservedBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("reservedBookIds");
    return saved ? JSON.parse(saved) : [];
  });

  const reserveBook = (bookId: string) => {
    const currentList = JSON.parse(localStorage.getItem("reservedBookIds") || "[]");
    if (currentList.includes(bookId)) return;
    
    const newList = [...currentList, bookId];
    setReservedBookIds(newList);
    localStorage.setItem("reservedBookIds", JSON.stringify(newList));
  };

  const isBookReserved = (bookId: string) => {
    return reservedBookIds.includes(bookId);
  };

  return { reservedBookIds, reserveBook, isBookReserved };
}
