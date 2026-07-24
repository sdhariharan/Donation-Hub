import Button from '../common/Button'
import Card from '../common/Card'
import { formatDataLabel } from '../../utils/donorUtils'
import MatchReasons from './MatchReasons'
import ScoreBreakdown from './ScoreBreakdown'

function RecommendationCard({
  recommendation,
  donation,
  onSelect,
  selecting,
  selectionDisabled,
}) {
  const { organization, finalScore, scoreBreakdown, relevantNeed } =
    recommendation
  const inventory = organization.inventory?.[donation.category]

  return (
    <Card className="flex h-full flex-col transition hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-950">
            {organization.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {[organization.city, organization.state].filter(Boolean).join(', ') ||
              'Location not provided'}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-orange-200 bg-kindred-cream px-4 py-3 text-center text-kindred-orange-dark">
          <p className="text-3xl font-bold tracking-tight">{finalScore}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide">
            Match
          </p>
        </div>
      </div>

      {organization.description && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {organization.description}
        </p>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-kindred-cream/70 p-4 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Accepted category</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {formatDataLabel(donation.category)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Category inventory</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {typeof inventory === 'number' && Number.isFinite(inventory)
              ? inventory
              : 'Not available'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Trust score</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {scoreBreakdown.trustScore} / 100
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Relevant need</dt>
          <dd className="mt-1 font-medium text-slate-900">
            {relevantNeed?.itemName || 'Category accepted'}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <ScoreBreakdown scores={scoreBreakdown} />
      </div>
      <div className="mt-5 flex-1">
        <MatchReasons reasons={recommendation.matchReasons} />
      </div>
      <Button
        className="mt-6 w-full"
        onClick={() => onSelect(recommendation)}
        loading={selecting}
        loadingText="Selecting organization..."
        disabled={selectionDisabled}
      >
        Select Organization
      </Button>
    </Card>
  )
}

export default RecommendationCard
