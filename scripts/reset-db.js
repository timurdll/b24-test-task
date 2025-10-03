const fs = require("fs");
const path = require("path");

const dbDir = path.join(process.cwd(), "db");
const dbPath = path.join(dbDir, "users.db");

console.log("🔄 Полное пересоздание базы данных...");

// Удаляем существующую БД
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("✅ Удален файл базы данных");
}

// Удаляем директорию db
if (fs.existsSync(dbDir)) {
  fs.rmdirSync(dbDir);
  console.log("✅ Удалена директория db");
}

// Запускаем инициализацию
console.log("🔄 Создание новой базы данных...");
require("./init.db.js");

console.log("✅ База данных полностью пересоздана!");
