'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-orange-500 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="text-9xl mb-4">404</div>

        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>

        <p className="text-white text-opacity-90 mb-8">
          The page you're looking for doesn't exist
        </p>

        <button
          onClick={() => {
            if (user) {
              if (user.role === 'rider') router.push('/rider/home')
              else if (user.role === 'driver') router.push('/driver/dashboard')
              else router.push('/admin/dashboard')
            } else {
              router.push('/welcome')
            }
          }}
          className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
