import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import { formatDate } from '../../utils/dateUtils'
import { formatDataLabel } from '../../utils/donorUtils'

function RecentImpactHistory({ donations, role }) {
  if (!donations.length) {
    return <p className="text-sm text-slate-500">No donation history yet.</p>
  }

  const basePath =
    role === 'donor' ? '/donor/donations' : '/organization/donations'

  return (
    <ul className="divide-y divide-slate-100">
      {donations.map((donation) => (
        <li
          key={donation.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Link
              to={`${basePath}/${donation.id}`}
              className="font-semibold text-slate-950 hover:text-kindred-orange-dark"
            >
              {donation.title}
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              {formatDataLabel(donation.category)}
              {' · '}Qty {donation.quantity}
              {' · '}
              {role === 'donor'
                ? donation.selectedOrganizationName ||
                  'Organization not selected'
                : donation.donorName}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {formatDate(donation.updatedAt || donation.createdAt)}
            </p>
          </div>
          <StatusBadge status={donation.status} />
        </li>
      ))}
    </ul>
  )
}

export default RecentImpactHistory
