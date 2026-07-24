import { useState } from 'react'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import DonorProfileForm from '../../components/donor/DonorProfileForm'
import useDonorProfile from '../../hooks/useDonorProfile'
import { calculateDonorProfileCompletion } from '../../utils/donorUtils'

function DonorProfilePage() {
  const { profile, loading, actionLoading, error, updateProfile, clearError } = useDonorProfile()
  const [success, setSuccess] = useState('')
  if (loading) return <Loading message="Loading donor profile..." />
  const completion = calculateDonorProfileCompletion(profile)

  const handleSave = async (data) => {
    clearError()
    setSuccess('')
    try {
      await updateProfile(data)
      setSuccess('Donor profile updated successfully.')
    } catch {
      // useDonorProfile exposes the readable error.
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Donor profile" description="Keep pickup contact and location details ready for donation creation." />
      <ErrorMessage message={error} />
      {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{success}</div>}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-950">Profile completion: {completion}%</h2>
          <p className="mt-1 text-sm text-slate-500">Email is linked to authentication and cannot be changed here.</p>
        </div>
        <DonorProfileForm profile={profile} onSave={handleSave} loading={actionLoading} />
      </Card>
    </div>
  )
}

export default DonorProfilePage
