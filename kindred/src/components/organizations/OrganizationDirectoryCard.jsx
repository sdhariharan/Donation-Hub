import { Link } from 'react-router-dom'
import { formatDataLabel } from '../../utils/donorUtils'
import Button from '../common/Button'
import Card from '../common/Card'

function OrganizationDirectoryCard({ recommendation }) {
  const { organization, activeNeeds, highestUrgency } = recommendation
  const acceptedInventory = organization.categoriesAccepted
    .map((category) => organization.inventory?.[category])
    .filter((value) => typeof value === 'number')
  const inventoryAverage = acceptedInventory.length
    ? Math.round(
        acceptedInventory.reduce((total, value) => total + value, 0) /
          acceptedInventory.length,
      )
    : null
  return (
    <Card className="flex h-full flex-col">
      <h3 className="text-lg font-bold text-slate-950">{organization.name}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {[organization.city, organization.state].filter(Boolean).join(', ')}
      </p>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
        {organization.description}
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div><dt className="text-slate-500">Trust</dt><dd className="mt-1 font-semibold">{organization.trustScore ?? '—'}</dd></div>
        <div><dt className="text-slate-500">Active needs</dt><dd className="mt-1 font-semibold">{activeNeeds.length}</dd></div>
        <div><dt className="text-slate-500">Inventory avg.</dt><dd className="mt-1 font-semibold">{inventoryAverage ?? '—'}</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-500">
        Highest urgency:{' '}
        <span className="font-semibold capitalize text-slate-700">
          {highestUrgency || 'none'}
        </span>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {organization.categoriesAccepted.map((category) => (
          <span key={category} className="rounded-full bg-kindred-cream px-2.5 py-1 text-xs font-semibold text-slate-700">
            {formatDataLabel(category)}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <Link to={`/donor/organizations/${organization.id}`}>
          <Button variant="outline" size="small">View Details</Button>
        </Link>
        <Link to={`/donor/donations/new?organizationId=${organization.id}`}>
          <Button size="small">Donate Here</Button>
        </Link>
      </div>
    </Card>
  )
}

export default OrganizationDirectoryCard
