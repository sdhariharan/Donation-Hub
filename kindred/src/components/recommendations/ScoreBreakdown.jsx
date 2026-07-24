const SCORE_LABELS = {
  needScore: 'Need Match',
  inventoryScore: 'Inventory Need',
  distanceScore: 'Proximity',
  trustScore: 'Trust',
}

function ScoreBreakdown({ scores }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">Score breakdown</h4>
      <div className="mt-3 space-y-3">
        {Object.entries(SCORE_LABELS).map(([key, label]) => (
          <div key={key}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{label}</span>
              <span>{scores[key]} / 100</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-kindred-cream-deep"
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
      <p className="mt-3 text-xs leading-5 text-slate-500">
        The final score uses transparent rules for need, inventory, proximity,
        and trust.
      </p>
    </div>
  )
}

export default ScoreBreakdown
