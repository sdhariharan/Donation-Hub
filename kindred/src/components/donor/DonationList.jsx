import { Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../common/constants'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import DonationCard from './DonationCard'

function DonationList({ donations }) {
  if (!donations.length) {
    return (
      <EmptyState icon={Gift} title="No donations yet" description="Create the first donation to begin preparing it for organization matching.">
        <Link to={APP_ROUTES.DONOR_CREATE_DONATION}><Button>Create donation</Button></Link>
      </EmptyState>
    )
  }
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{donations.map((donation) => <DonationCard key={donation.id} donation={donation} />)}</div>
}

export default DonationList
