# CLAUDE.md — CRM & Sales Funnel Demo

Этот проект — real estate приложение на Next.js 13 + Prisma + NextAuth.
Задача: добавить CRM-модуль поверх существующей базы, чтобы использовать как живое демо для **AI Automation Studio** (automation-studio.com).

Демо будет показывать: воронку продаж, аналитику лидов, веб-чат — всё как пример того что студия строит для клиентов.

---

## Связанный проект — AI Automation Studio

Основной сайт студии находится по пути:
```
/Users/maksymparfenov/Projects/Video/automation/
```

Оттуда можно брать готовые компоненты и логику. Ниже — что именно и откуда.

### Готово к переносу

#### 1. ChatWidget — веб-чат с AI
```
/Users/maksymparfenov/Projects/Video/automation/components/chat/ChatWidget.tsx
```
- Всплывающий чат (кнопка в правом нижнем углу)
- Общается через Groq API (llama-3.3-70b)
- Квалифицирует лида, собирает имя + email
- При захвате лида записывает в БД + шлёт в Telegram + на email
- **Адаптация для этого проекта:** убрать `locale` prop, системный промпт переписать под "CRM demo для AI Automation Studio", вместо `saveLead` из `/lib/db` — создать запись `Inquiry` через Prisma

API route чата:
```
/Users/maksymparfenov/Projects/Video/automation/app/api/chat/route.ts
```
Стек: `groq-sdk`, `GROQ_API_KEY` в .env, модель `llama-3.3-70b-versatile`

#### 2. Lead capture API — приём и классификация лидов
```
/Users/maksymparfenov/Projects/Video/automation/app/api/leads/route.ts
```
- Принимает: name, email, message, budget, company, service
- Классифицирует через Groq: hot / warm / cold
- Шлёт уведомление в Telegram
- Шлёт email через Resend
- Опционально вызывает n8n webhook
- **Адаптация:** заменить `saveLead` на запись `Inquiry` через Prisma, score сохранять в новое поле

#### 3. Telegram уведомления
```
/Users/maksymparfenov/Projects/Video/automation/lib/telegram.ts
```
Функция `sendTelegramMessage(text)` — просто скопировать, нужен `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в .env

#### 4. Lead classification через Groq
```
/Users/maksymparfenov/Projects/Video/automation/lib/groq.ts
```
Функция `classifyLead({ name, email, message, budget })` → возвращает `{ score, reasoning }`

#### 5. LeadCaptureForm — форма захвата лида
```
/Users/maksymparfenov/Projects/Video/automation/components/leads/LeadCaptureForm.tsx
```
Форма с полями: имя, email, компания, сообщение, бюджет. Можно встроить на страницу демо.

### Переменные окружения (нужно добавить в .env)
```env
GROQ_API_KEY=           # Groq API для чата и классификации лидов
RESEND_API_KEY=         # Resend для email уведомлений
EMAIL_FROM=             # от кого слать письма
EMAIL_TO=               # куда слать уведомления о лидах
TELEGRAM_BOT_TOKEN=     # токен Telegram бота
TELEGRAM_CHAT_ID=       # ID чата для уведомлений
N8N_LEAD_WEBHOOK=       # опционально — n8n webhook
```

---

## Стек (уже установлено, не трогать)

- Next.js 13.5 (Pages Router + App Router смешаны — осторожно)
- Prisma + PostgreSQL (`PRISMA_DATABASE_URL` в .env)
- NextAuth.js с ролями: USER / AGENT / ADMIN
- Recharts — для графиков
- Radix UI — все компоненты уже есть
- Tailwind CSS
- lucide-react — иконки
- react-hook-form + zod — формы

---

## Что нужно сделать

### 1. Обновить Prisma Schema

Добавить поле `stage` к модели `Inquiry` и новую модель `Lead`:

```prisma
// Добавить к существующей модели Inquiry:
model Inquiry {
  // ... существующие поля ...
  stage      LeadStage @default(NEW)
  source     LeadSource @default(WEBSITE)
  notes      String?   @db.Text
  updatedAt  DateTime  @updatedAt
}

enum LeadStage {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL
  WON
  LOST
}

