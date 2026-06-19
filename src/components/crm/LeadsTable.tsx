'use client'
import { useEffect, useState, useCallback } from 'react'
import { Lead } from './KanbanCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'

const STAGE_COLORS: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  CONTACTED: 'bg-yellow-50 text-yellow-700',
  QUALIFIED: 'bg-orange-50 text-orange-700',
  PROPOSAL: 'bg-purple-50 text-purple-700',
  WON: 'bg-green-50 text-green-700',
  LOST: 'bg-gray-100 text-gray-500',
}

type SortField = 'createdAt' | 'name' | 'stage'

export function LeadsTable() {
  const { t } = useLocale()
  const c = t.crm
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [stageFilter, setStageFilter] = useState('ALL')
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [sort, setSort] = useState<SortField>('createdAt')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const limit = 20

  const fetchLeads = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      order,
    })
    if (stageFilter !== 'ALL') params.set('stage', stageFilter)
    if (sourceFilter !== 'ALL') params.set('source', sourceFilter)
    if (search) params.set('search', search)

    fetch(`/api/crm/leads?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setLeads(Array.isArray(data.leads) ? data.leads : [])
        setTotal(data.total ?? 0)
        setPages(data.pages ?? 1)
        setLoading(false)
      })
  }, [page, stageFilter, sourceFilter, search, sort, order])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const updateStage = async (id: string, stage: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
    await fetch(`/api/crm/leads/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })
  }

  const toggleSort = (field: SortField) => {
    if (sort === field) {
      setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(field)
      setOrder('desc')
    }
    setPage(1)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort !== field) return <ChevronUp className="w-3 h-3 opacity-20 inline ml-1" />
    return order === 'asc'
      ? <ChevronUp className="w-3 h-3 inline ml-1 text-blue-600" />
      : <ChevronDown className="w-3 h-3 inline ml-1 text-blue-600" />
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder={c.filters.search}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={stageFilter} onValueChange={(v) => { setStageFilter(v); setPage(1) }}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder={c.filters.allStages} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{c.filters.allStages}</SelectItem>
            {Object.entries(c.stages).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setPage(1) }}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder={c.filters.allSources} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{c.filters.allSources}</SelectItem>
            {Object.entries(c.sources).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="sm:ml-auto text-sm text-gray-500 flex items-center">
          {loading ? c.table.loading : `${total} ${c.table.leads}`}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('name')}>
                {c.table.name} <SortIcon field="name" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{c.table.email}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{c.table.phone}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{c.table.source}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('stage')}>
                {c.table.stage} <SortIcon field="stage" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none" onClick={() => toggleSort('createdAt')}>
                {c.table.date} <SortIcon field="createdAt" />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 0 ? '120px' : j === 1 ? '160px' : '80px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">{c.table.noLeads}</td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.phone ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.sources[lead.source as keyof typeof c.sources] ?? lead.source}</td>
                <td className="px-4 py-3">
                  <Select value={lead.stage} onValueChange={(v) => updateStage(lead.id, v)}>
                    <SelectTrigger className={`h-7 text-xs w-36 border-0 ${STAGE_COLORS[lead.stage]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(c.stages).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {c.table.page} {page} {c.table.of} {pages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50 text-xs px-2"
            >1</button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(pages)}
              disabled={page === pages}
              className="p-1.5 rounded border disabled:opacity-30 hover:bg-gray-50 text-xs px-2"
            >{pages}</button>
          </div>
        </div>
      )}
    </div>
  )
}
