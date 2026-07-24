import { APP_ROUTES, USER_ROLES } from '../common/constants'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_ROLES = Object.values(USER_ROLES)

export function isValidRole(role) {
  return VALID_ROLES.includes(role)
}

export function getDashboardRoute(role) {
  return role === USER_ROLES.ORGANIZATION
    ? APP_ROUTES.ORGANIZATION_DASHBOARD
    : APP_ROUTES.DONOR_DASHBOARD
}

export function getValidReturnRoute(from, role) {
  const pathname = from?.pathname

  if (
    role === USER_ROLES.DONOR &&
    pathname === APP_ROUTES.DONOR_DASHBOARD
  ) {
    return pathname
  }

  if (
    role === USER_ROLES.ORGANIZATION &&
    pathname === APP_ROUTES.ORGANIZATION_DASHBOARD
  ) {
    return pathname
  }

  return null
}

function validateCredentials({ email, password }) {
  const errors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must contain at least 6 characters.'
  }

  return errors
}

export function validateLoginForm(formData) {
  return validateCredentials(formData)
}

export function validateRegistrationForm(formData) {
  const errors = validateCredentials(formData)

  if (!formData.name.trim()) {
    errors.name = 'Full name is required.'
  }

  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!isValidRole(formData.role)) {
    errors.role = 'Select either Donor or Organization.'
  }

  return errors
}

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'An account already exists for this email.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Password is required.',
  'auth/network-request-failed':
    'Unable to reach Firebase. Check your connection and try again.',
  'auth/too-many-requests':
    'Too many attempts. Wait a moment before trying again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/weak-password': 'Password must contain at least 6 characters.',
}

export function getReadableAuthError(error) {
  if (error?.message?.startsWith('Firebase is not configured.')) {
    return error.message
  }

  return (
    AUTH_ERROR_MESSAGES[error?.code] ||
    error?.message ||
    'Authentication could not be completed. Please try again.'
  )
}
