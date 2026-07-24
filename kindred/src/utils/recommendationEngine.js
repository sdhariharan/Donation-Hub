import {
  RECOMMENDATION_WEIGHTS,
  URGENCY_LEVELS,
} from '../common/constants'
import { formatDataLabel } from './donorUtils'

const clamp = (value) => Math.min(100, Math.max(0, value))

export function normalizeMatchingText(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getNeedResult(donation, organization) {
  const donationItem = normalizeMatchingText(donation?.itemName)
  const validUrgencies = Object.values(URGENCY_LEVELS)
  const urgencyScores = {
    [URGENCY_LEVELS.HIGH]: { exact: 100, partial: 90, category: 75 },
    [URGENCY_LEVELS.MEDIUM]: { exact: 90, partial: 80, category: 65 },
    [URGENCY_LEVELS.LOW]: { exact: 80, partial: 70, category: 55 },
  }
  let best = { score: 30, need: null, matchType: 'accepted-category' }

  for (const need of organization?.needs || []) {
    const needItem = normalizeMatchingText(need?.itemName)
    if (
      need?.isActive !== true ||
      need?.category !== donation?.category ||
      !validUrgencies.includes(need?.urgency) ||
      !needItem
    ) {
      continue
    }

    let matchType = 'category'
    if (donationItem && donationItem === needItem) matchType = 'exact'
    else if (
      donationItem &&
      (donationItem.includes(needItem) || needItem.includes(donationItem))
    ) {
      matchType = 'partial'
    }
    const score = urgencyScores[need.urgency][matchType]
    if (score > best.score) best = { score, need, matchType }
  }
  return best
}

export function calculateNeedScore(donation, organization) {
  return getNeedResult(donation, organization).score
}

export function calculateInventoryScore(donation, organization) {
  const rawValue = organization?.inventory?.[donation?.category]
  if (
    typeof rawValue !== 'number' ||
    !Number.isFinite(rawValue) ||
    rawValue < 0
  ) {
    return 50
  }
  const inventory = rawValue
  if (inventory <= 10) return 100
  if (inventory <= 25) return 80
  if (inventory <= 50) return 60
  if (inventory <= 100) return 40
  return 20
}

export function calculateDistanceScore(donation, organization) {
  const donationCity = normalizeMatchingText(donation?.city)
  const donationState = normalizeMatchingText(donation?.state)
  const organizationCity = normalizeMatchingText(organization?.city)
  const organizationState = normalizeMatchingText(organization?.state)
  if (!donationCity || !donationState || !organizationCity || !organizationState) {
    return 30
  }
  if (
    donationCity === organizationCity &&
    donationState === organizationState
  ) {
    return 100
  }
  if (donationState === organizationState) return 60
  return 30
}

export function calculateTrustScore(organization) {
  const rawValue = organization?.trustScore
  if (
    typeof rawValue !== 'number' ||
    !Number.isFinite(rawValue)
  ) {
    return 50
  }
  return clamp(rawValue)
}

function createMatchReasons(
  donation,
  organization,
  needResult,
  inventoryScore,
  distanceScore,
  trustScore,
) {
  const reasons = []
  if (needResult.need) {
    const urgency = formatDataLabel(needResult.need.urgency)
    const matchPrefix =
      needResult.matchType === 'exact'
        ? `${urgency} urgency need for`
        : needResult.matchType === 'partial'
          ? `${urgency} urgency related need for`
          : `${urgency} urgency need in this category for`
    reasons.push(`${matchPrefix} ${needResult.need.itemName}`)
  } else {
    reasons.push(`Accepts ${formatDataLabel(donation.category)} donations`)
  }

  if (inventoryScore >= 80) {
    reasons.push(`Very low ${formatDataLabel(donation.category)} inventory`)
  } else if (inventoryScore === 60) {
    reasons.push(`Moderate ${formatDataLabel(donation.category)} inventory`)
  } else if (inventoryScore === 50) {
    reasons.push('Inventory level is not currently available')
  } else {
    reasons.push(`Currently has higher ${formatDataLabel(donation.category)} inventory`)
  }

  if (distanceScore === 100) reasons.push('Located in the same city')
  else if (distanceScore === 60) reasons.push('Located in the same state')
  else reasons.push('Located outside the same local area')

  if (trustScore >= 75) reasons.push('Strong organization trust score')
  else if (trustScore >= 50) reasons.push('Established organization trust score')
  else reasons.push('Developing organization trust score')
  return reasons.slice(0, 4)
}

function isEligibleOrganization(donation, organization) {
  const hasDisplayData = Boolean(
    (normalizeMatchingText(organization?.city) &&
      normalizeMatchingText(organization?.state)) ||
      organization?.description ||
      organization?.email ||
      organization?.phone ||
      organization?.address,
  )
  return Boolean(
    organization?.id &&
      organization?.ownerId &&
      normalizeMatchingText(organization?.name) &&
      organization?.active !== false &&
      Array.isArray(organization?.categoriesAccepted) &&
      organization.categoriesAccepted.includes(donation?.category) &&
      hasDisplayData,
  )
}

export function calculateOrganizationRecommendation(donation, organization) {
  if (!isEligibleOrganization(donation, organization)) return null
  const needResult = getNeedResult(donation, organization)
  const inventoryScore = calculateInventoryScore(donation, organization)
  const distanceScore = calculateDistanceScore(donation, organization)
  const trustScore = calculateTrustScore(organization)
  // Centralized weights make the deterministic score explainable and keep all
  // recommendation cards comparable.
  const finalScore = clamp(
    Math.round(
      needResult.score * RECOMMENDATION_WEIGHTS.NEED +
        inventoryScore * RECOMMENDATION_WEIGHTS.INVENTORY +
        distanceScore * RECOMMENDATION_WEIGHTS.DISTANCE +
        trustScore * RECOMMENDATION_WEIGHTS.TRUST,
    ),
  )

  return {
    organizationId: organization.id,
    organization,
    finalScore,
    scoreBreakdown: {
      needScore: needResult.score,
      inventoryScore,
      distanceScore,
      trustScore,
    },
    relevantNeed: needResult.need,
    matchReasons: createMatchReasons(
      donation,
      organization,
      needResult,
      inventoryScore,
      distanceScore,
      trustScore,
    ),
  }
}

export function getTopOrganizationRecommendations(
  donation,
  organizations,
  limit = 3,
) {
  return organizations
    .map((organization) =>
      calculateOrganizationRecommendation(donation, organization),
    )
    .filter(Boolean)
    // Business tie-breakers ensure identical inputs always receive a stable,
    // deterministic organization order.
    .sort(
      (first, second) =>
        second.finalScore - first.finalScore ||
        second.scoreBreakdown.needScore - first.scoreBreakdown.needScore ||
        second.scoreBreakdown.distanceScore -
          first.scoreBreakdown.distanceScore ||
        second.scoreBreakdown.trustScore - first.scoreBreakdown.trustScore ||
        first.organization.name.localeCompare(second.organization.name, undefined, {
          sensitivity: 'base',
        }),
    )
    .slice(0, Math.max(0, limit))
}
