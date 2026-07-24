import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loading from '../components/common/Loading'
import { APP_ROUTES } from '../common/constants'
import useAuth from '../hooks/useAuth'

function ProtectedRoute() {
  const { user, userProfile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Checking your session..." />
  }

  if (!user || !userProfile) {
    return (
      <Navigate
        to={APP_ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
