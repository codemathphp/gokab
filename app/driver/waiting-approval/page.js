'use client'

import { useRouter } from 'next/navigation'

import { useEffect } from 'react'
import { FiClock } from 'react-icons/fi'

export default function WaitingApproval() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem('gokab_session')
    if (session) {
      setUser(JSON.parse(session))
    }
  }, [])

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/welcome')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-orange-500 flex items-center justify-center px-4">
      <div className="text-center text-white">
        {/* Illustration */}
        <div className="mb-8 flex justify-center"><FiClock size={120} /></div>

        <h1 className="text-3xl font-bold mb-4">Under Review</h1>

        <p className="text-white text-opacity-90 mb-6 text-lg">
          Your documents are being verified by our admin team.
        </p>

        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <p className="text-sm text-white text-opacity-80 mb-4">
            This usually takes 24-48 hours
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <p className="text-sm">We'll notify you once approved</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <p className="text-sm">You'll receive an email update</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <p className="text-sm">Check back soon to start earning</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/welcome')}
          className="w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
