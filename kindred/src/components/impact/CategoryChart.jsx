import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../common/EmptyState'
import { KINDRED_CHART_COLORS } from '../../common/constants'

function CategoryChart({ data }) {
  if (!data.length) {
    return <EmptyState title="No category data" description="Donation categories will appear after activity begins." />
  }
  return (
    <div>
      <p className="sr-only">Chart showing donation counts by category.</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 8 }}>
            <CartesianGrid
              stroke={KINDRED_CHART_COLORS.GRID}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={65} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="value"
              name="Donations"
              fill={KINDRED_CHART_COLORS.PRIMARY}
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CategoryChart
