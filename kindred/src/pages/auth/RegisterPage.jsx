import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../../components/common/ErrorMessage'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import { APP_ROUTES, USER_ROLES } from '../../common/constants'
import useAuth from '../../hooks/useAuth'
import { getDashboardRoute, validateRegistrationForm } from '../../utils/authUtils'

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
}

function RegisterPage() {
  const [formData, setFormData] = useState(initialFormData)
  const [validationErrors, setValidationErrors] = useState({})
  const { register, authLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setValidationErrors((current) => ({ ...current, [name]: '' }))
    clearError()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validateRegistrationForm(formData)
    setValidationErrors(errors)

    if (Object.keys(errors).length) return

    try {
      const profile = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      })
      navigate(getDashboardRoute(profile.role), { replace: true })
    } catch {
      // AuthContext exposes the readable error.
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-lg items-center px-4 py-14 sm:px-6 lg:py-20">
      <div className="w-full rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-900/5 sm:p-9">
        <p className="text-sm font-bold uppercase tracking-widest text-kindred-orange-dark">
          Join Kindred
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Create an account</h1>
        <p className="mt-2 text-slate-600">
          Choose how you will participate in demand-first giving.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <ErrorMessage message={error} />
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={validationErrors.name}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={validationErrors.confirmPassword}
            autoComplete="new-password"
          />

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-slate-700">
              I am joining as
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [USER_ROLES.DONOR, 'Donor', 'Offer items where they are needed'],
                [USER_ROLES.ORGANIZATION, 'Organization', 'Publish needs and receive donations'],
              ].map(([value, label, helper]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    formData.role === value
                      ? 'border-kindred-orange bg-kindred-cream ring-2 ring-kindred-orange/20'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-kindred-cream'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={formData.role === value}
                    onChange={handleChange}
                    className="h-4 w-4 text-kindred-orange focus:ring-kindred-orange"
                  />
                  <span className="ml-2 font-semibold text-slate-900">{label}</span>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span>
                </label>
              ))}
            </div>
            {validationErrors.role && (
              <p id="role-error" className="mt-1.5 text-sm text-red-700">
                {validationErrors.role}
              </p>
            )}
          </fieldset>

          <Button
            type="submit"
            disabled={authLoading}
            size="large"
            className="w-full"
          >
            {authLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to={APP_ROUTES.LOGIN}
            className="font-semibold text-kindred-orange-dark underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
