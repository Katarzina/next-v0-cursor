'use client'
import { useLocale } from '@/contexts/LocaleContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from './KanbanBoard'
import { LeadsTable } from './LeadsTable'
import { Analytics } from './Analytics'

export function CRMPageClient() {
  const { t } = useLocale()
  const c = t.crm

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{c.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{c.subtitle}</p>
        </div>

        <Tabs defaultValue="kanban">
          <TabsList className="mb-5">
            <TabsTrigger value="kanban">{c.tabs.kanban}</TabsTrigger>
            <TabsTrigger value="analytics">{c.tabs.analytics}</TabsTrigger>
            <TabsTrigger value="table">{c.tabs.table}</TabsTrigger>
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
      </div>
    </div>
  )
}
