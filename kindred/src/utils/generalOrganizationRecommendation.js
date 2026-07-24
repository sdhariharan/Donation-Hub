import {
  GENERAL_ORGANIZATION_WEIGHTS,
  URGENCY_LEVELS,
} from '../common/constants'

const PROFILE_FIELDS = [
  'name',
  'description',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postalCode',
]

const clamp = (value) => Math.min(100, Math.max(0, value))
const normalize = (value) => String(value || '').trim().toLowerCase()

export function getActiveNeeds(organization) {
  return Array.isArray(organization?.needs)
    ? organization.needs.filter((need) => need?.isActive === true)
    : []
}

export function isDiscoverableOrganization(organization) {
  const hasDisplayData = Boolean(
    normalize(organization?.description) ||
      normalize(organization?.email) ||
      normalize(organization?.phone) ||
      (normalize(organization?.city) && normalize(organization?.state)),
  )
  return Boolean(
    organization?.id &&
      normalize(organization.name) &&
      organization.active !== false &&
      Array.isArray(organization.categoriesAccepted) &&
      hasDisplayData,
  )
}

export function calculateActiveNeedsScore(organization) {
  const count = getActiveNeeds(organization).length
  if (count >= 5) return 100
  if (count >= 3) return 80
  if (count === 2) return 65
  if (count === 1) return 50
  return 20
}

export function calculateUrgencyScore(organization) {
  const needs = getActiveNeeds(organization)
  if (!needs.length) return 20
  if (needs.some((need) => need.urgency === URGENCY_LEVELS.HIGH)) return 100
  if (needs.some((need) => need.urgency === URGENCY_LEVELS.MEDIUM)) return 70
  return needs.some((need) => need.urgency === URGENCY_LEVELS.LOW) ? 45 : 20
}

export function calculateGeneralInventoryScore(organization) {
  const categories = organization?.categoriesAccepted
  if (!Array.isArray(categories) || !categories.length) return 50
  const values = categories.map((category) => organization?.inventory?.[category])
  if (
    values.some(
      (value) =>
        typeof value !== 'number' || !Number.isFinite(value) || value < 0,
    )
  ) {
    return 50
  }
  const average = values.reduce((total, value) => total + value, 0) / values.length
  if (average <= 10) return 100
  if (average <= 25) return 80
  if (average <= 50) return 60
  if (average <= 100) return 40
  return 20
}

export function calculateGeneralTrustScore(organization) {
  const value = organization?.trustScore
  return typeof value === 'number' && Number.isFinite(value)
    ? clamp(value)
    : 50
}

export function calculateDonorLocationScore(organization, donorProfile) {
  const donorCity = normalize(donorProfile?.city)
  const donorState = normalize(donorProfile?.state)
  const organizationCity = normalize(organization?.city)
  const organizationState = normalize(organization?.state)
  if (!donorCity || !donorState || !organizationCity || !organizationState) {
    return 40
  }
  if (donorCity === organizationCity && donorState === organizationState) {
    return 100
  }
  return donorState === organizationState ? 65 : 35
}

export function calculateDirectoryProfileCompleteness(organization) {
  const completedFields = PROFILE_FIELDS.filter((field) =>
    normalize(organization?.[field]),
  ).length
  const hasCategories = organization?.categoriesAccepted?.length ? 1 : 0
  return Math.round(
    ((completedFields + hasCategories) / (PROFILE_FIELDS.length + 1)) * 100,
  )
}

function buildGeneralReasons(organization, scores, selectedCategory) {
  const reasons = []
  if (selectedCategory && organization.categoriesAccepted.includes(selectedCategory)) {
    reasons.push('Accepts your selected category')
  }
  if (scores.urgencyScore === 100) reasons.push('Has urgent active needs')
  else if (scores.activeNeedsScore >= 65) reasons.push('Has multiple active needs')
  if (scores.locationScore === 100) reasons.push('Located in your city')
  else if (scores.locationScore === 65) reasons.push('Located in your state')
  if (scores.inventoryNeedScore >= 80) {
    reasons.push('Low inventory across accepted categories')
  }
  if (scores.trustScore >= 75) reasons.push('Strong trust score')
  if (scores.profileCompletenessScore >= 90) {
    reasons.push('Complete organization profile')
  }
  if (reasons.length < 2) {
    reasons.push(
      `Accepts ${organization.categoriesAccepted.length} donation ${
        organization.categoriesAccepted.length === 1 ? 'category' : 'categories'
      }`,
    )
  }
  if (reasons.length < 2) {
    reasons.push('Organization profile is available to review')
  }
  return reasons.slice(0, 4)
}