enum LeadSource {
  WEBSITE
  TELEGRAM
  EMAIL
  REFERRAL
  OTHER
}
```

После изменения schema запустить:
```bash
npx prisma migrate dev --name add_crm_fields
npx prisma generate
```

### 2. Обновить seed данные

Файл: `prisma/seed.ts`

Добавить 15-20 тестовых Inquiry с разными `stage` и `source`, датами за последние 3 месяца. Чтобы воронка выглядела живой.

```bash
npx prisma db seed
```

### 3. Создать CRM страницу

Файл: `src/app/crm/page.tsx`

Защитить роутом — только ADMIN (как `/admin`).

Структура страницы — три вкладки (используй `@radix-ui/react-tabs`):
- **Воронка** (Kanban)
- **Аналитика** (графики)
- **Все лиды** (таблица)

### 4. Вкладка "Воронка" (Kanban)

Файл: `src/components/crm/KanbanBoard.tsx`

6 колонок: New → Contacted → Qualified → Proposal → Won → Lost

Каждая карточка лида показывает:
- Имя + email
- Источник (иконка)
- Дата создания
- Объект недвижимости (если есть)

**Перетаскивание:** использовать `@dnd-kit/core` (нужно установить):
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

При drop — вызвать API endpoint для обновления stage.

API endpoint: `src/app/api/crm/leads/[id]/stage/route.ts`
```ts
PATCH /api/crm/leads/:id/stage
Body: { stage: LeadStage }
```

### 5. Вкладка "Аналитика"

Файл: `src/components/crm/Analytics.tsx`

Использовать Recharts (уже установлен).

**Блок 1 — Метрики (4 карточки):**
- Всего лидов
- Конверсия (WON / всего × 100%)
- Новых за 30 дней
- Средний цикл сделки (дней)

**Блок 2 — Воронка (BarChart вертикальный):**
- Ось X: стадии
- Ось Y: количество лидов
- Цвета: от синего (NEW) до зелёного (WON), серый (LOST)

**Блок 3 — Динамика (LineChart):**
- Новые лиды по неделям за последние 3 месяца
- ResponsiveContainer, Tooltip, Legend

**Блок 4 — Источники (PieChart):**
- Website / Telegram / Email / Referral / Other

### 6. Вкладка "Все лиды" (таблица)

Файл: `src/components/crm/LeadsTable.tsx`

Колонки: Имя | Email | Телефон | Источник | Стадия | Дата | Действия

- Фильтр по стадии (Radix Select)
- Поиск по имени/email (input)
- Сортировка по дате
- Inline смена стадии через Select в строке
- Кнопка "Написать" → mailto:

### 7. API endpoints

Создать в `src/app/api/crm/`:

```
GET  /api/crm/stats          — метрики для аналитики
GET  /api/crm/leads          — список лидов с фильтрами (?stage=NEW&source=WEBSITE)
PATCH /api/crm/leads/[id]/stage — обновить стадию
```

Все endpoints защитить через `getServerSession` — только ADMIN.

### 8. Навигация

Добавить ссылку "CRM" в admin навигацию (файл `src/components/admin/AdminDashboard.tsx`).

Или добавить отдельную кнопку на странице `/admin`.

### 9. Демо-логин

Создать в seed тестового admin пользователя:
```
Email: demo@automation-studio.com
Password: Demo2024!
Role: ADMIN
```

Этот логин будет публичным — указать на карточке Solutions на automation-studio.com.

---

## Порядок выполнения

1. Обновить `prisma/schema.prisma` — добавить enum и поля
2. `npx prisma migrate dev --name add_crm_fields`
3. Обновить `prisma/seed.ts` — добавить тестовые лиды
4. `npx prisma db seed`
5. Создать API endpoints (`/api/crm/stats`, `/api/crm/leads`)
6. Создать компоненты: `KanbanBoard`, `Analytics`, `LeadsTable`
7. Создать страницу `/crm/page.tsx`
8. Установить dnd-kit: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
9. Проверить на `localhost:3000/crm` под demo@automation-studio.com
10. Задеплоить на Vercel

---

## После деплоя

Обновить карточку в `/Users/maksymparfenov/Projects/Video/automation/data/solutions.json`:

```json
{
  "id": "dashboard",
  "slug": "dashboard",
  "demoUrl": "https://next-v0-cursor-a77v.vercel.app/crm",
  "status": "live",
  ...
}
```

И добавить инструкцию для посетителей:
> Demo login: demo@automation-studio.com / Demo2024!

---

## Структура файлов которые нужно создать

```
src/
  app/
    crm/
      page.tsx              ← защищённая страница CRM
    api/
      crm/
        stats/
          route.ts          ← GET метрики
        leads/
          route.ts          ← GET список
          [id]/
            stage/
              route.ts      ← PATCH стадия
  components/
    crm/
      KanbanBoard.tsx       ← drag & drop воронка
      KanbanCard.tsx        ← карточка лида
      Analytics.tsx         ← графики Recharts
      LeadsTable.tsx        ← таблица со фильтрами
      StageSelect.tsx       ← inline смена стадии
```
