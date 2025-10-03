/**
 * Repository для работы с пользователями в БД
 */
import Database from "better-sqlite3";
import path from "path";
import { User } from "../model/types";
import { mapDbUserToUser } from "../model/mappers";
import { DB_PATH } from "../model/constants";

const dbPath = path.join(process.cwd(), DB_PATH);

/**
 * Получить пользователя по ID
 */
export function getUserById(userId: number): User | null {
  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    const user = db
      .prepare(
        "SELECT id, login, email, bitrixId, phone, address, createdAt, updatedAt FROM users WHERE id = ?"
      )
      .get(userId) as any;

    if (!user) {
      return null;
    }

    return mapDbUserToUser(user);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  } finally {
    if (db) {
      db.close();
    }
  }
}

/**
 * Получить пользователя по email (включая пароль для аутентификации)
 */
export function getUserByEmail(email: string): any | null {
  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      return null;
    }

    // Возвращаем полные данные пользователя включая пароль для аутентификации
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  } finally {
    if (db) {
      db.close();
    }
  }
}

/**
 * Проверить существование пользователя по email или логину
 */
export function checkUserExists(email: string, login: string): boolean {
  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ? OR login = ?")
      .get(email, login);

    return !!existingUser;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  } finally {
    if (db) {
      db.close();
    }
  }
}

/**
 * Создать нового пользователя
 */
export function createUser(userData: {
  login: string;
  email: string;
  password: string;
  bitrixId: string | null;
}): User | null {
  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    const result = db
      .prepare(
        `INSERT INTO users (login, email, password, bitrixId, createdAt) 
         VALUES (?, ?, ?, ?, datetime('now'))`
      )
      .run(
        userData.login,
        userData.email,
        userData.password,
        userData.bitrixId
      );

    const userId = result.lastInsertRowid as number;

    const newUser = db
      .prepare(
        "SELECT id, login, email, bitrixId, createdAt FROM users WHERE id = ?"
      )
      .get(userId) as any;

    if (!newUser) {
      return null;
    }

    return mapDbUserToUser(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  } finally {
    if (db) {
      db.close();
    }
  }
}

/**
 * Обновить пользователя
 */
export function updateUser(
  userId: number,
  userData: {
    login: string;
    email: string;
    phone?: string | null;
    address?: string | null;
  }
): User | null {
  let db: Database.Database | null = null;

  try {
    db = new Database(dbPath);

    const updateResult = db
      .prepare(
        `UPDATE users 
         SET login = ?, email = ?, phone = ?, address = ?, updatedAt = datetime('now')
         WHERE id = ?`
      )
      .run(
        userData.login,
        userData.email,
        userData.phone || null,
        userData.address || null,
        userId
      );

    if (updateResult.changes === 0) {
      return null;
    }

    const updatedUser = db
      .prepare(
        "SELECT id, login, email, bitrixId, phone, address, createdAt, updatedAt FROM users WHERE id = ?"
      )
      .get(userId) as any;

    if (!updatedUser) {
      return null;
    }

    return mapDbUserToUser(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  } finally {
    if (db) {
      db.close();
    }
  }
}
