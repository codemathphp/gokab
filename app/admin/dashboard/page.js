'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useAdminStore } from '@/lib/store'
import { approveDriver, rejectDriver } from '@/lib/firebaseServices'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { pendingDrivers, setPendingDrivers } = useAdminStore()
  const [activeTab, setActiveTab] = useState('drivers')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/welcome')
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
  }, [user, router, setPendingDrivers])

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

  const handleLogout = () => {
    logout()
    localStorage.removeItem('gokab_session')
    router.push('/welcome')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-gray-700 text-white p-6 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <p className="text-white text-opacity-90">Manage drivers and monitor rides</p>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto mt-6 px-4 flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'drivers'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          📋 Drivers
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('rides')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'rides'
              ? 'bg-primary text-white'
              : 'bg-white text-secondary hover:bg-gray-100'
          }`}
        >
          🚗 Rides
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
    </div>
  )
}
