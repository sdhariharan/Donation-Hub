import { useCallback, useEffect, useMemo, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import { getDonorProfile } from '../services/donorService'
import {
  getAllDiscoverableOrganizations,
  getDiscoverableOrganizationById,
} from '../services/organizationDirectoryService'
import { buildOrganizationDirectorySections } from '../utils/generalOrganizationRecommendation'
import useAuth from './useAuth'

const EMPTY_FILTERS = Object.freeze({
  searchQuery: '',
  category: '',
  city: '',
  state: '',
  activeNeedsOnly: false,
})

function useOrganizationDirectory({ loadList = true } = {}) {
  const { user, role } = useAuth()
  const [organizations, setOrganizations] = useState([])
  const [donorProfile, setDonorProfile] = useState(null)
  const [selectedOrganization, setSelectedOrganization] = useState(null)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [loading, setLoading] = useState(loadList)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')

  const requireDonor = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.DONOR) {
      throw new Error('An authenticated donor account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const loadOrganizations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const donorId = requireDonor()
      const [directory, profile] = await Promise.all([
        getAllDiscoverableOrganizations(),
        getDonorProfile(donorId),
      ])
      setOrganizations(directory)
      setDonorProfile(profile)
      return directory
    } catch (loadError) {
      setError(loadError.message || 'Unable to load organizations.')
      return []
    } finally {
      setLoading(false)
    }
  }, [requireDonor])

  useEffect(() => {
    if (loadList) loadOrganizations()
    else setLoading(false)
  }, [loadList, loadOrganizations])

  const loadOrganizationDetails = useCallback(
    async (organizationId) => {
      setDetailLoading(true)
      setError('')
      try {
        const donorId = requireDonor()
        const cached = organizations.find((item) => item.id === organizationId)
        const [organization, profile] = await Promise.all([
          cached ||
            getDiscoverableOrganizationById(organizationId),
          getDonorProfile(donorId),
        ])
        if (!organization) throw new Error('Organization not found.')
        setSelectedOrganization(organization)
        setDonorProfile(profile)
        return organization
      } catch (loadError) {
        setError(loadError.message || 'Unable to load the organization.')
        setSelectedOrganization(null)
        return null
      } finally {
        setDetailLoading(false)
      }
    },
    [organizations, requireDonor],
  )

  const sections = useMemo(
    () =>
      buildOrganizationDirectorySections(
        organizations,
        donorProfile,
        filters,
      ),
    [donorProfile, filters, organizations],
  )
  const clearSelectedOrganization = useCallback(
    () => setSelectedOrganization(null),
    [],
  )

  return {
    organizations,
    recommendedOrganizations: sections.recommendedOrganizations,
    allOrganizations: sections.allOrganizations,
    selectedOrganization,
    donorProfile,
    filters,
    loading,
    detailLoading,
    error,
    setSearchQuery: (searchQuery) =>
      setFilters((current) => ({ ...current, searchQuery })),
    setCategoryFilter: (category) =>
      setFilters((current) => ({ ...current, category })),
    setCityFilter: (city) =>
      setFilters((current) => ({ ...current, city })),
    setStateFilter: (state) =>
      setFilters((current) => ({ ...current, state })),
    setActiveNeedsOnly: (activeNeedsOnly) =>
      setFilters((current) => ({ ...current, activeNeedsOnly })),
    clearFilters: () => setFilters(EMPTY_FILTERS),
    loadOrganizations,
    loadOrganizationDetails,
    clearSelectedOrganization,
    clearError: () => setError(''),
  }
}

export default useOrganizationDirectory
