import { formatDataLabel } from '../../utils/donorUtils'

const URGENCY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-emerald-100 text-emerald-700',
}

function ActiveNeedPreview({ needs, limit = 3, detailed = false }) {
  if (!needs.length) {
    return <p className="text-sm text-slate-500">No active needs published.</p>
  }
  return (
    <ul className="space-y-3">
      {needs.slice(0, limit).map((need) => {
        const needed = Number(need.quantityNeeded) || 0
        const received = Number(need.quantityReceived) || 0
        const progress = needed
          ? Math.min(100, Math.round((received / needed) * 100))
          : 0
        return (
          <li key={need.id} className="rounded-xl bg-kindred-cream/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{need.itemName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDataLabel(need.category)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  URGENCY_STYLES[need.urgency] ||
                  'bg-slate-100 text-slate-600'
                }`}
              >
                {formatDataLabel(need.urgency)} urgency
              </span>
            </div>
            {detailed && (
              <>
                {need.description && (
                  <p className="mt-3 text-sm text-slate-600">
                    {need.description}
                  </p>
                )}
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Received</span>
                    <span>{received} / {needed}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-kindred-orange"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default ActiveNeedPreview
