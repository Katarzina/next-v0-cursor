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
  FACEBOOK: 'Facebook',
  YOUTUBE: 'YouTube',
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
