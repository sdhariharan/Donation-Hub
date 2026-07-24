import {
  DONATION_STATUSES,
  DONATION_STATUS_TRANSITIONS,
} from '../common/constants'

export const DONATION_STATUS_ORDER = Object.freeze([
  DONATION_STATUSES.UPLOADED,
  DONATION_STATUSES.ACCEPTED,
  DONATION_STATUSES.READY_FOR_PICKUP,
  DONATION_STATUSES.RECEIVED,
  DONATION_STATUSES.COMPLETED,
])

export function getNextDonationStatus(currentStatus) {
  return Object.prototype.hasOwnProperty.call(
    DONATION_STATUS_TRANSITIONS,
    currentStatus,
  )
    ? DONATION_STATUS_TRANSITIONS[currentStatus]
    : null
}

export function canTransitionDonationStatus(currentStatus, nextStatus) {
  // Lifecycle movement is forward-only; UI labels never authorize skipping or
  // reversing a status.
  return Boolean(
    nextStatus && getNextDonationStatus(currentStatus) === nextStatus,
  )
}

export function getDonationStatusIndex(status) {
  return DONATION_STATUS_ORDER.indexOf(status)
}
