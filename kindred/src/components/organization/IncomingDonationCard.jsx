import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import { formatDate } from '../../utils/dateUtils'
import { formatDataLabel } from '../../utils/donorUtils'

function IncomingDonationCard({ donation }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {donation.imageUrl ? (
        <img src={donation.imageUrl} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center bg-slate-100 text-sm text-slate-500">No image</div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-slate-950">{donation.title}</h2>
          <StatusBadge status={donation.status} />
        </div>
        <p className="mt-2 text-sm text-slate-500">{formatDataLabel(donation.category)} · {donation.itemName} · Qty {donation.quantity}</p>
        <p className="mt-2 text-sm text-slate-600">Donor: {donation.donorName}</p>
        <p className="text-sm text-slate-600">{donation.city}, {donation.state}</p>
        <p className="mt-2 text-xs text-slate-500">Updated {formatDate(donation.updatedAt)}</p>
        <Link to={`/organization/donations/${donation.id}`} className="mt-4 inline-block text-sm font-semibold text-kindred-orange-dark hover:underline">Open details</Link>
      </div>
    </article>
  )
}

export default IncomingDonationCard
