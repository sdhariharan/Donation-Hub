import { HeartHandshake } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../common/constants'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-kindred-cream text-kindred-orange-dark'
      : 'text-slate-600 hover:bg-kindred-cream hover:text-slate-900'
  }`

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-kindred-cream">
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 backdrop-blur">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
          aria-label="Primary navigation"
        >
          <Link
            to={APP_ROUTES.HOME}
            className="flex items-center gap-2 text-xl font-bold text-slate-950"
          >
            <span className="rounded-lg bg-kindred-orange p-1.5 text-slate-950">
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            </span>
            Kindred
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to={APP_ROUTES.LOGIN} className={navLinkClass}>
              Log in
            </NavLink>
            <NavLink to={APP_ROUTES.REGISTER} className={navLinkClass}>
              Register
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="flex flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-orange-100 bg-white px-4 py-6 text-center text-sm text-slate-500">
        Kindred — connecting the right donation to the right recipient.
      </footer>
    </div>
  )
}

export default PublicLayout
