/**
 * Валидаторы для сущности User
 */
import { VALIDATION_REGEX, ERROR_MESSAGES } from "./constants";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидация email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS };
  }

  if (!VALIDATION_REGEX.EMAIL.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL_FORMAT };
  }

  return { isValid: true };
}

/**
 * Валидация пароля
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS };
  }

  if (!VALIDATION_REGEX.PASSWORD.test(password)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PASSWORD_FORMAT };
  }

  return { isValid: true };
}

/**
 * Валидация логина
 */
export function validateLogin(login: string): ValidationResult {
  if (!login || login.trim().length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELDS };
  }

  return { isValid: true };
}

/**
 * Валидация данных для входа
 */
export function validateLoginData(
  email: string,
  password: string
): ValidationResult {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  return { isValid: true };
}

/**
 * Валидация данных для регистрации
 */
export function validateRegisterData(
  login: string,
  email: string,
  password: string
): ValidationResult {
  const loginValidation = validateLogin(login);
  if (!loginValidation.isValid) {
    return loginValidation;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  return { isValid: true };
}

/**
 * Валидация данных для обновления профиля
 */
export function validateUpdateProfileData(
  name: string,
  email: string
): ValidationResult {
  if (!name || !email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_NAME_EMAIL };
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  return { isValid: true };
}
