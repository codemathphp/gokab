'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { DEFAULT_PRICE_PER_KM } from '@/lib/pricing'
import { FiClipboard, FiCheck, FiAlertCircle } from 'react-icons/fi'

export default function AdminPricing() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [minPrice, setMinPrice] = useState(0.50)
  const [maxPrice, setMaxPrice] = useState(3.00)
  const [defaultPrice, setDefaultPrice] = useState(DEFAULT_PRICE_PER_KM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/welcome')
      return
    }

    // Load current pricing settings
    const loadPricingSettings = async () => {
      try {
        // In a real app, fetch from database
        const savedSettings = localStorage.getItem('app_pricing_settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setMinPrice(settings.min || 0.50)
          setMaxPrice(settings.max || 3.00)
          setDefaultPrice(settings.default || DEFAULT_PRICE_PER_KM)
        }
      } catch (error) {
        console.error('Error loading pricing settings:', error)
      }
    }

    loadPricingSettings()
  }, [user, router])

  const validateSettings = () => {
    if (minPrice < 0) {
      setMessage('Minimum price cannot be negative')
      return false
    }

    if (maxPrice <= minPrice) {
      setMessage('Maximum price must be greater than minimum price')
      return false
    }

    if (defaultPrice < minPrice || defaultPrice > maxPrice) {
      setMessage('Default price must be between minimum and maximum')
      return false
    }

    return true
  }

  const handleSaveSettings = async () => {
    setMessage('')

    if (!validateSettings()) {
      return
    }

    setLoading(true)
    try {
      const settings = {
        min: parseFloat(minPrice),
        max: parseFloat(maxPrice),
        default: parseFloat(defaultPrice),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage (in real app, save to database)
      localStorage.setItem('app_pricing_settings', JSON.stringify(settings))

      setMessage('✅ Pricing settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('❌ Error saving settings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-gray-700 text-white p-6 pt-8">
        <button
          onClick={() => router.back()}
          className="text-2xl mb-4 hover:opacity-80 transition"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Pricing Management</h1>
        <p className="text-gray-100 mt-2">Set platform-wide pricing boundaries for drivers</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Overview Card */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-800 mb-4">Current Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Minimum</p>
              <p className="text-2xl font-bold text-blue-600">${minPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">/km</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Default</p>
              <p className="text-2xl font-bold text-green-600">${defaultPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">/km</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
              <p className="text-xs text-gray-600 mb-1">Maximum</p>
              <p className="text-2xl font-bold text-orange-600">${maxPrice.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">/km</p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="font-bold text-gray-800 mb-6">Configure Pricing Range</h2>

          {/* Minimum Price */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Minimum Price Per Kilometer</label>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-secondary transition"
              />
              <span className="text-lg text-gray-600">/km</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Drivers cannot set prices lower than this</p>
          </div>

          {/* Default Price */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Default Price Per Kilometer</label>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">$</span>
              <input
                type="number"
                step="0.01"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-secondary transition"
              />
              <span className="text-lg text-gray-600">/km</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Used when drivers don't set a custom price</p>
          </div>

          {/* Maximum Price */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Maximum Price Per Kilometer</label>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">$</span>
              <input
                type="number"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold focus:outline-none focus:border-secondary transition"
              />
              <span className="text-lg text-gray-600">/km</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Drivers cannot set prices higher than this</p>
          </div>

          {/* Validation Message */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-4 text-sm font-semibold ${
                message.includes('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full py-4 bg-secondary text-white rounded-lg font-bold text-base hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Price Impact Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Price Impact Analysis</h2>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">5 km Trip Earnings</p>
              <p className="text-2xl font-bold text-green-600">${(defaultPrice * 5).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">At default rate</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">10 km Trip Earnings</p>
              <p className="text-2xl font-bold text-green-600">${(defaultPrice * 10).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">At default rate</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">20 km Trip Earnings</p>
              <p className="text-2xl font-bold text-green-600">${(defaultPrice * 20).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">At default rate</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiClipboard className="text-blue-600" size={20} />
            <h3 className="font-bold text-gray-800">Pricing Strategy Guide</h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-2"><FiCheck size={18} className="text-green-600 flex-shrink-0" /> <span><span className="font-semibold">Minimum:</span> Lower prices attract more riders, increase driver volume</span></li>
            <li className="flex items-center gap-2"><FiCheck size={18} className="text-green-600 flex-shrink-0" /> <span><span className="font-semibold">Default:</span> Applied to all drivers who don't customize their rate</span></li>
            <li className="flex items-center gap-2"><FiCheck size={18} className="text-green-600 flex-shrink-0" /> <span><span className="font-semibold">Maximum:</span> Prevents price gouging during peak hours</span></li>
            <li className="flex items-center gap-2"><FiCheck size={18} className="text-green-600 flex-shrink-0" /> <span>Changes apply to future bookings, not active rides</span></li>
            <li className="flex items-center gap-2"><FiCheck size={18} className="text-green-600 flex-shrink-0" /> <span>Monitor driver satisfaction and adjust range if needed</span></li>
          </ul>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertCircle className="text-yellow-700" size={20} />
            <h3 className="font-bold text-yellow-800">Important</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Changes to pricing settings will affect all future ride requests. Existing active rides will maintain their original pricing.
          </p>
        </div>
      </div>
    </div>
  )
}
