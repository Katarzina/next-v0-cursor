'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Что-то пошло не так</h2>
            <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#111', color: '#fff', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}>
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
