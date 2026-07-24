import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const USERS_COLLECTION = 'users'

export async function createUserProfile({ uid, name, email, role }) {
  const profileReference = doc(db, USERS_COLLECTION, uid)

  await setDoc(profileReference, {
    uid,
    name,
    email,
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return getUserProfile(uid)
}

export async function getUserProfile(uid) {
  const profileSnapshot = await getDoc(doc(db, USERS_COLLECTION, uid))
  return profileSnapshot.exists() ? profileSnapshot.data() : null
}
