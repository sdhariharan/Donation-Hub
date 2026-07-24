import { useState } from 'react'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import InventoryForm from '../../components/organization/InventoryForm'
import OrganizationProfileForm from '../../components/organization/OrganizationProfileForm'
import useAuth from '../../hooks/useAuth'
import useOrganization from '../../hooks/useOrganization'

function SuccessMessage({ message }) {
  if (!message) return null
  return <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{message}</div>
}

function OrganizationProfilePage() {
  const { user } = useAuth()
  const { organization, loading, actionLoading, error, saveProfile, saveInventory, clearError } = useOrganization()
  const [profileSuccess, setProfileSuccess] = useState('')
  const [inventorySuccess, setInventorySuccess] = useState('')

  if (loading) return <Loading message="Loading organization profile..." />

  const handleProfileSave = async (data) => {
    clearError()
    setProfileSuccess('')
    try {
      await saveProfile(data)
      setProfileSuccess('Organization profile saved successfully.')
    } catch {
      // useOrganization exposes the readable write error.
    }
  }
  const handleInventorySave = async (inventory) => {
    clearError()
    setInventorySuccess('')
    try {
      await saveInventory(inventory)
      setInventorySuccess('Inventory saved successfully.')
    } catch {
      // useOrganization exposes the readable write error.
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Organization profile" description="Maintain the organization details and accepted donation categories used by Kindred." />
      <ErrorMessage message={error} />
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">Profile details</h2>
          <p className="mt-1 text-sm text-slate-500">Trust score and ownership are managed by Kindred and cannot be edited here.</p>
        </div>
        <div className="mb-5"><SuccessMessage message={profileSuccess} /></div>
        <OrganizationProfileForm organization={organization} defaultEmail={user?.email} onSave={handleProfileSave} loading={actionLoading === 'profile'} />
      </Card>
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">Inventory</h2>
          <p className="mt-1 text-sm text-slate-500">Record the current whole-item count for every supported category.</p>
        </div>
        <div className="mb-5"><SuccessMessage message={inventorySuccess} /></div>
        <InventoryForm inventory={organization?.inventory} onSave={handleInventorySave} loading={actionLoading === 'inventory'} disabled={!organization} />
        {!organization && <p className="mt-4 text-sm text-amber-700">Save the profile details before managing inventory.</p>}
      </Card>
    </div>
  )
}

export default OrganizationProfilePage
