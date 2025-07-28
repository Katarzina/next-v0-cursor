import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AgentPropertiesClient from "@/components/AgentPropertiesClient";

async function getAgentProperties(userId: string) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return properties;
  } catch (error) {
    console.error('Failed to fetch agent properties:', error);
    return [];
  }
}

export default async function AgentPropertiesPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has agent role
  if (!session || !['AGENT', 'ADMIN'].includes(session.user.role)) {
    redirect('/auth/signin');
  }

  const properties = await getAgentProperties(session.user.id);
  
  return <AgentPropertiesClient initialProperties={properties} />;
}