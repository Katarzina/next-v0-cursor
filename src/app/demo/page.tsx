'use client'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/crm')
      return
    }
    if (status === 'unauthenticated') {
      signIn('credentials', {
        email: 'demo@automation-studio.com',
        password: 'Demo2024!',
        callbackUrl: '/crm',
        redirect: true,
      }).catch(() => setError(true))
    }
  }, [status, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <p className="text-red-500 font-medium">Не удалось войти в демо-аккаунт.</p>
          <p className="text-sm text-gray-500 mt-1">Обратитесь к администратору.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Входим в демо...</p>
      </div>
    </div>
  )
}
