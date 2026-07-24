import { Building2 } from 'lucide-react'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import OrganizationDirectoryCard from '../../components/organizations/OrganizationDirectoryCard'
import OrganizationFilters from '../../components/organizations/OrganizationFilters'
import OrganizationRecommendationCard from '../../components/organizations/OrganizationRecommendationCard'
import useOrganizationDirectory from '../../hooks/useOrganizationDirectory'

function OrganizationDirectoryPage() {
  const directory = useOrganizationDirectory()
  if (directory.loading) {
    return <Loading message="Finding organizations..." />
  }
  const visibleCount =
    directory.recommendedOrganizations.length + directory.allOrganizations.length
  return (
    <div className="space-y-8">
      <PageHeader
        title="Discover Organizations"
        description="Explore organizations before creating a donation and understand why each may be a good fit."
      />
      <ErrorMessage message={directory.error} />
      <div className="rounded-xl bg-kindred-cream px-4 py-3 text-sm text-slate-700">
        These suggestions are based on your profile and current organization
        needs. Create a donation to receive item-specific recommendations.
      </div>
      <OrganizationFilters
        organizations={directory.organizations}
        filters={directory.filters}
        setSearchQuery={directory.setSearchQuery}
        setCategoryFilter={directory.setCategoryFilter}
        setCityFilter={directory.setCityFilter}
        setStateFilter={directory.setStateFilter}
        setActiveNeedsOnly={directory.setActiveNeedsOnly}
        clearFilters={directory.clearFilters}
      />
      {!visibleCount ? (
        <EmptyState
          icon={Building2}
          title="No organizations match these filters"
          description="Clear one or more filters to see the full organization directory."
        />
      ) : (
        <>
          <section aria-labelledby="recommended-organizations">
            <div className="mb-5">
              <h2 id="recommended-organizations" className="text-xl font-bold text-slate-950">
                Recommended for You
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Up to five organizations ranked with general profile and current-need signals.
              </p>
            </div>
            {directory.recommendedOrganizations.length ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {directory.recommendedOrganizations.map((recommendation) => (
                  <OrganizationRecommendationCard
                    key={recommendation.organization.id}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No recommendations match the current filters.
              </p>
            )}
          </section>
          <section aria-labelledby="all-organizations">
            <div className="mb-5">
              <h2 id="all-organizations" className="text-xl font-bold text-slate-950">
                All Organizations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Every remaining valid organization, without duplicates.
              </p>
            </div>
            {directory.allOrganizations.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {directory.allOrganizations.map((recommendation) => (
                  <OrganizationDirectoryCard
                    key={recommendation.organization.id}
                    recommendation={recommendation}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white p-4 text-sm text-slate-500">
                All matching organizations are currently included in Recommended for You.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default OrganizationDirectoryPage
