import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import {
  DONATION_STATUSES,
  USER_ROLES,
} from '../common/constants'
import { db } from '../firebase/config'
import {
  canTransitionDonationStatus,
  getNextDonationStatus,
} from '../utils/trackingUtils'

export async function getTrackingByDonationId(donationId) {
  const snapshot = await getDoc(doc(db, 'tracking', donationId))
  return snapshot.exists() ? snapshot.data() : null
}

export async function acceptDonation(donationId, organizationUid) {
  const donationReference = doc(db, 'donations', donationId)
  const trackingReference = doc(db, 'tracking', donationId)
  return runTransaction(db, async (transaction) => {
    const donationSnapshot = await transaction.get(donationReference)
    const trackingSnapshot = await transaction.get(trackingReference)
    if (!donationSnapshot.exists()) throw new Error('Assigned donation not found.')
    const donation = donationSnapshot.data()
    if (
      !donation.selectedOrganizationId ||
      donation.selectedOrganizationId !== organizationUid
    ) {
      throw new Error('This donation does not belong to your organization.')
    }
    if (donation.status !== DONATION_STATUSES.UPLOADED) {
      throw new Error('This donation has already been accepted or updated.')
    }
    if (trackingSnapshot.exists()) {
      throw new Error('Tracking already exists for this donation.')
    }

    const timestamp = Timestamp.now()
    const tracking = {
      donationId,
      donorId: donation.donorId,
      organizationId: organizationUid,
      currentStatus: DONATION_STATUSES.ACCEPTED,
      statusHistory: [
        {
          status: DONATION_STATUSES.UPLOADED,
          updatedBy: donation.donorId,
          updatedByRole: USER_ROLES.DONOR,
          timestamp,
        },
        {
          status: DONATION_STATUSES.ACCEPTED,
          updatedBy: organizationUid,
          updatedByRole: USER_ROLES.ORGANIZATION,
          timestamp,
        },
      ],
    }
    transaction.update(donationReference, {
      status: DONATION_STATUSES.ACCEPTED,
      updatedAt: serverTimestamp(),
    })
    transaction.set(trackingReference, {
      ...tracking,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return tracking
  })
}

export async function advanceDonationStatus(
  donationId,
  organizationUid,
  expectedNextStatus,
) {
  const donationReference = doc(db, 'donations', donationId)
  const trackingReference = doc(db, 'tracking', donationId)
  // Donation and tracking status commit together so neither document can expose
  // a lifecycle state that the other document does not contain.
  return runTransaction(db, async (transaction) => {
    const donationSnapshot = await transaction.get(donationReference)
    const trackingSnapshot = await transaction.get(trackingReference)
    if (!donationSnapshot.exists()) throw new Error('Assigned donation not found.')
    if (!trackingSnapshot.exists()) {
      throw new Error('Tracking is missing for this accepted donation.')
    }
    const donation = donationSnapshot.data()
    const tracking = trackingSnapshot.data()
    if (
      donation.selectedOrganizationId !== organizationUid ||
      tracking.organizationId !== organizationUid
    ) {
      throw new Error('This donation does not belong to your organization.')
    }
    if (
      tracking.donationId !== donationId ||
      tracking.donorId !== donation.donorId
    ) {
      throw new Error('Donation and tracking ownership data are inconsistent.')
    }
    if (donation.status !== tracking.currentStatus) {
      throw new Error('Donation and tracking statuses are inconsistent.')
    }
    const nextStatus = getNextDonationStatus(donation.status)
    if (!nextStatus) throw new Error('This donation is already completed.')
    if (
      !canTransitionDonationStatus(donation.status, expectedNextStatus)
    ) {
      throw new Error(`The next allowed status is ${nextStatus}.`)
    }

    const statusHistory = [
      ...(tracking.statusHistory || []),
      {
        status: nextStatus,
        updatedBy: organizationUid,
        updatedByRole: USER_ROLES.ORGANIZATION,
        timestamp: Timestamp.now(),
      },
    ]
    transaction.update(donationReference, {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    })
    transaction.update(trackingReference, {
      currentStatus: nextStatus,
      statusHistory,
      updatedAt: serverTimestamp(),
    })
    return { ...tracking, currentStatus: nextStatus, statusHistory }
  })
}
