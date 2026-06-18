'use client'
import { useEffect } from 'react'

export default function CRMError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <h2 className="text-lg font-semibold">Что-то пошло не так</h2>
        <p className="text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )
}
