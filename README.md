# B24 Test Task

Приложение для управления заказами и платежами с интеграцией Битрикс24.

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+
- npm или yarn

### Установка

1. **Клонируйте репозиторий**

   ```bash
   git clone <repository-url>
   cd b24-test-task
   ```

2. **Установите зависимости**

   ```bash
   npm install
   ```

3. **Настройте переменные окружения**

   ```bash
   cp .env.example .env.local
   ```

   Отредактируйте `.env.local` и установите безопасный JWT_SECRET:

   ```env
   JWT_SECRET=your-super-secure-jwt-secret-key
   NODE_ENV=development
   ```

4. **Инициализируйте базу данных**

   ```bash
   npm run db:init
   ```

5. **Запустите приложение**

   ```bash
   npm run dev
   ```

6. **Откройте браузер**
   ```
   http://localhost:3000
   ```

## 📋 Доступные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка для продакшена
- `npm run start` - запуск продакшен сборки
- `npm run db:init` - инициализация базы данных

## 🏗️ Архитектура

Проект использует Feature-Sliced Design (FSD) архитектуру:

```
src/
├── app/           # Конфигурация приложения
├── pages/         # Next.js страницы
├── widgets/       # Составные UI блоки
├── features/      # Бизнес-функции
├── entities/      # Бизнес-сущности
└── shared/        # Переиспользуемые ресурсы
```

## 🔧 Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: SCSS Modules
- **State**: Zustand
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt
- **UI**: Material-UI, Swiper.js

## 📱 Функциональность

- ✅ Аутентификация (вход/регистрация)
- ✅ Управление профилем пользователя
- ✅ Просмотр заказов с фильтрацией
- ✅ Управление платежами
- ✅ Интеграция с Битрикс24
- ✅ Адаптивный дизайн

## 🔐 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Валидация данных на клиенте и сервере
- Защищенные API роуты

## 📄 Лицензия

MIT License
