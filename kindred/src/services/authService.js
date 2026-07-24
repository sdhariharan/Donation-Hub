import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { assertFirebaseConfigured, auth } from '../firebase/config'

export async function configureAuthPersistence() {
  assertFirebaseConfigured()
  await setPersistence(auth, browserLocalPersistence)
}

export function subscribeToAuthChanges(callback, onError) {
  assertFirebaseConfigured()
  return onAuthStateChanged(auth, callback, onError)
}

export async function createAuthAccount(email, password) {
  assertFirebaseConfigured()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function loginWithEmailAndPassword(email, password) {
  assertFirebaseConfigured()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logoutAuthenticatedUser() {
  assertFirebaseConfigured()
  await signOut(auth)
}

export async function deleteAuthenticatedUser(user) {
  assertFirebaseConfigured()
  await deleteUser(user)
}
