import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../common/constants'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import CategoryChart from '../../components/impact/CategoryChart'
import DonationStatusChart from '../../components/impact/DonationStatusChart'
import ImpactStats from '../../components/impact/ImpactStats'
import RecentImpactHistory from '../../components/impact/RecentImpactHistory'
import useImpact from '../../hooks/useImpact'

function DonorImpactPage() {
  const {
    metrics,
    statusDistribution,
    categoryDistribution,
    recentDonations,
    loading,
    error,
  } = useImpact()
  if (loading) return <Loading message="Loading donor impact..." />

  const donationsRoute = APP_ROUTES.DONOR_DONATIONS
  const stats = [
    {
      key: 'totalDonations',
      label: 'Total Donations',
      value: metrics.totalDonations || 0,
      to: donationsRoute,
      ariaLabel: 'View all donations',
    },
    {
      key: 'completedDonations',
      label: 'Completed Donations',
      value: metrics.completedDonations || 0,
      to: donationsRoute,
      ariaLabel: 'View completed donations',
    },
    {
      key: 'organizationsHelped',
      label: 'Organizations Helped',
      value: metrics.organizationsHelped || 0,
      to: donationsRoute,
      ariaLabel: 'View donations by organization',
    },
    {
      key: 'itemsDonated',
      label: 'Items Donated',
      value: metrics.itemsDonated || 0,
      description: 'Completed donations only',
      to: donationsRoute,
      ariaLabel: 'View donated items',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Donor impact"
        description="See the measurable outcome of donations created by this account."
      />
      <ErrorMessage message={error} />
      <ImpactStats items={stats} />

      {(metrics.completedDonations || 0) === 0 && (
        <Link
          to={donationsRoute}
          aria-label="View all donations"
          className="group block cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-kindred-orange focus-visible:ring-offset-2"
        >
          <Card className="transition group-hover:-translate-y-0.5 group-hover:border-kindred-orange group-hover:shadow-md">
            <EmptyState
              title="No donation impact yet. Complete your first donation to start building your impact."
              description="Active donation distributions remain visible below."
            />
          </Card>
        </Link>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="transition hover:border-kindred-orange hover:shadow-md">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Donation Status Distribution
            </h2>
            <Link
              to={donationsRoute}
              aria-label="View all donations from status distribution"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-kindred-orange-dark transition hover:bg-kindred-cream"
            >
              View donations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <DonationStatusChart data={statusDistribution} />
        </Card>

        <Card className="transition hover:border-kindred-orange hover:shadow-md">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Donation Category Distribution
            </h2>
            <Link
              to={donationsRoute}
              aria-label="View all donations from category distribution"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-kindred-orange-dark transition hover:bg-kindred-cream"
            >
              View donations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <CategoryChart data={categoryDistribution} />
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-slate-950">
          Recent Donation History
        </h2>
        <RecentImpactHistory donations={recentDonations} role="donor" />
      </Card>
    </div>
  )
}

export default DonorImpactPage
