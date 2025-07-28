'use client'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/swagger')
      .then(res => res.json())
      .then(data => setSpec(data))
  }, [])

  if (!spec) {
    return <div className="flex items-center justify-center min-h-screen">Loading API documentation...</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 px-4">API Documentation</h1>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  )
}