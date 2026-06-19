import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { CRMPageClient } from '@/components/crm/CRMPageClient'

export const metadata: Metadata = {
  title: 'CRM',
}

export default async function CRMPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'DEMO') {
    redirect('/')
  }

  return <CRMPageClient />
}
