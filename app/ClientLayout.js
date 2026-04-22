'use client'

import { useEffect, useState } from 'react'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted immediately to prevent layout shift
    setMounted(true)

    // Register service worker for PWA (non-blocking)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err)
      })
    }
  }, [])

  // Render children immediately, don't wait for mounted state
  // This prevents white page on initial load
  return (
    <div className="min-h-screen max-w-md mx-auto bg-white relative">
      {children}
    </div>
  )
}
