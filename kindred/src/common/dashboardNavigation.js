import { APP_ROUTES, USER_ROLES } from './constants'

export const DASHBOARD_NAVIGATION = Object.freeze({
  [USER_ROLES.DONOR]: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.DONOR_DASHBOARD,
      icon: 'layout-dashboard',
      available: true,
    },
    {
      label: 'Discover Organizations',
      path: APP_ROUTES.DONOR_ORGANIZATIONS,
      icon: 'search',
      available: true,
    },
    {
      label: 'My Donations',
      path: APP_ROUTES.DONOR_DONATIONS,
      icon: 'gift',
      available: true,
    },
    {
      label: 'Create Donation',
      path: APP_ROUTES.DONOR_CREATE_DONATION,
      icon: 'circle-plus',
      available: true,
    },
    {
      label: 'Impact',
      path: APP_ROUTES.DONOR_IMPACT,
      icon: 'heart-handshake',
      available: true,
    },
    {
      label: 'Profile',
      path: APP_ROUTES.DONOR_PROFILE,
      icon: 'user-round',
      available: true,
    },
  ],
  [USER_ROLES.ORGANIZATION]: [
    {
      label: 'Dashboard',
      path: APP_ROUTES.ORGANIZATION_DASHBOARD,
      icon: 'layout-dashboard',
      available: true,
    },
    {
      label: 'Needs & Inventory',
      path: APP_ROUTES.ORGANIZATION_NEEDS,
      icon: 'clipboard-list',
      available: true,
    },
    {
      label: 'Incoming Donations',
      path: APP_ROUTES.ORGANIZATION_DONATIONS,
      icon: 'inbox',
      available: true,
    },
    {
      label: 'Impact',
      path: APP_ROUTES.ORGANIZATION_IMPACT,
      icon: 'heart-handshake',
      available: true,
    },
    {
      label: 'Profile',
      path: APP_ROUTES.ORGANIZATION_PROFILE,
      icon: 'user-round',
      available: true,
    },
  ],
})
