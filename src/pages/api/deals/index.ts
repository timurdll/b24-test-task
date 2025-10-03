import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import Database from "better-sqlite3";
import path from "path";
import { getBitrixDeals, createBitrixDeal } from "@/src/shared/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const dbPath = path.join(process.cwd(), "db", "users.db");

interface Deal {
  id: string;
  title: string;
  date: string;
  status: string;
  contactId: string;
  opportunity: string;
  currency: string;
  comments: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Не авторизован" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    const db = new Database(dbPath);
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(decoded.userId) as any;

    db.close();

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: "Пользователь не найден" });
    }

    if (req.method === "GET") {
      // Получаем сделки из Битрикс24
      const bitrixResult = await getBitrixDeals();

      if (!bitrixResult.ok) {
        return res.status(500).json({
          ok: false,
          error: bitrixResult.error || "Ошибка получения сделок",
        });
      }

      // Фильтруем сделки только для текущего пользователя
      const userDeals =
        bitrixResult.deals?.filter(
          (deal) => deal.CONTACT_ID === user.bitrixId
        ) || [];

      // Преобразуем данные в нужный формат
      const deals: Deal[] = userDeals.map((deal) => ({
        id: deal.ID,
        title: deal.TITLE,
        date: new Date(deal.DATE_CREATE).toLocaleDateString("ru-RU"),
        status: getStatusName(deal.STAGE_ID),
        contactId: deal.CONTACT_ID,
        opportunity: deal.OPPORTUNITY,
        currency: deal.CURRENCY_ID,
        comments: deal.COMMENTS,
      }));

      return res.status(200).json({
        ok: true,
        deals,
      });
    }

    if (req.method === "POST") {
      // Создаем новую сделку
      const { title, comments } = req.body;

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
        STAGE_ID: "NEW", // Новая сделка
        OPENED: "Y" as const,
        CURRENCY_ID: "KZT", // Тенге
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

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("❌ Deals API error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера",
    });
  }
}

// Функция для получения названия статуса по ID
function getStatusName(stageId: string): string {
  const statusMap: { [key: string]: string } = {
    NEW: "Новая",
    PREPARATION: "Подготовка",
    PREPAYMENT_INVOICE: "Счет на предоплату",
    EXECUTING: "В работе",
    FINAL_INVOICE: "Счет на оплату",
    WON: "Выиграна",
    LOSE: "Проиграна",
    APOLOGY: "Извинения",
  };

  return statusMap[stageId] || stageId;
}
