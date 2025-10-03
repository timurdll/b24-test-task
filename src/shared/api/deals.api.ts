/**
 * API для работы со сделками
 */
import { apiClient, ApiResponse } from "./base";

export interface Deal {
  id: string;
  title: string;
  date: string;
  status: string;
  contactId: string;
  opportunity: string;
  currency: string;
  comments: string;
}

export interface DealsResponse {
  ok: boolean;
  error?: string;
  deals?: Deal[];
}

export interface CreateDealResponse {
  ok: boolean;
  error?: string;
  dealId?: number;
  message?: string;
}

export interface CreateDealData {
  title: string;
  comments?: string;
}

/**
 * Получение всех сделок пользователя
 */
export async function getDeals(): Promise<DealsResponse> {
  const response = await apiClient.get<DealsResponse>("/deals");

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Ошибка получения сделок. Попробуйте позже.",
    };
  }

  return response.data!;
}

/**
 * Создание новой сделки
 */
export async function createDeal(
  data: CreateDealData
): Promise<CreateDealResponse> {
  const response = await apiClient.post<CreateDealResponse>("/deals", data);

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Ошибка создания сделки. Попробуйте позже.",
    };
  }

  return response.data!;
}
