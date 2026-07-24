import { useEffect, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { validateDonationImage } from '../../utils/donorUtils'
import Button from '../common/Button'

function DonationImageUpload({
  currentImageUrl,
  file,
  onFileChange,
  removeCurrent,
  onRemoveCurrent,
  error,
}) {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return undefined
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFile = (event) => {
    const selected = event.target.files?.[0] || null
    const validationError = validateDonationImage(selected)
    onFileChange(selected, validationError)
    event.target.value = ''
  }

  const visibleImage = previewUrl || (!removeCurrent ? currentImageUrl : '')

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="donation-image">
        Optional Image
      </label>
      {visibleImage ? (
        <div className="relative w-fit">
          <img src={visibleImage} alt="Donation preview" className="h-44 w-64 rounded-xl border border-slate-200 object-cover" />
          <button
            type="button"
            onClick={() => (file ? onFileChange(null, '') : onRemoveCurrent())}
            className="absolute right-2 top-2 rounded-full bg-white p-2 text-slate-700 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kindred-orange"
            aria-label="Remove donation image"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label htmlFor="donation-image" className="flex max-w-md cursor-pointer flex-col items-center rounded-xl border border-dashed border-orange-200 px-6 py-8 text-center transition hover:bg-kindred-cream">
          <ImagePlus className="h-7 w-7 text-slate-400" aria-hidden="true" />
          <span className="mt-2 text-sm font-medium text-slate-700">Choose an image</span>
          <span className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP up to 5 MB</span>
        </label>
      )}
      <input id="donation-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="sr-only" />
      {visibleImage && (
        <div className="mt-3">
          <Button variant="outline" size="small" onClick={() => document.getElementById('donation-image')?.click()}>
            Replace image
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
    </div>
  )
}

export default DonationImageUpload
