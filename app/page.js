'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  // Verify session and redirect to appropriate dashboard
  useEffect(() => {
    // Check localStorage for session without using Zustand hook
    const session = localStorage.getItem('gokab_session')
    if (session) {
      try {
        const userData = JSON.parse(session)
        if (userData.role === 'driver') {
          router.replace('/driver/dashboard')
        } else if (userData.role === 'admin') {
          router.replace('/admin/dashboard')
        } else {
          router.replace('/rider/home')
        }
      } catch (err) {
        router.replace('/welcome')
      }
    } else {
      router.replace('/welcome')
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/main_logo.png"
          alt="goKab"
          className="w-64 h-auto object-contain"
        />
      </div>

      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
