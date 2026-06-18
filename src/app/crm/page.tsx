import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/crm/KanbanBoard'
import { LeadsTable } from '@/components/crm/LeadsTable'
import { Analytics } from '@/components/crm/Analytics'

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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-2xl mx-auto">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground text-sm mt-1">Управление лидами и воронкой продаж</p>
        </div>

        <Tabs defaultValue="kanban">
          <TabsList className="mb-5">
            <TabsTrigger value="kanban">Воронка</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="table">Все лиды</TabsTrigger>
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
