import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export async function POST(req) {
  try {
    const adminRef = doc(db, 'admins', 'lloydgutu')
    const adminSnap = await getDoc(adminRef)
    
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        username: 'lloydgutu',
        password: '@Ju571f13d!',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: null,
      })
      return Response.json({ success: true, message: 'Default admin created' })
    }
    
    return Response.json({ success: true, message: 'Admin already exists' })
  } catch (err) {
    console.error('Error initializing default admin:', err)
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}
