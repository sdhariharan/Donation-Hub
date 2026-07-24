import { CheckCircle2 } from 'lucide-react'

function MatchReasons({ reasons }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">Why this matches</h4>
      <ul className="mt-3 space-y-2">
        {reasons.map((reason) => (
          <li key={reason} className="flex gap-2 text-sm text-slate-600">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-kindred-orange"
              aria-hidden="true"
            />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MatchReasons
