import { Gift, HandHeart, HeartHandshake, PackageCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES, DONATION_STATUSES } from '../../common/constants'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import DonationList from '../../components/donor/DonationList'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import useDonations from '../../hooks/useDonations'
import useDonorProfile from '../../hooks/useDonorProfile'
import { calculateDonorProfileCompletion } from '../../utils/donorUtils'

function DonorDashboardPage() {
  const { profile, loading: profileLoading } = useDonorProfile()
  const { donations, loading: donationsLoading, error } = useDonations()
  if (profileLoading || donationsLoading) {
    return <Loading message="Loading donor dashboard..." />
  }

  const completed = donations.filter(
    (donation) => donation.status === DONATION_STATUSES.COMPLETED,
  ).length
  const active = donations.length - completed
  const organizationsHelped = new Set(
    donations
      .map((donation) => donation.selectedOrganizationId)
      .filter(Boolean),
  ).size
  const completion = calculateDonorProfileCompletion(profile)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${profile?.name || 'Donor'}`}
        description="Review your donor profile and donation activity."
        action={
          <Link to={APP_ROUTES.DONOR_CREATE_DONATION}>
            <Button>Create donation</Button>
          </Link>
        }
      />
      <ErrorMessage message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Donations" value={donations.length} icon={Gift} description="Created by this account" />
        <StatCard label="Active Donations" value={active} icon={HandHeart} description="Not yet completed" />
        <StatCard label="Completed Donations" value={completed} icon={PackageCheck} description="Completed status" />
        <StatCard label="Organizations Helped" value={organizationsHelped} icon={HeartHandshake} description="Unique selected organizations" />
      </div>

      {completion < 100 && (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">Complete your donor profile</h2>
              <p className="mt-1 text-sm text-slate-500">Profile completion is {completion}%. Complete pickup details to speed up future donations.</p>
            </div>
            <Link to={APP_ROUTES.DONOR_PROFILE}><Button variant="outline">Complete profile</Button></Link>
          </div>
        </Card>
      )}

      <section aria-labelledby="recent-donations">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-donations" className="text-lg font-semibold text-slate-950">Recent donations</h2>
          {donations.length > 0 && <Link to={APP_ROUTES.DONOR_DONATIONS} className="text-sm font-semibold text-kindred-orange-dark hover:underline">View all</Link>}
        </div>
        <DonationList donations={donations.slice(0, 3)} />
      </section>
    </div>
  )
}

export default DonorDashboardPage
