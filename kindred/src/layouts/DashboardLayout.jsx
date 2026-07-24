import { useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { DASHBOARD_NAVIGATION } from '../common/dashboardNavigation'
import { APP_ROUTES } from '../common/constants'
import ErrorMessage from '../components/common/ErrorMessage'
import MobileSidebar from '../components/navigation/MobileSidebar'
import Sidebar from '../components/navigation/Sidebar'
import Topbar from '../components/navigation/Topbar'
import useAuth from '../hooks/useAuth'

function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const menuButtonRef = useRef(null)
  const { userProfile, role, logout, authLoading } = useAuth()
  const navigate = useNavigate()
  const navigationItems = DASHBOARD_NAVIGATION[role] || []

  const handleLogout = async () => {
    setLogoutError('')

    try {
      await logout()
      navigate(APP_ROUTES.LOGIN, { replace: true })
    } catch (error) {
      setLogoutError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-kindred-cream/60 lg:flex">
      <Sidebar
        navigationItems={navigationItems}
        userProfile={userProfile}
        role={role}
        onLogout={handleLogout}
        logoutLoading={authLoading}
      />

      <MobileSidebar
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        returnFocusRef={menuButtonRef}
        navigationItems={navigationItems}
        userProfile={userProfile}
        role={role}
        onLogout={handleLogout}
        logoutLoading={authLoading}
      />

      <div className="min-w-0 flex-1">
        <Topbar
          userProfile={userProfile}
          role={role}
          onMenuOpen={() => setIsMobileMenuOpen(true)}
          menuButtonRef={menuButtonRef}
        />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-5">
            <ErrorMessage message={logoutError} />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
