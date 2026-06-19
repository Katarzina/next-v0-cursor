'use client'
import { useEffect, useState, useCallback } from 'react'
import { Lead } from './KanbanCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'

const STAGE_BADGE: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  QUALIFIED: 'bg-orange-50 text-orange-700 border-orange-200',
  PROPOSAL: 'bg-purple-50 text-purple-700 border-purple-200',
  WON: 'bg-green-50 text-green-700 border-green-200',
  LOST: 'bg-gray-100 text-gray-500 border-gray-200',
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
    const params = new URLSearchParams({ page: String(page), limit: String(limit), sort, order })
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

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(timer)
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
    <Card>
      <CardHeader>
        <CardTitle>{c.tabs.table}</CardTitle>
        <CardDescription>{loading ? c.table.loading : `${total} ${c.table.leads}`}</CardDescription>
      </CardHeader>
      <CardContent>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={c.filters.search}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={stageFilter} onValueChange={(v) => { setStageFilter(v); setPage(1) }}>
          <SelectTrigger className="w-44">
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
          <SelectTrigger className="w-40">
            <SelectValue placeholder={c.filters.allSources} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{c.filters.allSources}</SelectItem>
            {Object.entries(c.sources).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('name')}>
                {c.table.name} <SortIcon field="name" />
              </TableHead>
              <TableHead>{c.table.email}</TableHead>
              <TableHead className="hidden md:table-cell">{c.table.phone}</TableHead>
              <TableHead className="hidden sm:table-cell">{c.table.source}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort('stage')}>
                {c.table.stage} <SortIcon field="stage" />
              </TableHead>
              <TableHead className="cursor-pointer select-none hidden sm:table-cell" onClick={() => toggleSort('createdAt')}>
                {c.table.date} <SortIcon field="createdAt" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-28 rounded-md" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {c.table.noLeads}
                </TableCell>
              </TableRow>
            ) : leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <a href={`mailto:${lead.email}`} className="text-muted-foreground hover:text-foreground hover:underline">
                    {lead.email}
                  </a>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {lead.phone ?? '—'}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline" className="text-xs font-normal">
                    {c.sources[lead.source as keyof typeof c.sources] ?? lead.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={lead.stage} onValueChange={(v) => updateStage(lead.id, v)}>
                    <SelectTrigger className={`h-7 text-xs w-36 ${STAGE_BADGE[lead.stage]}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(c.stages).map(([value, label]) => (
                        <SelectItem key={value} value={value} className="text-xs">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs hidden sm:table-cell">
                  {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {c.table.page} {page} {c.table.of} {pages}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1} className="px-2 text-xs">
              1
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" className="px-3">{page}</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(pages)} disabled={page === pages} className="px-2 text-xs">
              {pages}
            </Button>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
