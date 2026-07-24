import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import IncomingDonationList from '../../components/organization/IncomingDonationList'
import useOrganizationDonations from '../../hooks/useOrganizationDonations'

function IncomingDonationsPage() {
  const { organizationDonations, listLoading, error } =
    useOrganizationDonations()
  if (listLoading) return <Loading message="Loading assigned donations..." />
  return (
    <div className="space-y-8">
      <PageHeader title="Incoming donations" description="Review donations assigned to this organization and manage their lifecycle." />
      <ErrorMessage message={error} />
      <IncomingDonationList donations={organizationDonations} />
    </div>
  )
}

export default IncomingDonationsPage
