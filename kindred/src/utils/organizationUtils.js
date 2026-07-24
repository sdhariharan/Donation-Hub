import { DONATION_CATEGORIES, URGENCY_LEVELS } from '../common/constants'

export const ORGANIZATION_CATEGORIES = Object.freeze(
  Object.values(DONATION_CATEGORIES),
)

export const ORGANIZATION_URGENCIES = Object.freeze(
  Object.values(URGENCY_LEVELS),
)

export const REQUIRED_PROFILE_FIELDS = Object.freeze([
  'name',
  'description',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postalCode',
])

export function createEmptyInventory() {
  return Object.fromEntries(
    ORGANIZATION_CATEGORIES.map((category) => [category, 0]),
  )
}

export function normalizeInventory(inventory = {}) {
  return Object.fromEntries(
    ORGANIZATION_CATEGORIES.map((category) => {
      const value = Number(inventory[category] ?? 0)
      if (!Number.isInteger(value) || value < 0) {
        throw new Error(
          `${formatCategory(category)} inventory must be a whole number of 0 or more.`,
        )
      }
      return [category, value]
    }),
  )
}

export function calculateOrganizationProfileCompletion(organization) {
  if (!organization) return 0

  const completedTextFields = REQUIRED_PROFILE_FIELDS.filter(
    (field) => String(organization[field] || '').trim().length > 0,
  ).length
  const hasCategories = organization.categoriesAccepted?.length > 0 ? 1 : 0
  const completed = completedTextFields + hasCategories

  return Math.round((completed / (REQUIRED_PROFILE_FIELDS.length + 1)) * 100)
}

export function formatCategory(category) {
  return category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
}

export function sortOrganizationNeeds(needs = []) {
  const urgencyRank = {
    [URGENCY_LEVELS.HIGH]: 0,
    [URGENCY_LEVELS.MEDIUM]: 1,
    [URGENCY_LEVELS.LOW]: 2,
  }

  return [...needs].sort((first, second) => {
    if (first.isActive !== second.isActive) return first.isActive ? -1 : 1
    return (
      (urgencyRank[first.urgency] ?? 3) -
      (urgencyRank[second.urgency] ?? 3)
    )
  })
}
