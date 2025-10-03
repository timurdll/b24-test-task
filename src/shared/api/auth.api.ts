/**
 * API для аутентификации
 */
import { AuthResponse, LoginData, RegisterData } from "@/src/entities/user";
import { apiClient } from "./base";

export interface UpdateProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

/**
 * Регистрация пользователя
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Ошибка регистрации. Попробуйте позже.",
    };
  }

  return response.data!;
}

/**
 * Авторизация пользователя
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Ошибка входа. Попробуйте позже.",
    };
  }

  return response.data!;
}

/**
 * Получение текущего пользователя
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await apiClient.get<AuthResponse>("/auth/me");

  if (!response.ok) {
    return { ok: false };
  }

  return response.data!;
}

/**
 * Обновление профиля пользователя
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<AuthResponse> {
  const response = await apiClient.put<AuthResponse>(
    "/auth/update-profile",
    data
  );

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Ошибка обновления профиля. Попробуйте позже.",
    };
  }

  return response.data!;
}
