import Card from '../common/Card'
import StatusBadge from '../common/StatusBadge'
import { formatDate } from '../../utils/dateUtils'
import { formatDataLabel } from '../../utils/donorUtils'

function Detail({ label, children }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 text-sm text-slate-900">{children}</dd></div>
}

function DonationDetailsCard({ donation }) {
  return (
    <Card>
      {donation.imageUrl && <img src={donation.imageUrl} alt={donation.title} className="mb-6 max-h-96 w-full rounded-xl object-cover" />}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div><h2 className="text-2xl font-bold text-slate-950">{donation.title}</h2><p className="mt-1 text-slate-500">{formatDataLabel(donation.category)}</p></div>
        <StatusBadge status={donation.status} />
      </div>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Detail label="Item">{donation.itemName}</Detail>
        <Detail label="Quantity">{donation.quantity}</Detail>
        <Detail label="Condition">{formatDataLabel(donation.condition)}</Detail>
        <Detail label="Pickup location">{donation.pickupAddress}, {donation.city}, {donation.state} {donation.postalCode}</Detail>
        <Detail label="Selected organization">{donation.selectedOrganizationName || 'Not selected'}</Detail>
        <Detail label="Created">{formatDate(donation.createdAt)}</Detail>
        <Detail label="Updated">{formatDate(donation.updatedAt)}</Detail>
      </dl>
      <div className="mt-6"><h3 className="text-sm font-semibold text-slate-900">Description</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{donation.description}</p></div>
    </Card>
  )
}

export default DonationDetailsCard
