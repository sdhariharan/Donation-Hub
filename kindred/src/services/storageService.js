import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { storage } from '../firebase/config'
import {
  sanitizeFilename,
  validateDonationImage,
} from '../utils/donorUtils'

export async function uploadDonationImage(donorId, donationId, file) {
  if (!donorId || !donationId) {
    throw new Error('Donation image ownership information is missing.')
  }
  const validationError = validateDonationImage(file)
  if (validationError) throw new Error(validationError)

  const uniquePrefix =
    globalThis.crypto?.randomUUID?.() || `${Date.now()}`
  const uploadFilename = sanitizeFilename(`${uniquePrefix}-${file.name}`)
  const imagePath = `donation-images/${donorId}/${donationId}/${uploadFilename}`
  const imageReference = ref(storage, imagePath)
  await uploadBytes(imageReference, file, { contentType: file.type })
  return {
    imagePath,
    imageUrl: await getDownloadURL(imageReference),
  }
}

export async function deleteDonationImage(imagePath) {
  if (!imagePath) return
  await deleteObject(ref(storage, imagePath))
}
