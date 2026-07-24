import { useCallback, useEffect, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import { getDonorProfile, updateDonorProfile } from '../services/donorService'
import useAuth from './useAuth'

function useDonorProfile() {
  const { user, role } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const requireDonor = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.DONOR) {
      throw new Error('An authenticated donor account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const refreshProfile = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDonorProfile(requireDonor())
      setProfile(data)
      return data
    } catch (loadError) {
      setError(loadError.message || 'Unable to load the donor profile.')
      return null
    } finally {
      setLoading(false)
    }
  }, [requireDonor])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const updateProfile = async (profileData) => {
    setActionLoading(true)
    setError('')
    try {
      const updated = await updateDonorProfile(requireDonor(), profileData)
      setProfile(updated)
      return updated
    } catch (updateError) {
      const message = updateError.message || 'Unable to update the donor profile.'
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }

  return {
    profile,
    loading,
    actionLoading,
    error,
    updateProfile,
    clearError: () => setError(''),
    refreshProfile,
  }
}

export default useDonorProfile
