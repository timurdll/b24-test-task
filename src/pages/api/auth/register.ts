import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import Database from "better-sqlite3";
import path from "path";
import { createBitrixContact } from "@/src/shared/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const dbPath = path.join(process.cwd(), "db", "users.db");

interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { login, email, password } = req.body as RegisterRequest;

  // Валидация
  if (!login || !email || !password) {
    return res.status(400).json({ ok: false, error: "Все поля обязательны" });
  }

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: "Неверный формат email" });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      ok: false,
      error:
        "Пароль должен содержать минимум 6 символов, 1 заглавную букву и 1 цифру",
    });
  }

  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    // Проверка существующего пользователя
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ? OR login = ?")
      .get(email, login);

    if (existingUser) {
      return res.status(400).json({
        ok: false,
        error: "Пользователь с таким email или логином уже существует",
      });
    }

    // Создание контакта в Битрикс24
    console.log("Создание контакта в Битрикс24...");
    const bitrixResult = await createBitrixContact({
      NAME: login,
      EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
    });

    console.log("Bitrix result:", bitrixResult);

    if (!bitrixResult.ok) {
      console.error("Ошибка Битрикс24:", bitrixResult.error);
      return res.status(500).json({
        ok: false,
        error: bitrixResult.error || "Ошибка создания контакта в Битрикс24",
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение в БД
    const result = db
      .prepare(
        `INSERT INTO users (login, email, password, bitrixId, createdAt) 
         VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .run(
        login,
        email,
        hashedPassword,
        bitrixResult.contactId?.toString() || null
      );

    const userId = result.lastInsertRowid as number;

    // Получение созданного пользователя
    const newUser = db
      .prepare(
        "SELECT id, login, email, bitrixId, createdAt FROM users WHERE id = ?"
      )
      .get(userId) as any;

    if (!newUser) {
      throw new Error("Ошибка получения созданного пользователя");
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Установка cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 дней
        path: "/",
      })
    );

    console.log("✅ Пользователь успешно зарегистрирован:", newUser.id);

    return res.status(200).json({
      ok: true,
      user: {
        id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        bitrixId: newUser.bitrixId,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера при регистрации",
    });
  } finally {
    if (db) {
      db.close();
    }
  }
}
