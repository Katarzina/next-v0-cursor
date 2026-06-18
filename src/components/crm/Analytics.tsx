'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
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

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-sm text-gray-500 py-12 text-center">Загрузка...</div>
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Всего лидов" value={stats.total} />
        <MetricCard label="Конверсия" value={`${stats.conversion}%`} sub={`${stats.won} выиграно`} />
        <MetricCard label="Новых за 30 дней" value={stats.newLast30} />
        <MetricCard label="Средний цикл" value={`${stats.avgCycle} дн.`} sub="для выигранных" />
      </div>

      {/* Funnel + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium mb-4">Воронка по стадиям</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.funnel} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Лидов" radius={[4, 4, 0, 0]}>
                {stats.funnel.map((entry) => (
                  <Cell key={entry.key} fill={FUNNEL_COLORS[entry.key] ?? '#9ca3af'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-medium mb-4">Источники</h3>
          {stats.sources.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={stats.sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
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
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Нет данных</p>
          )}
        </div>
      </div>

      {/* Weekly dynamics */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-medium mb-4">Новые лиды по неделям</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.weeks} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              name="Лидов"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
