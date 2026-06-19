'use client'
import { useEffect, useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, TrendingUp, CalendarDays, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'

type Stats = {
  total: number
  won: number
  conversion: number
  newLast30: number
  avgCycle: number
  funnel: { stage: string; count: number; key: string }[]
  weeks: { week: string; count: number }[]
  sources: { name: string; value: number }[]
}

const FUNNEL_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  CONTACTED: '#eab308',
  QUALIFIED: '#f97316',
  PROPOSAL: '#8b5cf6',
  WON: '#22c55e',
  LOST: '#9ca3af',
}

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#eab308', '#ec4899', '#9ca3af']

export function Analytics() {
  const { t } = useLocale()
  const c = t.crm
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <Skeleton className="h-56 rounded-lg" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.analytics.total}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.analytics.conversion}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion}%</div>
            <p className="text-xs text-muted-foreground">{stats.won} {c.stages.WON.toLowerCase()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.analytics.newLast30}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLast30}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.analytics.avgCycle}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCycle} <span className="text-sm font-normal">{c.analytics.days}</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">{c.analytics.funnel}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.funnel} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name={c.table.leads} radius={[4, 4, 0, 0]}>
                  {stats.funnel.map((entry) => (
                    <Cell key={entry.key} fill={FUNNEL_COLORS[entry.key] ?? '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">{c.analytics.sources}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {stats.sources.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stats.sources} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                      {stats.sources.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {stats.sources.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly dynamics */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">{c.analytics.weekly}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.weeks} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                name={c.analytics.newLeads}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
