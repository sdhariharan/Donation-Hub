const SCORE_LABELS = {
  activeNeedsScore: 'Active Needs',
  urgencyScore: 'Urgency',
  inventoryNeedScore: 'Inventory Need',
  trustScore: 'Trust',
  locationScore: 'Location',
  profileCompletenessScore: 'Profile Completeness',
}

function GeneralScoreBreakdown({ scores }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">
        General score breakdown
      </h3>
      <div className="mt-3 space-y-3">
        {Object.entries(SCORE_LABELS).map(([key, label]) => (
          <div key={key}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{label}</span>
              <span>{scores[key]} / 100</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-kindred-cream-deep"
              role="progressbar"
              aria-label={label}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={scores[key]}
            >
              <div
                className="h-full rounded-full bg-kindred-orange"
                style={{ width: `${scores[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GeneralScoreBreakdown
