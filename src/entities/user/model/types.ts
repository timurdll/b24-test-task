/**
 * Типы для сущности User
 */

export interface User {
  id: number;
  login: string;
  email: string;
  bitrixId: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}
