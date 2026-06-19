# CRM Sales Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CRM page at `/crm` with a Kanban board and leads table, backed by a new dedicated `Lead` model (separate from `Inquiry` which handles real estate requests).

**Architecture:** Extend `Inquiry` with `stage`, `source`, `notes`, `updatedAt`. Two API routes (`GET /api/crm/leads`, `PATCH /api/crm/leads/[id]/stage`). Page `/crm` is admin-only with two Radix tabs — KanbanBoard and LeadsTable as client components.

**Tech Stack:** Next.js 13 App Router, Prisma 6, NextAuth, Radix UI Tabs + Select, Tailwind CSS, lucide-react

---

### Task 1: Extend Prisma Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add enums and Lead model**

Open `prisma/schema.prisma`. Add after the existing `UserRole` enum:

```prisma
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
  FACEBOOK
  YOUTUBE
  REFERRAL
  OTHER
}

model Lead {
  id        String     @id @default(cuid())
  name      String
  email     String
  phone     String?
  message   String     @db.Text
  stage     LeadStage  @default(NEW)
  source    LeadSource @default(WEBSITE)
  notes     String?    @db.Text
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

- [ ] **Step 2: Run migration**

```bash
./node_modules/.bin/prisma migrate dev --name add_crm_fields
```

Expected output: `✔ Generated Prisma Client` and a new file in `prisma/migrations/`.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add LeadStage and LeadSource to Inquiry model"
```

---

### Task 2: Add CRM Seed Data

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add Inquiry records to the seed**

In `prisma/seed.ts`, add this block right before the closing of `main()` (after the `blogPosts` block):

```typescript
  // Create CRM demo leads
  await prisma.lead.deleteMany()

  await prisma.lead.createMany({
    data: [
      { name: 'Алексей Петров', email: 'alexey@gmail.com', phone: '+7 900 123 4567', message: 'Интересует автоматизация отдела продаж', stage: 'NEW', source: 'WEBSITE' },
      { name: 'Марина Козлова', email: 'marina@biz.ru', phone: '+7 910 234 5678', message: 'Нужен чат-бот для сайта', stage: 'NEW', source: 'TELEGRAM' },
      { name: 'Дмитрий Соколов', email: 'dmitry@company.com', phone: '+7 920 345 6789', message: 'Хотим автоматизировать email-рассылки', stage: 'CONTACTED', source: 'WEBSITE' },
      { name: 'Ольга Новикова', email: 'olga@startup.io', message: 'Интересует CRM-система для команды', stage: 'CONTACTED', source: 'REFERRAL' },
      { name: 'Иван Морозов', email: 'ivan@trade.ru', phone: '+7 930 456 7890', message: 'Автоматизация обработки заказов', stage: 'QUALIFIED', source: 'WEBSITE' },
      { name: 'Татьяна Волкова', email: 'tatyana@salon.ru', phone: '+7 940 567 8901', message: 'Бот для записи клиентов', stage: 'QUALIFIED', source: 'TELEGRAM' },
      { name: 'Сергей Лебедев', email: 'sergey@logistics.ru', message: 'Интеграция с 1С через API', stage: 'QUALIFIED', source: 'EMAIL' },
      { name: 'Екатерина Попова', email: 'kate@retail.ru', phone: '+7 950 678 9012', message: 'Автоматизация отчётности', stage: 'PROPOSAL', source: 'WEBSITE' },
      { name: 'Андрей Захаров', email: 'andrey@clinic.ru', phone: '+7 960 789 0123', message: 'Запись пациентов через Telegram', stage: 'PROPOSAL', source: 'REFERRAL' },
      { name: 'Наталья Медведева', email: 'natasha@agency.ru', message: 'Лидогенерация через AI', stage: 'WON', source: 'WEBSITE' },
      { name: 'Роман Федоров', email: 'roman@store.ru', phone: '+7 970 890 1234', message: 'Обработка заказов автоматически', stage: 'WON', source: 'TELEGRAM' },
      { name: 'Людмила Орлова', email: 'lyuda@edu.ru', message: 'Автоматизация приёма студентов', stage: 'LOST', source: 'EMAIL' },
    ]
  })

  console.log('Created 12 CRM demo inquiries')
```

- [ ] **Step 2: Run seed**

