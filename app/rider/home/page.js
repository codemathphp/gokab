'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export default function RiderHome() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [location, setLocation] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Ecocash')

  // Mock drivers data
  const mockDrivers = [
    {
      id: 1,
      name: 'Lloyd Gutu',
      rating: 5.0,
      rides: 4,
      distance: '1 Minute Away',
      vehicle: 'Honda Fit New Hybrid Shape',
      plate: 'Ae478 - 388',
      price: '$7.50',
      paymentMethod: 'Ecocash',
    },
    {
      id: 2,
      name: 'Munyaradzi',
      rating: 4.8,
      rides: 4,
      distance: '5 Minute Away',
      vehicle: 'Toyota Vits',
      plate: 'TY489 - 221',
      price: '$8.75',
      paymentMethod: 'Cash',
    },
    {
      id: 3,
      name: 'Tonderai',
      rating: 5.0,
      rides: 4,
      distance: '10 Minutes Away',
      vehicle: 'Mercedes Benz',
      plate: 'MB555 - 666',
      price: '$17.00',
      paymentMethod: 'Cash',
    },
  ]

  useEffect(() => {
    if (!user || user.role !== 'rider') {
      router.push('/welcome')
      return
    }

    // Get current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [user, router])

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary">goKab</h1>
        <button
          onClick={() => router.push('/rider/profile')}
          className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl hover:bg-orange-200 transition"
        >
          ☰
        </button>
      </div>

      {/* Map Area */}
      <div className="h-72 bg-gray-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-md p-3 z-10">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 text-lg">📍</span>
                <p className="text-xs text-gray-600">1302 172 Close, Budiriro 1, Harare</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-lg">📍</span>
                <p className="text-xs text-gray-600">23 Ruddington Road, Marlborough ....</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-5xl opacity-30">🗺️</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Best Fare Section */}
        <div className="px-4 pt-4 pb-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-lg">
                🚗
              </div>
              <div className="flex-1">
                <p className="font-semibold text-secondary text-sm">GoKab</p>
                <p className="text-xs text-gray-600">2min Away</p>
                <p className="text-xs text-gray-500 mt-0.5">Full 0 Drivers</p>
              </div>
            </div>
            <div className="border-b border-gray-100 my-3"></div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-xs">Best Fare</p>
                <p className="font-bold text-lg text-secondary">$8.00</p>
                <p className="text-xs text-gray-500">Closest Drivers</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition">
                Negotiate
              </button>
            </div>
          </div>
        </div>

        {/* Best Offers Header */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-gray-600 font-semibold text-sm">Best Offers</p>
        </div>

        {/* Drivers List */}
        <div className="px-4 pb-4 space-y-3">
          {mockDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`border rounded-lg p-4 transition-all ${
                selectedDriver?.id === driver.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-secondary text-sm">
                        {driver.name} <span className="text-orange-500">⭐ {driver.rating}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{driver.distance}</p>
                      <p className="text-xs text-gray-500 mt-1">{driver.vehicle}</p>
                    </div>
                    <p className="font-bold text-lg text-secondary">{driver.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center justify-between">
                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowDropdown(driver.id === selectedDriver?.id ? !showDropdown : true)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:border-gray-400 bg-white"
                  >
                    <span className="text-gray-600">{paymentMethod}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  {showDropdown && selectedDriver?.id === driver.id && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20">
                      <button
                        onClick={() => {
                          setPaymentMethod('Ecocash')
                          setShowDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Ecocash
                      </button>
                      <button
                        onClick={() => {
                          setPaymentMethod('Cash')
                          setShowDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Cash
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedDriver(driver)}
                  className="px-6 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 transition"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
