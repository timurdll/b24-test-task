/**
 * Утилиты для аутентификации
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, PASSWORD_CONFIG } from "./constants";
import { createTokenConfig } from "./mappers";

/**
 * Создать JWT токен
 */
export function createToken(
  userId: number,
  email: string,
  remember: boolean = false
): string {
  return jwt.sign({ userId, email }, JWT_SECRET, createTokenConfig(remember));
}

/**
 * Верифицировать JWT токен
 */
export function verifyToken(
  token: string
): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch (error) {
    return null;
  }
}

/**
 * Хешировать пароль
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);
}

/**
 * Проверить пароль
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
