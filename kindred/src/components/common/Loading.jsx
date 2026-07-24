import { LoaderCircle } from 'lucide-react'

function Loading({ message = 'Loading…' }) {
  return (
    <div
      className="flex items-center justify-center gap-3 rounded-xl bg-kindred-cream/70 p-8 font-medium text-slate-600"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="h-5 w-5 animate-spin text-kindred-orange-dark" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default Loading
