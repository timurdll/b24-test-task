import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { createBitrixContact } from "@/src/shared/api";
import {
  validateRegisterData,
  createSafeUserResponse,
  createTokenCookieConfig,
  ERROR_MESSAGES,
} from "@/src/entities/user";
import {
  checkUserExistsByEmail,
  createUser,
} from "@/src/entities/user/api/userRepository";
import { hashPassword, createToken } from "@/src/entities/user/model/authUtils";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: ERROR_MESSAGES.METHOD_NOT_ALLOWED });
  }

  const { name, email, password } = req.body as RegisterRequest;

  // Валидация данных
  const validation = validateRegisterData(name, email, password);
  if (!validation.isValid) {
    return res.status(400).json({ ok: false, error: validation.error });
  }

  try {
    // Проверка существующего пользователя только по email
    if (checkUserExistsByEmail(email)) {
      return res.status(400).json({
        ok: false,
        error: ERROR_MESSAGES.USER_ALREADY_EXISTS,
      });
    }

    // Создание контакта в Битрикс24
    console.log("Создание контакта в Битрикс24...");
    const bitrixResult = await createBitrixContact({
      NAME: name,
      EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
    });

    console.log("Bitrix result:", bitrixResult);

    if (!bitrixResult.ok) {
      console.error("Ошибка Битрикс24:", bitrixResult.error);
      return res.status(500).json({
        ok: false,
        error: bitrixResult.error || ERROR_MESSAGES.BITRIX_CONTACT_ERROR,
      });
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание пользователя в БД
    const newUser = createUser({
      login: name,
      email,
      password: hashedPassword,
      bitrixId: bitrixResult.contactId?.toString() || null,
    });

    if (!newUser) {
      throw new Error("Ошибка создания пользователя");
    }

    // Создание JWT токена
    const token = createToken(newUser.id, newUser.email);

    // Установка cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, createTokenCookieConfig())
    );

    console.log("✅ Пользователь успешно зарегистрирован:", newUser.id);

    return res.status(200).json({
      ok: true,
      user: createSafeUserResponse(newUser),
    });
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return res.status(500).json({
      ok: false,
      error: error.message || ERROR_MESSAGES.REGISTRATION_ERROR,
    });
  }
}
