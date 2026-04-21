'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { PRICING_RANGE, DEFAULT_PRICE_PER_KM, formatPrice, isValidPrice } from '@/lib/pricing'

export default function DriverSettings() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [pricePerKm, setPricePerKm] = useState(DEFAULT_PRICE_PER_KM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [savedPrice, setSavedPrice] = useState(DEFAULT_PRICE_PER_KM)

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/welcome')
      return
    }

    // Load driver's saved pricing
    const loadDriverPricing = async () => {
      try {
        // In a real app, fetch from database
        const savedPricing = localStorage.getItem(`driver_pricing_${user.phone}`)
        if (savedPricing) {
          const price = parseFloat(savedPricing)
          setPricePerKm(price)
          setSavedPrice(price)
        }
      } catch (error) {
        console.error('Error loading pricing:', error)
      }
    }

    loadDriverPricing()
  }, [user, router])

  const handleSavePrice = async () => {
    setMessage('')

    // Validation
    if (!pricePerKm || isNaN(pricePerKm)) {
      setMessage('Please enter a valid price')
      return
    }

    if (!isValidPrice(pricePerKm)) {
      setMessage(
        `Price must be between ${formatPrice(PRICING_RANGE.min)} and ${formatPrice(PRICING_RANGE.max)} per km`
      )
      return
    }

    setLoading(true)
    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem(`driver_pricing_${user.phone}`, pricePerKm.toString())
      setSavedPrice(pricePerKm)
      setMessage('✅ Price saved successfully!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving price:', error)
      setMessage('❌ Error saving price. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetToDefault = () => {
    setPricePerKm(DEFAULT_PRICE_PER_KM)
    localStorage.removeItem(`driver_pricing_${user.phone}`)
    setSavedPrice(DEFAULT_PRICE_PER_KM)
    setMessage('✅ Reset to default price')
    setTimeout(() => setMessage(''), 3000)
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-6 pt-8">
        <button
          onClick={() => router.back()}
          className="text-2xl mb-4 hover:opacity-80 transition"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Pricing Settings</h1>
        <p className="text-orange-100 mt-2">Set your custom rate per kilometer</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Current Price Display */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Current Rate</p>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-4xl font-bold text-primary">{formatPrice(savedPrice)}</p>
            <p className="text-gray-600">per km</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">Default rate:</span> {formatPrice(DEFAULT_PRICE_PER_KM)}/km
            </p>
            <p className="text-xs text-blue-700 mt-1">
              You can customize your rate between {formatPrice(PRICING_RANGE.min)} and{' '}
              {formatPrice(PRICING_RANGE.max)} per km
            </p>
          </div>
        </div>

        {/* Price Input */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-semibold mb-3 text-sm">
            Set Your Price Per Kilometer
          </label>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg text-gray-600">$</span>
            <input
              type="number"
              step="0.01"
              min={PRICING_RANGE.min}
              max={PRICING_RANGE.max}
              value={pricePerKm}
              onChange={(e) => setPricePerKm(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-bold focus:outline-none focus:border-primary transition"
              placeholder="0.00"
            />
            <span className="text-lg text-gray-600">/km</span>
          </div>

          {/* Price Range Guide */}
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Minimum</span>
              <span className="text-gray-600">Maximum</span>
            </div>
            <input
              type="range"
              min={PRICING_RANGE.min}
              max={PRICING_RANGE.max}
              step="0.01"
              value={pricePerKm}
              onChange={(e) => setPricePerKm(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatPrice(PRICING_RANGE.min)}</span>
              <span>{formatPrice(PRICING_RANGE.max)}</span>
            </div>
          </div>

          {/* Estimated Earnings Example */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-xs text-gray-600 mb-2 font-semibold">Estimated Earnings Example</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-700">5 km trip</span>
                <span className="font-semibold">{formatPrice(pricePerKm * 5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">10 km trip</span>
                <span className="font-semibold">{formatPrice(pricePerKm * 10)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">20 km trip</span>
                <span className="font-semibold">{formatPrice(pricePerKm * 20)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-4 text-sm font-semibold ${
              message.includes('✅')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : message.includes('❌')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <button
          onClick={handleSavePrice}
          disabled={loading || pricePerKm === savedPrice}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-3"
        >
          {loading ? 'Saving...' : 'Save Price'}
        </button>

        <button
          onClick={handleResetToDefault}
          className="w-full py-4 bg-white border-2 border-gray-300 text-gray-800 rounded-xl font-bold text-base hover:bg-gray-50 transition"
        >
          Reset to Default
        </button>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-3">💡 How Pricing Works</h3>
          <ul className="text-xs text-gray-700 space-y-2">
            <li>✓ Your custom rate is used for all ride requests</li>
            <li>✓ Riders see your rate before booking</li>
            <li>✓ You can update your rate anytime</li>
            <li>✓ Higher competitive rates may get fewer requests</li>
            <li>✓ All rates must stay within the regulated range</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
