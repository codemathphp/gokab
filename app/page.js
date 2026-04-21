'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'

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
        <svg
          className="w-32 h-32"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* GoKab Logo SVG */}
          <circle cx="100" cy="100" r="95" fill="white" stroke="#2D2D2D" strokeWidth="2" />
          <text
            x="50%"
            y="55%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-4xl font-bold fill-primary"
          >
            goKab
          </text>
          {/* Car Icon */}
          <circle cx="150" cy="60" r="30" fill="none" stroke="#FF7A3D" strokeWidth="2" />
          <path d="M130 60 L170 60" stroke="#FF7A3D" strokeWidth="2" />
          <path d="M140 60 L160 60" stroke="#FF7A3D" strokeWidth="2" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-secondary mb-2">goKab</h1>
      <p className="text-gray-500 text-sm mb-8">Travel in Smart Style</p>

      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
