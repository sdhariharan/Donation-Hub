import { Inbox } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import IncomingDonationCard from './IncomingDonationCard'

function IncomingDonationList({ donations }) {
  if (!donations.length) {
    return <EmptyState icon={Inbox} title="No assigned donations" description="Donations selected for this organization will appear here." />
  }
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{donations.map((donation) => <IncomingDonationCard key={donation.id} donation={donation} />)}</div>
}

export default IncomingDonationList
