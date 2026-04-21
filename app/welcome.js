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
    
    // Validate the entered code matches the generated code
    if (enteredCode !== verificationCode) {
      setError('Incorrect verification code. Please try again.')
      return
    }
    
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
          verificationCode={verificationCode}
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
        <img
          src="/main_logo.png"
          alt="goKab"
          className="w-32 h-20 mx-auto mb-2 object-contain"
        />
      </div>

      {/* Placeholder area */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-8"></div>

      {/* Content */}
      
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
        <img
          src="/main_logo.png"
          alt="goKab"
          className="w-32 h-20 mx-auto mb-2 object-contain"
        />
      </div>

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
        Your number is safe with us
      </p>
    </div>
  )
}

function VerifyCode({ phone, verificationCode, onVerify, error, loading }) {
  const [code, setCode] = useState('')

  const handleCodeChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setCode(numericValue)
  }

  const handleVerify = () => {
    onVerify(code)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 text-center">
        <img
          src="/main_logo.png"
          alt="goKab"
          className="w-32 h-20 mx-auto object-contain"
        />
      </div>

      <h3 className="text-lg font-bold text-secondary mb-2 text-center">Activate Your Account</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">Enter the verification code to activate your account</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      {/* Display the verification code */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
        <p className="text-gray-600 text-xs mb-2">Your Verification Code</p>
        <p className="text-3xl font-bold text-primary tracking-wider">{verificationCode}</p>
      </div>

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
        Enter the 6-digit code above to verify
      </p>

      <button
        onClick={handleVerify}
        disabled={loading || code.length !== 6}
        className="w-full py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Activating...' : 'Activate Account'}
      </button>
    </div>
  )
}
