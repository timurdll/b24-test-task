/**
 * Типы для сущности Deal
 */

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
