/**
 * Константы для сущности Deal
 */

/**
 * Маппинг статусов сделок
 */
export const DEAL_STATUS_MAP = {
  NEW: "Новая",
  PREPARATION: "Подготовка",
  PREPAYMENT_INVOICE: "Счет на предоплату",
  EXECUTING: "В работе",
  FINAL_INVOICE: "Счет на оплату",
  WON: "Выиграна",
  LOSE: "Проиграна",
  APOLOGY: "Извинения",
} as const;

/**
 * Валюта по умолчанию
 */
export const DEFAULT_CURRENCY = "KZT" as const;

/**
 * Стадия по умолчанию для новых сделок
 */
export const DEFAULT_STAGE = "NEW" as const;
