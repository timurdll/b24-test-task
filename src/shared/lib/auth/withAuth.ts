/**
 * Middleware для аутентификации API роутов
 */
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { JWT_SECRET } from "@/src/entities/user/model/constants";

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    userId: number;
    email: string;
  };
}

export type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

/**
 * HOF для защиты API роутов аутентификацией
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.token;

      if (!token) {
        return res.status(401).json({ ok: false, error: "Не авторизован" });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
      };

      // Добавляем пользователя в request
      (req as AuthenticatedRequest).user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      return await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ ok: false, error: "Неверный токен" });
    }
  };
}
