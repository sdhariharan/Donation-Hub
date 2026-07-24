import { useEffect, useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import {
  createEmptyInventory,
  formatCategory,
  ORGANIZATION_CATEGORIES,
} from '../../utils/organizationUtils'

function InventoryForm({ inventory, onSave, loading, disabled }) {
  const [values, setValues] = useState(createEmptyInventory)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues({ ...createEmptyInventory(), ...inventory })
  }, [inventory])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const normalized = {}

    ORGANIZATION_CATEGORIES.forEach((category) => {
      const value = values[category] === '' ? 0 : Number(values[category])
      if (!Number.isInteger(value) || value < 0) {
        nextErrors[category] = 'Enter a whole number of 0 or more.'
      } else {
        normalized[category] = value
      }
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    await onSave(normalized)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ORGANIZATION_CATEGORIES.map((category) => (
          <Input
            key={category}
            label={formatCategory(category)}
            name={`inventory-${category}`}
            type="number"
            min="0"
            step="1"
            value={values[category]}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                [category]: event.target.value,
              }))
              setErrors((current) => ({ ...current, [category]: '' }))
            }}
            error={errors[category]}
            disabled={disabled}
          />
        ))}
      </div>
      <Button
        type="submit"
        loading={loading}
        loadingText="Saving inventory..."
        disabled={disabled}
      >
        Save inventory
      </Button>
    </form>
  )
}

export default InventoryForm
