'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocale } from '@/contexts/LocaleContext'

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

const SOURCE_ICONS: Record<string, string> = {
  WEBSITE: '🌐',
  TELEGRAM: '✈️',
  EMAIL: '✉️',
  FACEBOOK: '👤',
  YOUTUBE: '▶️',
  REFERRAL: '🤝',
  OTHER: '•',
}

type Props = {
  lead: Lead
  onStageChange: (id: string, stage: string) => void
}

export function KanbanCard({ lead, onStageChange }: Props) {
  const { t } = useLocale()
  const c = t.crm

  return (
    <Card className="shadow-sm">
      <CardContent className="p-3 space-y-1.5">
        <div className="font-medium text-sm leading-tight">{lead.name}</div>
        <div className="text-xs text-muted-foreground">{lead.email}</div>
        {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
        <p className="text-xs text-muted-foreground line-clamp-2">{lead.message}</p>
        <div className="flex items-center justify-between pt-0.5">
          <Badge variant="secondary" className="text-xs gap-1 px-1.5">
            <span>{SOURCE_ICONS[lead.source] ?? '•'}</span>
            {c.sources[lead.source as keyof typeof c.sources] ?? lead.source}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
        <Select value={lead.stage} onValueChange={(v) => onStageChange(lead.id, v)}>
          <SelectTrigger className="h-7 text-xs mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(c.stages).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
