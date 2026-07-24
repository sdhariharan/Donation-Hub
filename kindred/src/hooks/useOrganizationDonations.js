import { useCallback, useEffect, useRef, useState } from 'react'
import { DONATION_STATUSES, USER_ROLES } from '../common/constants'
import {
  getOrganizationDonationById,
  getOrganizationDonations,
} from '../services/organizationDonationService'
import {
  acceptDonation as acceptDonationTransaction,
  advanceDonationStatus,
  getTrackingByDonationId,
} from '../services/trackingService'
import useAuth from './useAuth'

function useOrganizationDonations({ loadList = true } = {}) {
  const { user, role } = useAuth()
  const [organizationDonations, setOrganizationDonations] = useState([])
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [listLoading, setListLoading] = useState(loadList)
  const [detailLoading, setDetailLoading] = useState(false)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')
  const actionLock = useRef(false)

  const requireOrganization = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.ORGANIZATION) {
      throw new Error('An authenticated organization account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const loadOrganizationDonations = useCallback(async () => {
    setListLoading(true)
    setError('')
    try {
      const data = await getOrganizationDonations(requireOrganization())
      setOrganizationDonations(data)
      return data
    } catch (loadError) {
      setError(loadError.code ? 'Unable to load assigned donations.' : loadError.message)
      return []
    } finally {
      setListLoading(false)
    }
  }, [requireOrganization])

  useEffect(() => {
    if (loadList) loadOrganizationDonations()
    else setListLoading(false)
  }, [loadList, loadOrganizationDonations])

  const loadTracking = useCallback(async (donation) => {
    setTrackingLoading(true)
    try {
      const data = await getTrackingByDonationId(donation.id)
      if (!data && donation.status !== DONATION_STATUSES.UPLOADED) {
        throw new Error('Tracking is missing for this accepted donation.')
      }
      if (
        data &&
        (data.donationId !== donation.id ||
          data.organizationId !== donation.selectedOrganizationId ||
          data.donorId !== donation.donorId ||
          data.currentStatus !== donation.status)
      ) {
        throw new Error('Donation and tracking data are inconsistent.')
      }
      setTracking(data)
      return data
    } catch (trackingError) {
      setError(trackingError.code ? 'Unable to load donation tracking.' : trackingError.message)
      setTracking(null)
      return null
    } finally {
      setTrackingLoading(false)
    }
  }, [])

  const loadOrganizationDonation = useCallback(async (donationId) => {
    setDetailLoading(true)
    setError('')
    setSelectedDonation(null)
    setTracking(null)
    try {
      const donation = await getOrganizationDonationById(
        donationId,
        requireOrganization(),
      )
      setSelectedDonation(donation)
      await loadTracking(donation)
      return donation
    } catch (detailError) {
      setError(detailError.code ? 'Unable to load the assigned donation.' : detailError.message)
      return null
    } finally {
      setDetailLoading(false)
    }
  }, [loadTracking, requireOrganization])

  const refreshSelectedDonation = useCallback(async () => {
    if (!selectedDonation?.id) return null
    return loadOrganizationDonation(selectedDonation.id)
  }, [loadOrganizationDonation, selectedDonation?.id])

  const runAction = async (name, operation) => {
    if (actionLock.current) throw new Error('A status update is already in progress.')
    actionLock.current = true
    setActionLoading(name)
    setError('')
    try {
      const result = await operation(requireOrganization())
      await loadOrganizationDonation(selectedDonation.id)
      return result
    } catch (actionError) {
      const message = actionError.code ? 'Unable to update donation status.' : actionError.message
      setError(message)
      throw new Error(message)
    } finally {
      actionLock.current = false
      setActionLoading('')
    }
  }

  const acceptDonation = () =>
    runAction('accept', (organizationUid) =>
      acceptDonationTransaction(selectedDonation.id, organizationUid),
    )

  const advanceStatus = (nextStatus) =>
    runAction('advance', (organizationUid) =>
      advanceDonationStatus(
        selectedDonation.id,
        organizationUid,
        nextStatus,
      ),
    )

  return {
    organizationDonations,
    selectedDonation,
    tracking,
    listLoading,
    detailLoading,
    trackingLoading,
    actionLoading,
    error,
    loadOrganizationDonations,
    loadOrganizationDonation,
    loadTracking,
    acceptDonation,
    advanceStatus,
    clearError: () => setError(''),
    refreshSelectedDonation,
  }
}

export default useOrganizationDonations
