import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import Database from "better-sqlite3";
import path from "path";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const dbPath = path.join(process.cwd(), "db", "users.db");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
      .prepare(
        "SELECT id, login, email, bitrixId, phone, address, createdAt, updatedAt FROM users WHERE id = ?"
      )
      .get(decoded.userId) as any;

    db.close();

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, error: "Пользователь не найден" });
    }

    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        bitrixId: user.bitrixId,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(401).json({ ok: false, error: "Неверный токен" });
  }
}
