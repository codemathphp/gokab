'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generateVerificationCode, formatPhone } from '@/lib/utils'
import { createUser, getUser } from '@/lib/firebaseServices'
import { COUNTRIES } from '@/lib/countries'

export default function Welcome() {
  const router = useRouter()
  const [step, setStep] = useState('terms') // terms, phone, setup
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [country, setCountry] = useState(COUNTRIES[1]) // Default to Zimbabwe
  const [verificationCode, setVerificationCode] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Check if user already has a valid session on mount
  useEffect(() => {
    // Prevent multiple redirect attempts
    if (sessionStorage.getItem('gokab_redirecting')) {
      return
    }

    const session = localStorage.getItem('gokab_session')
    if (session) {
      try {
        const userData = JSON.parse(session)
        // Mark as redirecting to prevent infinite loop
        sessionStorage.setItem('gokab_redirecting', 'true')
        setIsRedirecting(true)
        const redirectPath = userData.role === 'driver' ? '/driver/dashboard' : '/rider/home'
        router.replace(redirectPath)
      } catch (err) {
        console.error('Failed to parse session:', err)
      }
    }
  }, [router])

  // Don't render form if redirecting
  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">Redirecting...</div>
      </div>
    )
  }

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
      const formattedPhone = formatPhone(phone, country.phone)
      
      // Check if account already exists
      try {
        const existingUser = await getUser(formattedPhone)
        if (existingUser) {
          // Account exists - log in directly without verification
          const userData = {
            phone: formattedPhone,
            name: existingUser.name || 'User',
            role: existingUser.role || 'rider',
            isVerified: true,
          }
          
          // Generate device ID if not exists
          if (!localStorage.getItem('gokab_device_id')) {
            const deviceId = 'device_' + Math.random().toString(36).substr(2, 9)
            localStorage.setItem('gokab_device_id', deviceId)
          }
          
          // Save to localStorage directly
          localStorage.setItem('gokab_session', JSON.stringify(userData))
          const deviceId = localStorage.getItem('gokab_device_id')
          localStorage.setItem('gokab_device_sessions', JSON.stringify([
            {
              phone: formattedPhone,
              lastLogin: new Date().toISOString(),
              deviceId: deviceId,
            },
          ]))
          
          console.log('Account found - logging in directly')
          const redirectPath = existingUser.role === 'driver' ? '/driver/dashboard' : '/rider/home'
          router.push(redirectPath)
          return
        }
      } catch (err) {
        console.log('Firebase check skipped, proceeding with new account')
      }
      
      // New account - generate verification code
      const code = generateVerificationCode()
      setVerificationCode(code)
      setPhone(formattedPhone)
      setEnteredCode('')
      setName('')
      setStep('setup')
    } catch (err) {
      console.error(err)
      setError('Please enter a valid phone number')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeVerify = async () => {
    setError('')
    
    // Validate code
    if (enteredCode !== verificationCode) {
      setError('Incorrect verification code. Please try again.')
      return
    }
    
    // Validate name
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }

    setLoading(true)
    try {
      const defaultRole = 'rider'
      console.log('Creating user with phone:', phone, 'and name:', name)
      
      // Generate device ID if not exists
      if (!localStorage.getItem('gokab_device_id')) {
        const deviceId = 'device_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('gokab_device_id', deviceId)
      }
      
      // Try to create in Firebase
      try {
        await createUser(phone, defaultRole, name)
        console.log('User created successfully in Firebase')
      } catch (firebaseErr) {
        console.warn('Firebase creation failed, using localStorage fallback:', firebaseErr.message)
      }
      
      const userData = { phone, name, role: defaultRole, isVerified: true }
      
      // Persist session with device tracking
      localStorage.setItem('gokab_session', JSON.stringify(userData))
      localStorage.setItem('gokab_session_created', new Date().toISOString())
      const deviceId = localStorage.getItem('gokab_device_id')
      localStorage.setItem('gokab_device_sessions', JSON.stringify([
        {
          phone,
          lastLogin: new Date().toISOString(),
          deviceId,
        },
      ]))
      
      console.log('User verified and session created')
      console.log('Redirecting to /rider/home')
      
      // Navigate after state update
      router.push('/rider/home')
    } catch (err) {
      console.error('Full error:', err)
      console.error('Error message:', err.message)
      setError(`Account activation failed. Please try again.`)
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
          country={country}
          setCountry={setCountry}
          onSubmit={handlePhoneSubmit}
          error={error}
          loading={loading}
        />
      )}

      {step === 'setup' && (
        <SetupPage
          phone={phone}
          verificationCode={verificationCode}
          enteredCode={enteredCode}
          setEnteredCode={setEnteredCode}
          name={name}
          setName={setName}
          onSubmit={handleCodeVerify}
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

function PhoneInput({ phone, setPhone, country, setCountry, onSubmit, error, loading }) {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

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

      {/* Country selector dropdown */}
      <div className="mb-6 relative">
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Select Country</label>
        <button
          type="button"
          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg flex items-center justify-between bg-white hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{country.flag}</span>
            <span className="text-gray-700 font-semibold">{country.name}</span>
            <span className="text-gray-600 text-sm">({country.phone})</span>
          </div>
          <span className="text-gray-600">▼</span>
        </button>

        {/* Dropdown menu */}
        {showCountryDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountry(c)
                  setShowCountryDropdown(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <span className="text-lg">{c.flag}</span>
                <span className="text-gray-700 font-semibold">{c.name}</span>
                <span className="text-gray-600 text-sm ml-auto">({c.phone})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Phone number input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
        <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3 focus-within:border-primary transition-colors">
          <span className="text-lg mr-3">{country.flag}</span>
          <span className="text-gray-700 font-semibold text-sm mr-2">{country.phone}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={country.placeholder}
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

function SetupPage({ phone, verificationCode, enteredCode, setEnteredCode, name, setName, onSubmit, error, loading }) {
  const handleCodeChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setEnteredCode(numericValue)
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="/main_logo.png"
          alt="goKab"
          className="w-32 h-20 mx-auto object-contain"
        />
      </div>

      <h3 className="text-lg font-bold text-secondary mb-2 text-center">Account Setup</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">Verify your code and complete your profile</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      {/* Verification Code Display - Reduced Size */}
      <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center">
        <p className="text-gray-600 text-xs mb-1">Verification Code</p>
        <p className="text-xl font-bold text-primary tracking-wide">{verificationCode}</p>
      </div>

      {/* Code Input */}
      <div className="mb-5">
        <label className="block text-gray-700 font-semibold mb-2 text-xs">Enter Code</label>
        <input
          type="text"
          value={enteredCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="000000"
          maxLength="6"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-center text-lg font-semibold tracking-wider text-gray-800 bg-white"
        />
      </div>

      {/* Name Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-xs">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-gray-800 bg-white"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || enteredCode.length !== 6 || !name.trim()}
        className="w-full py-3 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Setting up...' : 'Continue to App'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Both fields are required to continue
      </p>
    </div>
  )
}
