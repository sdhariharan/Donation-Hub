import {
  DONATION_CATEGORIES,
  DONATION_CONDITIONS,
  DONATION_STATUSES,
} from '../common/constants'
import { getTimestampMillis } from './dateUtils'

export const DONATION_CATEGORY_VALUES = Object.freeze(
  Object.values(DONATION_CATEGORIES),
)
export const DONATION_CONDITION_VALUES = Object.freeze(
  Object.values(DONATION_CONDITIONS),
)
export const ALLOWED_IMAGE_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'image/webp',
])
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function calculateDonorProfileCompletion(profile) {
  const fields = ['name', 'phone', 'address', 'city', 'state', 'postalCode']
  if (!profile) return 0
  const completed = fields.filter(
    (field) => String(profile[field] || '').trim().length > 0,
  ).length
  return Math.round((completed / fields.length) * 100)
}

export function validateDonationImage(file) {
  if (!file) return ''
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Choose a JPEG, PNG, or WebP image.'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image size must not exceed 5 MB.'
  }
  return ''
}

export function sanitizeFilename(filename) {
  const cleaned = filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
  return cleaned || 'donation-image'
}

export function canModifyDonation(donation, donorId) {
  return Boolean(
    donation &&
      donation.donorId === donorId &&
      donation.status === DONATION_STATUSES.UPLOADED &&
      donation.selectedOrganizationId === null,
  )
}

export function canRecommendOrganizations(donation, donorId) {
  return Boolean(
    donation &&
      donation.donorId === donorId &&
      donation.status === DONATION_STATUSES.UPLOADED &&
      donation.selectedOrganizationId === null,
  )
}

export function sortDonationsNewestFirst(donations = []) {
  return [...donations].sort(
    (first, second) =>
      getTimestampMillis(second.createdAt) -
      getTimestampMillis(first.createdAt),
  )
}

export function formatDataLabel(value) {
  return value
    ? value
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : ''
}
