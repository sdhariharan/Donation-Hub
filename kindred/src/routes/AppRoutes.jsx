import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loading from '../components/common/Loading'
import PublicLayout from '../layouts/PublicLayout'
import { APP_ROUTES, USER_ROLES } from '../common/constants'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import RoleProtectedRoute from './RoleProtectedRoute'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const DonorDashboardPage = lazy(() => import('../pages/donor/DonorDashboardPage'))
const CreateDonationPage = lazy(() => import('../pages/donor/CreateDonationPage'))
const DonationDetailsPage = lazy(() => import('../pages/donor/DonationDetailsPage'))
const DonorDonationsPage = lazy(() => import('../pages/donor/DonorDonationsPage'))
const DonorProfilePage = lazy(() => import('../pages/donor/DonorProfilePage'))
const OrganizationDirectoryPage = lazy(
  () => import('../pages/donor/OrganizationDirectoryPage'),
)
const OrganizationDirectoryDetailsPage = lazy(
  () => import('../pages/donor/OrganizationDirectoryDetailsPage'),
)
const OrganizationDashboardPage = lazy(
  () => import('../pages/organization/OrganizationDashboardPage'),
)
const OrganizationNeedsPage = lazy(
  () => import('../pages/organization/OrganizationNeedsPage'),
)
const OrganizationProfilePage = lazy(
  () => import('../pages/organization/OrganizationProfilePage'),
)
const IncomingDonationsPage = lazy(
  () => import('../pages/organization/IncomingDonationsPage'),
)
const OrganizationDonationDetailsPage = lazy(
  () => import('../pages/organization/OrganizationDonationDetailsPage'),
)
const DonorImpactPage = lazy(() => import('../pages/impact/DonorImpactPage'))
const OrganizationImpactPage = lazy(
  () => import('../pages/impact/OrganizationImpactPage'),
)
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loading message="Loading page..." />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={APP_ROUTES.HOME} element={<LandingPage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.DONOR} />}>
            <Route path="/donor" element={<DashboardLayout />}>
              <Route path="dashboard" element={<DonorDashboardPage />} />
              <Route path="organizations" element={<OrganizationDirectoryPage />} />
              <Route
                path="organizations/:organizationId"
                element={<OrganizationDirectoryDetailsPage />}
              />
              <Route path="donations" element={<DonorDonationsPage />} />
              <Route path="donations/new" element={<CreateDonationPage />} />
              <Route path="donations/:donationId" element={<DonationDetailsPage />} />
              <Route path="impact" element={<DonorImpactPage />} />
              <Route path="profile" element={<DonorProfilePage />} />
            </Route>
          </Route>
          <Route element={<RoleProtectedRoute allowedRole={USER_ROLES.ORGANIZATION} />}>
            <Route path="/organization" element={<DashboardLayout />}>
              <Route path="dashboard" element={<OrganizationDashboardPage />} />
              <Route path="needs" element={<OrganizationNeedsPage />} />
              <Route path="donations" element={<IncomingDonationsPage />} />
              <Route
                path="donations/:donationId"
                element={<OrganizationDonationDetailsPage />}
              />
              <Route path="impact" element={<OrganizationImpactPage />} />
              <Route path="profile" element={<OrganizationProfilePage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
