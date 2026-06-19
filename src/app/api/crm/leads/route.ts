import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'DEMO')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const stage = searchParams.get('stage')
  const source = searchParams.get('source')
  const search = searchParams.get('search')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const sortField = searchParams.get('sort') ?? 'createdAt'
  const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc'
  const all = searchParams.get('all') === 'true'

  const where: any = {}
  if (stage && stage !== 'ALL') where.stage = stage
  if (source && source !== 'ALL') where.source = source
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy: any = { [sortField]: sortOrder }

  if (all) {
    const leads = await prisma.lead.findMany({ where, orderBy })
    return NextResponse.json({ leads, total: leads.length, page: 1, pages: 1 })
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.lead.count({ where }),
  ])

  return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) })
}
