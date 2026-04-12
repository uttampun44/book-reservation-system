import axios from "axios";
import type { Book } from "../types/book";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  timeout: 10000,
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
  userId?: string;
  bookId: string;
  reserveDate: string;
  bookDetails?: Book;
}

export interface ReservationResponse {
  success: boolean;
  message: string;
  data?: ReservedItem[];
}

export const reserveBooks = async (
  reservations: ReservationRequest[]
): Promise<ReservationResponse> => {
  const response = await api.post("/api/v1/reserve-books", reservations);
  return response.data;
};

export const getReservedBooks = async (): Promise<ReservationResponse> => {
  const response = await api.get("/api/v1/reserve-books");
  return response.data;
};

export const unreserveBook = async (bookId: string): Promise<ReservationResponse> => {
  const response = await api.delete(`/api/v1/unreserve-books/${bookId}`);
  return response.data;
};
