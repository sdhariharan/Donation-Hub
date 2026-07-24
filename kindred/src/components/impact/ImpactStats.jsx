import { Boxes, Building2, CircleCheck, Gift, Users } from 'lucide-react'
import StatCard from '../common/StatCard'

const ICONS = {
  totalDonations: Gift,
  assignedDonations: Gift,
  completedDonations: CircleCheck,
  organizationsHelped: Building2,
  itemsDonated: Boxes,
  itemsReceived: Boxes,
  uniqueDonors: Users,
}

function ImpactStats({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={item.value}
          icon={ICONS[item.key]}
          description={item.description}
          to={item.to}
          ariaLabel={item.ariaLabel}
          clickable={item.clickable}
        />
      ))}
    </div>
  )
}

export default ImpactStats
