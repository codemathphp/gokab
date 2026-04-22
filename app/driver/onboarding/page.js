'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createDriverApplication } from '@/lib/firebaseServices'

export default function DriverOnboarding() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem('gokab_session')
    if (session) {
      setUser(JSON.parse(session))
    }
  }, [])
  const [step, setStep] = useState('vehicle')
  const [loading, setLoading] = useState(false)
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    vehicleType: '',
  })

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.push('/welcome')
    }
  }, [user, router])

  const handleVehicleSubmit = async () => {
    if (!vehicleData.brand || !vehicleData.licensePlate) {
      alert('Please fill in all vehicle details')
      return
    }

    setLoading(true)
    try {
      await createDriverApplication(user.phone, {
        ...vehicleData,
        status: 'pending_approval',
      })
      router.push('/driver/waiting-approval')
    } catch (error) {
      alert('Error submitting vehicle details: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVehicleChange = (field, value) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-6 pt-8">
        <h1 className="text-2xl font-bold">Driver Onboarding</h1>
        <p className="text-white text-opacity-90 mt-2">Complete your profile</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {step === 'vehicle' && (
          <div>
            <h2 className="text-xl font-bold text-secondary mb-6">Vehicle Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                <input
                  type="text"
                  placeholder="e.g., Toyota"
                  value={vehicleData.brand}
                  onChange={(e) => handleVehicleChange('brand', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Model</label>
                <input
                  type="text"
                  placeholder="e.g., Avanza"
                  value={vehicleData.model}
                  onChange={(e) => handleVehicleChange('model', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Year</label>
                <input
                  type="text"
                  placeholder="e.g., 2020"
                  value={vehicleData.year}
                  onChange={(e) => handleVehicleChange('year', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Color</label>
                <input
                  type="text"
                  placeholder="e.g., White"
                  value={vehicleData.color}
                  onChange={(e) => handleVehicleChange('color', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">License Plate</label>
                <input
                  type="text"
                  placeholder="e.g., ABC 1234"
                  value={vehicleData.licensePlate}
                  onChange={(e) => handleVehicleChange('licensePlate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Vehicle Type</label>
                <select
                  value={vehicleData.vehicleType}
                  onChange={(e) => handleVehicleChange('vehicleType', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleVehicleSubmit}
              disabled={loading}
              className="w-full mt-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
