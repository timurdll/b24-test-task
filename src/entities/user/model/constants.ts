/**
 * Константы для сущности User
 */

/**
 * JWT секрет
 */
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Путь к базе данных
 */
export const DB_PATH = process.env.DB_PATH || "db/users.db";

/**
 * Настройки cookie
 */
export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

/**
 * Настройки токенов
 */
export const TOKEN_CONFIG = {
  DEFAULT_EXPIRES_IN: "7d",
  REMEMBER_EXPIRES_IN: "30d",
  DEFAULT_MAX_AGE: 60 * 60 * 24 * 7, // 7 дней в секундах
  REMEMBER_MAX_AGE: 60 * 60 * 24 * 30, // 30 дней в секундах
} as const;

/**
 * Настройки хеширования паролей
 */
export const PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
} as const;

/**
 * Регулярные выражения для валидации
 */
export const VALIDATION_REGEX = {
  EMAIL: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
} as const;

/**
 * Сообщения об ошибках
 */
export const ERROR_MESSAGES = {
  METHOD_NOT_ALLOWED: "Method not allowed",
  UNAUTHORIZED: "Не авторизован",
  INVALID_TOKEN: "Неверный токен",
  USER_NOT_FOUND: "Пользователь не найден",
  INVALID_CREDENTIALS: "Неверный email или пароль",
  USER_ALREADY_EXISTS: "Пользователь с таким email уже существует",
  INVALID_EMAIL_FORMAT: "Неверный формат email",
  INVALID_PASSWORD_FORMAT:
    "Пароль должен содержать минимум 6 символов, 1 заглавную букву и 1 цифру",
  REQUIRED_FIELDS: "Все поля обязательны",
  REQUIRED_NAME_EMAIL: "Имя и email обязательны",
  SERVER_ERROR: "Ошибка сервера",
  LOGIN_ERROR: "Ошибка сервера при входе",
  REGISTRATION_ERROR: "Ошибка сервера при регистрации",
  UPDATE_PROFILE_ERROR: "Ошибка сервера при обновлении профиля",
  PROFILE_UPDATE_FAILED: "Не удалось обновить профиль",
  BITRIX_CONTACT_ERROR: "Ошибка создания контакта в Битрикс24",
} as const;
