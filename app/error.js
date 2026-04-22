'use client'

import { useEffect } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-orange-500 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-sm">
        <div className="mb-4 flex justify-center"><FiAlertCircle size={80} /></div>

        <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>

        <p className="text-white text-opacity-90 mb-8">
          An error occurred. Please try again or contact support.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/'
              }
            }}
            className="w-full px-6 py-3 bg-white bg-opacity-20 text-white rounded-xl font-bold hover:bg-opacity-30 transition-colors"
          >
            Go Home
          </button>
        </div>

        <p className="text-xs text-white text-opacity-70 mt-6">
          Error: {error?.message || 'Unknown error'}
        </p>
      </div>
    </div>
  )
}
