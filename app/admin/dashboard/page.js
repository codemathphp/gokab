'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/lib/store'
import { approveDriver, rejectDriver, updateAdminPassword } from '@/lib/firebaseServices'
import { FiClipboard, FiUsers, FiTruck, FiDollarSign, FiLogOut, FiLock } from 'react-icons/fi'

export default function AdminDashboard() {
  const router = useRouter()
  const { pendingDrivers, setPendingDrivers } = useAdminStore()
  const [activeTab, setActiveTab] = useState('drivers')
  const [loading, setLoading] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    // Check for admin session
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      router.replace('/admin/login')
      return
    }

    try {
      const session = JSON.parse(adminSession)
      setAdminUsername(session.username)
    } catch (err) {
      console.error('Invalid admin session:', err)
      router.replace('/admin/login')
      return
    }

    // Mock pending drivers
    setPendingDrivers([
      {
        phone: '+263 77 123 4567',
        name: 'John Doe',
        vehicle: 'Toyota Avanza ABC 1234',
        createdAt: '2 hours ago',
        status: 'pending',
      },
      {
        phone: '+263 77 234 5678',
        name: 'Jane Smith',
        vehicle: 'Honda Fit XYZ 5678',
        createdAt: '5 hours ago',
        status: 'pending',
      },
    ])
  }, [router, setPendingDrivers])

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.replace('/admin/login')
  }

  const handleChangePassword = async () => {
    setPasswordError('')

    if (!passwordData.oldPassword) {
      setPasswordError('Please enter your current password')
      return
    }
    if (!passwordData.newPassword) {
      setPasswordError('Please enter a new password')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setPasswordLoading(true)
    try {
      await updateAdminPassword(
        adminUsername,
        passwordData.oldPassword,
        passwordData.newPassword
      )
      setPasswordError('')
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordModal(false)
      alert('Password updated successfully!')
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleApproveDriver = async (phone) => {
    setLoading(true)
    try {
      await approveDriver(phone, {})
      setPendingDrivers(pendingDrivers.filter((d) => d.phone !== phone))
      alert('Driver approved successfully')
    } catch (error) {
      alert('Error approving driver: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectDriver = async (phone) => {
    setLoading(true)
    try {
      await rejectDriver(phone)
      setPendingDrivers(pendingDrivers.filter((d) => d.phone !== phone))
      alert('Driver rejected')
    } catch (error) {
      alert('Error rejecting driver: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-gray-700 text-white p-6 pt-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-300">Welcome, {adminUsername}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-sm bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FiLock size={16} />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
        <p className="text-white text-opacity-90">Manage drivers and monitor rides</p>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto mt-6 px-4 flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'drivers'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          <FiClipboard size={18} /> Drivers
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          <FiUsers size={18} /> Users
        </button>
        <button
          onClick={() => setActiveTab('rides')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'rides'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          <FiTruck size={18} /> Rides
        </button>
        <button
          onClick={() => router.push('/admin/pricing')}
          className="px-6 py-2 rounded-lg font-semibold transition-colors bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2"
        >
          <FiDollarSign size={18} /> Pricing
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Drivers Tab */}
        {activeTab === 'drivers' && (
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Pending Driver Applications</h2>
            {pendingDrivers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-600">No pending driver applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDrivers.map((driver) => (
                  <div key={driver.phone} className="bg-white rounded-2xl p-6 shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-secondary">{driver.name}</h3>
                        <p className="text-gray-600 text-sm">{driver.phone}</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                        {driver.createdAt}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-semibold text-secondary">{driver.vehicle}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveDriver(driver.phone)}
                        disabled={loading}
                        className="flex-1 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleRejectDriver(driver.phone)}
                        disabled={loading}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">All Users</h2>
            <div className="bg-white rounded-2xl p-6 shadow text-center">
              <p className="text-gray-600">Total Users: 156</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">124</p>
                  <p className="text-sm text-gray-600">Riders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">28</p>
                  <p className="text-sm text-gray-600">Drivers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">4</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rides Tab */}
        {activeTab === 'rides' && (
          <div>
            <h2 className="text-xl font-bold text-secondary mb-4">Recent Rides</h2>
            <div className="bg-white rounded-2xl p-6 shadow text-center">
              <p className="text-gray-600">Total Rides: 342</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-accent">298</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">44</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-2xl font-bold text-primary">$4,256.50</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Change Password</h2>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
                {passwordError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {/* Current Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
                  disabled={passwordLoading}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
                  disabled={passwordLoading}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary bg-white"
                  disabled={passwordLoading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                }}
                disabled={passwordLoading}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
