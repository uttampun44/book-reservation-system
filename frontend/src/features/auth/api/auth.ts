import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RegisterFormData {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    fullname?: string;
    email: string;
  };
  users?: {
    id: string;
    fullname: string;
    email: string;
  };
}

export const registerUser = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await api.post("/api/v1/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post("/api/v1/auth/login", data);
  return response.data;
};

export const logoutUser = async (): Promise<AuthResponse> => {
  const response = await api.post("/api/v1/auth/logout");
  return response.data;
};
