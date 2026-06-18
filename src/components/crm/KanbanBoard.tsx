'use client'
import { useEffect, useState } from 'react'
import { KanbanCard, Lead } from './KanbanCard'

const STAGES = [
  { key: 'NEW', label: 'Новый', color: 'bg-blue-50 border-blue-200' },
  { key: 'CONTACTED', label: 'Связались', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'QUALIFIED', label: 'Квалифицирован', color: 'bg-orange-50 border-orange-200' },
  { key: 'PROPOSAL', label: 'КП', color: 'bg-purple-50 border-purple-200' },
  { key: 'WON', label: 'Выиграли', color: 'bg-green-50 border-green-200' },
  { key: 'LOST', label: 'Проиграли', color: 'bg-gray-50 border-gray-200' },
]

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState('NEW')

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
    return <div className="text-sm text-gray-500 py-12 text-center">Загрузка...</div>
  }

  return (
    <>
      {/* Mobile: stage tabs + single column */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {STAGES.map((stage) => {
            const count = leads.filter((l) => l.stage === stage.key).length
            return (
              <button
                key={stage.key}
                onClick={() => setActiveStage(stage.key)}
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
        <div className="space-y-2">
          {leads.filter((l) => l.stage === activeStage).map((lead) => (
            <KanbanCard key={lead.id} lead={lead} onStageChange={updateStage} />
          ))}
          {leads.filter((l) => l.stage === activeStage).length === 0 && (
            <div className="text-sm text-gray-400 text-center py-8 bg-white rounded-lg border">
              Нет лидов в этой стадии
            </div>
          )}
        </div>
      </div>

      {/* Desktop: full kanban */}
      <div className="hidden lg:flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.key)
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
    </>
  )
}
