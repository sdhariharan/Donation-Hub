import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { APP_ROUTES, DONATION_STATUSES } from '../../common/constants'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import DonationDetailsCard from '../../components/donor/DonationDetailsCard'
import DonationForm from '../../components/donor/DonationForm'
import RecommendationList from '../../components/recommendations/RecommendationList'
import TrackingHistory from '../../components/tracking/TrackingHistory'
import TrackingStepper from '../../components/tracking/TrackingStepper'
import useAuth from '../../hooks/useAuth'
import useDonations from '../../hooks/useDonations'
import useDonorProfile from '../../hooks/useDonorProfile'
import useDonationTracking from '../../hooks/useDonationTracking'
import useRecommendations from '../../hooks/useRecommendations'
import {
  canModifyDonation,
  canRecommendOrganizations,
} from '../../utils/donorUtils'

function DonationDetailsPage() {
  const { donationId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useDonorProfile()
  const {
    selectedDonation,
    detailLoading,
    actionLoading,
    error,
    loadDonation,
    updateDonation,
    deleteDonation,
    clearError,
  } = useDonations({ loadList: false })
  const {
    recommendations,
    loading: recommendationsLoading,
    selectingOrganizationId,
    error: recommendationError,
    hasLoaded,
    loadRecommendations,
    selectOrganization,
    clearRecommendations,
    clearError: clearRecommendationError,
  } = useRecommendations()
  const {
    tracking,
    trackingLoading,
    error: trackingError,
    loadTracking: loadDonationTracking,
  } = useDonationTracking()
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState('')
  const [selectionCommitted, setSelectionCommitted] = useState(false)

  useEffect(() => {
    loadDonation(donationId)
  }, [donationId, loadDonation])

  useEffect(() => {
    if (selectedDonation?.selectedOrganizationId) {
      loadDonationTracking(selectedDonation)
    }
  }, [loadDonationTracking, selectedDonation])

  if (detailLoading) return <Loading message="Loading donation details..." />
  const editable =
    !selectionCommitted && canModifyDonation(selectedDonation, user?.uid)
  const recommendationEligible =
    !selectionCommitted &&
    canRecommendOrganizations(selectedDonation, user?.uid)

  const handleUpdate = async (data, imageChanges) => {
    clearError()
    setSuccess('')
    try {
      await updateDonation(donationId, data, imageChanges)
      setEditing(false)
      setSuccess('Donation updated successfully.')
    } catch {
      // useDonations exposes update and cleanup errors.
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${selectedDonation.title}"?`)) return
    clearError()
    try {
      const deleted = await deleteDonation(donationId)
      navigate(APP_ROUTES.DONOR_DONATIONS, {
        replace: true,
        state: {
          notice: deleted.cleanupWarning || 'Donation deleted successfully.',
          noticeType: deleted.cleanupWarning ? 'warning' : 'success',
        },
      })
    } catch {
      // useDonations exposes deletion errors.
    }
  }

  const handleLoadRecommendations = async () => {
    setSuccess('')
    clearRecommendationError()
    await loadRecommendations(selectedDonation)
  }

  const handleSelectOrganization = async (recommendation) => {
    const organizationName = recommendation.organization.name
    if (
      !window.confirm(
        `Select "${organizationName}" for this donation? You will no longer be able to edit or delete it.`,
      )
    ) {
      return
    }

    setSuccess('')
    clearRecommendationError()
    try {
      await selectOrganization(
        selectedDonation,
        recommendation.organizationId,
      )
      setSelectionCommitted(true)
      await loadDonation(donationId)
      clearRecommendations()
      setEditing(false)
      setSuccess(
        `${organizationName} was selected. The donation remains Uploaded until organization acceptance is implemented.`,
      )
    } catch {
      // useRecommendations exposes the readable transaction error.
    }
  }

  if (!selectedDonation) {
    return (
      <Card>
        <ErrorMessage message={error || 'Donation not found or unavailable.'} />
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={editing ? 'Edit donation' : 'Donation details'}
        description={
          editing
            ? 'Only Uploaded, unassigned donations may be edited.'
            : 'Review the donation and compare eligible organizations.'
        }
        action={
          !editing && (
            <div className="flex flex-wrap gap-2">
              {editable && (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {editable && (
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={actionLoading === 'delete'}
                  loadingText="Deleting..."
                >
                  Delete
                </Button>
              )}
              {recommendationEligible && (
                <Button
                  onClick={handleLoadRecommendations}
                  loading={recommendationsLoading}
                  loadingText="Finding organizations..."
                >
                  Find Recommended Organizations
                </Button>
              )}
            </div>
          )
        }
      />
      <ErrorMessage message={error} />
      <ErrorMessage message={recommendationError} />
      <ErrorMessage message={trackingError} />
      {success && (
        <div
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {success}
        </div>
      )}

      {editing ? (
        <Card>
          <DonationForm
            donation={selectedDonation}
            donorProfile={profile}
            onSave={handleUpdate}
            onCancel={() => setEditing(false)}
            loading={Boolean(actionLoading)}
          />
          {actionLoading === 'image-upload' && (
            <p className="mt-3 text-sm text-slate-500">
              Uploading replacement image...
            </p>
          )}
          {actionLoading === 'image-cleanup' && (
            <p className="mt-3 text-sm text-slate-500">
              Cleaning up image...
            </p>
          )}
        </Card>
      ) : (
        <DonationDetailsCard donation={selectedDonation} />
      )}

      {!editing && selectedDonation.selectedOrganizationId && (
        <Card>
          <h2 className="mb-5 text-lg font-semibold text-slate-950">
            Donation tracking
          </h2>
          {selectedDonation.status === DONATION_STATUSES.UPLOADED ? (
            <p className="text-sm text-amber-800">
              Waiting for the organization to accept this donation.
            </p>
          ) : trackingLoading ? (
            <Loading message="Loading tracking history..." />
          ) : tracking ? (
            <div className="space-y-7">
              <TrackingStepper currentStatus={selectedDonation.status} />
              <div>
                <h3 className="mb-4 font-semibold text-slate-900">
                  Status history
                </h3>
                <TrackingHistory history={tracking.statusHistory || []} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-700">
              Tracking data is missing for this accepted donation.
            </p>
          )}
        </Card>
      )}

      {!editing && recommendationEligible && (
        <Card>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Recommended organizations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Results load only when requested and use transparent rule-based
              scoring.
            </p>
          </div>
          {!hasLoaded && !recommendationsLoading && (
            <p className="text-sm text-slate-600">
              Use “Find Recommended Organizations” to compare eligible
              organizations.
            </p>
          )}
          <RecommendationList
            recommendations={recommendations}
            donation={selectedDonation}
            loading={recommendationsLoading}
            hasLoaded={hasLoaded}
            onSelect={handleSelectOrganization}
            selectingOrganizationId={selectingOrganizationId}
          />
        </Card>
      )}

      {!editing &&
        !recommendationEligible &&
        !selectedDonation.selectedOrganizationId && (
          <Card>
            <p className="text-sm text-slate-600">
              Recommendations are unavailable because this donation is no
              longer in the eligible Uploaded state.
            </p>
          </Card>
        )}
    </div>
  )
}

export default DonationDetailsPage
