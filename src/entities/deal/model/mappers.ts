/**
 * Mappers для сущности Deal
 */
import { Deal, BitrixDeal } from "./types";
import { DEAL_STATUS_MAP } from "./constants";

/**
 * Преобразует BitrixDeal в Deal
 */
export function bitrixDealToDeal(bitrixDeal: BitrixDeal): Deal {
  return {
    id: bitrixDeal.ID,
    title: bitrixDeal.TITLE,
    date: new Date(bitrixDeal.DATE_CREATE).toLocaleDateString("ru-RU"),
    status: getStatusName(bitrixDeal.STAGE_ID),
    contactId: bitrixDeal.CONTACT_ID,
    opportunity: bitrixDeal.OPPORTUNITY,
    currency: bitrixDeal.CURRENCY_ID,
    comments: bitrixDeal.COMMENTS,
  };
}

/**
 * Получает название статуса по ID
 */
export function getStatusName(stageId: string): string {
  return DEAL_STATUS_MAP[stageId as keyof typeof DEAL_STATUS_MAP] || stageId;
}
