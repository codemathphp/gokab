'use client'

import { useState, useEffect, useRef } from 'react'
import { FiMapPin, FiClock } from 'react-icons/fi'

export default function AddressAutocomplete({ 
  value, 
  onChange, 
  onSelect, 
  placeholder = "Enter address",
  recentLocations = [],
  showRecent = true
}) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Debounced autocomplete search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value && value.length > 2) {
        searchAddresses(value)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  const searchAddresses = async (query) => {
    setLoading(true)
    try {
      // Use Google Places API through your backend
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.predictions) {
        setSuggestions(data.predictions)
      }
    } catch (error) {
      console.error('Address search error:', error)
      // Fallback: just show recent locations if API fails
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.description)
    onSelect({
      address: suggestion.description,
      lat: suggestion.lat,
      lng: suggestion.lng,
      placeId: suggestion.place_id,
    })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSelectRecent = (location) => {
    onChange(location.address)
    onSelect(location)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const displaySuggestions = showSuggestions && (suggestions.length > 0 || (showRecent && recentLocations.length > 0))

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => {
          if (value || recentLocations.length > 0) {
            setShowSuggestions(true)
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition"
      />

      {/* Suggestions Dropdown */}
      {displaySuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* API Suggestions */}
          {suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                >
                  <FiMapPin className="text-gray-400 flex-shrink-0 mt-1" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {suggestion.main_text}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.secondary_text}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Recent Locations */}
          {showRecent && suggestions.length === 0 && recentLocations.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Recent</p>
              </div>
              {recentLocations.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRecent(location)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                >
                  <FiClock className="text-gray-400 flex-shrink-0 mt-1" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {location.address}
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {loading && (
            <div className="px-4 py-6 text-center text-gray-500">
              <p className="text-sm">Searching locations...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
