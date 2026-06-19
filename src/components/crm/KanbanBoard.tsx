'use client'
import { useEffect, useState } from 'react'
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

const STAGE_KEYS = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']

const CARDS_PER_COL = 8

export function KanbanBoard() {
  const { t } = useLocale()
  const c = t.crm
  const STAGES = STAGE_KEYS.map((key) => ({
    key,
    label: c.stages[key as keyof typeof c.stages],
    color: STAGE_COLORS[key],
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
            <div className="h-4 w-24 bg-white/60 rounded animate-pulse mb-3" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/60 rounded-lg mb-2 animate-pulse" />
            ))}
          </div>
        ))}
        <div className="text-sm text-gray-500 py-12 text-center lg:hidden w-full">Загрузка...</div>
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
              <button
                key={stage.key}
                onClick={() => { setActiveStage(stage.key); setMobileExpanded(false) }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeStage === stage.key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {stage.label} · {count}
              </button>
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
                <div className="text-sm text-gray-400 text-center py-8 bg-white rounded-lg border">{c.kanban.empty}</div>
              )}
              {stageLeads.length > CARDS_PER_COL && !mobileExpanded && (
                <button
                  onClick={() => setMobileExpanded(true)}
                  className="w-full text-sm text-gray-500 hover:text-gray-900 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  {c.kanban.showMore.replace('{n}', String(stageLeads.length - CARDS_PER_COL))}
                </button>
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
                <span className="text-xs bg-white border rounded-full px-2 py-0.5 font-medium">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2">
                {visible.map((lead) => (
                  <KanbanCard key={lead.id} lead={lead} onStageChange={updateStage} />
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">{c.kanban.empty}</div>
                )}
                {!isExpanded && hidden > 0 && (
                  <button
                    onClick={() => setExpanded((e) => ({ ...e, [stage.key]: true }))}
                    className="w-full text-xs text-gray-500 hover:text-gray-900 py-1.5 border rounded-md bg-white/70 hover:bg-white transition-colors"
                  >
                    {c.kanban.showMore.replace('{n}', String(hidden))}
                  </button>
                )}
                {isExpanded && stageLeads.length > CARDS_PER_COL && (
                  <button
                    onClick={() => setExpanded((e) => ({ ...e, [stage.key]: false }))}
                    className="w-full text-xs text-gray-500 hover:text-gray-900 py-1.5 border rounded-md bg-white/70 hover:bg-white transition-colors"
                  >
                    {c.kanban.collapse}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
