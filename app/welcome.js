'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { generateVerificationCode, formatPhone } from '@/lib/utils'
import { createUser, getUser } from '@/lib/firebaseServices'
import { COUNTRIES } from '@/lib/countries'

export default function Welcome() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [step, setStep] = useState('terms') // terms, phone, verify, name
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [country, setCountry] = useState(COUNTRIES[1]) // Default to Zimbabwe
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
          setUser(userData)
          localStorage.setItem('gokab_session', JSON.stringify(userData))
          localStorage.setItem('gokab_device_sessions', JSON.stringify([
            {
              phone: formattedPhone,
              lastLogin: new Date().toISOString(),
              deviceId: localStorage.getItem('gokab_device_id') || 'unknown',
            },
          ]))
          console.log('Account found - logging in directly')
          await router.push(existingUser.role === 'driver' ? '/driver/dashboard' : '/rider/home')
          return
        }
      } catch (err) {
        console.log('Firebase check skipped, proceeding with new account')
      }
      
      // New account - generate verification code
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
    
    setLoading(false)
    setStep('name')
  }

  const handleNameSubmit = async () => {
    setError('')
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
        // Fallback: still allow login with localStorage only
      }
      
      const userData = { phone, name, role: defaultRole, isVerified: true }
      setUser(userData)
      
      // Persist session with device tracking
      localStorage.setItem('gokab_session', JSON.stringify(userData))
      localStorage.setItem('gokab_session_created', new Date().toISOString())
      localStorage.setItem('gokab_device_sessions', JSON.stringify([
        {
          phone,
          lastLogin: new Date().toISOString(),
          deviceId: localStorage.getItem('gokab_device_id'),
        },
      ]))
      
      console.log('User verified and session created')
      console.log('Redirecting to /rider/home')
      await router.push('/rider/home')
      console.log('Redirect completed')
    } catch (err) {
      console.error('Full error:', err)
      console.error('Error message:', err.message)
      setError(`Account activation failed. Please try again.`)
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
          country={country}
          setCountry={setCountry}
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

      {step === 'name' && (
        <NameInput
          name={name}
          setName={setName}
          onSubmit={handleNameSubmit}
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

function NameInput({ name, setName, onSubmit, error, loading }) {
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

      <h3 className="text-lg font-bold text-secondary mb-2 text-center">Complete Your Profile</h3>
      <p className="text-gray-600 text-sm mb-6 text-center">Please enter your full name to complete setup</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors text-gray-800 bg-white"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !name.trim()}
        className="w-full py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Setting up...' : 'Continue to Home'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Your name helps us provide better service
      </p>
    </div>
  )
}
