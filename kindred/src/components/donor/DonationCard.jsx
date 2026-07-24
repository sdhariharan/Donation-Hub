import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import { formatDataLabel } from '../../utils/donorUtils'

function DonationCard({ donation }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {donation.imageUrl ? (
        <img src={donation.imageUrl} alt="" className="h-44 w-full object-cover" />
      ) : (
        <div className="grid h-44 place-items-center bg-slate-100 text-sm text-slate-500">No image</div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-slate-950">{donation.title}</h2>
          <StatusBadge status={donation.status} />
        </div>
        <p className="mt-2 text-sm text-slate-500">{formatDataLabel(donation.category)} · Quantity {donation.quantity}</p>
        <p className="mt-2 text-sm text-slate-600">
          Organization: {donation.selectedOrganizationName || 'Not selected'}
        </p>
        <Link to={`/donor/donations/${donation.id}`} className="mt-4 inline-block text-sm font-semibold text-kindred-orange-dark hover:underline">
          View details
        </Link>
      </div>
    </article>
  )
}

export default DonationCard