// This pre-donation score intentionally uses organization-wide signals. The
// item-specific engine remains separate until a real donation exists.
export function calculateGeneralOrganizationRecommendation(
  organization,
  donorProfile,
  selectedCategory = '',
) {
  if (!isDiscoverableOrganization(organization)) return null
  const scores = {
    activeNeedsScore: calculateActiveNeedsScore(organization),
    urgencyScore: calculateUrgencyScore(organization),
    inventoryNeedScore: calculateGeneralInventoryScore(organization),
    trustScore: calculateGeneralTrustScore(organization),
    locationScore: calculateDonorLocationScore(organization, donorProfile),
    profileCompletenessScore:
      calculateDirectoryProfileCompleteness(organization),
  }
  const generalScore = clamp(
    Math.round(
      scores.activeNeedsScore * GENERAL_ORGANIZATION_WEIGHTS.ACTIVE_NEEDS +
        scores.urgencyScore * GENERAL_ORGANIZATION_WEIGHTS.URGENCY +
        scores.inventoryNeedScore *
          GENERAL_ORGANIZATION_WEIGHTS.INVENTORY_NEED +
        scores.trustScore * GENERAL_ORGANIZATION_WEIGHTS.TRUST +
        scores.locationScore * GENERAL_ORGANIZATION_WEIGHTS.LOCATION +
        scores.profileCompletenessScore *
          GENERAL_ORGANIZATION_WEIGHTS.PROFILE_COMPLETENESS,
    ),
  )
  const activeNeeds = getActiveNeeds(organization)
  const highestUrgency = activeNeeds.some(
    (need) => need.urgency === URGENCY_LEVELS.HIGH,
  )
    ? URGENCY_LEVELS.HIGH
    : activeNeeds.some((need) => need.urgency === URGENCY_LEVELS.MEDIUM)
      ? URGENCY_LEVELS.MEDIUM
      : activeNeeds.some((need) => need.urgency === URGENCY_LEVELS.LOW)
        ? URGENCY_LEVELS.LOW
        : null

  return {
    organization,
    generalScore,
    scoreBreakdown: scores,
    activeNeeds,
    highestUrgency,
    reasons: buildGeneralReasons(organization, scores, selectedCategory),
  }
}

export function filterDiscoverableOrganizations(organizations, filters) {
  const search = normalize(filters.searchQuery)
  return organizations.filter((organization) => {
    const activeNeeds = getActiveNeeds(organization)
    if (
      filters.category &&
      !organization.categoriesAccepted.includes(filters.category)
    ) {
      return false
    }
    if (
      filters.city &&
      normalize(organization.city) !== normalize(filters.city)
    ) {
      return false
    }
    if (
      filters.state &&
      normalize(organization.state) !== normalize(filters.state)
    ) {
      return false
    }
    if (filters.activeNeedsOnly && !activeNeeds.length) return false
    if (
      search &&
      ![
        organization.name,
        organization.description,
        organization.city,
        organization.state,
        ...activeNeeds.map((need) => need.itemName),
      ].some((value) => normalize(value).includes(search))
    ) {
      return false
    }
    return true
  })
}

export function buildOrganizationDirectorySections(
  organizations,
  donorProfile,
  filters,
  recommendationLimit = 5,
) {
  const ranked = filterDiscoverableOrganizations(organizations, filters)
    .map((organization) =>
      calculateGeneralOrganizationRecommendation(
        organization,
        donorProfile,
        filters.category,
      ),
    )
    .filter(Boolean)
    .sort(
      (first, second) =>
        second.generalScore - first.generalScore ||
        second.activeNeeds.length - first.activeNeeds.length ||
        second.scoreBreakdown.trustScore - first.scoreBreakdown.trustScore ||
        first.organization.name.localeCompare(second.organization.name),
    )
  const recommendedOrganizations = ranked.slice(0, recommendationLimit)
  const recommendedIds = new Set(
    recommendedOrganizations.map((item) => item.organization.id),
  )
  const allOrganizations = ranked
    .filter((item) => !recommendedIds.has(item.organization.id))
    .sort(
      (first, second) =>
        Number(second.activeNeeds.length > 0) -
          Number(first.activeNeeds.length > 0) ||
        second.scoreBreakdown.trustScore - first.scoreBreakdown.trustScore ||
        first.organization.name.localeCompare(second.organization.name),
    )
  return { recommendedOrganizations, allOrganizations }
}
