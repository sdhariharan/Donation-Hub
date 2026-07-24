import { ClipboardList } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import { sortOrganizationNeeds } from '../../utils/organizationUtils'
import NeedCard from './NeedCard'

function NeedsList({ needs, onEdit, onDelete, actionLoading }) {
  const sortedNeeds = sortOrganizationNeeds(needs)

  if (!sortedNeeds.length) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No organization needs"
        description="Add the first structured need using the form above."
      />
    )
  }

  return (
    <div className="space-y-4">
      {sortedNeeds.map((need) => (
        <NeedCard
          key={need.id}
          need={need}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={actionLoading === `delete:${need.id}`}
        />
      ))}
    </div>
  )
}

export default NeedsList
