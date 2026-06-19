'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { KanbanCard, Lead } from './KanbanCard'
import { useLocale } from '@/contexts/LocaleContext'

const STAGE_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 border-blue-200',
  CONTACTED: 'bg-yellow-50 border-yellow-200',
  QUALIFIED: 'bg-orange-50 border-orange-200',
  PROPOSAL: 'bg-purple-50 border-purple-200',
  WON: 'bg-green-50 border-green-200',
  LOST: 'bg-gray-50 border-gray-200',
}

const STAGE_BADGE_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  QUALIFIED: 'bg-orange-100 text-orange-700 border-orange-200',
  PROPOSAL: 'bg-purple-100 text-purple-700 border-purple-200',
  WON: 'bg-green-100 text-green-700 border-green-200',
  LOST: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STAGE_KEYS = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']
const CARDS_PER_COL = 8

export function KanbanBoard() {
  const { t } = useLocale()
  const c = t.crm
  const STAGES = STAGE_KEYS.map((key) => ({
    key,
    label: c.stages[key as keyof typeof c.stages],
    color: STAGE_COLORS[key],
    badgeColor: STAGE_BADGE_COLORS[key],
  }))

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState('NEW')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [mobileExpanded, setMobileExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/crm/leads?all=true')
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : Array.isArray(data.leads) ? data.leads : []
        setLeads(arr)
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
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((s) => (
          <div key={s.key} className={`min-w-[210px] w-[210px] flex-shrink-0 rounded-lg border p-3 ${s.color} hidden lg:block`}>
            <Skeleton className="h-4 w-24 mb-3" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full mb-2" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {STAGES.map((stage) => {
            const count = leads.filter((l) => l.stage === stage.key).length
            return (
              <Button
                key={stage.key}
                variant={activeStage === stage.key ? 'default' : 'outline'}
                size="sm"
                className="flex-shrink-0 rounded-full text-xs h-7"
                onClick={() => { setActiveStage(stage.key); setMobileExpanded(false) }}
              >
                {stage.label} · {count}
              </Button>
            )
          })}
        </div>
        {(() => {
          const stageLeads = leads.filter((l) => l.stage === activeStage)
          const visible = mobileExpanded ? stageLeads : stageLeads.slice(0, CARDS_PER_COL)
          return (
            <div className="space-y-2">
              {visible.map((lead) => (
                <KanbanCard key={lead.id} lead={lead} onStageChange={updateStage} />
              ))}
              {stageLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8 bg-white rounded-lg border">{c.kanban.empty}</p>
              )}
              {stageLeads.length > CARDS_PER_COL && !mobileExpanded && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setMobileExpanded(true)}
                >
                  {c.kanban.showMore.replace('{n}', String(stageLeads.length - CARDS_PER_COL))}
                </Button>
              )}
            </div>
          )
        })()}
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.key)
          const isExpanded = expanded[stage.key]
          const visible = isExpanded ? stageLeads : stageLeads.slice(0, CARDS_PER_COL)
          const hidden = stageLeads.length - CARDS_PER_COL

          return (
            <div
              key={stage.key}
              className={`min-w-[210px] w-[210px] flex-shrink-0 rounded-lg border p-3 ${stage.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{stage.label}</h3>
                <Badge className={`text-xs px-1.5 py-0 ${stage.badgeColor}`} variant="outline">
                  {stageLeads.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {visible.map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} onStageChange={updateStage} />
                ))}
                {stageLeads.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">{c.kanban.empty}</p>
                )}
                {!isExpanded && hidden > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-7 text-xs bg-white/70 hover:bg-white"
                    onClick={() => setExpanded((e) => ({ ...e, [stage.key]: true }))}
                  >
                    {c.kanban.showMore.replace('{n}', String(hidden))}
                  </Button>
                )}
                {isExpanded && stageLeads.length > CARDS_PER_COL && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-7 text-xs bg-white/70 hover:bg-white"
                    onClick={() => setExpanded((e) => ({ ...e, [stage.key]: false }))}
                  >
                    {c.kanban.collapse}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
