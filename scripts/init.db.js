const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(process.cwd(), "db");
const dbPath = path.join(dbDir, "users.db");

// Создаём директорию db, если её нет
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("✅ Создана директория /db");
}

const db = new Database(dbPath);

// Создание таблицы пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bitrixId TEXT,
    phone TEXT,
    address TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
`);

// Добавляем новые колонки, если они не существуют
try {
  db.exec(`ALTER TABLE users ADD COLUMN phone TEXT;`);
  console.log("✅ Добавлена колонка phone");
} catch (e) {
  // Колонка уже существует
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN address TEXT;`);
  console.log("✅ Добавлена колонка address");
} catch (e) {
  // Колонка уже существует
}

try {
  db.exec(`ALTER TABLE users ADD COLUMN updatedAt TEXT;`);
  console.log("✅ Добавлена колонка updatedAt");
} catch (e) {
  // Колонка уже существует
}

console.log("✅ База данных инициализирована успешно!");
console.log("📍 Путь к БД:", dbPath);

// Проверяем структуру таблицы
const tableInfo = db.prepare("PRAGMA table_info(users)").all();
console.log("📋 Структура таблицы users:");
console.table(tableInfo);

db.close();
