import { Check } from 'lucide-react'
import {
  DONATION_STATUS_ORDER,
  getDonationStatusIndex,
} from '../../utils/trackingUtils'

function TrackingStepper({ currentStatus }) {
  const currentIndex = getDonationStatusIndex(currentStatus)
  return (
    <ol className="grid gap-3 sm:grid-cols-5" aria-label="Donation progress">
      {DONATION_STATUS_ORDER.map((status, index) => {
        const completed = currentIndex >= 0 && index < currentIndex
        const current = index === currentIndex
        return (
          <li
            key={status}
            className={`rounded-xl border px-3 py-3 text-sm transition ${
              current
                ? 'border-kindred-orange bg-kindred-cream font-bold text-kindred-orange-dark ring-2 ring-kindred-orange/20'
                : completed
                  ? 'border-orange-200 bg-orange-50 font-semibold text-kindred-orange-dark'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
            aria-current={current ? 'step' : undefined}
          >
            <span className="flex items-center gap-2">
              {completed && <Check className="h-4 w-4" aria-hidden="true" />}
              {status}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default TrackingStepper
