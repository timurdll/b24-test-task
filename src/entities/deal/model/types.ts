/**
 * Типы для сущности Deal
 */
import type { BitrixDeal } from "@/src/shared/types/bitrix.types";

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

export interface CreateDealData {
  title: string;
  comments?: string;
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

export interface CreateDealDto {
  title: string;
  comments?: string;
}

// Re-export BitrixDeal for convenience
export type { BitrixDeal };
