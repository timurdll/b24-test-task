import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import Database from "better-sqlite3";
import path from "path";
import { updateBitrixContact } from "@/src/shared/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const dbPath = path.join(process.cwd(), "db", "users.db");

interface UpdateProfileRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Не авторизован" });
  }

  const { name, email, phone, address } = req.body as UpdateProfileRequest;

  if (!name || !email) {
    return res
      .status(400)
      .json({ ok: false, error: "Имя и email обязательны" });
  }

  let db: Database.Database | null = null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    db = new Database(dbPath);

    // Получаем текущего пользователя
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(decoded.userId) as any;

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: "Пользователь не найден" });
    }

    // Обновляем данные в локальной БД
    const updateResult = db
      .prepare(
        `UPDATE users 
         SET login = ?, email = ?, phone = ?, address = ?, updatedAt = datetime('now')
         WHERE id = ?`
      )
      .run(name, email, phone || null, address || null, decoded.userId);

    if (updateResult.changes === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "Не удалось обновить профиль" });
    }

    // Обновляем контакт в Битрикс24, если есть bitrixId
    if (user.bitrixId) {
      console.log("Обновление контакта в Битрикс24...");

      const bitrixData = {
        NAME: name,
        EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
        ...(phone && { PHONE: [{ VALUE: phone, VALUE_TYPE: "WORK" }] }),
        ...(address && { ADDRESS: address }),
      };

      const bitrixResult = await updateBitrixContact(user.bitrixId, bitrixData);

      if (!bitrixResult.ok) {
        console.error("Ошибка обновления в Битрикс24:", bitrixResult.error);
        // Не прерываем выполнение, только логируем ошибку
      } else {
        console.log("✅ Контакт успешно обновлен в Битрикс24");
      }
    }

    // Получаем обновленного пользователя
    const updatedUser = db
      .prepare(
        "SELECT id, login, email, bitrixId, phone, address, createdAt, updatedAt FROM users WHERE id = ?"
      )
      .get(decoded.userId) as any;

    console.log("✅ Профиль успешно обновлен:", updatedUser.id);

    return res.status(200).json({
      ok: true,
      user: {
        id: updatedUser.id,
        login: updatedUser.login,
        email: updatedUser.email,
        bitrixId: updatedUser.bitrixId,
        phone: updatedUser.phone,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Update profile error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера при обновлении профиля",
    });
  } finally {
    if (db) {
      db.close();
    }
  }
}
