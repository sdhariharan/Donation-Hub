import { DONATION_STATUSES } from '../../common/constants'

const STATUS_STYLES = {
  [DONATION_STATUSES.UPLOADED]: 'bg-kindred-cream text-slate-700',
  [DONATION_STATUSES.ACCEPTED]: 'bg-orange-100 text-kindred-orange-dark',
  [DONATION_STATUSES.READY_FOR_PICKUP]: 'bg-amber-100 text-amber-800',
  [DONATION_STATUSES.RECEIVED]: 'bg-green-50 text-green-700',
  [DONATION_STATUSES.COMPLETED]: 'bg-emerald-100 text-emerald-700',
}

function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5 ${style} ${className}`}
    >
      {status || 'Unknown'}
    </span>
  )
}

export default StatusBadge
