'use client'
import { useLocale } from '@/contexts/LocaleContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Container } from '@/components/ui/Container'
import { LayoutDashboard, BarChart3, List } from 'lucide-react'
import { KanbanBoard } from './KanbanBoard'
import { LeadsTable } from './LeadsTable'
import { Analytics } from './Analytics'

export function CRMPageClient() {
  const { t } = useLocale()
  const c = t.crm

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-muted-foreground">{c.subtitle}</p>
      </div>

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {c.tabs.kanban}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {c.tabs.analytics}
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {c.tabs.table}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        <TabsContent value="table">
          <LeadsTable />
        </TabsContent>
      </Tabs>
    </Container>
  )
}
