import { DONATION_CATEGORIES, DONATION_STATUSES } from '../common/constants'
import { sortDonationsNewestFirst } from './donorUtils'

const safeQuantity = (value) => {
  const quantity = Number(value)
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0
}

export function calculateDonorImpact(donations = []) {
  // Item totals represent realized impact, so incomplete donations contribute
  // to activity counts but never to completed quantity totals.
  const completed = donations.filter(
    (donation) => donation?.status === DONATION_STATUSES.COMPLETED,
  )
  return {
    totalDonations: donations.length,
    completedDonations: completed.length,
    organizationsHelped: new Set(
      donations.map((item) => item?.selectedOrganizationId).filter(Boolean),
    ).size,
    itemsDonated: completed.reduce(
      (total, item) => total + safeQuantity(item?.quantity),
      0,
    ),
  }
}

export function calculateOrganizationImpact(donations = []) {
  const completed = donations.filter(
    (donation) => donation?.status === DONATION_STATUSES.COMPLETED,
  )
  return {
    assignedDonations: donations.length,
    completedDonations: completed.length,
    itemsReceived: completed.reduce(
      (total, item) => total + safeQuantity(item?.quantity),
      0,
    ),
    uniqueDonors: new Set(
      completed.map((item) => item?.donorId).filter(Boolean),
    ).size,
  }
}

export function buildStatusDistribution(donations = []) {
  const statuses = Object.values(DONATION_STATUSES)
  return statuses
    .map((status) => ({
      key: status,
      name: status,
      value: donations.filter((item) => item?.status === status).length,
    }))
    .filter((item) => item.value > 0)
}

export function buildCategoryDistribution(donations = []) {
  return Object.values(DONATION_CATEGORIES)
    .map((category) => ({
      key: category,
      name: category
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      value: donations.filter((item) => item?.category === category).length,
    }))
    .filter((item) => item.value > 0)
}

export function getRecentDonations(donations = [], limit = 5) {
  return sortDonationsNewestFirst(donations).slice(0, Math.max(0, limit))
}
