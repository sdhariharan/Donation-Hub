import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import ActiveNeedPreview from '../../components/organizations/ActiveNeedPreview'
import GeneralScoreBreakdown from '../../components/organizations/GeneralScoreBreakdown'
import useOrganizationDirectory from '../../hooks/useOrganizationDirectory'
import { formatDataLabel } from '../../utils/donorUtils'
import {
  calculateGeneralOrganizationRecommendation,
  getActiveNeeds,
} from '../../utils/generalOrganizationRecommendation'

function OrganizationDirectoryDetailsPage() {
  const { organizationId } = useParams()
  const directory = useOrganizationDirectory({ loadList: false })
  const { loadOrganizationDetails } = directory

  useEffect(() => {
    loadOrganizationDetails(organizationId)
  }, [loadOrganizationDetails, organizationId])

  if (directory.detailLoading) {
    return <Loading message="Loading organization details..." />
  }
  const organization = directory.selectedOrganization
  if (!organization) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={directory.error || 'Organization not found.'} />
        <Link to="/donor/organizations"><Button variant="outline">Back to organizations</Button></Link>
      </div>
    )
  }
  const recommendation = calculateGeneralOrganizationRecommendation(
    organization,
    directory.donorProfile,
  )
  const activeNeeds = getActiveNeeds(organization)
  return (
    <div className="space-y-8">
      <Link to="/donor/organizations" className="inline-flex items-center gap-2 text-sm font-semibold text-kindred-orange-dark hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to organizations
      </Link>
      <PageHeader
        title={organization.name}
        description={organization.description}
        action={
          <Link to={`/donor/donations/new?organizationId=${organization.id}`}>
            <Button>Donate to this Organization</Button>
          </Link>
        }
      />
      <ErrorMessage message={directory.error} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-slate-950">Organization details</h2>
            <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              <p className="flex gap-2 text-slate-600"><Mail className="h-4 w-4 shrink-0 text-kindred-orange-dark" aria-hidden="true" />{organization.email}</p>
              <p className="flex gap-2 text-slate-600"><Phone className="h-4 w-4 shrink-0 text-kindred-orange-dark" aria-hidden="true" />{organization.phone}</p>
              <p className="flex gap-2 text-slate-600 sm:col-span-2"><MapPin className="h-4 w-4 shrink-0 text-kindred-orange-dark" aria-hidden="true" />{[organization.address, organization.city, organization.state, organization.postalCode].filter(Boolean).join(', ')}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {organization.categoriesAccepted.map((category) => (
                <span key={category} className="rounded-full bg-kindred-cream px-3 py-1 text-xs font-semibold text-slate-700">{formatDataLabel(category)}</span>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-bold text-slate-950">Active needs</h2>
            <ActiveNeedPreview needs={activeNeeds} limit={activeNeeds.length} detailed />
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-bold text-slate-950">Inventory summary</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {organization.categoriesAccepted.map((category) => (
                <div key={category} className="flex items-center justify-between rounded-xl bg-kindred-cream/70 px-4 py-3">
                  <dt className="text-sm font-medium text-slate-700">{formatDataLabel(category)}</dt>
                  <dd className="font-bold text-slate-950">{typeof organization.inventory?.[category] === 'number' ? organization.inventory[category] : 'Not available'}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="border-orange-200">
            <p className="text-sm font-semibold text-kindred-orange-dark">General Match Score</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-slate-950">{recommendation.generalScore}</p>
            <p className="mt-2 text-sm text-slate-500">Trust score: {organization.trustScore ?? 'Not available'} / 100</p>
            <div className="mt-6"><GeneralScoreBreakdown scores={recommendation.scoreBreakdown} /></div>
          </Card>
          <Card>
            <h2 className="text-lg font-bold text-slate-950">Why this may be a good fit</h2>
            <ul className="mt-4 space-y-3">
              {recommendation.reasons.map((reason) => (
                <li key={reason} className="rounded-xl bg-kindred-cream px-4 py-3 text-sm text-slate-700">{reason}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrganizationDirectoryDetailsPage
