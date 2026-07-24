import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore'
import { DONATION_STATUSES } from '../common/constants'
import { db } from '../firebase/config'
import { sortDonationsNewestFirst } from '../utils/donorUtils'

const DONATIONS_COLLECTION = 'donations'
const EDITABLE_FIELDS = [
  'title',
  'category',
  'itemName',
  'quantity',
  'condition',
  'description',
  'pickupAddress',
  'city',
  'state',
  'postalCode',
  'imageUrl',
  'imagePath',
]

function donationReference(donationId) {
  if (!donationId) throw new Error('Donation ID is required.')
  return doc(db, DONATIONS_COLLECTION, donationId)
}

function assertEditable(donation, donorId) {
  if (donation.donorId !== donorId) {
    throw new Error('You do not have access to this donation.')
  }
  if (
    donation.status !== DONATION_STATUSES.UPLOADED ||
    donation.selectedOrganizationId !== null
  ) {
    throw new Error(
      'This donation can no longer be edited or deleted.',
    )
  }
}

export function generateDonationId() {
  return doc(collection(db, DONATIONS_COLLECTION)).id
}

export async function createDonation(
  donationId,
  donorId,
  donorProfile,
  donationData,
  selectedOrganizationId = null,
) {
  const baseDonationDocument = {
    donorId,
    donorName: donorProfile.name,
    donorEmail: donorProfile.email,
    ...Object.fromEntries(
      EDITABLE_FIELDS.map((field) => [field, donationData[field] ?? null]),
    ),
    status: DONATION_STATUSES.UPLOADED,
  }
  let selection = {
    selectedOrganizationId: null,
    selectedOrganizationName: null,
  }
  if (selectedOrganizationId) {
    const donationRef = donationReference(donationId)
    const organizationRef = doc(db, 'organizations', selectedOrganizationId)
    selection = await runTransaction(db, async (transaction) => {
      const organizationSnapshot = await transaction.get(organizationRef)
      if (!organizationSnapshot.exists()) {
        throw new Error('The selected organization is no longer available.')
      }
      const organization = organizationSnapshot.data()
      if (
        !Array.isArray(organization.categoriesAccepted) ||
        !organization.categoriesAccepted.includes(donationData.category)
      ) {
        throw new Error(
          'The selected organization does not accept this donation category.',
        )
      }
      const authoritativeSelection = {
        selectedOrganizationId,
        selectedOrganizationName: String(organization.name || '').trim(),
      }
      if (!authoritativeSelection.selectedOrganizationName) {
        throw new Error('The selected organization has an invalid profile.')
      }
      transaction.set(donationRef, {
        ...baseDonationDocument,
        ...authoritativeSelection,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return authoritativeSelection
    })
  } else {
    await setDoc(donationReference(donationId), {
      ...baseDonationDocument,
      ...selection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
  const donationDocument = { ...baseDonationDocument, ...selection }
  return {
    id: donationId,
    ...donationDocument,
    createdAt: null,
    updatedAt: null,
  }
}

export async function getDonorDonations(donorId) {
  const snapshot = await getDocs(
    query(
      collection(db, DONATIONS_COLLECTION),
      where('donorId', '==', donorId),
    ),
  )
  return sortDonationsNewestFirst(
    snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
  )
}

export async function getDonationById(donationId) {
  const snapshot = await getDoc(donationReference(donationId))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export async function updateDonation(donationId, donorId, updates) {
  const reference = donationReference(donationId)
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new Error('Donation not found.')
    const donation = snapshot.data()
    assertEditable(donation, donorId)
    const editableUpdates = Object.fromEntries(
      EDITABLE_FIELDS.filter((field) => field in updates).map((field) => [
        field,
        updates[field],
      ]),
    )
    transaction.update(reference, {
      ...editableUpdates,
      updatedAt: serverTimestamp(),
    })
    return { id: donationId, ...donation, ...editableUpdates }
  })
}

export async function deleteDonation(donationId, donorId) {
  const reference = donationReference(donationId)
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists()) throw new Error('Donation not found.')
    const donation = snapshot.data()
    assertEditable(donation, donorId)
    transaction.delete(reference)
    return { id: donationId, ...donation }
  })
}
