import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ErrorMessage from '../../components/common/ErrorMessage'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import { APP_ROUTES } from '../../common/constants'
import useAuth from '../../hooks/useAuth'
import {
  getDashboardRoute,
  getValidReturnRoute,
  validateLoginForm,
} from '../../utils/authUtils'

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState({})
  const { login, authLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setValidationErrors((current) => ({ ...current, [name]: '' }))
    clearError()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validateLoginForm(formData)
    setValidationErrors(errors)

    if (Object.keys(errors).length) return

    try {
      const profile = await login({
        email: formData.email.trim(),
        password: formData.password,
      })
      const returnRoute = getValidReturnRoute(location.state?.from, profile.role)
      navigate(returnRoute || getDashboardRoute(profile.role), {
        replace: true,
      })
    } catch {
      // AuthContext exposes the readable error.
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-lg items-center px-4 py-14 sm:px-6 lg:py-20">
      <div className="w-full rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-900/5 sm:p-9">
        <p className="text-sm font-bold uppercase tracking-widest text-kindred-orange-dark">
          Kindred account
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-slate-600">
          Log in to continue matching donations with real needs.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={error} />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
            autoComplete="email"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={validationErrors.password}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            disabled={authLoading}
            size="large"
            className="w-full"
          >
            {authLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Kindred?{' '}
          <Link
            to={APP_ROUTES.REGISTER}
            className="font-semibold text-kindred-orange-dark underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
