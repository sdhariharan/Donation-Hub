import { DONATION_CATEGORIES } from '../../common/constants'
import { formatDataLabel } from '../../utils/donorUtils'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'

function uniqueOptions(organizations, field) {
  return [...new Set(organizations.map((item) => item[field]).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
    .map((value) => ({ value, label: value }))
}

function OrganizationFilters({
  organizations,
  filters,
  setSearchQuery,
  setCategoryFilter,
  setCityFilter,
  setStateFilter,
  setActiveNeedsOnly,
  clearFilters,
}) {
  const categoryOptions = Object.values(DONATION_CATEGORIES).map((value) => ({
    value,
    label: formatDataLabel(value),
  }))
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Search"
          name="organization-search"
          value={filters.searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Organization or active need"
        />
        <Select
          label="Category"
          name="organization-category"
          value={filters.category}
          onChange={(event) => setCategoryFilter(event.target.value)}
          placeholder="All categories"
          options={categoryOptions}
        />
        <Select
          label="City"
          name="organization-city"
          value={filters.city}
          onChange={(event) => setCityFilter(event.target.value)}
          placeholder="All cities"
          options={uniqueOptions(organizations, 'city')}
        />
        <Select
          label="State"
          name="organization-state"
          value={filters.state}
          onChange={(event) => setStateFilter(event.target.value)}
          placeholder="All states"
          options={uniqueOptions(organizations, 'state')}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={filters.activeNeedsOnly}
            onChange={(event) => setActiveNeedsOnly(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-kindred-orange focus:ring-kindred-orange"
          />
          Active needs only
        </label>
        <Button variant="ghost" size="small" onClick={clearFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  )
}

export default OrganizationFilters
