import Button from '../common/Button'
import { DONATION_STATUSES } from '../../common/constants'
import { getNextDonationStatus } from '../../utils/trackingUtils'
import { getDonationStatusIndex } from '../../utils/trackingUtils'

const ACTION_LABELS = {
  [DONATION_STATUSES.UPLOADED]: 'Accept Donation',
  [DONATION_STATUSES.ACCEPTED]: 'Mark Ready for Pickup',
  [DONATION_STATUSES.READY_FOR_PICKUP]: 'Mark Received',
  [DONATION_STATUSES.RECEIVED]: 'Mark Completed',
}

function DonationStatusUpdater({ status, onUpdate, loading }) {
  const nextStatus = getNextDonationStatus(status)
  if (getDonationStatusIndex(status) < 0) {
    return (
      <p className="text-sm font-medium text-red-700">
        Unknown status. Lifecycle updates are unavailable.
      </p>
    )
  }
  if (!nextStatus) {
    return <p className="text-sm font-medium text-emerald-700">Donation lifecycle completed.</p>
  }
  return (
    <div className="rounded-xl bg-kindred-cream p-4">
      <p className="mb-3 text-sm text-slate-600">Next status: <strong className="text-slate-900">{nextStatus}</strong></p>
      <Button onClick={() => onUpdate(nextStatus)} loading={loading} loadingText="Updating status...">
        {ACTION_LABELS[status] || `Move to ${nextStatus}`}
      </Button>
    </div>
  )
}

export default DonationStatusUpdater
