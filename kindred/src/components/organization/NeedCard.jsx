import { Pencil, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import Card from '../common/Card'
import { formatCategory } from '../../utils/organizationUtils'

const URGENCY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-emerald-100 text-emerald-700',
}

function NeedCard({ need, onEdit, onDelete, deleting }) {
  const progress = Math.min(
    100,
    Math.round((need.quantityReceived / need.quantityNeeded) * 100),
  )

  const handleDelete = () => {
    if (window.confirm(`Delete the need for "${need.itemName}"?`)) {
      onDelete(need.id)
    }
  }

  return (
    <Card className={!need.isActive ? 'opacity-70' : ''}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">{need.itemName}</h3>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${URGENCY_STYLES[need.urgency] || 'bg-slate-100 text-slate-600'}`}>
              {formatCategory(need.urgency)}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${need.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {need.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{formatCategory(need.category)}</p>
          {need.description && <p className="mt-3 text-sm text-slate-600">{need.description}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="small" variant="outline" onClick={() => onEdit(need)}>
            <Pencil className="mr-1.5 h-4 w-4" aria-hidden="true" /> Edit
          </Button>
          <Button size="small" variant="danger" onClick={handleDelete} loading={deleting} loadingText="Deleting...">
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" /> Delete
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm text-slate-600">
          <span>Progress</span>
          <span>{need.quantityReceived} / {need.quantityNeeded}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-kindred-orange" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  )
}

export default NeedCard
