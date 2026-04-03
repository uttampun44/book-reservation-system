import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBooks = async (page: number = 1, perPage: number = 6) => {
  const response = await api.get("/api/v1/books", {
    params: { page, perPage }
  });
  return response.data;
};