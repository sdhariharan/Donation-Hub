import { Menu } from 'lucide-react'

function Topbar({ userProfile, role, onMenuOpen, menuButtonRef }) {
  return (
    <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onMenuOpen}
          className="rounded-lg p-2 text-slate-600 hover:bg-kindred-cream hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kindred-orange lg:hidden"
          aria-label="Open dashboard navigation"
          aria-haspopup="dialog"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        <p className="hidden text-sm text-slate-500 lg:block">
          Kindred
        </p>

        <div className="min-w-0 text-right">
          <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
            {userProfile?.name}
          </p>
          <p className="capitalize text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </header>
  )
}

export default Topbar
