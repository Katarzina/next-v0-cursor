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
  FACEBOOK: 'Facebook',
  YOUTUBE: 'YouTube',
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
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Поиск по имени или email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="sm:w-48">
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

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
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
