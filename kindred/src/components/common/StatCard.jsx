import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from './Card'

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  trend,
  to,
  ariaLabel,
  clickable = Boolean(to),
}) {
  const content = (
    <Card
      className={`h-full min-w-0 transition ${
        clickable
          ? 'group-hover:-translate-y-0.5 group-hover:border-kindred-orange group-hover:shadow-md'
          : 'hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="rounded-xl bg-kindred-cream p-2.5 text-kindred-orange-dark">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
      {description && (
        <p className="mt-3 text-xs text-slate-500">{description}</p>
      )}
      {trend && (
        <p className="mt-2 text-xs font-medium text-kindred-orange-dark">
          {trend}
        </p>
      )}
      {clickable && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-kindred-orange-dark">
          View donations
          <ArrowRight
            className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      )}
    </Card>
  )

  if (clickable && to) {
    return (
      <Link
        to={to}
        aria-label={ariaLabel || `View donations for ${label}`}
        className="group block h-full cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-kindred-orange focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    )
  }

  return content
}

export default StatCard
