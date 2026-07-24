import { Building2, X } from 'lucide-react'
import { formatDataLabel } from '../../utils/donorUtils'

function SelectedOrganizationBanner({ organization, onRemove }) {
  return (
    <div className="rounded-2xl border border-kindred-orange bg-kindred-cream p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-kindred-orange-dark">
            <Building2 className="h-5 w-5" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-wide">
              Selected organization
            </p>
          </div>
          <h2 className="mt-2 text-lg font-bold text-slate-950">
            {organization.name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose one of its accepted categories:{' '}
            {organization.categoriesAccepted.map(formatDataLabel).join(', ')}.
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-950"
          aria-label={`Remove ${organization.name} preselection`}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default SelectedOrganizationBanner
