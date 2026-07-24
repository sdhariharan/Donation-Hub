import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import {
  createEmptyInventory,
  normalizeInventory,
} from '../utils/organizationUtils'

const ORGANIZATIONS_COLLECTION = 'organizations'
const PROFILE_FIELDS = [
  'name',
  'description',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postalCode',
  'categoriesAccepted',
]

function organizationReference(uid) {
  if (!uid) throw new Error('An authenticated organization user is required.')
  return doc(db, ORGANIZATIONS_COLLECTION, uid)
}

function selectProfileFields(data) {
  return Object.fromEntries(PROFILE_FIELDS.map((field) => [field, data[field]]))
}

function verifyOwnership(organization, uid) {
  if (organization.ownerId !== uid) {
    throw new Error('You do not have permission to modify this organization.')
  }
}

function createNeedId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `need-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
}

export async function getOrganizationByOwnerId(uid) {
  const snapshot = await getDoc(organizationReference(uid))
  if (!snapshot.exists()) return null
  const organization = snapshot.data()
  verifyOwnership(organization, uid)
  return organization
}

export async function createOrganizationProfile(uid, data) {
  const profile = selectProfileFields(data)
  await setDoc(organizationReference(uid), {
    ownerId: uid,
    ...profile,
    inventory: createEmptyInventory(),
    needs: [],
    trustScore: 70,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return getOrganizationByOwnerId(uid)
}

export async function updateOrganizationProfile(uid, data) {
  await updateDoc(organizationReference(uid), {
    ...selectProfileFields(data),
    updatedAt: serverTimestamp(),
  })
  return getOrganizationByOwnerId(uid)
}

export async function saveOrganizationProfile(uid, data) {
  const existing = await getOrganizationByOwnerId(uid)
  return existing
    ? updateOrganizationProfile(uid, data)
    : createOrganizationProfile(uid, data)
}

export async function updateOrganizationInventory(uid, inventory) {
  const reference = organizationReference(uid)
  const existing = await getOrganizationByOwnerId(uid)
  if (!existing) {
    throw new Error('Complete the organization profile before saving inventory.')
  }

  await updateDoc(reference, {
    inventory: normalizeInventory(inventory),
    updatedAt: serverTimestamp(),
  })
  return getOrganizationByOwnerId(uid)
}

export async function addOrganizationNeed(uid, need) {
  const reference = organizationReference(uid)
  // A transaction prevents concurrent need edits from silently overwriting the
  // organization-owned needs array.
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) {
      throw new Error('Complete the organization profile before adding needs.')
    }
    const organization = snapshot.data()
    verifyOwnership(organization, uid)
    const now = new Date().toISOString()
    const createdNeed = {
      ...need,
      id: createNeedId(),
      createdAt: now,
      updatedAt: now,
    }
    const needs = [...(organization.needs || []), createdNeed]
    transaction.update(reference, { needs, updatedAt: serverTimestamp() })
    return needs
  })
}

export async function updateOrganizationNeed(uid, needId, updates) {
  const reference = organizationReference(uid)
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new Error('Organization profile not found.')
    const organization = snapshot.data()
    verifyOwnership(organization, uid)
    let found = false
    const needs = (organization.needs || []).map((need) => {
      if (need.id !== needId) return need
      found = true
      return { ...need, ...updates, id: need.id, updatedAt: new Date().toISOString() }
    })
    if (!found) throw new Error('The requested need no longer exists.')
    transaction.update(reference, { needs, updatedAt: serverTimestamp() })
    return needs
  })
}

export async function deleteOrganizationNeed(uid, needId) {
  const reference = organizationReference(uid)
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new Error('Organization profile not found.')
    const organization = snapshot.data()
    verifyOwnership(organization, uid)
    const needs = (organization.needs || []).filter(
      (need) => need.id !== needId,
    )
    if (needs.length === (organization.needs || []).length) {
      throw new Error('The requested need no longer exists.')
    }
    transaction.update(reference, { needs, updatedAt: serverTimestamp() })
    return needs
  })
}
