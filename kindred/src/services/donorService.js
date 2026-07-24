import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { USER_ROLES } from '../common/constants'
import { db } from '../firebase/config'

const USERS_COLLECTION = 'users'
const EDITABLE_FIELDS = ['name', 'phone', 'address', 'city', 'state', 'postalCode']

export async function getDonorProfile(uid) {
  if (!uid) throw new Error('An authenticated donor is required.')
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid))
  if (!snapshot.exists()) throw new Error('Donor profile not found.')
  const profile = snapshot.data()
  if (profile.role !== USER_ROLES.DONOR || profile.uid !== uid) {
    throw new Error('This account is not authorized for donor features.')
  }
  return profile
}

export async function updateDonorProfile(uid, profileData) {
  await getDonorProfile(uid)
  const updates = Object.fromEntries(
    EDITABLE_FIELDS.map((field) => [field, profileData[field]]),
  )
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
  return getDonorProfile(uid)
}
