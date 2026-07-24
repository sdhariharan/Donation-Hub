import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import {
  formatCategory,
  ORGANIZATION_CATEGORIES,
  ORGANIZATION_URGENCIES,
} from '../../utils/organizationUtils'

const EMPTY_NEED = {
  category: '',
  itemName: '',
  quantityNeeded: '',
  quantityReceived: '0',
  urgency: '',
  description: '',
  isActive: true,
}

function validateNeed(need) {
  const errors = {}
  const needed = Number(need.quantityNeeded)
  const received = Number(need.quantityReceived)
  if (!ORGANIZATION_CATEGORIES.includes(need.category)) errors.category = 'Select a supported category.'
  if (!need.itemName.trim()) errors.itemName = 'Item name is required.'
  if (!Number.isInteger(needed) || needed <= 0) errors.quantityNeeded = 'Enter a positive whole number.'
  if (!Number.isInteger(received) || received < 0 || received > needed) {
    errors.quantityReceived = 'Enter a whole number from 0 to quantity needed.'
  }
  if (!ORGANIZATION_URGENCIES.includes(need.urgency)) errors.urgency = 'Select an urgency.'
  if (typeof need.isActive !== 'boolean') errors.isActive = 'Active status is invalid.'
  return errors
}

function NeedsForm({ need, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState(EMPTY_NEED)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(need ? { ...EMPTY_NEED, ...need } : EMPTY_NEED)
    setErrors({})
  }, [need])

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateNeed(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    const saved = await onSave({
      category: formData.category,
      itemName: formData.itemName.trim(),
      quantityNeeded: Number(formData.quantityNeeded),
      quantityReceived: Number(formData.quantityReceived),
      urgency: formData.urgency,
      description: formData.description.trim(),
      isActive: Boolean(formData.isActive),
    })
    if (saved && !need) setFormData(EMPTY_NEED)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Select a category"
          options={ORGANIZATION_CATEGORIES.map((value) => ({
            value,
            label: formatCategory(value),
          }))}
          error={errors.category}
        />
        <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} error={errors.itemName} />
        <Input label="Quantity Needed" name="quantityNeeded" type="number" min="1" step="1" value={formData.quantityNeeded} onChange={handleChange} error={errors.quantityNeeded} />
        <Input label="Quantity Received" name="quantityReceived" type="number" min="0" step="1" value={formData.quantityReceived} onChange={handleChange} error={errors.quantityReceived} />
        <Select
          label="Urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          placeholder="Select urgency"
          options={ORGANIZATION_URGENCIES.map((value) => ({
            value,
            label: formatCategory(value),
          }))}
          error={errors.urgency}
        />
        <label className="flex items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-kindred-orange focus:ring-kindred-orange"
          />
          Active need
        </label>
      </div>
      <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} helperText="Optional" />
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={loading} loadingText={need ? 'Updating need...' : 'Adding need...'}>
          {need ? 'Update need' : 'Add need'}
        </Button>
        {need && (
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default NeedsForm
