'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Restore session from localStorage to Zustand on app mount
    const session = localStorage.getItem('gokab_session')
    if (session) {
      try {
        const userData = JSON.parse(session)
        // Update Zustand store with persisted session
        useAuthStore.setState({ user: userData, sessionPersisted: true })
        console.log('Session restored from localStorage on mount:', userData.phone)
      } catch (err) {
        console.error('Failed to restore session:', err)
        localStorage.removeItem('gokab_session')
      }
    }
    
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
