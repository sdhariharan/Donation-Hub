import { USER_ROLES } from '../../common/constants'
import { formatDate } from '../../utils/dateUtils'

function TrackingTimelineItem({ entry }) {
  const roleLabel =
    entry.updatedByRole === USER_ROLES.ORGANIZATION
      ? 'Organization'
      : entry.updatedByRole === USER_ROLES.DONOR
        ? 'Donor'
        : 'Unknown role'
  return (
    <li className="relative border-l-2 border-orange-200 pb-6 pl-6 last:pb-0">
      <span className="absolute -left-2 top-0.5 h-3.5 w-3.5 rounded-full bg-kindred-orange ring-4 ring-kindred-cream" />
      <p className="font-semibold text-slate-900">{entry.status}</p>
      <p className="mt-1 text-sm text-slate-500">
        Updated by {roleLabel} · {formatDate(entry.timestamp)}
      </p>
    </li>
  )
}

export default TrackingTimelineItem
