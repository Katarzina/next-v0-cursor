import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return properties;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return [];
  }
}

export default async function Home() {
  const properties = await getProperties();
  
  return <HomeClient initialProperties={properties} />;
}