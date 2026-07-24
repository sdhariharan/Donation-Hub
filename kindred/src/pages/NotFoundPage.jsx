import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../common/constants'

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-kindred-cream px-4">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-kindred-orange-dark">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600">
          The page you requested does not exist.
        </p>
        <Link
          to={APP_ROUTES.HOME}
          className="mt-8 inline-flex rounded-xl bg-kindred-orange px-5 py-3 font-semibold text-slate-950 transition hover:bg-kindred-orange-dark hover:text-white"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
