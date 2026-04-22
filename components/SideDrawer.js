'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SideDrawer({ isOpen, onClose }) {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user info from localStorage
    const session = localStorage.getItem('gokab_session')
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch (err) {
        console.error('Failed to parse session:', err)
      }
    }
  }, [isOpen])

  const handleNavigation = (path) => {
    router.push(path)
    onClose()
  }

  const handleLogout = () => {
    localStorage.removeItem('gokab_session')
    router.push('/welcome')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <button
            onClick={onClose}
            className="text-2xl mb-4 hover:opacity-80 transition"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold">goKab</h2>
          <p className="text-orange-100 text-sm mt-1">{user?.name || 'User'}</p>
          <p className="text-orange-200 text-xs">{user?.phone}</p>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex flex-col h-full">
          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="text-2xl">🏠</span>
            <span className="font-semibold">Home</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/profile')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="text-2xl">👤</span>
            <span className="font-semibold">My Profile</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="text-2xl">🗺️</span>
            <span className="font-semibold">Ride History</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="text-2xl">💬</span>
            <span className="font-semibold">Support</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold">Settings</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-6 py-4 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3 border-l-4 border-transparent hover:border-red-500 mt-auto"
          >
            <span className="text-2xl">🚪</span>
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </div>
    </>
  )
}
