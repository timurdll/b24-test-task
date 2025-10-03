/**
 * Mappers и утилиты для сущности User
 */
import { User, SafeUserResponse } from "./types";
import { TOKEN_CONFIG, COOKIE_CONFIG } from "./constants";

/**
 * Преобразует данные пользователя из БД в User объект
 */
export function mapDbUserToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    login: dbUser.login,
    email: dbUser.email,
    bitrixId: dbUser.bitrixId,
    phone: dbUser.phone,
    address: dbUser.address,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

/**
 * Создает безопасный объект пользователя для ответа (без пароля)
 */
export function createSafeUserResponse(user: User): SafeUserResponse {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    bitrixId: user.bitrixId,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Создает конфигурацию cookie для токена
 */
export function createTokenCookieConfig(remember: boolean = false) {
  return {
    ...COOKIE_CONFIG,
    maxAge: remember
      ? TOKEN_CONFIG.REMEMBER_MAX_AGE
      : TOKEN_CONFIG.DEFAULT_MAX_AGE,
    sameSite: remember ? ("lax" as const) : ("strict" as const),
  };
}

/**
 * Создает конфигурацию для JWT токена
 */
export function createTokenConfig(remember: boolean = false) {
  return {
    expiresIn: remember
      ? TOKEN_CONFIG.REMEMBER_EXPIRES_IN
      : TOKEN_CONFIG.DEFAULT_EXPIRES_IN,
  };
}
