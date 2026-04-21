'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { generateVerificationCode, formatPhoneNumber } from '@/lib/utils'
import { createUser, getUser } from '@/lib/firebaseServices'
import Link from 'next/link'

export default function Welcome() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState('role') // role, phone, verify
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [displayCode, setDisplayCode] = useState('')
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
      const formattedPhone = formatPhoneNumber(phone)
      const existingUser = await getUser(formattedPhone)

      if (existingUser && existingUser.role === role) {
        // User exists, proceed to verification
        const code = generateVerificationCode()
        setVerificationCode(code)
        setDisplayCode(code)
        setPhone(formattedPhone)
        setStep('verify')
      } else if (!existingUser) {
        // New user
        const code = generateVerificationCode()
        setVerificationCode(code)
        setDisplayCode(code)
        setPhone(formattedPhone)
        setStep('verify')
      } else {
        setError('This phone number is already registered with a different role')
      }
    } catch (err) {
      setError('Error processing phone number')
      console.error(err)
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
      setError('Invalid verification code')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-orange-500">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo */}
        <div className="mb-12 text-center">
          <img src="/main_logo.png" alt="GoKab" className="w-32 h-32 mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-bold text-white">goKab</h1>
          <p className="text-white text-opacity-90 mt-2">Travel in Smart Style</p>
        </div>

        {/* Content */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
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
              displayCode={displayCode}
              onVerify={handleCodeVerify}
              onBack={() => setStep('phone')}
              error={error}
              loading={loading}
            />
          )}
        </div>

        <div className="mt-8 text-center text-white text-sm">
          <p>Your account is safe with us</p>
        </div>
      </div>
    </div>
  )
}

function RoleSelection({ onRoleSelect }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-secondary mb-2">Get Started</h2>
      <p className="text-gray-600 mb-8">Choose your role to continue</p>

      <button
        onClick={() => onRoleSelect('rider')}
        className="w-full py-4 mb-4 bg-primary text-white rounded-2xl font-semibold text-lg hover:bg-primary-dark transition-colors"
      >
        🛵 Book a Ride
      </button>

      <button
        onClick={() => onRoleSelect('driver')}
        className="w-full py-4 mb-4 bg-secondary text-white rounded-2xl font-semibold text-lg hover:bg-gray-700 transition-colors"
      >
        🚕 Become a Driver
      </button>

      <button
        onClick={() => onRoleSelect('admin')}
        className="w-full py-4 bg-gray-300 text-secondary rounded-2xl font-semibold text-lg hover:bg-gray-400 transition-colors"
      >
        ⚙️ Admin Access
      </button>
    </div>
  )
}

function PhoneInput({ phone, setPhone, onSubmit, onBack, error, loading }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-primary text-sm font-semibold mb-4 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-secondary mb-2">Enter Phone Number</h2>
      <p className="text-gray-600 mb-6 text-sm">We'll verify your account with a code</p>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+263 77 123 4567"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none text-gray-800"
        />
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>
    </div>
  )
}

function VerifyCode({ displayCode, onVerify, onBack, error, loading }) {
  const [code, setCode] = useState('')

  const handleCodeChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setCode(numericValue)
    if (numericValue.length === 6) {
      onVerify(numericValue)
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-primary text-sm font-semibold mb-4 hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-secondary mb-2">Verify Account</h2>
      <p className="text-gray-600 mb-6 text-sm">Enter the code shown below</p>

      {/* Display Code Box */}
      <div className="bg-primary bg-opacity-10 border-2 border-primary rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-600 text-sm mb-2">Your Verification Code</p>
        <p className="text-4xl font-bold text-primary tracking-widest">{displayCode}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Enter Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="000000"
          maxLength="6"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none text-center text-2xl font-bold tracking-widest"
        />
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center mt-4">
        Code automatically verified when you enter 6 digits
      </p>
    </div>
  )
}
