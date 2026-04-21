'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import './globals.css'

export default function RootLayout({ children }) {
  const { initSession, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) {
    return (
      <html lang="en">
        <body className="bg-white">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin">Loading...</div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>GoKab - Travel in Smart Style</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="theme-color" content="#FF7A3D" />
        <meta name="description" content="Premium taxi service - Travel in Smart Style" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GoKab" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/app_icon.png" />
        <link rel="apple-touch-icon" href="/app_icon.png" />
      </head>
      <body className="bg-white text-secondary">
        <div className="min-h-screen max-w-md mx-auto bg-white relative">
          {children}
        </div>
      </body>
    </html>
  )
}
