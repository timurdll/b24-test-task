import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import Database from "better-sqlite3";
import path from "path";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const dbPath = path.join(process.cwd(), "db", "users.db");

interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, remember } = req.body as LoginRequest;

  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, error: "Email и пароль обязательны" });
  }

  const db = new Database(dbPath);

  try {
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: "Неверный email или пароль" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ ok: false, error: "Неверный email или пароль" });
    }

    // Создание JWT токена
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 дней или 7 дней
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: remember ? "30d" : "7d",
    });

    // Установка cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge,
        path: "/",
      })
    );

    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        bitrixId: user.bitrixId,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Ошибка сервера при входе" });
  } finally {
    db.close();
  }
}
