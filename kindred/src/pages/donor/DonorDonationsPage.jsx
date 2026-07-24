import { Link, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../common/constants'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import DonationList from '../../components/donor/DonationList'
import useDonations from '../../hooks/useDonations'

function DonorDonationsPage() {
  const location = useLocation()
  const { donations, loading, error } = useDonations()
  if (loading) return <Loading message="Loading your donations..." />

  return (
    <div className="space-y-8">
      <PageHeader
        title="My donations"
        description="Review every donation created by this donor account."
        action={<Link to={APP_ROUTES.DONOR_CREATE_DONATION}><Button>Create donation</Button></Link>}
      />
      <ErrorMessage message={error} />
      {location.state?.notice && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            location.state.noticeType === 'warning'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
          role="status"
        >
          {location.state.notice}
        </div>
      )}
      <DonationList donations={donations} />
    </div>
  )
}

export default DonorDonationsPage
