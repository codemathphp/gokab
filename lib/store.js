import { create } from 'zustand'

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  sessionPersisted: false,
  
  initSession: () => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('gokab_session')
      const sessionCreated = localStorage.getItem('gokab_session_created')
      
      // Session persists indefinitely until manually cleared
      set({ 
        user: session ? JSON.parse(session) : null,
        sessionPersisted: !!session,
        loading: false 
      })
      
      if (session) {
        console.log('Session restored from storage (created:', sessionCreated, ')')
      }
    }
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gokab_session', JSON.stringify(user))
      localStorage.setItem('gokab_session_created', new Date().toISOString())
      localStorage.setItem('gokab_session_last_activity', new Date().toISOString())
      
      // Update device sessions
      const deviceId = localStorage.getItem('gokab_device_id') || ('device_' + Math.random().toString(36).substr(2, 9))
      localStorage.setItem('gokab_device_id', deviceId)
      
      const deviceSessions = JSON.parse(localStorage.getItem('gokab_device_sessions') || '[]')
      const existingIndex = deviceSessions.findIndex(s => s.phone === user.phone)
      
      if (existingIndex !== -1) {
        deviceSessions[existingIndex].lastLogin = new Date().toISOString()
      } else {
        deviceSessions.push({
          phone: user.phone,
          lastLogin: new Date().toISOString(),
          deviceId,
        })
      }
      
      localStorage.setItem('gokab_device_sessions', JSON.stringify(deviceSessions))
    }
    set({ user, sessionPersisted: true })
  },

  updateLastActivity: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gokab_session_last_activity', new Date().toISOString())
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gokab_session')
      localStorage.removeItem('gokab_session_created')
      localStorage.removeItem('gokab_session_last_activity')
      // Keep device sessions and device ID for future logins
    }
    set({ user: null, sessionPersisted: false })
  },

  clearAllSessions: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gokab_session')
      localStorage.removeItem('gokab_session_created')
      localStorage.removeItem('gokab_session_last_activity')
      localStorage.removeItem('gokab_device_id')
      localStorage.removeItem('gokab_device_sessions')
    }
    set({ user: null, sessionPersisted: false })
  },
}))

// Ride Store
export const useRideStore = create((set) => ({
  currentRide: null,
  rideHistory: [],
  nearbyDrivers: [],

  setCurrentRide: (ride) => set({ currentRide: ride }),
  setRideHistory: (history) => set({ rideHistory: history }),
  setNearbyDrivers: (drivers) => set({ nearbyDrivers: drivers }),
  clearCurrentRide: () => set({ currentRide: null }),
}))

// Driver Store
export const useDriverStore = create((set) => ({
  driverStatus: 'offline',
  currentRide: null,
  rideRequests: [],
  driverStats: { earnings: 0, rides: 0, rating: 0 },

  setDriverStatus: (status) => set({ driverStatus: status }),
  setCurrentRide: (ride) => set({ currentRide: ride }),
  addRideRequest: (request) => set((state) => ({
    rideRequests: [...state.rideRequests, request],
  })),
  clearRideRequest: (rideId) => set((state) => ({
    rideRequests: state.rideRequests.filter((r) => r.id !== rideId),
  })),
  setDriverStats: (stats) => set({ driverStats: stats }),
}))

// Location Store
export const useLocationStore = create((set) => ({
  userLocation: null,
  pickup: null,
  dropoff: null,

  setUserLocation: (location) => set({ userLocation: location }),
  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  clearLocation: () => set({ userLocation: null, pickup: null, dropoff: null }),
}))

// Admin Store
export const useAdminStore = create((set) => ({
  pendingDrivers: [],
  allUsers: [],
  stats: {},

  setPendingDrivers: (drivers) => set({ pendingDrivers: drivers }),
  setAllUsers: (users) => set({ allUsers: users }),
  setStats: (stats) => set({ stats }),
}))
