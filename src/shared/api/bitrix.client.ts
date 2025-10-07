/**
 * Bitrix24 API клиент
 */
import axios from "axios";
import type {
  BitrixContactData,
  BitrixContactResponse,
  BitrixContactUpdateData,
  BitrixContactUpdateResponse,
  BitrixDealData,
  BitrixDealResponse,
  BitrixDeal,
  BitrixDealsListResponse,
} from "@/src/shared/types/bitrix.types";

const BITRIX_WEBHOOK =
  process.env.BITRIX_WEBHOOK_URL ||
  "https://b24-3j0xu3.bitrix24.kz/rest/1/8spymo6egpzv2wzs/";

// Re-export types for convenience
export type {
  BitrixContactData,
  BitrixContactResponse,
  BitrixContactUpdateData,
  BitrixContactUpdateResponse,
  BitrixDealData,
  BitrixDealResponse,
  BitrixDeal,
  BitrixDealsListResponse,
} from "@/src/shared/types/bitrix.types";

// =============== CONTACTS API ===============

export async function createBitrixContact(
  data: BitrixContactData
): Promise<{ ok: boolean; contactId?: number; error?: string }> {
  try {
    console.log("Отправка запроса в Битрикс24:", {
      url: `${BITRIX_WEBHOOK}crm.contact.add.json`,
      data: { fields: data },
    });

    const response = await axios.post<BitrixContactResponse>(
      `${BITRIX_WEBHOOK}crm.contact.add.json`,
      {
        fields: data,
      }
    );

    console.log("Ответ от Битрикс24:", response.data);

    if (response.data.result) {
      return {
        ok: true,
        contactId: response.data.result,
      };
    }

    return {
      ok: false,
      error:
        response.data.error_description ||
        response.data.error ||
        "Ошибка создания контакта в Битрикс24",
    };
  } catch (error: any) {
    console.error(
      "❌ Bitrix API error:",
      error.response?.data || error.message
    );
    return {
      ok: false,
      error:
        error.response?.data?.error_description ||
        error.message ||
        "Ошибка подключения к Битрикс24",
    };
  }
}

export async function updateBitrixContact(
  contactId: string,
  data: BitrixContactUpdateData
): Promise<{ ok: boolean; error?: string }> {
  try {
    console.log("Обновление контакта в Битрикс24:", {
      url: `${BITRIX_WEBHOOK}crm.contact.update.json`,
      contactId,
      data: { fields: data },
    });

    const response = await axios.post<BitrixContactUpdateResponse>(
      `${BITRIX_WEBHOOK}crm.contact.update.json`,
      {
        id: contactId,
        fields: data,
      }
    );

    console.log("Ответ от Битрикс24 (обновление):", response.data);

    if (response.data.result) {
      return {
        ok: true,
      };
    }

    return {
      ok: false,
      error:
        response.data.error_description ||
        response.data.error ||
        "Ошибка обновления контакта в Битрикс24",
    };
  } catch (error: any) {
    console.error(
      "❌ Bitrix API error (обновление):",
      error.response?.data || error.message
    );
    return {
      ok: false,
      error:
        error.response?.data?.error_description ||
        error.message ||
        "Ошибка подключения к Битрикс24",
    };
  }
}

// =============== DEALS API ===============

export async function createBitrixDeal(
  data: BitrixDealData
): Promise<{ ok: boolean; dealId?: number; error?: string }> {
  try {
    console.log("Создание сделки в Битрикс24:", {
      url: `${BITRIX_WEBHOOK}crm.deal.add.json`,
      data: { fields: data },
    });

    const response = await axios.post<BitrixDealResponse>(
      `${BITRIX_WEBHOOK}crm.deal.add.json`,
      {
        fields: data,
      }
    );

    console.log("Ответ от Битрикс24 (создание сделки):", response.data);

    if (response.data.result) {
      return {
        ok: true,
        dealId: response.data.result,
      };
    }

    return {
      ok: false,
      error:
        response.data.error_description ||
        response.data.error ||
        "Ошибка создания сделки в Битрикс24",
    };
  } catch (error: any) {
    console.error(
      "❌ Bitrix API error (создание сделки):",
      error.response?.data || error.message
    );
    return {
      ok: false,
      error:
        error.response?.data?.error_description ||
        error.message ||
        "Ошибка подключения к Битрикс24",
    };
  }
}

export async function getBitrixDeals(): Promise<{
  ok: boolean;
  deals?: BitrixDeal[];
  error?: string;
}> {
  try {
    console.log("Получение сделок из Битрикс24:", {
      url: `${BITRIX_WEBHOOK}crm.deal.list.json`,
    });

    const response = await axios.post<BitrixDealsListResponse>(
      `${BITRIX_WEBHOOK}crm.deal.list.json`,
      {
        select: [
          "ID",
          "TITLE",
          "DATE_CREATE",
          "STAGE_ID",
          "CONTACT_ID",
          "OPPORTUNITY",
          "CURRENCY_ID",
          "COMMENTS",
        ],
        order: { DATE_CREATE: "DESC" },
      }
    );

    console.log("Ответ от Битрикс24 (получение сделок):", response.data);

    if (response.data.result) {
      return {
        ok: true,
        deals: response.data.result,
      };
    }

    return {
      ok: false,
      error:
        response.data.error_description ||
        response.data.error ||
        "Ошибка получения сделок из Битрикс24",
    };
  } catch (error: any) {
    console.error(
      "❌ Bitrix API error (получение сделок):",
      error.response?.data || error.message
    );
    return {
      ok: false,
      error:
        error.response?.data?.error_description ||
        error.message ||
        "Ошибка подключения к Битрикс24",
    };
  }
}
