import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import {
  validateLoginData,
  createSafeUserResponse,
  createTokenCookieConfig,
  ERROR_MESSAGES,
} from "@/src/entities/user";
import { getUserByEmail } from "@/src/entities/user/api/userRepository";
import {
  comparePassword,
  createToken,
} from "@/src/entities/user/model/authUtils";

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
    return res.status(405).json({ error: ERROR_MESSAGES.METHOD_NOT_ALLOWED });
  }

  const { email, password, remember } = req.body as LoginRequest;

  // Валидация данных
  const validation = validateLoginData(email, password);
  if (!validation.isValid) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    // Получение пользователя из БД
    const dbUser = getUserByEmail(email);
    if (!dbUser) {
      return res
        .status(401)
        .json({ ok: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }

    // Проверка пароля
    const passwordMatch = await comparePassword(password, dbUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ ok: false, error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }

    // Создание JWT токена
    const token = createToken(dbUser.id, dbUser.email, remember);

    // Установка cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, createTokenCookieConfig(remember))
    );

    // Создаем безопасный объект пользователя для ответа
    const safeUser = createSafeUserResponse(dbUser);

    return res.status(200).json({
      ok: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ ok: false, error: ERROR_MESSAGES.LOGIN_ERROR });
  }
}
