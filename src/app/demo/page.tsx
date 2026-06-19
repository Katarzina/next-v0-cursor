'use client'
import { useEffect } from 'react'
import { signIn } from 'next-auth/react'

export default function DemoPage() {
  useEffect(() => {
    signIn('credentials', {
      email: process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'demo@automation-studio.com',
      password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo2024!',
      callbackUrl: '/crm',
      redirect: true,
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Входим в демо...</p>
      </div>
    </div>
  )
}
