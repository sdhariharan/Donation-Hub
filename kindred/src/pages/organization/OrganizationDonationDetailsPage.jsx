import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DONATION_STATUSES } from '../../common/constants'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import DonationDetailsCard from '../../components/donor/DonationDetailsCard'
import DonationStatusUpdater from '../../components/organization/DonationStatusUpdater'
import TrackingHistory from '../../components/tracking/TrackingHistory'
import TrackingStepper from '../../components/tracking/TrackingStepper'
import useOrganizationDonations from '../../hooks/useOrganizationDonations'

function OrganizationDonationDetailsPage() {
  const { donationId } = useParams()
  const {
    selectedDonation,
    tracking,
    detailLoading,
    trackingLoading,
    actionLoading,
    error,
    loadOrganizationDonation,
    acceptDonation,
    advanceStatus,
    clearError,
  } = useOrganizationDonations({ loadList: false })
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadOrganizationDonation(donationId)
  }, [donationId, loadOrganizationDonation])

  if (detailLoading) return <Loading message="Loading assigned donation..." />
  if (!selectedDonation) return <Card><ErrorMessage message={error || 'Assigned donation not found.'} /></Card>

  const handleUpdate = async (nextStatus) => {
    if (!window.confirm(`Move this donation from ${selectedDonation.status} to ${nextStatus}?`)) return
    clearError()
    setSuccess('')
    try {
      if (selectedDonation.status === DONATION_STATUSES.UPLOADED) {
        await acceptDonation()
      } else {
        await advanceStatus(nextStatus)
      }
      setSuccess(`Donation status updated to ${nextStatus}.`)
    } catch {
      // The hook exposes the readable transaction error.
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Assigned donation details" description="Review donor information and advance only the next allowed lifecycle status." />
      <ErrorMessage message={error} />
      {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{success}</div>}
      <DonationDetailsCard donation={selectedDonation} />
      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Donor contact</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs uppercase text-slate-500">Donor</dt><dd className="mt-1 text-sm text-slate-900">{selectedDonation.donorName}</dd></div>
          <div><dt className="text-xs uppercase text-slate-500">Email</dt><dd className="mt-1 text-sm text-slate-900">{selectedDonation.donorEmail}</dd></div>
        </dl>
      </Card>
      <Card>
        <h2 className="mb-5 text-lg font-semibold text-slate-950">Status progress</h2>
        <TrackingStepper currentStatus={selectedDonation.status} />
        <div className="mt-6 border-t border-slate-100 pt-6">
          <DonationStatusUpdater status={selectedDonation.status} onUpdate={handleUpdate} loading={Boolean(actionLoading)} />
        </div>
      </Card>
      <Card>
        <h2 className="mb-5 text-lg font-semibold text-slate-950">Tracking history</h2>
        {trackingLoading ? <Loading message="Loading tracking history..." /> : (
          <TrackingHistory history={tracking?.statusHistory || []} />
        )}
      </Card>
    </div>
  )
}

export default OrganizationDonationDetailsPage
