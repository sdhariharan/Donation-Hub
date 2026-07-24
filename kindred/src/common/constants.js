export const USER_ROLES = Object.freeze({
  DONOR: 'donor',
  ORGANIZATION: 'organization',
})

export const DONATION_STATUSES = Object.freeze({
  UPLOADED: 'Uploaded',
  ACCEPTED: 'Accepted',
  READY_FOR_PICKUP: 'Ready for Pickup',
  RECEIVED: 'Received',
  COMPLETED: 'Completed',
})

export const DONATION_STATUS_TRANSITIONS = Object.freeze({
  [DONATION_STATUSES.UPLOADED]: DONATION_STATUSES.ACCEPTED,
  [DONATION_STATUSES.ACCEPTED]: DONATION_STATUSES.READY_FOR_PICKUP,
  [DONATION_STATUSES.READY_FOR_PICKUP]: DONATION_STATUSES.RECEIVED,
  [DONATION_STATUSES.RECEIVED]: DONATION_STATUSES.COMPLETED,
  [DONATION_STATUSES.COMPLETED]: null,
})

export const DONATION_CATEGORIES = Object.freeze({
  CLOTHING: 'clothing',
  FOOD: 'food',
  EDUCATION: 'education',
  MEDICAL: 'medical',
  ELECTRONICS: 'electronics',
  HOUSEHOLD: 'household',
  HYGIENE: 'hygiene',
  OTHER: 'other',
})

export const URGENCY_LEVELS = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
})

export const DONATION_CONDITIONS = Object.freeze({
  NEW: 'new',
  LIKE_NEW: 'like-new',
  GOOD: 'good',
  FAIR: 'fair',
})

export const RECOMMENDATION_WEIGHTS = Object.freeze({
  NEED: 0.4,
  INVENTORY: 0.25,
  DISTANCE: 0.2,
  TRUST: 0.15,
})

export const GENERAL_ORGANIZATION_WEIGHTS = Object.freeze({
  ACTIVE_NEEDS: 0.25,
  URGENCY: 0.2,
  INVENTORY_NEED: 0.15,
  TRUST: 0.2,
  LOCATION: 0.15,
  PROFILE_COMPLETENESS: 0.05,
})

export const KINDRED_CHART_COLORS = Object.freeze({
  PRIMARY: '#fb8b24',
  GRID: '#f4dfca',
  SERIES: Object.freeze([
    '#fb8b24',
    '#c95f08',
    '#f4b56f',
    '#8f5a2a',
    '#d97706',
  ]),
})

export const APP_ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DONOR_DASHBOARD: '/donor/dashboard',
  DONOR_ORGANIZATIONS: '/donor/organizations',
  DONOR_ORGANIZATION_DETAILS: '/donor/organizations/:organizationId',
  DONOR_DONATIONS: '/donor/donations',
  DONOR_CREATE_DONATION: '/donor/donations/new',
  DONOR_IMPACT: '/donor/impact',
  DONOR_PROFILE: '/donor/profile',
  ORGANIZATION_DASHBOARD: '/organization/dashboard',
  ORGANIZATION_NEEDS: '/organization/needs',
  ORGANIZATION_DONATIONS: '/organization/donations',
  ORGANIZATION_IMPACT: '/organization/impact',
  ORGANIZATION_PROFILE: '/organization/profile',
})
