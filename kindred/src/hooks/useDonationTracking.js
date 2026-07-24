import { useCallback, useState } from 'react'
import { DONATION_STATUSES, USER_ROLES } from '../common/constants'
import { getTrackingByDonationId } from '../services/trackingService'
import useAuth from './useAuth'

function useDonationTracking() {
  const { user, role } = useAuth()
  const [tracking, setTracking] = useState(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTracking = useCallback(async (donation) => {
    setTrackingLoading(true)
    setError('')
    setTracking(null)
    try {
      if (!user?.uid) throw new Error('Authentication is required.')
      const ownsDonation =
        (role === USER_ROLES.DONOR && donation?.donorId === user.uid) ||
        (role === USER_ROLES.ORGANIZATION &&
          donation?.selectedOrganizationId === user.uid)
      if (!ownsDonation) throw new Error('You cannot access this tracking record.')

      const data = await getTrackingByDonationId(donation.id)
      if (!data && donation.status !== DONATION_STATUSES.UPLOADED) {
        throw new Error(
          'Tracking is missing even though this donation has been accepted.',
        )
      }
      if (
        data &&
        (data.donationId !== donation.id ||
          data.donorId !== donation.donorId ||
          data.organizationId !== donation.selectedOrganizationId ||
          data.currentStatus !== donation.status)
      ) {
        throw new Error('Donation and tracking data are inconsistent.')
      }
      setTracking(data)
      return data
    } catch (loadError) {
      setError(loadError.code ? 'Unable to load donation tracking.' : loadError.message)
      return null
    } finally {
      setTrackingLoading(false)
    }
  }, [role, user?.uid])

  return {
    tracking,
    trackingLoading,
    error,
    loadTracking,
    clearError: () => setError(''),
  }
}

export default useDonationTracking
