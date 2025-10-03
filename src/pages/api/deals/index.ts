import type { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "@/src/shared/lib/auth";
import { getUserById } from "@/src/entities/user/api/userRepository";
import { getBitrixDeals, createBitrixDeal } from "@/src/shared/api";
import {
  Deal,
  CreateDealDto,
  bitrixDealToDeal,
  DEFAULT_CURRENCY,
  DEFAULT_STAGE,
} from "@/src/entities/deal";

/**
 * Обработчик для получения сделок
 */
async function handleGetDeals(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = getUserById(req.user.userId);

  if (!user) {
    return res.status(401).json({ ok: false, error: "Пользователь не найден" });
  }

  const bitrixResult = await getBitrixDeals();

  if (!bitrixResult.ok) {
    return res.status(500).json({
      ok: false,
      error: bitrixResult.error || "Ошибка получения сделок",
    });
  }

  // Фильтруем сделки только для текущего пользователя
  const userDeals =
    bitrixResult.deals?.filter((deal) => deal.CONTACT_ID === user.bitrixId) ||
    [];

  // Преобразуем данные в нужный формат
  const deals: Deal[] = userDeals.map(bitrixDealToDeal);

  return res.status(200).json({
    ok: true,
    deals,
  });
}

/**
 * Обработчик для создания сделки
 */
async function handleCreateDeal(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const user = getUserById(req.user.userId);

  if (!user) {
    return res.status(401).json({ ok: false, error: "Пользователь не найден" });
  }

  const { title, comments }: CreateDealDto = req.body;

  if (!title) {
    return res.status(400).json({
      ok: false,
      error: "Название сделки обязательно",
    });
  }

  if (!user.bitrixId) {
    return res.status(400).json({
      ok: false,
      error: "У пользователя нет связанного контакта в Битрикс24",
    });
  }

  const dealData = {
    TITLE: title,
    CONTACT_ID: user.bitrixId,
    STAGE_ID: DEFAULT_STAGE,
    OPENED: "Y" as const,
    CURRENCY_ID: DEFAULT_CURRENCY,
    COMMENTS: comments || "",
  };

  const bitrixResult = await createBitrixDeal(dealData);

  if (!bitrixResult.ok) {
    return res.status(500).json({
      ok: false,
      error: bitrixResult.error || "Ошибка создания сделки",
    });
  }

  return res.status(200).json({
    ok: true,
    dealId: bitrixResult.dealId,
    message: "Сделка успешно создана",
  });
}

/**
 * Основной обработчик API роута
 */
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      return await handleGetDeals(req, res);
    }

    if (req.method === "POST") {
      return await handleCreateDeal(req, res);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("❌ Deals API error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера",
    });
  }
}

export default withAuth(handler);
