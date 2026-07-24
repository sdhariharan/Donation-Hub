import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { isDiscoverableOrganization } from '../utils/generalOrganizationRecommendation'

const ORGANIZATIONS_COLLECTION = 'organizations'

export async function getAllDiscoverableOrganizations() {
  const snapshot = await getDocs(collection(db, ORGANIZATIONS_COLLECTION))
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter(isDiscoverableOrganization)
}

export async function getDiscoverableOrganizationById(organizationId) {
  if (!organizationId) throw new Error('Organization ID is required.')
  const snapshot = await getDoc(
    doc(db, ORGANIZATIONS_COLLECTION, organizationId),
  )
  if (!snapshot.exists()) return null
  const organization = { id: snapshot.id, ...snapshot.data() }
  return isDiscoverableOrganization(organization) ? organization : null
}
