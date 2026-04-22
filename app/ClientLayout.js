'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize default admin account on app startup
    fetch('/api/admin/init', { method: 'POST' })
      .catch((err) => {
        console.warn('Could not initialize default admin:', err)
      })

    // Just mount - don't update Zustand here to avoid state loop
    // Each component will read from localStorage as needed
    setMounted(true)

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err)
      })
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white relative">
      {children}
    </div>
  )
}
