import { create } from 'zustand'

// Auth Store
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  initSession: () => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('gokab_session')
      set({ 
        user: session ? JSON.parse(session) : null, 
        loading: false 
      })
    }
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gokab_session', JSON.stringify(user))
    }
    set({ user })
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gokab_session')
    }
    set({ user: null })
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
