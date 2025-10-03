const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(process.cwd(), "db");
const dbPath = path.join(dbDir, "users.db");

console.log("🗑️  Очистка базы данных...");

if (fs.existsSync(dbPath)) {
  // Подключаемся к БД
  const db = new Database(dbPath);

  try {
    // Удаляем все записи из таблицы users
    const result = db.prepare("DELETE FROM users").run();
    console.log(`✅ Удалено ${result.changes} записей из таблицы users`);

    // Сбрасываем автоинкремент
    db.prepare("DELETE FROM sqlite_sequence WHERE name='users'").run();
    console.log("✅ Сброшен автоинкремент");

    // Проверяем, что таблица пуста
    const count = db.prepare("SELECT COUNT(*) as count FROM users").get();
    console.log(`📊 Текущее количество записей: ${count.count}`);
  } catch (error) {
    console.error("❌ Ошибка при очистке БД:", error.message);
  } finally {
    db.close();
  }
} else {
  console.log("ℹ️  База данных не найдена, создаем новую...");
  // Запускаем инициализацию
  require("./init.db.js");
}

console.log("✅ Очистка завершена!");
