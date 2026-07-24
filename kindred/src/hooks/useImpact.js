import { useCallback, useEffect, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import { getDonorDonations } from '../services/donationService'
import { getOrganizationDonations } from '../services/organizationDonationService'
import {
  buildCategoryDistribution,
  buildStatusDistribution,
  calculateDonorImpact,
  calculateOrganizationImpact,
  getRecentDonations,
} from '../utils/impactCalculations'
import useAuth from './useAuth'

function useImpact() {
  const { user, role } = useAuth()
  const [metrics, setMetrics] = useState({})
  const [statusDistribution, setStatusDistribution] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [recentDonations, setRecentDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshImpact = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (!user?.uid) throw new Error('Authentication is required.')
      let donations
      let nextMetrics
      if (role === USER_ROLES.DONOR) {
        donations = await getDonorDonations(user.uid)
        nextMetrics = calculateDonorImpact(donations)
      } else if (role === USER_ROLES.ORGANIZATION) {
        donations = await getOrganizationDonations(user.uid)
        nextMetrics = calculateOrganizationImpact(donations)
      } else {
        throw new Error('This account role does not support impact reporting.')
      }
      setMetrics(nextMetrics)
      setStatusDistribution(buildStatusDistribution(donations))
      setCategoryDistribution(buildCategoryDistribution(donations))
      setRecentDonations(getRecentDonations(donations))
      return nextMetrics
    } catch (loadError) {
      setError(loadError.code ? 'Unable to load impact data.' : loadError.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [role, user?.uid])

  useEffect(() => {
    refreshImpact()
  }, [refreshImpact])

  return {
    metrics,
    statusDistribution,
    categoryDistribution,
    recentDonations,
    loading,
    error,
    refreshImpact,
  }
}

export default useImpact
