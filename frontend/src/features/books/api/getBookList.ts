import axios from "axios";
import type { Book, BookListResponse } from "../types/book";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL:", import.meta.env.VITE_BACKEND_URL);

export const getBooks = async (
  page: number = 1,
  perPage: number = 8,
  sortByLabel: string = "Highest Rated"
): Promise<BookListResponse> => {
  const sortMap: Record<string, string> = {
    "Most Popular": "most_popular",
    "Highest Rated": "highest_rated",
    "Most Available": "most_available",
    "Title A–Z": "title_asc",
  };

  const sortByValue = sortMap[sortByLabel] || "highest_rated";

  const response = await api.get("/api/v1/books", {
    params: { page, perPage, sortBy: sortByValue },
  });
  return response.data;
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  // Frontend workaround: fetch list and find by ID
  const response = await api.get("/api/v1/books", {
    params: { perPage: 100 }, 
  });
  return response.data.data.find((book: Book) => book.id === id);
};