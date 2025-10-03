/**
 * Типы для работы с Битрикс24 API
 */

export interface BitrixContactData {
  NAME: string;
  EMAIL: Array<{ VALUE: string; VALUE_TYPE: string }>;
}

export interface BitrixContactResponse {
  result?: number;
  error?: string;
  error_description?: string;
}

export interface BitrixContactUpdateData {
  NAME: string;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ADDRESS?: string;
}

export interface BitrixContactUpdateResponse {
  result?: boolean;
  error?: string;
  error_description?: string;
}

export interface BitrixDealData {
  TITLE: string;
  CONTACT_ID: string;
  STAGE_ID?: string;
  OPENED?: "Y" | "N";
  CURRENCY_ID?: string;
  OPPORTUNITY?: number;
  COMMENTS?: string;
}

export interface BitrixDealResponse {
  result?: number;
  error?: string;
  error_description?: string;
}

export interface BitrixDeal {
  ID: string;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
  CONTACT_ID: string;
  OPPORTUNITY: string;
  CURRENCY_ID: string;
  COMMENTS: string;
}

export interface BitrixDealsListResponse {
  result?: BitrixDeal[];
  error?: string;
  error_description?: string;
}
