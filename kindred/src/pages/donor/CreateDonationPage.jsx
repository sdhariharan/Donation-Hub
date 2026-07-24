import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import DonationForm from '../../components/donor/DonationForm'
import SelectedOrganizationBanner from '../../components/organizations/SelectedOrganizationBanner'
import useDonations from '../../hooks/useDonations'
import useDonorProfile from '../../hooks/useDonorProfile'
import useOrganizationDirectory from '../../hooks/useOrganizationDirectory'
import { calculateDonorProfileCompletion } from '../../utils/donorUtils'

function CreateDonationPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const organizationId = searchParams.get('organizationId')
  const { profile, loading: profileLoading } = useDonorProfile()
  const { createDonation, actionLoading, error, clearError } = useDonations({ loadList: false })
  const directory = useOrganizationDirectory({ loadList: false })
  const {
    clearSelectedOrganization,
    loadOrganizationDetails,
  } = directory

  useEffect(() => {
    if (organizationId) loadOrganizationDetails(organizationId)
    else clearSelectedOrganization()
  }, [clearSelectedOrganization, loadOrganizationDetails, organizationId])

  if (profileLoading || directory.detailLoading) {
    return <Loading message="Preparing donation form..." />
  }

  const handleSave = async (data, { imageFile }) => {
    clearError()
    try {
      const created = await createDonation(
        data,
        imageFile,
        directory.selectedOrganization?.id || null,
      )
      navigate(`/donor/donations/${created.id}`, { replace: true })
    } catch {
      // useDonations exposes creation and cleanup errors.
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Create donation" description="Describe the available item and pickup location for future organization matching." />
      <ErrorMessage message={error || directory.error} />
      {directory.selectedOrganization && (
        <SelectedOrganizationBanner
          organization={directory.selectedOrganization}
          onRemove={() => {
            clearSelectedOrganization()
            setSearchParams({}, { replace: true })
          }}
        />
      )}
      {calculateDonorProfileCompletion(profile) < 100 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your donor profile is incomplete. You can continue, but complete it to make future donation entry faster.
        </div>
      )}
      <Card>
        <DonationForm
          donorProfile={profile}
          onSave={handleSave}
          loading={Boolean(actionLoading)}
          acceptedCategories={
            directory.selectedOrganization?.categoriesAccepted
          }
        />
        {actionLoading === 'image-upload' && <p className="mt-3 text-sm text-slate-500">Uploading image...</p>}
        {actionLoading === 'image-cleanup' && <p className="mt-3 text-sm text-slate-500">Cleaning up image...</p>}
      </Card>
    </div>
  )
}

export default CreateDonationPage
