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

    const where: any = {}

    if (specialty) {
      where.specialties = {
        has: specialty
      }
    }

    if (language) {
      where.languages = {
        has: language
      }
    }

    const agents = await prisma.agent.findMany({
      where,
      orderBy: {
        rating: 'desc'
      }
    })

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

    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        title: body.title,
        image: body.image,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        soldProperties: body.soldProperties || 0,
        yearsExperience: body.yearsExperience,
        languages: body.languages || [],
        specialties: body.specialties || [],
        phone: body.phone,
        email: body.email,
        bio: body.bio
      }
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
}