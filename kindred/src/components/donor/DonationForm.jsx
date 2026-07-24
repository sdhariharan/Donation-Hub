import { useEffect, useState } from 'react'
import { DONATION_CATEGORIES, DONATION_CONDITIONS } from '../../common/constants'
import { formatDataLabel, validateDonationImage } from '../../utils/donorUtils'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import DonationImageUpload from './DonationImageUpload'

const EMPTY_DONATION = {
  title: '',
  category: '',
  itemName: '',
  quantity: '',
  condition: '',
  description: '',
  pickupAddress: '',
  city: '',
  state: '',
  postalCode: '',
}

function DonationForm({
  donation,
  donorProfile,
  onSave,
  loading,
  onCancel,
  acceptedCategories,
}) {
  const [formData, setFormData] = useState(EMPTY_DONATION)
  const [imageFile, setImageFile] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const editableDonation = donation
      ? Object.fromEntries(
          Object.keys(EMPTY_DONATION).map((field) => [
            field,
            donation[field] ?? '',
          ]),
        )
      : {}
    setFormData({
      ...EMPTY_DONATION,
      pickupAddress: donorProfile?.address || '',
      city: donorProfile?.city || '',
      state: donorProfile?.state || '',
      postalCode: donorProfile?.postalCode || '',
      ...editableDonation,
    })
    setImageFile(null)
    setRemoveImage(false)
    setErrors({})
  }, [donation, donorProfile])

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const required = ['title', 'itemName', 'description', 'pickupAddress', 'city', 'state', 'postalCode']
    required.forEach((field) => {
      if (!String(formData[field] || '').trim()) nextErrors[field] = 'This field is required.'
    })
    if (!Object.values(DONATION_CATEGORIES).includes(formData.category)) nextErrors.category = 'Select a supported category.'
    else if (
      acceptedCategories &&
      !acceptedCategories.includes(formData.category)
    ) {
      nextErrors.category =
        'The selected organization does not accept this category.'
    }
    if (!Object.values(DONATION_CONDITIONS).includes(formData.condition)) nextErrors.condition = 'Select a condition.'
    const quantity = Number(formData.quantity)
    if (!Number.isInteger(quantity) || quantity <= 0) nextErrors.quantity = 'Enter a positive whole number.'
    const imageError = validateDonationImage(imageFile)
    if (imageError) nextErrors.image = imageError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const data = Object.fromEntries(
      Object.entries(formData).map(([field, value]) => [
        field,
        field === 'quantity' ? quantity : String(value).trim(),
      ]),
    )
    await onSave(data, { imageFile, removeImage })
  }

  const categoryOptions = Object.values(DONATION_CATEGORIES).map((value) => ({ value, label: formatDataLabel(value) }))
  const conditionOptions = Object.values(DONATION_CONDITIONS).map((value) => ({ value, label: formatDataLabel(value) }))

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Title" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
        <Select label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="Select category" options={categoryOptions} error={errors.category} />
        <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} error={errors.itemName} />
        <Input label="Quantity" name="quantity" type="number" min="1" step="1" value={formData.quantity} onChange={handleChange} error={errors.quantity} />
        <Select label="Condition" name="condition" value={formData.condition} onChange={handleChange} placeholder="Select condition" options={conditionOptions} error={errors.condition} />
        <Input label="Pickup Address" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} error={errors.pickupAddress} />
        <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
        <Input label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
        <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} error={errors.postalCode} />
      </div>
      <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
      <DonationImageUpload
        currentImageUrl={donation?.imageUrl}
        file={imageFile}
        removeCurrent={removeImage}
        onRemoveCurrent={() => setRemoveImage(true)}
        onFileChange={(file, imageError) => {
          setImageFile(file)
          if (file) setRemoveImage(false)
          setErrors((current) => ({ ...current, image: imageError }))
        }}
        error={errors.image}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={loading} loadingText={donation ? 'Updating donation...' : 'Creating donation...'}>
          {donation ? 'Update donation' : 'Create donation'}
        </Button>
        {onCancel && <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>}
      </div>
    </form>
  )
}

export default DonationForm
