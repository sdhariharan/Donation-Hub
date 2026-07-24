import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/authUtils'

function RoleProtectedRoute({ allowedRole }) {
  const { role } = useAuth()

  if (role !== allowedRole) {
    return <Navigate to={getDashboardRoute(role)} replace />
  }

  return <Outlet />
}

export default RoleProtectedRoute
