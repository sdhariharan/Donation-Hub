import { useCallback, useRef, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import {
  getRecommendationsForDonation,
  selectOrganizationForDonation,
} from '../services/recommendationService'
import { canRecommendOrganizations } from '../utils/donorUtils'
import useAuth from './useAuth'

function readableRecommendationError(error, fallback) {
  if (error?.code) return fallback
  return error?.message || fallback
}

function useRecommendations() {
  const { user, role } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectingOrganizationId, setSelectingOrganizationId] = useState('')
  const [error, setError] = useState('')
  const [hasLoaded, setHasLoaded] = useState(false)
  const selectionLock = useRef(false)

  const requireDonor = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.DONOR) {
      throw new Error('An authenticated donor account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const loadRecommendations = useCallback(
    async (donation) => {
      setLoading(true)
      setError('')
      setRecommendations([])
      setHasLoaded(false)
      try {
        const donorId = requireDonor()
        if (!donation) throw new Error('Donation not found.')
        if (donation.donorId !== donorId) {
          throw new Error('You do not have access to this donation.')
        }
        if (!canRecommendOrganizations(donation, donorId)) {
          throw new Error(
            'This donation is no longer eligible for organization recommendations.',
          )
        }
        const results = await getRecommendationsForDonation(donation)
        setRecommendations(results)
        setHasLoaded(true)
        return results
      } catch (loadError) {
        const message = readableRecommendationError(
          loadError,
          'Unable to load organization recommendations.',
        )
        setError(message)
        setHasLoaded(true)
        return []
      } finally {
        setLoading(false)
      }
    },
    [requireDonor],
  )

  const selectOrganization = useCallback(
    async (donation, organizationId) => {
      if (selectionLock.current) {
        throw new Error('An organization selection is already in progress.')
      }
      selectionLock.current = true
      setSelectingOrganizationId(organizationId)
      setError('')
      try {
        const donorId = requireDonor()
        if (!canRecommendOrganizations(donation, donorId)) {
          throw new Error(
            'This donation is no longer eligible for organization selection.',
          )
        }
        const result = await selectOrganizationForDonation(
          donation.id,
          donorId,
          organizationId,
        )
        setRecommendations([])
        setHasLoaded(false)
        return result
      } catch (selectionError) {
        const message = readableRecommendationError(
          selectionError,
          'Unable to select the organization.',
        )
        setError(message)
        throw new Error(message)
      } finally {
        selectionLock.current = false
        setSelectingOrganizationId('')
      }
    },
    [requireDonor],
  )

  return {
    recommendations,
    loading,
    selectingOrganizationId,
    error,
    hasLoaded,
    loadRecommendations,
    selectOrganization,
    clearRecommendations: () => {
      setRecommendations([])
      setHasLoaded(false)
    },
    clearError: () => setError(''),
  }
}

export default useRecommendations
