'use client'
import { useSession } from 'next-auth/react'

export default function NavCRMLink() {
  const { data: session } = useSession()
  const role = session?.user?.role

  if (role !== 'ADMIN' && role !== 'DEMO') return null

  return (
    <a href="/crm" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
      CRM
    </a>
  )
}
