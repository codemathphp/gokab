'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore, useDriverStore } from '@/lib/store'
import { FiX, FiNavigation, FiBell, FiShield, FiSettings, FiHelpCircle, FiLogOut, FiSwapHorizontal, FiDollarSign } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { getDriver } from '@/lib/firebaseServices'

export default function SideDrawer({ isOpen, onClose }) {
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()
  const { driverStatus, setDriverStatus } = useDriverStore()
  const [hasDriverAccount, setHasDriverAccount] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if driver account exists
    const checkDriverAccount = async () => {
      if (user?.phone) {
        try {
          const driver = await getDriver(user.phone)
          setHasDriverAccount(!!driver)
        } catch (error) {
          console.error('Error checking driver account:', error)
          setHasDriverAccount(false)
        }
      }
      setLoading(false)
    }

    if (isOpen) {
      checkDriverAccount()
    }
  }, [isOpen, user?.phone])

  const handleNavigation = (path) => {
    router.push(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('gokab_session')
    router.push('/welcome')
    onClose()
  }

  const handleAccountToggle = async () => {
    if (hasDriverAccount) {
      // Switch to driver account
      const newUserData = { ...user, role: 'driver' }
      setUser(newUserData)
      router.push('/driver/dashboard')
      onClose()
    } else {
      // Start driver onboarding
      const newUserData = { ...user, role: 'driver' }
      setUser(newUserData)
      router.push('/driver/onboarding')
      onClose()
    }
  }

  const toggleOnlineStatus = () => {
    const newStatus = driverStatus === 'online' ? 'offline' : 'online'
    setDriverStatus(newStatus)
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
            <FiX size={24} />
          </button>
          {/* Logo */}
          <img
            src="/main_logo.png"
            alt="goKab"
            className="h-8 object-contain mb-4"
          />
          <p className="text-orange-100 text-sm font-semibold">{user?.phone}</p>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex flex-col h-full overflow-y-auto pb-6">
          {/* Main Menu */}
          <button
            onClick={() => handleNavigation(user?.role === 'driver' ? '/driver/dashboard' : '/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiNavigation size={20} />
            <span className="font-semibold">Rides</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiBell size={20} />
            <span className="font-semibold">Notifications</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiShield size={20} />
            <span className="font-semibold">Safety</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiSettings size={20} />
            <span className="font-semibold">Settings</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiHelpCircle size={20} />
            <span className="font-semibold">Help</span>
          </button>

          <button
            onClick={() => handleNavigation('/rider/home')}
            className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
          >
            <FiHelpCircle size={20} />
            <span className="font-semibold">Support</span>
          </button>

          {/* Driver Section - Only show if on driver role or has driver account */}
          {(user?.role === 'driver' || hasDriverAccount) && !loading && (
            <>
              <div className="border-t border-gray-200 my-4"></div>

              <div className="px-6 py-2">
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Driver Settings</p>
              </div>

              <button
                onClick={() => handleNavigation('/driver/settings')}
                className="px-6 py-4 text-left text-gray-800 hover:bg-gray-100 transition flex items-center gap-3 border-l-4 border-transparent hover:border-orange-500"
              >
                <FiDollarSign size={20} />
                <span className="font-semibold">My Rates</span>
              </button>

              {/* Online/Offline Toggle - Only for driver role */}
              {user?.role === 'driver' && (
                <button
                  onClick={toggleOnlineStatus}
                  className={`px-6 py-4 text-left transition flex items-center gap-3 border-l-4 ${
                    driverStatus === 'online'
                      ? 'bg-green-50 text-green-800 border-green-500 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${driverStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-semibold">{driverStatus === 'online' ? 'Go Offline' : 'Go Online'}</span>
                </button>
              )}
            </>
          )}

          {/* Account Toggle */}
          <div className="border-t border-gray-200 my-4"></div>

          <button
            onClick={handleAccountToggle}
            className="px-6 py-4 text-left text-blue-600 hover:bg-blue-50 transition flex items-center gap-3 border-l-4 border-transparent hover:border-blue-500"
          >
            <FiSwapHorizontal size={20} />
            <span className="font-semibold">
              {user?.role === 'rider' ? 'Switch to Driver' : 'Switch to Rider'}
            </span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-6 py-4 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3 border-l-4 border-transparent hover:border-red-500 mt-auto"
          >
            <FiLogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </div>
    </>
  )
}
