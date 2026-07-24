import { Building2, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDataLabel } from '../../utils/donorUtils'
import Button from '../common/Button'
import Card from '../common/Card'

function OrganizationRecommendationCard({ recommendation }) {
  const { organization, generalScore, activeNeeds, highestUrgency, reasons } =
    recommendation
  const inventoryValues = organization.categoriesAccepted
    .map((category) => organization.inventory?.[category])
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
  const inventoryAverage = inventoryValues.length
    ? Math.round(
        inventoryValues.reduce((total, value) => total + value, 0) /
          inventoryValues.length,
      )
    : null
  return (
    <Card className="flex h-full flex-col border-orange-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-kindred-orange-dark">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wide">
              Recommended for You
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-950">
            {organization.name}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {[organization.city, organization.state].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-kindred-cream px-4 py-3 text-center text-kindred-orange-dark">
          <p className="text-3xl font-bold">{generalScore}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide">
            General Match Score
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-2 text-center text-sm sm:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Trust</dt>
          <dd className="mt-1 font-bold text-slate-900">
            {organization.trustScore ?? '—'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Active needs</dt>
          <dd className="mt-1 font-bold text-slate-900">{activeNeeds.length}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Highest urgency</dt>
          <dd className="mt-1 font-bold capitalize text-slate-900">
            {highestUrgency || 'None'}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Inventory avg.</dt>
          <dd className="mt-1 font-bold text-slate-900">
            {inventoryAverage ?? '—'}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {organization.categoriesAccepted.map((category) => (
          <span key={category} className="rounded-full bg-kindred-cream px-2.5 py-1 text-xs font-semibold text-slate-700">
            {formatDataLabel(category)}
          </span>
        ))}
      </div>
      <div className="mt-5 flex-1 rounded-xl bg-kindred-cream/70 p-4">
        <h4 className="text-sm font-semibold text-slate-900">
          Why this may be a good fit
        </h4>
        <ul className="mt-3 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-kindred-orange-dark" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to={`/donor/organizations/${organization.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <Link to={`/donor/donations/new?organizationId=${organization.id}`}>
          <Button>Donate Here</Button>
        </Link>
      </div>
    </Card>
  )
}

export default OrganizationRecommendationCard