```bash
./node_modules/.bin/prisma db seed
```

Expected output includes: `Created 12 CRM demo inquiries`

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: add CRM demo inquiries to seed"
```

---

### Task 3: API — GET /api/crm/leads

**Files:**
- Create: `src/app/api/crm/leads/route.ts`

- [ ] **Step 1: Create the file**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get('stage')

  const leads = await prisma.lead.findMany({
    where: stage ? { stage: stage as any } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(leads)
}
```

- [ ] **Step 2: Verify manually**

Start dev server (`npm run dev`) and open in browser:
`http://localhost:3000/api/crm/leads`

Logged in as admin → should return JSON array of 12 leads.
Not logged in → should return `{"error":"Unauthorized"}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/crm/leads/route.ts
git commit -m "feat: add GET /api/crm/leads endpoint"
```

---

### Task 4: API — PATCH /api/crm/leads/[id]/stage

**Files:**
- Create: `src/app/api/crm/leads/[id]/stage/route.ts`

- [ ] **Step 1: Create the file**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { stage } = body

  if (!VALID_STAGES.includes(stage)) {
    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: { stage },
  })

  return NextResponse.json(lead)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/crm/leads/[id]/stage/route.ts
git commit -m "feat: add PATCH /api/crm/leads/[id]/stage endpoint"
```

---

### Task 5: KanbanCard Component

**Files:**
- Create: `src/components/crm/KanbanCard.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  stage: string
  source: string
  createdAt: string
  updatedAt: string
}

const STAGE_OPTIONS = [
  { value: 'NEW', label: 'Новый' },
  { value: 'CONTACTED', label: 'Связались' },
  { value: 'QUALIFIED', label: 'Квалифицирован' },
  { value: 'PROPOSAL', label: 'КП отправлено' },
  { value: 'WON', label: 'Выиграли' },
  { value: 'LOST', label: 'Проиграли' },
]

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: 'Сайт',
  TELEGRAM: 'Telegram',
  EMAIL: 'Email',
  REFERRAL: 'Реферал',
  OTHER: 'Другое',
}

type Props = {
  lead: Lead
  onStageChange: (id: string, stage: string) => void
}

export function KanbanCard({ lead, onStageChange }: Props) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm space-y-1">
      <div className="font-medium text-sm">{lead.name}</div>
      <div className="text-xs text-gray-500">{lead.email}</div>
      {lead.phone && <div className="text-xs text-gray-500">{lead.phone}</div>}
      <p className="text-xs text-gray-400 line-clamp-2">{lead.message}</p>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gray-400">{SOURCE_LABELS[lead.source] ?? lead.source}</span>
        <span className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
        </span>
      </div>
      <Select value={lead.stage} onValueChange={(v) => onStageChange(lead.id, v)}>
        <SelectTrigger className="h-7 text-xs mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STAGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crm/KanbanCard.tsx
git commit -m "feat: add KanbanCard component"
```

---

### Task 6: KanbanBoard Component

**Files:**
- Create: `src/components/crm/KanbanBoard.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { KanbanCard, Lead } from './KanbanCard'

const STAGES = [
  { key: 'NEW', label: 'Новый' },
  { key: 'CONTACTED', label: 'Связались' },
  { key: 'QUALIFIED', label: 'Квалифицирован' },
  { key: 'PROPOSAL', label: 'КП отправлено' },
  { key: 'WON', label: 'Выиграли' },
  { key: 'LOST', label: 'Проиграли' },
]

