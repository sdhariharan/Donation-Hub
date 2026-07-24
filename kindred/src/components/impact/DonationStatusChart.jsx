import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import EmptyState from '../common/EmptyState'
import { KINDRED_CHART_COLORS } from '../../common/constants'

function DonationStatusChart({ data }) {
  if (!data.length) {
    return <EmptyState title="No status data" description="Donation statuses will appear after activity begins." />
  }
  return (
    <div>
      <p className="sr-only">Chart showing donation counts by lifecycle status.</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2} isAnimationActive={false}>
              {data.map((item, index) => (
                <Cell
                  key={item.key}
                  fill={
                    KINDRED_CHART_COLORS.SERIES[
                      index % KINDRED_CHART_COLORS.SERIES.length
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DonationStatusChart
