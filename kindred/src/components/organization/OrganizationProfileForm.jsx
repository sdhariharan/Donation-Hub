import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import {
  formatCategory,
  ORGANIZATION_CATEGORIES,
} from '../../utils/organizationUtils'

const EMPTY_PROFILE = {
  name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  categoriesAccepted: [],
}
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateProfile(profile) {
  const errors = {}
  const labels = {
    name: 'Organization name',
    description: 'Description',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    postalCode: 'Postal code',
  }

  Object.entries(labels).forEach(([field, label]) => {
    if (!profile[field].trim()) errors[field] = `${label} is required.`
  })
  if (profile.email && !EMAIL_PATTERN.test(profile.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!profile.categoriesAccepted.length) {
    errors.categoriesAccepted = 'Select at least one accepted category.'
  }
  return errors
}

function OrganizationProfileForm({
  organization,
  defaultEmail,
  onSave,
  loading,
}) {
  const [formData, setFormData] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData({
      ...EMPTY_PROFILE,
      ...organization,
      email: organization?.email || defaultEmail || '',
      categoriesAccepted: organization?.categoriesAccepted || [],
    })
  }, [defaultEmail, organization])

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const toggleCategory = (category) => {
    setFormData((current) => ({
      ...current,
      categoriesAccepted: current.categoriesAccepted.includes(category)
        ? current.categoriesAccepted.filter((item) => item !== category)
        : [...current.categoriesAccepted, category],
    }))
    setErrors((current) => ({ ...current, categoriesAccepted: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateProfile(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    const normalized = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ]),
    )
    await onSave(normalized)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Organization Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
        <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
        <Input label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
        <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
      </div>
      <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">
          Categories Accepted
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIZATION_CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={formData.categoriesAccepted.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-slate-300 text-kindred-orange focus:ring-kindred-orange"
              />
              {formatCategory(category)}
            </label>
          ))}
        </div>
        {errors.categoriesAccepted && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {errors.categoriesAccepted}
          </p>
        )}
      </fieldset>

      <Button type="submit" loading={loading} loadingText="Saving profile...">
        {organization ? 'Save profile changes' : 'Create organization profile'}
      </Button>
    </form>
  )
}

export default OrganizationProfileForm
