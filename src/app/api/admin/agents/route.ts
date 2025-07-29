import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Получаем агентов через User + AgentProfile
    const agents = await prisma.user.findMany({
      where: {
        role: 'AGENT',
        agentProfile: {
          isNot: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        agentProfile: {
          select: {
            id: true,
            phone: true,
            rating: true,
            reviewCount: true,
            soldProperties: true,
            yearsExperience: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Преобразуем данные в нужный формат
    const transformedAgents = agents.map(user => ({
      id: user.agentProfile!.id,
      name: user.name || '',
      email: user.email,
      phone: user.agentProfile!.phone,
      rating: user.agentProfile!.rating,
      reviewCount: user.agentProfile!.reviewCount,
      soldProperties: user.agentProfile!.soldProperties,
      yearsExperience: user.agentProfile!.yearsExperience,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ agents: transformedAgents });

  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}