import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { sortDonationsNewestFirst } from '../utils/donorUtils'

export async function getOrganizationDonations(organizationUid) {
  const snapshot = await getDocs(
    query(
      collection(db, 'donations'),
      where('selectedOrganizationId', '==', organizationUid),
    ),
  )
  return sortDonationsNewestFirst(
    snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
  )
}

export async function getOrganizationDonationById(
  donationId,
  organizationUid,
) {
  const snapshot = await getDoc(doc(db, 'donations', donationId))
  if (!snapshot.exists()) throw new Error('Assigned donation not found.')
  const donation = { id: snapshot.id, ...snapshot.data() }
  if (donation.selectedOrganizationId !== organizationUid) {
    throw new Error('This donation does not belong to your organization.')
  }
  return donation
}
