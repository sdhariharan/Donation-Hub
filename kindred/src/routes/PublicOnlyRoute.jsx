import { Navigate, Outlet } from 'react-router-dom'
import Loading from '../components/common/Loading'
import useAuth from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/authUtils'

function PublicOnlyRoute() {
  const { user, userProfile, role, loading } = useAuth()

  if (loading) {
    return <Loading message="Checking your session..." />
  }

  if (user && userProfile) {
    return <Navigate to={getDashboardRoute(role)} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