const STAGE_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 border-blue-200',
  CONTACTED: 'bg-yellow-50 border-yellow-200',
  QUALIFIED: 'bg-orange-50 border-orange-200',
  PROPOSAL: 'bg-purple-50 border-purple-200',
  WON: 'bg-green-50 border-green-200',
  LOST: 'bg-gray-50 border-gray-200',
}

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/leads')
      .then((r) => r.json())
      .then((data) => {
        setLeads(data)
        setLoading(false)
      })
  }, [])

  const updateStage = async (id: string, stage: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    await fetch(`/api/crm/leads/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }

  if (loading) {
    return <div className="text-sm text-gray-500 py-8 text-center">Загрузка...</div>
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.key)
        return (
          <div
            key={stage.key}
            className={`min-w-[220px] flex-shrink-0 rounded-lg border p-3 ${STAGE_COLORS[stage.key]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{stage.label}</h3>
              <span className="text-xs bg-white border rounded-full px-2 py-0.5 font-medium">
                {stageLeads.length}
              </span>
            </div>
            <div className="space-y-2">
              {stageLeads.map((lead) => (
                <KanbanCard key={lead.id} lead={lead} onStageChange={updateStage} />
              ))}
              {stageLeads.length === 0 && (
                <div className="text-xs text-gray-400 text-center py-4">Нет лидов</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crm/KanbanBoard.tsx
git commit -m "feat: add KanbanBoard component"
```

---

### Task 7: LeadsTable Component

**Files:**
- Create: `src/components/crm/LeadsTable.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { Lead } from './KanbanCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STAGE_LABELS: Record<string, string> = {
  NEW: 'Новый',
  CONTACTED: 'Связались',
  QUALIFIED: 'Квалифицирован',
  PROPOSAL: 'КП отправлено',
  WON: 'Выиграли',
  LOST: 'Проиграли',
}

const SOURCE_LABELS: Record<string, string> = {
  WEBSITE: 'Сайт',
  TELEGRAM: 'Telegram',
  EMAIL: 'Email',
  REFERRAL: 'Реферал',
  OTHER: 'Другое',
}

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('ALL')

  useEffect(() => {
    fetch('/api/crm/leads')
      .then((r) => r.json())
      .then((data) => {
        setLeads(data)
        setLoading(false)
      })
  }, [])

  const updateStage = async (id: string, stage: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    await fetch(`/api/crm/leads/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter
    return matchesSearch && matchesStage
  })

  if (loading) {
    return <div className="text-sm text-gray-500 py-8 text-center">Загрузка...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Все стадии" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все стадии</SelectItem>
            {Object.entries(STAGE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Имя</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Телефон</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Источник</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Стадия</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.phone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{SOURCE_LABELS[lead.source] ?? lead.source}</td>
                <td className="px-4 py-3">
                  <Select value={lead.stage} onValueChange={(v) => updateStage(lead.id, v)}>
                    <SelectTrigger className="h-7 text-xs w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Лидов не найдено</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/crm/LeadsTable.tsx
git commit -m "feat: add LeadsTable component"
```

---

### Task 8: CRM Page

**Files:**
- Create: `src/app/crm/page.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Container } from '@/components/ui/Container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/crm/KanbanBoard'
import { LeadsTable } from '@/components/crm/LeadsTable'

export const metadata: Metadata = {
  title: 'CRM — Воронка продаж',
}

export default async function CRMPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
        <p className="text-muted-foreground">Управление лидами и воронкой продаж</p>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="mb-6">
          <TabsTrigger value="kanban">Воронка</TabsTrigger>
          <TabsTrigger value="table">Все лиды</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="table">
          <LeadsTable />
        </TabsContent>
      </Tabs>
    </Container>
  )
}
```

- [ ] **Step 2: Verify manually**

Запустите `npm run dev` и откройте `http://localhost:3000/crm` под admin.

Проверьте:
- Редирект на `/auth/signin` если не залогинен
- Редирект на `/` если роль не ADMIN
- Вкладка "Воронка" показывает 6 колонок с карточками лидов
- Смена стадии через Select на карточке перемещает её в другую колонку
- Вкладка "Все лиды" показывает таблицу с поиском и фильтром

- [ ] **Step 3: Commit**

```bash
git add src/app/crm/page.tsx
git commit -m "feat: add CRM page with Kanban and LeadsTable tabs"
```

---

### Task 9: Add CRM Link to Admin Panel

**Files:**
- Modify: `src/components/admin/AdminDashboard.tsx`

- [ ] **Step 1: Add CRM link**

В `src/components/admin/AdminDashboard.tsx` найдите заголовок компонента (первый `return`) и добавьте кнопку-ссылку на CRM после заголовка:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
```

И в JSX после заголовка (перед `<Tabs>`):

```tsx
<div className="mb-6">
  <Link href="/crm">
    <Button variant="outline">Открыть CRM →</Button>
  </Link>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminDashboard.tsx
git commit -m "feat: add CRM link to admin dashboard"
```
