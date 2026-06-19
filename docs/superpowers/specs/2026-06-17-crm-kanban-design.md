# CRM Sales Funnel — Design Spec
Date: 2026-06-17

## Overview
Basic CRM page for AI Automation Studio demo. Shows all leads (Inquiry records) in a Kanban board and a searchable table. Admin-only access.

## Decisions Made
- No drag & drop (add later) — stage changes via Select on each card
- Uses existing `Inquiry` model, extended with new fields
- Two tabs: Воронка (Kanban) + Все лиды (Table)
- Route: `/crm`, protected to ADMIN role only

## 1. Data Model

Add to `prisma/schema.prisma` — model `Inquiry`:
```prisma
stage     LeadStage  @default(NEW)
source    LeadSource @default(WEBSITE)
notes     String?    @db.Text
updatedAt DateTime   @updatedAt
```

New enums:
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
  REFERRAL
  OTHER
}
```

Migration: `./node_modules/.bin/prisma migrate dev --name add_crm_fields`

## 2. Page Structure

**`/crm/page.tsx`**
- Server component, checks session — redirects non-ADMIN to `/`
- Renders `<CRMDashboard />` client component
- Two tabs via `@radix-ui/react-tabs`:
  - "Воронка" → `<KanbanBoard />`
  - "Все лиды" → `<LeadsTable />`

## 3. Kanban Board

**`KanbanBoard.tsx`**
- Fetches all Inquiry from `GET /api/crm/leads` on mount
- 6 columns: NEW → CONTACTED → QUALIFIED → PROPOSAL → WON → LOST
- Column header shows stage name + count of cards
- Each column renders `<KanbanCard />` per lead

**`KanbanCard.tsx`**
- Shows: name, email, phone (if present), createdAt, source badge
- Select dropdown for stage — on change calls `PATCH /api/crm/leads/[id]/stage`
- On success: card moves to correct column (optimistic update locally)

## 4. Leads Table

**`LeadsTable.tsx`**
- Fetches from `GET /api/crm/leads` (same endpoint, shared fetch)
- Columns: Имя | Email | Телефон | Источник | Стадия | Дата
- Filter by stage (Radix Select)
- Search by name or email (input, client-side filter)
- Inline stage change via Select in row (same PATCH endpoint)

## 5. API Endpoints

**`GET /api/crm/leads`**
- Auth: ADMIN only (getServerSession)
- Query params: `?stage=NEW` (optional filter)
- Returns: Inquiry[] ordered by createdAt desc

**`PATCH /api/crm/leads/[id]/stage`**
- Auth: ADMIN only
- Body: `{ stage: LeadStage }`
- Validates stage is a valid enum value
- Returns: updated Inquiry

## 6. File Structure

```
src/
  app/
    crm/
      page.tsx
    api/
      crm/
        leads/
          route.ts
          [id]/
            stage/
              route.ts
  components/
    crm/
      KanbanBoard.tsx
      KanbanCard.tsx
      LeadsTable.tsx
```

## 7. Seed Data

Update `prisma/seed.ts` to add `stage` and `source` to existing Inquiry seed entries, distributing across all 6 stages so the kanban looks populated.

## Out of Scope (add later)
- Drag & drop (dnd-kit)
- Analytics tab (Recharts charts)
- AI lead scoring (Groq)
- Notes editing on cards
