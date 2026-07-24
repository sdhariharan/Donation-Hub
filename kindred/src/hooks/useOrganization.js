import { useCallback, useEffect, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import useAuth from './useAuth'
import {
  addOrganizationNeed,
  deleteOrganizationNeed,
  getOrganizationByOwnerId,
  saveOrganizationProfile,
  updateOrganizationInventory,
  updateOrganizationNeed,
} from '../services/organizationService'

function useOrganization() {
  const { user, role } = useAuth()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')

  const requireOrganizationUser = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.ORGANIZATION) {
      throw new Error('An authenticated organization account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const refreshOrganization = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const uid = requireOrganizationUser()
      const data = await getOrganizationByOwnerId(uid)
      setOrganization(data)
      return data
    } catch (loadError) {
      setError(loadError.message || 'Unable to load the organization.')
      return null
    } finally {
      setLoading(false)
    }
  }, [requireOrganizationUser])

  useEffect(() => {
    refreshOrganization()
  }, [refreshOrganization])

  const runAction = async (action, operation) => {
    setActionLoading(action)
    setError('')
    try {
      return await operation(requireOrganizationUser())
    } catch (actionError) {
      const message =
        actionError.message || 'The organization update could not be completed.'
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading('')
    }
  }

  const saveProfile = (data) =>
    runAction('profile', async (uid) => {
      const updated = await saveOrganizationProfile(uid, data)
      setOrganization(updated)
      return updated
    })

  const saveInventory = (inventory) =>
    runAction('inventory', async (uid) => {
      const updated = await updateOrganizationInventory(uid, inventory)
      setOrganization(updated)
      return updated
    })

  const addNeed = (need) =>
    runAction('need', async (uid) => {
      const needs = await addOrganizationNeed(uid, need)
      setOrganization((current) => ({ ...current, needs }))
      return needs
    })

  const updateNeed = (needId, updates) =>
    runAction('need', async (uid) => {
      const needs = await updateOrganizationNeed(uid, needId, updates)
      setOrganization((current) => ({ ...current, needs }))
      return needs
    })

  const deleteNeed = (needId) =>
    runAction(`delete:${needId}`, async (uid) => {
      const needs = await deleteOrganizationNeed(uid, needId)
      setOrganization((current) => ({ ...current, needs }))
      return needs
    })

  return {
    organization,
    loading,
    actionLoading,
    error,
    saveProfile,
    saveInventory,
    addNeed,
    updateNeed,
    deleteNeed,
    clearError: () => setError(''),
    refreshOrganization,
  }
}

export default useOrganization
