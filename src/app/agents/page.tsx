import { prisma } from '@/lib/prisma';
import AgentsClient from '@/components/AgentsClient';

async function getAgents() {
  console.log('🔍 [Agents Page] Fetching agents...');
  try {
    const users = await prisma.user.findMany({
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
    });

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
    }));

    console.log('✅ [Agents Page] Found agents:', agents.length);
    return agents;
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return [];
  }
}

export default async function AgentsPage() {
  const agents = await getAgents();
  
  return <AgentsClient initialAgents={agents} />;
}