import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { DONATION_STATUSES } from '../common/constants'
import { db } from '../firebase/config'
import { getTopOrganizationRecommendations } from '../utils/recommendationEngine'

export async function getRecommendationsForDonation(donation) {
  if (!donation?.category) throw new Error('Donation category is missing.')
  const snapshot = await getDocs(
    query(
      collection(db, 'organizations'),
      where('categoriesAccepted', 'array-contains', donation.category),
    ),
  )
  const organizations = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }))
  return getTopOrganizationRecommendations(donation, organizations, 3)
}

export async function selectOrganizationForDonation(
  donationId,
  donorId,
  organizationId,
) {
  const donationReference = doc(db, 'donations', donationId)
  const organizationReference = doc(db, 'organizations', organizationId)

  // Selection is a one-time transaction so eligibility cannot change between
  // reading the donation/organization and committing the assignment.
  return runTransaction(db, async (transaction) => {
    const donationSnapshot = await transaction.get(donationReference)
    if (!donationSnapshot.exists()) throw new Error('Donation not found.')
    const donation = donationSnapshot.data()
    if (donation.donorId !== donorId) {
      throw new Error('You do not have access to this donation.')
    }
    if (donation.status !== DONATION_STATUSES.UPLOADED) {
      throw new Error('This donation is no longer eligible for recommendations.')
    }
    if (donation.selectedOrganizationId !== null) {
      throw new Error(
        'This donation has already been assigned to an organization.',
      )
    }

    const organizationSnapshot = await transaction.get(organizationReference)
    if (!organizationSnapshot.exists()) {
      throw new Error('The selected organization was removed.')
    }
    const organization = organizationSnapshot.data()
    if (!String(organization.name || '').trim()) {
      throw new Error('The selected organization has an invalid profile.')
    }
    if (
      !Array.isArray(organization.categoriesAccepted) ||
      !organization.categoriesAccepted.includes(donation.category)
    ) {
      throw new Error(
        'The selected organization no longer accepts this donation category.',
      )
    }

    transaction.update(donationReference, {
      selectedOrganizationId: organizationId,
      selectedOrganizationName: organization.name,
      updatedAt: serverTimestamp(),
    })
    return {
      donationId,
      selectedOrganizationId: organizationId,
      selectedOrganizationName: organization.name,
      status: donation.status,
    }
  })
}
