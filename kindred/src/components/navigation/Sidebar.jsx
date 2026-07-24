import { HeartHandshake, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../common/constants'
import NavItem from './NavItem'

function Sidebar({
  navigationItems,
  userProfile,
  role,
  onLogout,
  logoutLoading,
  mobile = false,
  onNavigate,
}) {
  return (
    <aside
      className={
        mobile
          ? 'flex h-full flex-col bg-white'
          : 'sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-orange-100 bg-white lg:flex'
      }
    >
      <div className="border-b border-orange-100 px-5 py-5">
        <Link
          to={APP_ROUTES.HOME}
          onClick={onNavigate}
          className="flex items-center gap-2 text-xl font-bold text-slate-950"
        >
          <span className="rounded-lg bg-kindred-orange p-1.5 text-slate-950">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          Kindred
        </Link>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-4 py-5"
        aria-label={`${role} dashboard navigation`}
      >
        {navigationItems.map((item) => (
          <NavItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-orange-100 p-4">
        <div className="mb-3 min-w-0 rounded-xl bg-kindred-cream px-3 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {userProfile?.name}
          </p>
          <p className="mt-0.5 capitalize text-xs text-slate-500">{role}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={logoutLoading}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          {logoutLoading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
