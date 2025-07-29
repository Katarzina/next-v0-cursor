import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const agentProfileId = parseInt(params.id);

    // Удаляем AgentProfile (пользователь остается, но теряет роль агента)
    const agentProfile = await prisma.agentProfile.findUnique({
      where: { id: agentProfileId },
      select: { userId: true }
    });

    if (!agentProfile) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Удаляем профиль агента и меняем роль пользователя
    await prisma.$transaction([
      prisma.agentProfile.delete({
        where: { id: agentProfileId },
      }),
      prisma.user.update({
        where: { id: agentProfile.userId },
        data: { role: 'USER' }
      })
    ]);

    return NextResponse.json({ 
      message: 'Agent deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}