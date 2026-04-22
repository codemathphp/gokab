'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

export default function ClientLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Initialize session only once on mount
    const initializeSession = async () => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('gokab_session')
        const sessionCreated = localStorage.getItem('gokab_session_created')
        
        if (session) {
          try {
            const userData = JSON.parse(session)
            useAuthStore.setState({
              user: userData,
              sessionPersisted: true,
              loading: false
            })
            console.log('Session restored from storage (created:', sessionCreated, ')')
          } catch (err) {
            console.error('Failed to parse session:', err)
            useAuthStore.setState({ user: null, sessionPersisted: false, loading: false })
          }
        } else {
          useAuthStore.setState({ user: null, sessionPersisted: false, loading: false })
        }
      }

      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration failed:', err)
        })
      }

      setMounted(true)
    }

    initializeSession()
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
