import { useState } from 'react'
import Card from '../../components/common/Card'
import ErrorMessage from '../../components/common/ErrorMessage'
import Loading from '../../components/common/Loading'
import PageHeader from '../../components/common/PageHeader'
import NeedsForm from '../../components/organization/NeedsForm'
import NeedsList from '../../components/organization/NeedsList'
import useOrganization from '../../hooks/useOrganization'

function OrganizationNeedsPage() {
  const { organization, loading, actionLoading, error, addNeed, updateNeed, deleteNeed, clearError } = useOrganization()
  const [editingNeed, setEditingNeed] = useState(null)
  const [success, setSuccess] = useState('')

  if (loading) return <Loading message="Loading organization needs..." />

  const handleSave = async (need) => {
    clearError()
    setSuccess('')
    try {
      if (editingNeed) {
        await updateNeed(editingNeed.id, need)
        setEditingNeed(null)
        setSuccess('Need updated successfully.')
      } else {
        await addNeed(need)
        setSuccess('Need added successfully.')
      }
      return true
    } catch {
      // useOrganization exposes the readable write error.
      return false
    }
  }
  const handleDelete = async (needId) => {
    clearError()
    setSuccess('')
    try {
      await deleteNeed(needId)
      if (editingNeed?.id === needId) setEditingNeed(null)
      setSuccess('Need deleted successfully.')
      return true
    } catch {
      // useOrganization exposes the readable write error.
      return false
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Needs & inventory priorities" description="Create structured needs that can support future demand-first matching." />
      <ErrorMessage message={error} />
      {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{success}</div>}
      {!organization ? (
        <Card><p className="text-sm text-amber-800">Complete the organization profile before adding needs.</p></Card>
      ) : (
        <>
          <Card>
            <h2 className="mb-6 text-lg font-semibold text-slate-950">{editingNeed ? 'Edit need' : 'Add a need'}</h2>
            <NeedsForm need={editingNeed} onSave={handleSave} onCancel={() => setEditingNeed(null)} loading={actionLoading === 'need'} />
          </Card>
          <section aria-labelledby="organization-needs-list">
            <h2 id="organization-needs-list" className="mb-4 text-lg font-semibold text-slate-950">Current needs</h2>
            <NeedsList needs={organization.needs || []} onEdit={setEditingNeed} onDelete={handleDelete} actionLoading={actionLoading} />
          </section>
        </>
      )}
    </div>
  )
}

export default OrganizationNeedsPage
