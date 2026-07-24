import { Building2 } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import Loading from '../common/Loading'
import RecommendationCard from './RecommendationCard'

function RecommendationList({
  recommendations,
  donation,
  loading,
  hasLoaded,
  onSelect,
  selectingOrganizationId,
}) {
  if (loading) return <Loading message="Finding suitable organizations..." />
  if (!hasLoaded) return null
  if (!recommendations.length) {
    return (
      <EmptyState
        icon={Building2}
        title="No suitable organizations currently accept this donation category."
        description="Organizations need to publish matching accepted categories and usable profile data before they can appear here."
      />
    )
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.organizationId}
          recommendation={recommendation}
          donation={donation}
          onSelect={onSelect}
          selecting={
            selectingOrganizationId === recommendation.organizationId
          }
          selectionDisabled={Boolean(selectingOrganizationId)}
        />
      ))}
    </div>
  )
}

export default RecommendationList
