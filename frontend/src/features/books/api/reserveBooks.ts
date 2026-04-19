import axios from "axios";
import type { Book } from "../types/book";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ReservationRequest {
  bookId: string;
  reserveDate: string;
}

export interface ReservedItem {
  id?: string;
  _id?: string;
  userId?: string;
  bookId?: string;
  reserveDate: string;
  bookDetails?: Book;
  book?: Book;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  data?: ReservedItem[];
  duplicates?: string[];
}

export const reserveBooks = async (
  reservations: ReservationRequest[]
): Promise<ReservationResponse> => {
  const response = await api.post("/api/v1/reserve-books", reservations);
  console.log("response-------", response.data);
  return response.data;
};

export const getReservedBooks = async (): Promise<ReservationResponse> => {
  const response = await api.get("/api/v1/reserve-books-list");
  return response.data;
};

export const unreserveBook = async (bookId: string): Promise<ReservationResponse> => {
  const response = await api.delete(`/api/v1/unreserve-books/${bookId}`);
  return response.data;

};
