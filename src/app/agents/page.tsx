import { prisma } from '@/lib/prisma';
import AgentsClient from '@/components/AgentsClient';

async function getAgents() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: {
        rating: 'desc'
      }
    });
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