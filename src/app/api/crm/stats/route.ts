import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'DEMO')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const leads = await prisma.lead.findMany({
    select: { stage: true, source: true, createdAt: true, updatedAt: true },
  })

  const total = leads.length
  const won = leads.filter((l) => l.stage === 'WON').length
  const conversion = total > 0 ? Math.round((won / total) * 100) : 0

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const newLast30 = leads.filter((l) => new Date(l.createdAt) >= thirtyDaysAgo).length

  const wonLeads = leads.filter((l) => l.stage === 'WON')
  const avgCycle =
    wonLeads.length > 0
      ? Math.round(
          wonLeads.reduce((sum, l) => {
            const days = Math.floor(
              (new Date(l.updatedAt).getTime() - new Date(l.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            )
            return sum + days
          }, 0) / wonLeads.length
        )
      : 0

  // Funnel by stage
  const STAGES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']
  const STAGE_LABELS: Record<string, string> = {
    NEW: 'Новый',
    CONTACTED: 'Связались',
    QUALIFIED: 'Квалифицирован',
    PROPOSAL: 'КП',
    WON: 'Выиграли',
    LOST: 'Проиграли',
  }
  const funnel = STAGES.map((stage) => ({
    stage: STAGE_LABELS[stage],
    count: leads.filter((l) => l.stage === stage).length,
    key: stage,
  }))

  // Weekly dynamics for last 12 weeks
  const weeks: { week: string; count: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const start = new Date()
    start.setDate(start.getDate() - i * 7 - 6)
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setDate(end.getDate() - i * 7)
    end.setHours(23, 59, 59, 999)
    const count = leads.filter((l) => {
      const d = new Date(l.createdAt)
      return d >= start && d <= end
    }).length
    weeks.push({
      week: start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      count,
    })
  }

  // Sources
  const SOURCE_LABELS: Record<string, string> = {
    WEBSITE: 'Сайт',
    TELEGRAM: 'Telegram',
    EMAIL: 'Email',
    FACEBOOK: 'Facebook',
    YOUTUBE: 'YouTube',
    REFERRAL: 'Реферал',
    OTHER: 'Другое',
  }
  const sourceMap: Record<string, number> = {}
  leads.forEach((l) => {
    const label = SOURCE_LABELS[l.source] ?? l.source
    sourceMap[label] = (sourceMap[label] ?? 0) + 1
  })
  const sources = Object.entries(sourceMap).map(([name, value]) => ({ name, value }))

  return NextResponse.json({ total, won, conversion, newLast30, avgCycle, funnel, weeks, sources })
}
