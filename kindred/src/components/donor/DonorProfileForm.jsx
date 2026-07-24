import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

const EMPTY_PROFILE = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
}

function DonorProfileForm({ profile, onSave, loading }) {
  const [formData, setFormData] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postalCode: profile?.postalCode || '',
    })
  }, [profile])

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const labels = {
      name: 'Full name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      postalCode: 'Postal code',
    }
    Object.entries(labels).forEach(([field, label]) => {
      if (!formData[field]?.trim()) nextErrors[field] = `${label} is required.`
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    await onSave({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" value={formData.email} readOnly helperText="Email changes require a separate secure account flow." />
        <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} />
        <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
        <Input label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
        <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
      </div>
      <Button type="submit" loading={loading} loadingText="Saving profile...">
        Save profile
      </Button>
    </form>
  )
}

export default DonorProfileForm
