'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/store'

export default function ClientLayout({ children }) {
  const { initSession, updateLastActivity } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Memoize the activity handler to prevent infinite re-renders
  const handleActivity = useCallback(() => {
    updateLastActivity()
  }, [updateLastActivity])

  useEffect(() => {
    initSession()
    setMounted(true)

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err)
      })
    }
  }, [initSession])

  useEffect(() => {
    // Update last activity on user interaction
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [handleActivity])

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
