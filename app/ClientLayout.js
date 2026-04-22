'use client'

import { useEffect, useState } from 'react'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Just set mounted flag, nothing else
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
