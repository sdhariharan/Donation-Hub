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

function OrganizationImpactPage() {
  const { metrics, statusDistribution, categoryDistribution, recentDonations, loading, error } = useImpact()
  if (loading) return <Loading message="Loading organization impact..." />
  const stats = [
    { key: 'assignedDonations', label: 'Assigned Donations', value: metrics.assignedDonations || 0 },
    { key: 'completedDonations', label: 'Completed Donations', value: metrics.completedDonations || 0 },
    { key: 'itemsReceived', label: 'Items Received', value: metrics.itemsReceived || 0, description: 'Completed donations only' },
    { key: 'uniqueDonors', label: 'Unique Donors', value: metrics.uniqueDonors || 0, description: 'Completed donations only' },
  ]
  return (
    <div className="space-y-8">
      <PageHeader title="Organization impact" description="Review assigned donations and completed donation outcomes." />
      <ErrorMessage message={error} />
      <ImpactStats items={stats} />
      {(metrics.completedDonations || 0) === 0 && (
        <Card><EmptyState title="No completed donation impact yet. Complete assigned donations to see your impact." description="Assigned donation distributions remain visible below." /></Card>
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card><h2 className="mb-4 text-lg font-semibold text-slate-950">Donation Status Distribution</h2><DonationStatusChart data={statusDistribution} /></Card>
        <Card><h2 className="mb-4 text-lg font-semibold text-slate-950">Donation Category Distribution</h2><CategoryChart data={categoryDistribution} /></Card>
      </div>
      <Card><h2 className="mb-3 text-lg font-semibold text-slate-950">Recent Received Donation History</h2><RecentImpactHistory donations={recentDonations} role="organization" /></Card>
    </div>
  )
}

export default OrganizationImpactPage
