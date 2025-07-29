import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/agents:
 *   get:
 *     tags:
 *       - Agents
 *     summary: Get all agents
 *     description: Retrieve a list of all agents with optional filtering
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by agent specialty
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language spoken
 *     responses:
 *       200:
 *         description: List of agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const specialty = searchParams.get('specialty')
    const language = searchParams.get('language')

    const where: any = {
      role: 'AGENT',
      agentProfile: {
        isNot: null
      }
    }

    // Фильтры применяем к AgentProfile
    const agentProfileWhere: any = {}

    if (specialty) {
      agentProfileWhere.specialties = {
        has: specialty
      }
    }

    if (language) {
      agentProfileWhere.languages = {
        has: language
      }
    }

    if (Object.keys(agentProfileWhere).length > 0) {
      where.agentProfile = {
        ...where.agentProfile,
        ...agentProfileWhere
      }
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        agentProfile: {
          select: {
            id: true,
            title: true,
            image: true,
            rating: true,
            reviewCount: true,
            soldProperties: true,
            yearsExperience: true,
            languages: true,
            specialties: true,
            phone: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
      orderBy: {
        agentProfile: {
          rating: 'desc'
        }
      }
    })

    // Преобразуем в формат Agent для совместимости
    const agents = users.map(user => ({
      id: user.agentProfile!.id,
      name: user.name || '',
      title: user.agentProfile!.title,
      image: user.agentProfile!.image,
      rating: user.agentProfile!.rating,
      reviewCount: user.agentProfile!.reviewCount,
      soldProperties: user.agentProfile!.soldProperties,
      yearsExperience: user.agentProfile!.yearsExperience,
      languages: user.agentProfile!.languages,
      specialties: user.agentProfile!.specialties,
      phone: user.agentProfile!.phone,
      email: user.email,
      bio: user.agentProfile!.bio,
      createdAt: user.agentProfile!.createdAt,
      updatedAt: user.agentProfile!.updatedAt,
    }))

    return NextResponse.json(agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch agents',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/agents:
 *   post:
 *     tags:
 *       - Agents
 *     summary: Create a new agent
 *     description: Add a new agent to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentInput'
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agent'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Создаем пользователя с ролью AGENT и его профиль в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Проверяем, не существует ли уже пользователь с таким email
      const existingUser = await tx.user.findUnique({
        where: { email: body.email }
      })

      let user
      if (existingUser) {
        // Если пользователь существует, обновляем его роль
        user = await tx.user.update({
          where: { id: existingUser.id },
          data: { role: 'AGENT' }
        })
      } else {
        // Если пользователя нет, создаем нового
        user = await tx.user.create({
          data: {
            name: body.name,
            email: body.email,
            role: 'AGENT'
          }
        })
      }

      // Создаем профиль агента
      const agentProfile = await tx.agentProfile.create({
        data: {
          userId: user.id,
          title: body.title,
          image: body.image,
          rating: body.rating || 0,
          reviewCount: body.reviewCount || 0,
          soldProperties: body.soldProperties || 0,
          yearsExperience: body.yearsExperience,
          languages: body.languages || [],
          specialties: body.specialties || [],
          phone: body.phone,
          bio: body.bio
        }
      })

      return {
        id: agentProfile.id,
        name: user.name || '',
        title: agentProfile.title,
        image: agentProfile.image,
        rating: agentProfile.rating,
        reviewCount: agentProfile.reviewCount,
        soldProperties: agentProfile.soldProperties,
        yearsExperience: agentProfile.yearsExperience,
        languages: agentProfile.languages,
        specialties: agentProfile.specialties,
        phone: agentProfile.phone,
        email: user.email,
        bio: agentProfile.bio,
        createdAt: agentProfile.createdAt,
        updatedAt: agentProfile.updatedAt,
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}