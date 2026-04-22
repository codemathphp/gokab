'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { useLocalSession } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuthStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          if (user.role === 'driver') {
            router.push('/driver/dashboard')
          } else if (user.role === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/rider/home')
          }
        } else {
          router.push('/welcome')
        }
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [user, loading, router])

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
