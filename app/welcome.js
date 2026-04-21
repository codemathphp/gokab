'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { generateVerificationCode, formatPhone } from '@/lib/utils'
import { createUser, getUser } from '@/lib/firebaseServices'

export default function Welcome() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState('role') // role, phone, verify
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep('phone')
  }

  const handlePhoneSubmit = async () => {
    setError('')
    if (!phone.trim()) {
      setError('Please enter a phone number')
      return
    }

    setLoading(true)
    try {
      const formattedPhone = formatPhone(phone)
      const existingUser = await getUser(formattedPhone)

      if (existingUser && existingUser.role === role) {
        // User exists, proceed to verification
        const code = generateVerificationCode()
        setVerificationCode(code)
        setPhone(formattedPhone)
        setStep('verify')
      } else if (!existingUser) {
        // New user
        const code = generateVerificationCode()
        setVerificationCode(code)
        setPhone(formattedPhone)
        setStep('verify')
      } else {
        setError('This phone number is already registered with a different role')
      }
    } catch (err) {
      console.error(err)
      setError('Please enter a valid phone number')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeVerify = async (enteredCode) => {
    setError('')
    if (enteredCode === verificationCode) {
      setLoading(true)
      try {
        await createUser(phone, role)
        const userData = { phone, role }
        setUser(userData)
        localStorage.setItem('gokab_session', JSON.stringify(userData))

        if (role === 'driver') {
          router.push('/driver/onboarding')
        } else if (role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/rider/home')
        }
      } catch (err) {
        setError('Error creating account')
        console.error(err)
      } finally {
        setLoading(false)
      }
    } else {
      setError('Invalid code. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {step === 'role' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {step === 'phone' && (
        <PhoneInput
          phone={phone}
          setPhone={setPhone}
          onSubmit={handlePhoneSubmit}
          onBack={() => setStep('role')}
          error={error}
          loading={loading}
        />
      )}

      {step === 'verify' && (
        <VerifyCode
          phone={phone}
          onVerify={handleCodeVerify}
          onBack={() => setStep('phone')}
          error={error}
          loading={loading}
        />
      )}
    </div>
  )
}

function RoleSelection({ onRoleSelect }) {
  return (
    <div className="w-full max-w-sm text-center">
      {/* Logo */}
      <div className="mb-8">
        <svg
          className="w-16 h-16 mx-auto mb-2"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="30" r="8" fill="#FF7A3D" />
          <circle cx="50" cy="30" r="12" fill="none" stroke="#FF7A3D" strokeWidth="1" />
          <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="50" r="4" fill="#2D2D2D" />
          <circle cx="60" cy="50" r="4" fill="#2D2D2D" />
        </svg>
        <h1 className="text-3xl font-bold text-secondary mt-2">goKab</h1>
        <p className="text-gray-500 text-xs mt-1">Travel in Smart Style</p>
      </div>

      <h2 className="text-xl font-bold text-secondary mb-1">Get Started</h2>
      <p className="text-gray-600 text-sm mb-6">Choose your role</p>

      <button
        onClick={() => onRoleSelect('rider')}
        className="w-full py-3 mb-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors"
      >
        Book a Ride
      </button>

      <button
        onClick={() => onRoleSelect('driver')}
        className="w-full py-3 mb-3 bg-secondary text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
      >
        Become a Driver
      </button>

      <button
        onClick={() => onRoleSelect('admin')}
        className="w-full py-3 bg-gray-300 text-secondary rounded-lg font-semibold text-sm hover:bg-gray-400 transition-colors"
      >
        Admin Access
      </button>
    </div>
  )
}

function PhoneInput({ phone, setPhone, onSubmit, onBack, error, loading }) {
  return (
    <div className="w-full max-w-sm">
      <button
        onClick={onBack}
        className="text-gray-600 text-sm font-semibold mb-6 hover:text-gray-800"
      >
        ← Back
      </button>

      {/* Logo */}
      <div className="mb-6 text-center">
        <svg
          className="w-14 h-14 mx-auto mb-1"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="30" r="8" fill="#FF7A3D" />
          <circle cx="50" cy="30" r="12" fill="none" stroke="#FF7A3D" strokeWidth="1" />
          <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="50" r="4" fill="#2D2D2D" />
          <circle cx="60" cy="50" r="4" fill="#2D2D2D" />
        </svg>
        <h2 className="text-2xl font-bold text-secondary">goKab</h2>
        <p className="text-gray-500 text-xs mt-0.5">Travel in Smart Style</p>
      </div>

      <h3 className="text-lg font-bold text-secondary mb-1">Enter Mobile Number</h3>
      <p className="text-gray-600 text-sm mb-6">Enter your mobile number to get started with GoKab. We'll send a verification code to this number.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Country code and input */}
      <div className="mb-4">
        <label className="text-gray-700 text-xs font-semibold mb-2 block">Phone Number</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <div className="px-3 py-2.5 bg-gray-50 border-r border-gray-300 flex items-center">
            <span className="text-lg mr-2">🇿🇼</span>
            <span className="text-gray-700 font-semibold text-sm">+263</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 123 4567"
            className="flex-1 px-3 py-2.5 focus:outline-none text-sm font-semibold text-gray-800"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:opacity-60 transition-colors mt-2"
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Your number is safe with us · Standard SMS rates may apply
      </p>
    </div>
  )
}

function VerifyCode({ phone, onVerify, onBack, error, loading }) {
  const [code, setCode] = useState('')

  const handleCodeChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setCode(numericValue)
    if (numericValue.length === 6) {
      onVerify(numericValue)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <button
        onClick={onBack}
        className="text-gray-600 text-sm font-semibold mb-6 hover:text-gray-800"
      >
        ← Back
      </button>

      {/* Logo */}
      <div className="mb-6 text-center">
        <svg
          className="w-14 h-14 mx-auto mb-1"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="30" r="8" fill="#FF7A3D" />
          <circle cx="50" cy="30" r="12" fill="none" stroke="#FF7A3D" strokeWidth="1" />
          <path d="M30 50 L70 50 M30 60 L70 60" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="50" r="4" fill="#2D2D2D" />
          <circle cx="60" cy="50" r="4" fill="#2D2D2D" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-secondary mb-1">Verify Your Number</h3>
      <p className="text-gray-600 text-sm mb-6">We've sent a verification code to {phone}. Enter it below to continue.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="text-gray-700 text-xs font-semibold mb-2 block">Verification Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="000000"
          maxLength="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-center text-2xl font-bold tracking-wider text-gray-800"
        />
      </div>

      <p className="text-gray-500 text-xs text-center mb-4">
        Code automatically verified when complete
      </p>

      <button
        onClick={() => onVerify(code)}
        disabled={loading || code.length !== 6}
        className="w-full py-3 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  )
}
