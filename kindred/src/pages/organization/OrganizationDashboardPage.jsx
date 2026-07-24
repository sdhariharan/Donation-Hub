import {
  Activity,
  Boxes,
  CircleCheck,
  ClipboardList,
  Inbox,
  ListChecks,
  UserRoundCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES, DONATION_STATUSES } from '../../common/constants'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import EmptyState from '../../components/common/EmptyState'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import useAuth from '../../hooks/useAuth'
import useOrganization from '../../hooks/useOrganization'
import useOrganizationDonations from '../../hooks/useOrganizationDonations'
import {
  calculateOrganizationProfileCompletion,
  sortOrganizationNeeds,
} from '../../utils/organizationUtils'

function OrganizationDashboardPage() {
  const { userProfile } = useAuth()
  const { organization, loading: organizationLoading, error: organizationError } =
    useOrganization()
  const {
    organizationDonations,
    listLoading: donationsLoading,
    error: donationsError,
  } = useOrganizationDonations()
  if (organizationLoading || donationsLoading) {
    return <Loading message="Loading organization dashboard..." />
  }

  const activeNeeds = (organization?.needs || []).filter((need) => need.isActive)
  const assignedDonations = organizationDonations.length
  const completedDonations = organizationDonations.filter(
    (donation) => donation.status === DONATION_STATUSES.COMPLETED,
  ).length
  const activeDonations = assignedDonations - completedDonations
  const totalInventory = Object.values(organization?.inventory || {}).reduce(
    (total, value) => total + (Number(value) || 0),
    0,
  )
  const acceptedCategories = organization?.categoriesAccepted?.length || 0
  const profileCompletion = calculateOrganizationProfileCompletion(organization)
  const priorityNeeds = sortOrganizationNeeds(activeNeeds).slice(0, 3)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${userProfile?.name || 'Organization'}`}
        description="Review active needs and donations assigned to this organization."
        action={
          <Link
            to={
              organization
                ? APP_ROUTES.ORGANIZATION_DONATIONS
                : APP_ROUTES.ORGANIZATION_PROFILE
            }
          >
            <Button>{organization ? 'View incoming donations' : 'Set up profile'}</Button>
          </Link>
        }
      />
      <ErrorMessage message={organizationError || donationsError} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Needs" value={activeNeeds.length} icon={ClipboardList} description="Currently active" />
        <StatCard label="Assigned Donations" value={assignedDonations} icon={Inbox} description="Selected for this organization" />
        <StatCard label="Active Donations" value={activeDonations} icon={Activity} description="Not yet completed" />
        <StatCard label="Completed Donations" value={completedDonations} icon={CircleCheck} description="Lifecycle completed" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Inventory Items" value={totalInventory} icon={Boxes} />
        <StatCard label="Accepted Categories" value={acceptedCategories} icon={ListChecks} />
        <StatCard label="Profile Completion" value={`${profileCompletion}%`} icon={UserRoundCheck} />
      </div>

      {!organization && (
        <Card>
          <EmptyState icon={UserRoundCheck} title="Set up your organization profile" description="Complete organization details before publishing structured needs.">
            <Link to={APP_ROUTES.ORGANIZATION_PROFILE}><Button>Set up profile</Button></Link>
          </EmptyState>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-950">Priority active needs</h2>
          {organization && <Link className="text-sm font-semibold text-kindred-orange-dark hover:underline" to={APP_ROUTES.ORGANIZATION_NEEDS}>View all</Link>}
        </div>
        {priorityNeeds.length ? (
          <ul className="divide-y divide-slate-100">
            {priorityNeeds.map((need) => (
              <li key={need.id} className="flex items-center justify-between gap-4 py-3">
                <div><p className="font-medium text-slate-900">{need.itemName}</p><p className="text-sm capitalize text-slate-500">{need.category} · {need.urgency} urgency</p></div>
                <span className="text-sm text-slate-600">{need.quantityReceived} / {need.quantityNeeded}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={ClipboardList} title="No active needs" description="Add an active need to make demand visible for future matching.">
            {organization && <Link to={APP_ROUTES.ORGANIZATION_NEEDS}><Button variant="outline">Add a need</Button></Link>}
          </EmptyState>
        )}
      </Card>
    </div>
  )
}

export default OrganizationDashboardPage
