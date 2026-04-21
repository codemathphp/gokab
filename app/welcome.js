'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { generateVerificationCode, formatPhone } from '@/lib/utils'
import { createUser, getUser } from '@/lib/firebaseServices'

export default function Welcome() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState('terms') // terms, phone, verify
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTermsAccept = () => {
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
      
      // Generate verification code
      const code = generateVerificationCode()
      setVerificationCode(code)
      setPhone(formattedPhone)
      setStep('verify')
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
        const defaultRole = 'rider'
        await createUser(phone, defaultRole)
        const userData = { phone, role: defaultRole }
        setUser(userData)
        localStorage.setItem('gokab_session', JSON.stringify(userData))
        
        router.push('/rider/home')
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
      {step === 'terms' && (
        <TermsScreen onAccept={handleTermsAccept} />
      )}

      {step === 'phone' && (
        <PhoneInput
          phone={phone}
          setPhone={setPhone}
          onSubmit={handlePhoneSubmit}
          error={error}
          loading={loading}
        />
      )}

      {step === 'verify' && (
        <VerifyCode
          phone={phone}
          onVerify={handleCodeVerify}
          error={error}
          loading={loading}
        />
      )}
    </div>
  )
}

function TermsScreen({ onAccept }) {
  return (
    <div className="w-full max-w-sm flex flex-col">
      {/* Logo */}
      <div className="mb-8 text-center">
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

      {/* Placeholder area */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-8"></div>

      {/* Content */}
      <h2 className="text-2xl font-bold text-secondary mb-4 text-center">Welcome To GoKab</h2>
      
      <p className="text-gray-700 text-sm text-center mb-6">
        Please <span className="text-primary font-semibold">Read</span> through our{' '}
        <span className="text-primary font-semibold underline">Privacy Policy</span>. To start using{' '}
        <span className="font-semibold">GOKAB</span> Tap Agree and Continue to{' '}
        <span className="text-primary font-semibold underline">Agree to our Terms of Service</span>.
      </p>

      <button
        onClick={onAccept}
        className="w-full py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 transition-colors mt-auto mb-4"
      >
        Agree and Continue
      </button>
    </div>
  )
}

function PhoneInput({ phone, setPhone, onSubmit, error, loading }) {
  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 text-center">
        <svg
          className="w-14 h-14 mx-auto mb-2"
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
        <h2 className="text-2xl font-bold text-secondary mt-2">goKab</h2>
        <p className="text-gray-500 text-xs mt-1">Travel in Smart Style</p>
      </div>

      <h3 className="text-lg font-bold text-secondary mb-2 text-center">Enter Mobile Number</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">Enter your mobile number to get started with GoKab. We'll send a verification code to this number.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      {/* Country code and input */}
      <div className="mb-6">
        <div className="flex items-center border-b border-gray-300 pb-3">
          <span className="text-lg mr-3">🇿🇼</span>
          <span className="text-gray-700 font-semibold text-sm mr-2">+263</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="77 123 4567"
            className="flex-1 focus:outline-none text-sm font-semibold text-gray-800 bg-transparent"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Processing...' : 'Continue'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Your number is safe with us · Standard SMS rates may apply
      </p>
    </div>
  )
}

function VerifyCode({ phone, onVerify, error, loading }) {
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
      {/* Logo */}
      <div className="mb-8 text-center">
        <svg
          className="w-14 h-14 mx-auto mb-2"
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

      <h3 className="text-lg font-bold text-secondary mb-2 text-center">Verify Your Number</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">We've sent a verification code to {phone}. Enter it below to continue.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="000000"
          maxLength="6"
          className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-primary text-center text-2xl font-bold tracking-wider text-gray-800 bg-transparent"
        />
      </div>

      <p className="text-gray-500 text-xs text-center mb-6">
        Code automatically verified when complete
      </p>

      <button
        onClick={() => onVerify(code)}
        disabled={loading || code.length !== 6}
        className="w-full py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  )
}
