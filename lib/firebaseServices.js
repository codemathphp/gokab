import { db } from './firebase'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore'

// Users
export const createUser = async (phone, role) => {
  const userRef = doc(db, 'users', phone)
  await setDoc(userRef, {
    phone,
    role,
    sessionActive: true,
    createdAt: new Date(),
    lastLogin: new Date(),
  })
}

export const getUser = async (phone) => {
  const userRef = doc(db, 'users', phone)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const updateUserLocation = async (phone, location) => {
  const userRef = doc(db, 'users', phone)
  await updateDoc(userRef, {
    location,
    lastLocationUpdate: new Date(),
  })
}

// Drivers
export const createDriverApplication = async (phone, data) => {
  const appRef = doc(collection(db, 'driverApplications'), phone)
  await setDoc(appRef, {
    phone,
    ...data,
    status: 'pending',
    createdAt: new Date(),
  })
}

export const getDriver = async (phone) => {
  const driverRef = doc(db, 'drivers', phone)
  const driverSnap = await getDoc(driverRef)
  return driverSnap.exists() ? driverSnap.data() : null
}

export const updateDriverStatus = async (phone, online) => {
  const driverRef = doc(db, 'drivers', phone)
  await updateDoc(driverRef, {
    online,
    lastStatusUpdate: new Date(),
  })
}

export const getNearbyDrivers = async (location, radiusKm = 5) => {
  // Basic query - in production use geohash or geopoint
  const driversRef = collection(db, 'drivers')
  const q = query(driversRef, where('online', '==', true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Rides
export const createRide = async (riderId, data) => {
  const rideRef = doc(collection(db, 'rides'))
  await setDoc(rideRef, {
    riderId,
    ...data,
    status: 'searching',
    createdAt: new Date(),
  })
  return rideRef.id
}

export const updateRideStatus = async (rideId, status, updates = {}) => {
  const rideRef = doc(db, 'rides', rideId)
  await updateDoc(rideRef, {
    status,
    ...updates,
    updatedAt: new Date(),
  })
}

export const getRide = async (rideId) => {
  const rideRef = doc(db, 'rides', rideId)
  const rideSnap = await getDoc(rideRef)
  return rideSnap.exists() ? rideSnap.data() : null
}

export const getPendingRides = async () => {
  const ridesRef = collection(db, 'rides')
  const q = query(ridesRef, where('status', '==', 'searching'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Admin - Approve Driver
export const approveDriver = async (phone, vehicleData) => {
  const userRef = doc(db, 'users', phone)
  const driverRef = doc(db, 'drivers', phone)

  await updateDoc(userRef, { approved: true })
  await setDoc(driverRef, {
    phone,
    status: 'approved',
    online: false,
    vehicleData,
    createdAt: new Date(),
  })
}

export const rejectDriver = async (phone) => {
  const appRef = doc(db, 'driverApplications', phone)
  await updateDoc(appRef, {
    status: 'rejected',
    rejectedAt: new Date(),
  })
}
