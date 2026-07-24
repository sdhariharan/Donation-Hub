import { useCallback, useEffect, useState } from 'react'
import { USER_ROLES } from '../common/constants'
import {
  createDonation as createDonationDocument,
  deleteDonation as deleteDonationDocument,
  generateDonationId,
  getDonationById,
  getDonorDonations,
  updateDonation as updateDonationDocument,
} from '../services/donationService'
import { getDonorProfile } from '../services/donorService'
import {
  deleteDonationImage,
  uploadDonationImage,
} from '../services/storageService'
import useAuth from './useAuth'

function useDonations({ loadList = true } = {}) {
  const { user, role } = useAuth()
  const [donations, setDonations] = useState([])
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [loading, setLoading] = useState(loadList)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')
  const [error, setError] = useState('')

  const requireDonor = useCallback(() => {
    if (!user?.uid || role !== USER_ROLES.DONOR) {
      throw new Error('An authenticated donor account is required.')
    }
    return user.uid
  }, [role, user?.uid])

  const refreshDonations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDonorDonations(requireDonor())
      setDonations(data)
      return data
    } catch (loadError) {
      setError(loadError.message || 'Unable to load donations.')
      return []
    } finally {
      setLoading(false)
    }
  }, [requireDonor])

  useEffect(() => {
    if (loadList) refreshDonations()
    else setLoading(false)
  }, [loadList, refreshDonations])

  const loadDonation = useCallback(
    async (donationId) => {
      setDetailLoading(true)
      setError('')
      setSelectedDonation(null)
      try {
        const donation = await getDonationById(donationId)
        if (!donation || donation.donorId !== requireDonor()) {
          throw new Error('Donation not found or unavailable.')
        }
        setSelectedDonation(donation)
        return donation
      } catch (detailError) {
        setError(detailError.message || 'Unable to load the donation.')
        return null
      } finally {
        setDetailLoading(false)
      }
    },
    [requireDonor],
  )

  const createDonation = async (
    donationData,
    imageFile,
    selectedOrganizationId = null,
  ) => {
    setError('')
    const donorId = requireDonor()
    const donationId = generateDonationId()
    let uploadedImage = null

    try {
      const donorProfile = await getDonorProfile(donorId)
      if (imageFile) {
        setActionLoading('image-upload')
        uploadedImage = await uploadDonationImage(
          donorId,
          donationId,
          imageFile,
        )
      }
      setActionLoading('create')
      const created = await createDonationDocument(
        donationId,
        donorId,
        donorProfile,
        {
          ...donationData,
          imageUrl: uploadedImage?.imageUrl || null,
          imagePath: uploadedImage?.imagePath || null,
        },
        selectedOrganizationId,
      )
      setDonations((current) => [created, ...current])
      setSelectedDonation(created)
      return created
    } catch (creationError) {
      let message = creationError.message || 'Unable to create the donation.'
      // Storage uploads precede the Firestore write, so a failed document create
      // requires best-effort cleanup to avoid an orphaned image.
      if (uploadedImage?.imagePath) {
        setActionLoading('image-cleanup')
        try {
          await deleteDonationImage(uploadedImage.imagePath)
        } catch {
          message += ' The uploaded image could not be cleaned up.'
        }
      }
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading('')
    }
  }

  const updateDonation = async (
    donationId,
    updates,
    { imageFile = null, removeImage = false } = {},
  ) => {
    setError('')
    const donorId = requireDonor()
    const current =
      selectedDonation?.id === donationId
        ? selectedDonation
        : await getDonationById(donationId)
    if (!current || current.donorId !== donorId) {
      const message = 'Donation not found or unavailable.'
      setError(message)
      throw new Error(message)
    }

    let replacement = null
    let updateCommitted = false
    try {
      if (imageFile) {
        setActionLoading('image-upload')
        replacement = await uploadDonationImage(donorId, donationId, imageFile)
      }
      const imageUpdates = replacement
        ? replacement
        : removeImage
          ? { imageUrl: null, imagePath: null }
          : {}
      setActionLoading('update')
      const updated = await updateDonationDocument(donationId, donorId, {
        ...updates,
        ...imageUpdates,
      })
      updateCommitted = true
      setSelectedDonation(updated)
      setDonations((items) =>
        items.map((item) => (item.id === donationId ? updated : item)),
      )

      if ((replacement || removeImage) && current.imagePath) {
        setActionLoading('image-cleanup')
        try {
          await deleteDonationImage(current.imagePath)
        } catch {
          const message =
            'Donation updated, but the previous image could not be deleted.'
          setError(message)
          return { ...updated, cleanupWarning: message }
        }
      }
      return updated
    } catch (updateError) {
      if (replacement?.imagePath && !updateCommitted) {
        setActionLoading('image-cleanup')
        try {
          await deleteDonationImage(replacement.imagePath)
        } catch {
          const message = `${updateError.message} The replacement image could not be cleaned up.`
          setError(message)
          throw new Error(message)
        }
      }
      const message = updateError.message || 'Unable to update the donation.'
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading('')
    }
  }

  const deleteDonation = async (donationId) => {
    setError('')
    setActionLoading('delete')
    try {
      const deleted = await deleteDonationDocument(
        donationId,
        requireDonor(),
      )
      setDonations((items) => items.filter((item) => item.id !== donationId))
      if (selectedDonation?.id === donationId) setSelectedDonation(null)
      if (deleted.imagePath) {
        setActionLoading('image-cleanup')
        try {
          await deleteDonationImage(deleted.imagePath)
        } catch {
          const message =
            'Donation deleted, but its Storage image could not be cleaned up.'
          setError(message)
          return { ...deleted, cleanupWarning: message }
        }
      }
      return deleted
    } catch (deletionError) {
      const message = deletionError.message || 'Unable to delete the donation.'
      setError(message)
      throw new Error(message)
    } finally {
      setActionLoading('')
    }
  }

  return {
    donations,
    selectedDonation,
    loading,
    detailLoading,
    actionLoading,
    error,
    createDonation,
    loadDonation,
    updateDonation,
    deleteDonation,
    clearError: () => setError(''),
    refreshDonations,
  }
}

export default useDonations
